import Cookies from "js-cookie";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { downloadFile } from "@/utils/downloadFile";
import { findDatasetID } from "@/utils/findDatasetID";
import { findProviderID } from "@/utils/findProviderID";
import { formatDate } from "@/utils/formatDate";

import { DatasetContext, ConsumerContext } from "@/hooks/useContext";
import { FetchOptions, fetchWithRefresh } from "@/hooks/useFetch";

import { DatasetView } from "@/components/DatasetView";
import { ErrorModal } from "@/components/ErrorModal";
import { Loading } from "@/components/Loading";
import { Section } from "@/components/Section";

import { ErrorResponse, SearchResponse } from "@/types/api_internal";
import { Resource } from "@/types/ckan";

import { Layout } from "@/layouts/Layout";

interface ResourceState {
  resource: Resource;
  blob: Blob | null;
  blobStatus: "loaded" | "undefined" | "error";
  isChecked: boolean;
  verification: "verified" | "undefined" | "error";
}

const Page: NextPage = () => {
  const router = useRouter();
  // const datasetID = router.query.datasetID as string;
  const [loading, setLoading] = useState<boolean>(false);
  const [resourceStates, setResourceStates] = useState<ResourceState[]>([]);
  const [error, setError] = useState<{
    status: number;
    message: string;
  } | null>(null);
  const [errorModalOpen, setErrorModalOpen] = useState<boolean>(false);
  const { dataset, setDataset } = useContext(DatasetContext);
  const consumerConnectorOrigin =
    useContext(ConsumerContext).consumer.connectorUrl;

  const haveResourceURL = useMemo(() => {
    if (!dataset) {
      return false;
    }
    return dataset?.resources.every((resource) => {
      return resource.url !== "";
    });
  }, [dataset]);

  const providerID = useMemo(() => {
    if (router.query.providerID) {
      return router.query.providerID as string;
    } else if (dataset) {
      return findProviderID(dataset);
    } else {
      return "";
    }
  }, [router, dataset]);

  useEffect(() => {
    if (dataset) {
      setResourceStates(
        dataset.resources.map((resource) => {
          return {
            resource: resource,
            blob: null,
            blobStatus: "undefined",
            isChecked: false,
            verification: "verified",
          };
        }),
      );
    }
  }, [dataset]);

  const requestResources = () => {
    const requestUrl = `/api/ut-cadde/search/detail?fq=caddec_dataset_id_for_detail:${findDatasetID(dataset)}`;
    const requestOptions: FetchOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("access_token")}`,
        "x-cadde-provider": providerID,
        "consumer-connector-origin": consumerConnectorOrigin,
      },
    };
    setLoading(true);
    fetchWithRefresh(requestUrl, requestOptions)
      .then(async (res) => {
        if (!res.ok) {
          const status = res.status;
          const error = (await res.json()) as ErrorResponse;
          setError({
            status: status,
            message: error.message,
          });
          setErrorModalOpen(true);
          throw new Error(error.message);
        }
        return res.json();
      })
      .then((data: SearchResponse) => {
        const dataset = data.result.results[0];
        setDataset(dataset);
        setResourceStates(
          dataset.resources.map((resource) => {
            return {
              resource: resource,
              blob: null,
              blobStatus: "undefined",
              isChecked: false,
              verification: "verified",
            };
          }),
        );
      })
      .catch((error: Error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };


  const fetchData = async () => {
    setLoading(true);
    const updatedResouceStates = [];
    for (const resourceState of resourceStates) {
      if (resourceState.isChecked) {
        const blob = await fetchFile(resourceState.resource);
        resourceState.blob = blob;
        resourceState.blobStatus = blob ? "loaded" : "error";
        if (blob) {
          toast.success("Data fetched successfully", {
            position: "top-right",
            hideProgressBar: true,
            theme: "colored",
          });
        }
      }
      updatedResouceStates.push(resourceState);
    }
    setResourceStates(updatedResouceStates);
    setLoading(false);
  };

  const download = () => {
    for (const resourceState of resourceStates) {
      if (
        resourceState.isChecked &&
        resourceState.blob &&
        resourceState.verification === "verified"
      ) {
        let name = resourceState.resource.name;
        if (resourceState.resource.name === "") {
          name =
            resourceState.resource.url.split("/")[
              resourceState.resource.url.split("/").length - 1
            ] || "file";
        }
        downloadFile(resourceState.blob, name);
      }
    }
  };

  const disableDownload = useMemo(() => {
    for (const resourceState of resourceStates) {
      if (resourceState.isChecked && resourceState.blobStatus !== "loaded") {
        return true;
      }
    }
    if (resourceStates.every((resourceState) => !resourceState.isChecked)) {
      return true;
    }
    return false;
  }, [resourceStates]);


  const fetchFile = async (resource: Resource) => {
    const requestUrl = "/api/ut-cadde/download";
    let requestOptions: FetchOptions;
    if (providerID) {
      requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
          "x-cadde-provider": providerID,
          "x-cadde-resource-url": resource.url,
          "x-cadde-resource-api-type":
            resource.resource_type || "file/http",
          "consumer-connector-origin": consumerConnectorOrigin,
        },
      };
    } else {
      requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
          "x-cadde-resource-url": resource.url,
          "x-cadde-resource-api-type":
            resource.resource_type || "file/http",
          "consumer-connector-origin": consumerConnectorOrigin,
        },
      };
    }
    const blob = await fetchWithRefresh(requestUrl, requestOptions)
      .then(async (res) => {
        if (!res.ok) {
          const status = res.status;
          const error = (await res.json()) as ErrorResponse;
          setError({
            status: status,
            message: error.message,
          });
          setErrorModalOpen(true);
          throw new Error(error.message);
        } else {
          return res.blob();
        }
      })
      .then((blob: Blob) => {
        return blob;
      })
      .catch((error: Error) => {
        console.log(error);
        return null;
      });
    return blob;
  };

  return (
    <>
      <Layout>
        {loading && (
          <div className="fixed inset-0 bg-secondary bg-opacity-30 z-10 flex justify-center items-center">
            <Loading />
          </div>
        )}
        {errorModalOpen && error && (
          <ErrorModal error={error} setIsOpen={setErrorModalOpen} />
        )}
        {dataset && resourceStates.length > 0 && (
          <div className="flex flex-col w-full px-10 py-10">
            <DatasetView dataset={dataset} />
            {!haveResourceURL && (
              <div className="py-5 flex flex-col items-center">
                <button
                  className="bg-primary text-white px-10 py-5 text-xl font-bold"
                  onClick={() => requestResources()}
                  disabled={loading}
                >
                  Request Resources
                </button>
              </div>
            )}
            {haveResourceURL && (
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
                          <th className="px-4 py-2">created</th>
                          <th className="px-4 py-2">api type</th>
                          <th className="px-4 py-2">data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataset.resources.map((resource, index) => {
                          const borderColor = resourceStates[index].isChecked
                            ? "border-primary"
                            : "border-secondary";
                          return (
                            <>
                              <tr
                                key={index}
                                className={`border ${borderColor} hover:border-primary hover:bg-primary hover:bg-opacity-10 cursor-pointer`}
                                onClick={() => {
                                  setResourceStates(
                                    resourceStates.map((resourceState, i) => {
                                      if (i === index) {
                                        resourceState.isChecked =
                                          !resourceState.isChecked;
                                      }
                                      return resourceState;
                                    }),
                                  );
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
                                <td className="px-4 py-4">
                                  {formatDate(new Date(resource.created), true)}
                                </td>
                                <td className="px-4 py-4">
                                  {resource.resource_type}
                                </td>
                                {resourceStates[index].blobStatus ===
                                  "loaded" && (
                                  <td className="px-4 py-4">
                                    <div className="material-symbols-outlined text-success">
                                      check_circle
                                    </div>
                                  </td>
                                )}
                                {resourceStates[index].blobStatus ===
                                  "undefined" && (
                                  <td className="px-4 py-4">
                                    <div className="material-symbols-outlined text-secondary">
                                      help_outline
                                    </div>
                                  </td>
                                )}
                                {resourceStates[index].blobStatus ===
                                  "error" && (
                                  <td className="px-4 py-4">
                                    <div className="material-symbols-outlined text-alert">
                                      error_outline
                                    </div>
                                  </td>
                                )}
                              </tr>
                              <tr className="h-3">
                                <td colSpan={5} />
                              </tr>
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                    <div className="flex flex-row justify-end w-full pt-5">
                      <button
                        className="bg-primary text-white w-36 h-12 font-inter font-bold mr-5"
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onClick={fetchData}
                      >
                        Fetch Data
                      </button>
                      <button
                        className="bg-primary text-white w-36 h-12 font-inter font-bold disabled:opacity-50"
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
  );
};

export default Page;