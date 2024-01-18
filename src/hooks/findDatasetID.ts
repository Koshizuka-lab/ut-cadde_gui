import { Dataset } from "@/types/ckan";

export const findDatasetID = (dataset: Dataset): string => {
  for (let extra of dataset.extras) {
    if (extra.key === "caddec_dataset_id_for_detail") {
      return extra.value;
    }
  }
  return "";
};