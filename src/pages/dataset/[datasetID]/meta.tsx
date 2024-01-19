import { findDatasetID } from '@/hooks/findDatasetID';
import { Layout } from '@/layouts/Layout';
import { SearchResponse } from '@/types/api';
import { Dataset } from '@/types/ckan';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { findProviderID } from '@/hooks/findProviderID';
import { DatasetView } from '@/components/DatasetView';
import { FetchOptions, fetchWithRefresh, useFetch } from '@/hooks/useFetch';
import Cookies from "js-cookie";

const Page: NextPage = () => {
  const router = useRouter();
  const datasetID = router.query.datasetID as string;
  const url = datasetID ? `/api/dataex/search/meta?fq=caddec_dataset_id_for_detail:${datasetID}` : "";
  const options: FetchOptions = { method: "GET", headers: {} };
  const { data, error, loading, fetchData } = useFetch<SearchResponse>(url, options);
  const dataset = useMemo<Dataset | null>(() => {
    return data?.result.results[0] || null;
  }, [data]);
  const [requesting, setRequesting] = useState<boolean>(false);

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url]);

  const requestUrl = datasetID ? `/api/dataex/search/detail?fq=caddec_dataset_id_for_detail:${datasetID}` : "";
  const requestOptions: FetchOptions = useMemo(() => {
    if (!dataset) {
      return { method: "GET", headers: {} };
    }
    return {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${Cookies.get("access_token")}`,
        "x-cadde-provider": findProviderID(dataset),
      }
    }
  }, [dataset]);

  const requestResources = async (dataset: Dataset) => {
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
      router.push(`/dataset/${findDatasetID(dataset)}/detail?providerID=${findProviderID(dataset)}`)
    })
    .catch(error => {
      alert(error.message)
    })
    .finally(() => {
      setRequesting(false);
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
          <div className="pt-5 pb-24 flex flex-col items-center">
            <button
              className="bg-primary text-white px-20 py-5 text-4xl font-inter font-bold"
              onClick={() => requestResources(dataset)}
              disabled={requesting}
            >
              Request Resources
            </button>
          </div>
        </div>
      )}
    </Layout>
  </>
};

export default Page;