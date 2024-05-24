/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
import Cookies from "js-cookie";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { useContext } from "react";
import Select from "react-select";

import { findDatasetID } from "@/utils/findDatasetID";
import { joinFormats, extractFormats } from "@/utils/format";
import { formatDate } from "@/utils/formatDate";

import { DatasetContext, ConsumerContext } from "@/hooks/useContext";
import { FetchOptions, fetchWithRefresh } from "@/hooks/useFetch";

import { ErrorModal } from "@/components/ErrorModal";
import { InputForm } from "@/components/InputForm";
import { Loading } from "@/components/Loading";
import { PageNumberSelector } from "@/components/PageNumberSelector";

import {
  ErrorResponse,
  SearchResponse,
} from "@/types/api_internal";
import { Dataset } from "@/types/ckan";

import { Layout } from "@/layouts/Layout";
import { selectStyles } from "@/styles/select";

const Page: NextPage = () => {
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  const [dataspace, setDataspace] = useState<string>("ut-cadde");
  const [searchType, setSearchType] = useState<string>("meta"); // meta or detail
  const [providerID, setProviderID] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [displayCount, setDisplayCount] = useState<number>(10);
  const [error, setError] = useState<{
    status: number;
    message: string;
  } | null>(null);
  const [errorModalOpen, setErrorModalOpen] = useState<boolean>(false);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const consumerConnectorOrigin =
    useContext(ConsumerContext).consumer.connectorUrl;
  const { setDataset } = useContext(DatasetContext);

  const url = useMemo(() => {
    if (searchType === "meta") {
      return `/api/${dataspace}/search/meta?q=${query}`;
    } else {
      return `/api/${dataspace}/search/detail?q=${query}`;
    }
  }, [dataspace, searchType, query]);
  const options: FetchOptions = useMemo(() => {
    if (searchType === "detail") {
      return {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
          "x-cadde-provider": providerID,
          "consumer-connector-origin": consumerConnectorOrigin,
        },
      };
    } else {
      return {
        method: "GET",
        headers: {
          "consumer-connector-origin": consumerConnectorOrigin,
        },
      };
    }
  }, [searchType, providerID, consumerConnectorOrigin]);

  const fetchData = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    fetchWithRefresh(url, options)
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
        const data = (await res.json()) as SearchResponse;
        setData(data);
      })
      .catch((error: Error) => {
        console.log(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const count = useMemo(() => {
    return data?.result.results.length || 0;
  }, [data]);

  const datasets = useMemo(() => {
    return (
      data?.result.results.slice(
        (pageNumber - 1) * displayCount,
        pageNumber * displayCount,
      ) || []
    );
  }, [data, pageNumber, displayCount]);

  return (
    <>
      <Layout>
        {errorModalOpen && error && (
          <ErrorModal error={error} setIsOpen={setErrorModalOpen} />
        )}
        <div className="bg-primary w-full h-40 relative">
          <div className="flex flex-row justify-start items-start h-full pt-10 pl-5">
            <div className="text-4xl text-white font-bold">
              Search for dataset in the Dataspace
            </div>
          </div>
          <div className="absolute top-28 w-full px-20">
            <div className="bg-white border">
              <form className="flex flex-col w-full p-5">
                <div className="flex flex-row border border-primary h-10 w-full">
                  <div className="material-symbols-outlined text-primary pt-2 pl-3 pr-2">
                    search
                  </div>
                  <input
                    className="w-full pl-3"
                    type="text"
                    onChange={(e) => setQuery(e.target.value)}
                    value={query}
                    placeholder="Find datasets by keywords"
                  />
                </div>
                <div className="flex flex-row justify-between flex-wrap gap-4 items-end pt-5">
                  <div className="flex flex-col items-start">
                    <div className="pl-2">dataspace</div>
                    <Select
                      className="w-48"
                      styles={selectStyles}
                      options={[
                        { value: "ut-cadde", label: "UT-CADDE" },
                      ]}
                      value={{ value: dataspace, label: dataspace }}
                      onChange={(selected) =>
                        setDataspace(
                          (selected as { value: string; label: string })
                            .value || "ut-cadde",
                        )
                      }
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="pl-2">search type</div>
                    <Select
                      className="w-48"
                      styles={selectStyles}
                      options={[
                        { value: "meta", label: "Meta Search" },
                        { value: "detail", label: "Detail Search" },
                      ]}
                      value={{ value: searchType, label: searchType }}
                      onChange={(selected) =>
                        setSearchType(
                          (selected as { value: string; label: string })
                            .value || "meta",
                        )
                      }
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="pl-2">Provider ID</div>
                    <InputForm
                      value={providerID}
                      setValue={setProviderID}
                      disabled={searchType === "meta"}
                      label={""}
                      w="w-96"
                    />
                  </div>
                  <button
                    className="bg-primary text-white w-48 h-10 font-bold shadow-md"
                    onClick={fetchData}
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="bg-white flex flex-col w-full px-20 pb-10 pt-48">
          {loading ? (
            <Loading />
          ) : (
            <>
              <div className="font-bold text-2xl pt-10">
                {count} datasets found
              </div>
              <div className="flex flex-col items-center pt-5">
                <PageNumberSelector
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                  displayCount={displayCount}
                  setDisplayCount={setDisplayCount}
                  dataCount={data?.result.results.length || 0}
                />
              </div>
              <div className="flex flex-col gap-5 pb-10 pt-5">
                {datasets.map((dataset: Dataset, index) => (
                  <div
                    key={index}
                    className="flex flex-col border border-secondary p-5 hover:border-primary hover:bg-primary hover:bg-opacity-10 cursor-pointer group"
                    onClick={() => {
                      setDataset(dataset);
                      if (searchType === "meta") {
                        router.push(`/dataset/${findDatasetID(dataset)}`);
                      } else {
                        router.push(
                          `/dataset/${findDatasetID(dataset)}?providerID=${providerID}`,
                        );
                      }
                    }}
                  >
                    <div className="text-primary font-bold text-2xl group-hover:border-b group-hover:border-primary">
                      {dataset.title}
                    </div>
                    <div className="flex flex-row flex-wrap items-center justify-between">
                      <div className="flex flex-col">
                        <div className="text-xl">
                          {dataset.organization.title}
                        </div>
                        <div className="text-md py-5">{dataset.notes}</div>
                      </div>
                      <div className="flex flex-col">
                        <div className="grid grid-cols-2 gap-x-5">
                          <div className="text-md">published</div>
                          <div className="text-md">
                            {formatDate(
                              new Date(dataset.metadata_created),
                              true,
                            )}
                          </div>
                          <div className="col-span-2 border-b border-secondary" />
                          <div className="text-md">last updated</div>
                          <div className="text-md">
                            {formatDate(
                              new Date(dataset.metadata_modified),
                              true,
                            )}
                          </div>
                          <div className="col-span-2 border-b border-secondary" />
                          <div className="text-md">format</div>
                          <div className="text-md">
                            {joinFormats(extractFormats(dataset))}
                          </div>
                          <div className="col-span-2 border-b border-secondary" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Layout>
    </>
  );
};

export default Page;