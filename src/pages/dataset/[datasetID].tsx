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

const Page: NextPage = () => {
  const router = useRouter();
  const datasetID = router.query.datasetID as string;
  const [searchType, setSearchType] = useState<string>(router.query.searchType as string);
  const [providerID, setProviderID] = useState<string>(router.query.providerID as string);
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [requesting, setRequesting] = useState<boolean>(false);
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
        .then((data) => {
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
    setRequesting(true);
    fetchWithRefresh(requestUrl, requestOptions)
    .then((res) => {
      if (!res.ok) {
        throw res;
      }
      return res.json()
    })
    .then((data) => {
      console.log(data)
      setDataset(data.result.results[0]);
      setSearchType("detail");
      setProviderID(providerID);
    })
    .catch(error => {
      alert(error.message)
    })
    .finally(() => {
      setRequesting(false);
    })
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
    fetchWithRefresh(requestUrl, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw res;
        } else {
          return res.blob()
        }
      })
      .then((blob: Blob) => {
        downloadFile(blob, resource.name)
      })
      .catch(error => {
        alert(error.message);
      })
  }

  return <>
    <Layout>
      {dataset && (
        <div className="flex flex-col w-full px-10 py-10">
          <DatasetView dataset={dataset} />
          { searchType === "meta" && (
            <div className="py-5 flex flex-col items-center">
              <button
                className="bg-primary text-white px-20 py-5 text-2xl font-inter font-bold"
                onClick={() => requestResources(dataset)}
                disabled={requesting}
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
                <div className="flex flex-col gap-y-4 w-full">
                  {/* <div className="flex flex-row justify-between items-center px-4 py-2 mx-20">
                    <div className="font-bold font-inter text-lg">title</div>
                    <div className="font-bold font-inter text-lg">format</div>
                    <div className="font-bold font-inter text-lg">last updated</div>
                    <div className="font-bold font-inter text-lg">api type</div>
                    <div></div>
                  </div> */}
                  {dataset.resources.map((resource, index) => (
                    <div key={index} className="flex flex-row justify-between items-center border border-secondary px-4 py-2 mx-20 hover:border-primary hover:bg-primary hover:bg-opacity-10 cursor-pointer">
                      <div className="font-inter text-xl font-bold text-primary">{resource.name}</div>
                      <div className="font-inter text-lg">{resource.format}</div>
                      <div className="font-inter text-lg">{formatDate(new Date(resource.last_modified), true)}</div>
                      <div className="font-inter text-lg">file/http</div>
                      <button
                        className="bg-primary text-white w-36 h-10 font-inter font-bold"
                        onClick={() => fetchFile(resource)}
                      >
                        Download
                      </button>
                    </div>
                  ))}
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