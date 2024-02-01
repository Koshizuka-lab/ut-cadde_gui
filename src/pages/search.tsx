/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
import Cookies from "js-cookie";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import Select from "react-select";

import { findDatasetID } from "@/hooks/findDatasetID";
import { joinFormats, extractFormats } from "@/hooks/format";
import { formatDate } from "@/hooks/formatDate";
import { FetchOptions, fetchWithRefresh } from "@/hooks/useFetch";
import { useAppSelector } from "@/hooks/useStore";

import { InputForm } from "@/components/InputForm";
import { Loading } from "@/components/Loading";
import { PageNumberSelector } from "@/components/PageNumberSelector";

import { SearchResponse } from "@/types/api";
import { Dataset } from "@/types/ckan";

import { Layout } from "@/layouts/Layout";

const Page: NextPage = () => {
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  const [dataspace, setDataspace] = useState<string>("dataex"); // dataex or ids-dsc
  const [searchType, setSearchType] = useState<string>("meta"); // meta or detail
  const [providerID, setProviderID] = useState<string>("");
  const [providerURL, setProviderURL] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [displayCount, setDisplayCount] = useState<number>(10);
  const consumerConnectorOrigin = useAppSelector(
    (state) => state.consumerConnector.origin,
  );
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const url = useMemo(() => {
    if (dataspace === "dataex") {
      if (searchType === "meta") {
        return `/api/dataex/search/meta?q=${query}`;
      } else {
        return `/api/dataex/search/detail?q=${query}`;
      }
    } else {
      return `/api/ids-dsc/search?q=${query}&providerURL=${providerURL}`;
    }
  }, [dataspace, searchType, query, providerURL]);
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
        const data = (await res.json()) as { message: string };
        throw data;
      }
      const data = (await res.json()) as SearchResponse;
      setData(data);
    })
    .catch((error: { message: string }) => {
      alert(error.message);
    })
    .finally(() => {
      setLoading(false);
    });
  }


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
        <div className="bg-primary w-full h-40 relative">
          <div className="flex flex-row justify-start items-start h-full pt-10 pl-5">
            <div className="text-4xl text-white font-bold font-inter">
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
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          backgroundColor: "white",
                          borderColor: "#00479D",
                          borderRadius: "0",
                        }),
                      }}
                      options={[
                        { value: "dataex", label: "DATA-EX" },
                        { value: "ids-dsc", label: "IDS Dataspace" },
                      ]}
                      value={{ value: dataspace, label: dataspace }}
                      onChange={(selected) => setDataspace((selected as { value: string, label: string }).value || "dataex")}
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="pl-2">search type</div>
                    <Select 
                      className="w-48"
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          backgroundColor: "white",
                          borderColor: "#00479D",
                          borderRadius: "0",
                        }),
                      }}
                      options={[
                        { value: "meta", label: "Meta Search" },
                        { value: "detail", label: "Detail Search" },
                      ]}
                      value={{ value: searchType, label: searchType }}
                      onChange={(selected) => setSearchType((selected as { value: string, label: string }).value || "meta")}
                      isDisabled={dataspace === "ids-dsc"}
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    {dataspace === "ids-dsc" ? (
                      <>
                        <div className="pl-2">provider URL</div>
                        <InputForm
                          value={providerURL}
                          setValue={setProviderURL}
                          label={""}
                        />
                      </>
                    ) : (
                      <>
                        <div className="pl-2">DATA-EX ID (Provider)</div>
                        <InputForm
                          value={providerID}
                          setValue={setProviderID}
                          disabled={searchType === "meta"}
                          label={""}
                        />
                      </>
                    )}
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
              <div className="font-bold font-inter text-2xl pt-10">
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
                    className="flex flex-col items-start border border-secondary p-5 hover:border-primary hover:bg-primary hover:bg-opacity-10 cursor-pointer group"
                    onClick={() => {
                      if (searchType === "meta") {
                        router.push(
                          `/dataset/${findDatasetID(dataset)}?searchType=meta`,
                        );
                      } else {
                        router.push(
                          `/dataset/${findDatasetID(dataset)}?searchType=detail&providerID=${providerID}`,
                        );
                      }
                    }}
                  >
                    <div className="text-primary font-bold font-inter text-2xl group-hover:border-b group-hover:border-primary">
                      {dataset.title}
                    </div>
                    <div className="font-inter text-xl">
                      {dataset.organization.title}
                    </div>
                    <div className="font-inter text-md py-5">
                      {dataset.notes}
                    </div>
                    <div className="grid grid-cols-2 gap-x-5">
                      <div className="font-inter text-md">published</div>
                      <div className="font-inter text-md">
                        {formatDate(new Date(dataset.metadata_created), true)}
                      </div>
                      <div className="col-span-2 border-b border-secondary" />
                      <div className="font-inter text-md">last updated</div>
                      <div className="font-inter text-md">
                        {formatDate(new Date(dataset.metadata_modified), true)}
                      </div>
                      <div className="col-span-2 border-b border-secondary" />
                      <div className="font-inter text-md">format</div>
                      <div className="font-inter text-md">
                        {joinFormats(extractFormats(dataset))}
                      </div>
                      <div className="col-span-2 border-b border-secondary" />
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
