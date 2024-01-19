import { Dataset } from "@/types/ckan";
import { Section } from "./Section";
import { formatDate } from '@/hooks/formatDate';
import { extractFormats, joinFormats } from '@/hooks/format';

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