import { Layout } from '@/layouts/Layout';
import { Dataset, Resource } from '@/types/ckan';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import Cookies from "js-cookie";
import { Section } from '@/components/Section';
import { formatDate } from '@/hooks/formatDate';
import { FetchOptions, fetchWithRefresh } from '@/hooks/useFetch';
import { downloadFile } from '@/hooks/downloadFile';
import { useAppSelector } from '@/hooks/useStore';
import { findProviderID } from '@/hooks/findProviderID';
import { DatasetView } from '@/components/DatasetView';
import { SearchResponse } from '@/types/api';
import { Loading } from '@/components/Loading';

interface ResourceState {
  resource: Resource;
  blob: Blob | null;
  isChecked: boolean;
  verification: "verified" | "unverified" | "error";
}

const Page: NextPage = () => {
  const router = useRouter();
  const datasetID = router.query.datasetID as string;
  const [searchType, setSearchType] = useState<string>(router.query.searchType as string);
  const [providerID, setProviderID] = useState<string>(router.query.providerID as string);
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [resourceStates, setResourceStates] = useState<ResourceState[]>([]);
  const consumerConnectorOrigin = useAppSelector(state => state.consumerConnector.origin);

  const url = useMemo(() => {
    if (datasetID) {
      if (searchType === "meta") {
        return `/api/dataex/search/meta?fq=caddec_dataset_id_for_detail:${datasetID}`
      } else if (searchType === "detail") {
        return `/api/dataex/search/detail?fq=caddec_dataset_id_for_detail:${datasetID}`
      }
    }
    return "";
  }, [datasetID, searchType]);
  const options = useMemo<FetchOptions>(() => {
    const headers = searchType === "detail" ? {
      "Authorization": `Bearer ${Cookies.get("access_token")}`,
      "x-cadde-provider": providerID,
      "consumer-connector-origin": consumerConnectorOrigin,
    } : {
      "consumer-connector-origin": consumerConnectorOrigin,
    }
    return {
      method: "GET",
      headers: headers
    }
  }, [providerID, consumerConnectorOrigin, searchType]);
  
  useEffect(() => {
    if (url) {
      fetchWithRefresh(url, options)
        .then((res) => {
          if (!res.ok) {
            throw res;
          }
          return res.json()
        })
        .then((data: SearchResponse) => {
          setDataset(data.result.results[0]);
        })
        .catch(error => {
          alert(error.message)
        })
    }
  }, [url, options]);

  const requestResources = async (dataset: Dataset) => {
    const requestUrl = `/api/dataex/search/detail?fq=caddec_dataset_id_for_detail:${datasetID}`;
    const providerID = findProviderID(dataset);
    const requestOptions: FetchOptions = {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${Cookies.get("access_token")}`,
        "x-cadde-provider": providerID,
        "consumer-connector-origin": consumerConnectorOrigin,
      }
    };
    setLoading(true);
    fetchWithRefresh(requestUrl, requestOptions)
    .then((res) => {
      if (!res.ok) {
        throw res;
      }
      return res.json()
    })
    .then((data: SearchResponse) => {
      console.log(data)
      const dataset = data.result.results[0];
      setDataset(dataset);
      setSearchType("detail");
      setProviderID(providerID);
      setResourceStates(dataset.resources.map((resource) => {
        return {
          resource: resource,
          blob: null,
          isChecked: false,
          verification: "unverified",
        }
      }))
    })
    .catch(error => {
      alert(error.message)
    })
    .finally(() => {
      setLoading(false);
    })
  }

  const verify = async () => {
    setLoading(true);
    const updatedResouceStates = [];
    for (const resourceState of resourceStates) {
      if (resourceState.isChecked) {
        const blob = await fetchFile(resourceState.resource);
        if (blob) {
          resourceState.blob = blob;
          resourceState.verification =  await fetchSignatureVerification(blob);
        }
      }
      updatedResouceStates.push(resourceState);
    }
    setResourceStates(updatedResouceStates);
    setLoading(false);
  }

  const download = async () => {
    for (const resourceState of resourceStates) {
      if (resourceState.isChecked && resourceState.blob && resourceState.verification === "verified") {
        downloadFile(resourceState.blob, resourceState.resource.name);
      }
    }
  }

  const disableDownload = useMemo(() => {
    for (const resourceState of resourceStates) {
      if (resourceState.isChecked && resourceState.verification !== "verified") {
        return true;
      }
    }
    if (resourceStates.every((resourceState) => !resourceState.isChecked)) {
      return true;
    }
    return false;
  }, [resourceStates]);

  const fetchSignatureVerification = async (blob: Blob) => {
    const requestUrl = "/api/dataex/verify";
    const requestOptions: FetchOptions = {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Cookies.get("access_token")}`,
        "x-cadde-provider": providerID,
      },
      // TODO: verifierID, data, trust_seal_id
      body: JSON.stringify({
        "verifierID": "verifierID",
        "data": "data",
        "trust_seal_id": "trust_seal_id",
      })
    }
    
    const verification: "verified" | "error" = await fetchWithRefresh(requestUrl, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json()
      })
      .then((data) => {
        if (data.result === "OK") {
          return "verified";
        } else {
          return "error";
        }
      })
      .catch(error => {
        return "error";
      })
    return verification;
  }

  const fetchFile = async (resource: Resource) => {
    const requestUrl = "/api/dataex/download";
    const requestOptions: FetchOptions = {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${Cookies.get("access_token")}`,
        "x-cadde-provider": providerID,
        "x-cadde-resource-url": resource.url,
        "x-cadde-resource-api-type": "file/http",
        "consumer-connector-origin": consumerConnectorOrigin,
      }
    }
    const blob = await fetchWithRefresh(requestUrl, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw res;
        } else {
          return res.blob()
        }
      })
      .then((blob: Blob) => {
        return blob;
      })
      .catch(error => {
        alert(error.message);
        return null;
      })
    if (blob) {
      return blob;
    } else {
      return null;
    }
  }

  return <>
    <Layout>
      {loading && (
        <div className="fixed inset-0 bg-secondary bg-opacity-30 z-10 flex justify-center items-center">
          <Loading />
        </div>
      )}
      {dataset && (
        <div className="flex flex-col w-full px-10 py-10">
          <DatasetView dataset={dataset} />
          { searchType === "meta" && (
            <div className="py-5 flex flex-col items-center">
              <button
                className="bg-primary text-white px-20 py-5 text-2xl font-inter font-bold"
                onClick={() => requestResources(dataset)}
                disabled={loading}
              >
                Request Resources
              </button>
            </div>
          )}
          { searchType === "detail" && (
            <>
              <div className="pt-5">
                <Section label="Resources" />
              </div>
              <div className="flex flex-col items-center py-5">
                <div>
                  <table className="table-auto">
                    <thead>
                      <tr>
                        <th></th>
                        <th className="px-4 py-2">title</th>
                        <th className="px-4 py-2">format</th>
                        <th className="px-4 py-2">last updated</th>
                        <th className="px-4 py-2">api type</th>
                        <th className="px-4 py-2">verification</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataset.resources.map((resource, index) => {
                        const borderColor = resourceStates[index].isChecked ? "border-primary" : "border-secondary";
                        return (
                          <>
                        <tr
                          key={index}
                          className={`border ${borderColor} hover:border-primary hover:bg-primary hover:bg-opacity-10 cursor-pointer`}
                          onClick={() => {
                            setResourceStates(resourceStates.map((resourceState, i) => {
                              if (i === index) {
                                resourceState.isChecked = !resourceState.isChecked;
                              }
                              return resourceState;
                            }))
                          }}
                        >
                          <td className="px-4 pt-2">
                            <input
                              className="w-5 h-5 accent-primary"
                              type="checkbox"
                              checked={resourceStates[index].isChecked}
                              readOnly
                            />
                          </td>
                          <td className="px-4 py-4">{resource.name}</td>
                          <td className="px-4 py-4">{resource.format}</td>
                          <td className="px-4 py-4">{formatDate(new Date(resource.last_modified), true)}</td>
                          <td className="px-4 py-4">file/http</td>
                          {resourceStates[index].verification === "verified" && (
                            <td className="px-4 py-4 flex justify-center items-center">
                              <div className="material-symbols-outlined text-success">
                                check_circle
                              </div>
                            </td>
                          )}
                          {resourceStates[index].verification === "unverified" && (
                            <td className="px-4 py-4 flex justify-center items-center">
                              <div className="material-symbols-outlined text-secondary">
                                help_outline
                              </div>
                            </td>
                          )}
                          {resourceStates[index].verification === "error" && (
                            <td className="px-4 py-4 flex justify-center items-center">
                              <div className="material-symbols-outlined text-alert">
                                error_outline
                              </div>
                            </td>
                          )}
                        </tr>
                        <tr className="h-3">
                          <td colSpan={5} />
                        </tr>
                        </>);
                      })}
                    </tbody>
                  </table>
                  <div className="flex flex-row justify-end w-full pt-5">
                    <button
                      className="bg-primary text-white w-36 h-10 font-inter font-bold mr-5"
                      onClick={verify}
                    >
                      Verify signature
                    </button>
                    <button
                      className="bg-primary text-white w-36 h-10 font-inter font-bold disabled:opacity-50"
                      onClick={download}
                      disabled={disableDownload}
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="pb-5">
            <button
              className="bg-white text-primary hover:bg-primary hover:bg-opacity-10 w-24 h-10 font-inter font-bold"
              onClick={() => router.back()}
            >
              &lt; Back
            </button>
          </div>
        </div>
      )}
    </Layout>
  </>
};

export default Page;