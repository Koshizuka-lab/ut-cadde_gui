import { Layout } from '@/layouts/Layout';
import { SearchResponse } from '@/types/api';
import { Dataset, Resource } from '@/types/ckan';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import Cookies from "js-cookie";
import { DatasetView } from '@/components/DatasetView';
import { Section } from '@/components/Section';
import { formatDate } from '@/hooks/formatDate';
import { FetchOptions, fetchWithRefresh, useFetch } from '@/hooks/useFetch';
import { downloadFile } from '@/hooks/downloadFile';

const Page: NextPage = () => {
  const router = useRouter();
  const { datasetID, providerID } = router.query as { datasetID: string, providerID: string };
  const url = datasetID ? `/api/dataex/search/detail?fq=caddec_dataset_id_for_detail:${datasetID}` : "";
  const options = useMemo<FetchOptions>(() => {
    return {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${Cookies.get("access_token")}`,
        "x-cadde-provider": providerID,
      }
    }
  }, [providerID]);
  const { data, error, loading, fetchData } = useFetch<SearchResponse>(url, options);
  const dataset = useMemo<Dataset | null>(() => {
    return data?.result.results[0] || null;
  }, [data]);

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url]);

  const fetchFile = async (resource: Resource) => {
    const requestUrl = "/api/dataex/download";
    const requestOptions: FetchOptions = {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${Cookies.get("access_token")}`,
        "x-cadde-provider": providerID,
        "x-cadde-resource-url": resource.url,
        "x-cadde-resource-api-type": "file/http",
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
        <div className="flex flex-col w-full px-10">
          <div className="pt-5">
            <button
              className="bg-primary text-white w-24 h-10 font-inter font-bold"
              onClick={() => router.back()}
            >
              &lt; back
            </button>
          </div>
          <DatasetView dataset={dataset} />
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
        </div>
      )}
    </Layout>
  </>
};

export default Page;