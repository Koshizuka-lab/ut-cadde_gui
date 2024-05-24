import { createContext } from "react";

import { Consumer } from "@/types/api_internal";
import { Dataset } from "@/types/ckan";

export const ConsumerContext = createContext<{
  consumer: Consumer;
  setConsumer: (consumer: Consumer) => void;
}>({
  consumer: { name: "consumer1", connectorUrl: "https://172.26.16.20:443/", dashboardUrl: "" },
  setConsumer: () => {},
});

export const initialDataset: Dataset = {
  id: "",
  name: "",
  title: "",
  notes: "",
  owner_org: "",
  extras: [],
  resources: [],
  author: "",
  author_email: "",
  creator_user_id: "",
  isopen: false,
  license_id: "",
  license_title: "",
  maintainer: "",
  maintainer_email: "",
  metadata_created: "",
  metadata_modified: "",
  num_resources: 0,
  num_tags: 0,
  organization: {
    approval_status: "",
    created: "",
    description: "",
    id: "",
    image_url: "",
    is_organization: true,
    name: "",
    state: "",
    title: "",
    type: "",
  },
  private: false,
  state: "",
  type: "",
  url: "",
  version: "",
};

export const DatasetContext = createContext<{
  dataset: Dataset;
  setDataset: (dataset: Dataset) => void;
}>({
  dataset: initialDataset,
  setDataset: () => {},
});