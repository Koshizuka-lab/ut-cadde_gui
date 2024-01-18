import { Layout } from '@/layouts/Layout';
import { SearchResponse } from '@/types/api';
import { Dataset } from '@/types/ckan';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { DatasetView } from './meta';
import { Section } from '@/components/Section';
import { formatDate } from '@/hooks/formatDate';

const Page: NextPage = () => {
  const router = useRouter();
  const [dataset, setDataset] = useState<Dataset>();

  useEffect(() => {
    if (router.isReady) {
      const { datasetID, providerID } = router.query as { datasetID: string, providerID: string };
      const url = `/api/dataex/search/detail?fq=caddec_dataset_id_for_detail:${datasetID}`;
      const headers = {
        "Authorization": `Bearer ${Cookies.get("access_token")}`,
        "x-cadde-provider": providerID,
      }
      fetch(url, {
        method: "GET",
        headers: headers,
      })
      .then(res => {
        if (!res.ok) {
          throw new Error("error")
        }
        return res.json()
      })
      .then((data: SearchResponse) => {
        console.log(data);
        if (data.result.count !== 1) {
          throw new Error("error")
        }
        setDataset(data.result.results[0]);
      })
    }
  }
  , [router]);

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