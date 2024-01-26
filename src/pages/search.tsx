/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
import Cookies from "js-cookie";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

import { findDatasetID } from "@/hooks/findDatasetID";
import { joinFormats, extractFormats } from "@/hooks/format";
import { formatDate } from "@/hooks/formatDate";
import { FetchOptions, useFetch } from "@/hooks/useFetch";
import { useAppSelector } from "@/hooks/useStore";

import { InputForm } from "@/components/InputForm";
import { Loading } from "@/components/Loading";
import { PageNumberSelector } from "@/components/PageNumberSelector";
import { Radio, RadioThin } from "@/components/Radio";

import { SearchResponse } from "@/types/api";
import { Dataset } from "@/types/ckan";

import { Layout } from "@/layouts/Layout";

interface SearchBoxProps {
  query: string;
  setQuery: (query: string) => void;
  onClick: () => void;
}
const SearchBox = (props: SearchBoxProps) => {
  const { query, setQuery, onClick } = props;
  return (
    <form
      className="flex flex-row justify-center py-5 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      <input
        className="border boreder-primary w-full h-10 pl-3"
        type="text"
        onChange={(e) => setQuery(e.target.value)}
        value={query}
        placeholder="Find datasets by keywords"
      />
      <button
        className="material-symbols-outlined text-primary border-b border-t border-r border-primary w-16 h-10"
        type="submit"
      >
        search
      </button>
    </form>
  );
};

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

  const { data, loading, fetchData } = useFetch<SearchResponse>(url, options);

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
        <div className="bg-white flex flex-col w-full px-20 py-10">
          <div className="flex flex-col items-center">
            <div className="text-4xl text-primary font-bold font-inter pt-10">
              Search for dataset in the Dataspace
            </div>
            <SearchBox query={query} setQuery={setQuery} onClick={fetchData} />
          </div>
          <div className="flex flex-col items-start p-5">
            <Radio
              id="dataex"
              label="Search DATA-EX"
              checked={dataspace === "dataex"}
              onChange={() => setDataspace("dataex")}
            />
            {dataspace === "dataex" && (
              <>
                <div className="pl-10">
                  <RadioThin
                    id="meta"
                    label="Meta Search"
                    checked={searchType === "meta"}
                    onChange={() => setSearchType("meta")}
                  />
                </div>
                <div className="pl-10">
                  <RadioThin
                    id="detail"
                    label="Detail Search"
                    checked={searchType === "detail"}
                    onChange={() => setSearchType("detail")}
                  />
                </div>
                {searchType === "detail" && (
                  <div className="pl-20 pb-2">
                    <InputForm
                      label="DATA-EX ID (Provider)"
                      value={providerID}
                      setValue={setProviderID}
                    />
                  </div>
                )}
              </>
            )}
            <Radio
              id="ids-dsc"
              label="Search IDS Dataspace"
              checked={dataspace === "ids-dsc"}
              onChange={() => setDataspace("ids-dsc")}
            />
            {dataspace === "ids-dsc" && (
              <div className="pl-10">
                <InputForm
                  label="Provider URL"
                  value={providerURL}
                  setValue={setProviderURL}
                />
              </div>
            )}
          </div>
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
