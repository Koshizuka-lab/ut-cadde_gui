import { Section } from '@/components/Section';
import { findDatasetID } from '@/hooks/findDatasetID';
import { formatDate } from '@/hooks/formatDate';
import { extractFormats, joinFormats } from '@/hooks/format';
import { Layout } from '@/layouts/Layout';
import { SearchResponse } from '@/types/api';
import { Dataset } from '@/types/ckan';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { findProviderID } from '@/hooks/findProviderID';

export const DatasetView = ({ dataset }: { dataset: Dataset }) => {
  const Row = ({ label, value }: {label: string, value: string}) => {
    return (
      <>
        <div className="col-span-1 font-bold font-inter text-xl py-2">
          {label}
        </div>
        <div className="col-span-2 font-inter text-xl py-2">
          {value}
        </div>
        <div className="col-span-3 border-b border-secondary" />
      </>
    );
  };

  return (
    <>
      <div className="text-primary text-3xl font-bold font-inter p-5">
        {dataset.title}
      </div>
      <div className="pt-16">
        <Section label="Description"/>
      </div>
      <div className="px-10 py-5 font-inter text-sm">
        {dataset.notes}
      </div>
      <div className="pt-10">
        <Section label="Metadata" />
      </div>
      <div className="flex flex-col jutify-center items-center p-16">
        <div className="grid grid-cols-3 gap-x-5 w-2/3">
          <Row label="provider" value={dataset.organization.title} />
          <Row label="maintainer" value={dataset.maintainer} />
          <Row label="published" value={formatDate(new Date(dataset.metadata_created), false)} />
          <Row label="last updated" value={formatDate(new Date(dataset.metadata_modified), false)} />
          <Row label="format" value={joinFormats(extractFormats(dataset))} />
          <Row label="number of resources" value={dataset.num_resources.toString()} />
          <Row label="contract" value={dataset.license_title} />
        </div>
      </div>
    </>
  );
}

const Page: NextPage = () => {
  const router = useRouter();
  const [dataset, setDataset] = useState<Dataset>();

  useEffect(() => {
    if (router.isReady) {
      const datasetID = router.query.datasetID as string;
      const url = `/api/dataex/search/meta?fq=caddec_dataset_id_for_detail:${datasetID}`;
      fetch(url, {
        method: "GET",
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
          <div className="pt-5 pb-24 flex flex-col items-center">
            <button
              className="bg-primary text-white px-20 py-5 text-4xl font-inter font-bold"
              onClick={() => {
                router.push(`/download/${findDatasetID(dataset)}/detail?providerID=${findProviderID(dataset)}`)
              }}
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