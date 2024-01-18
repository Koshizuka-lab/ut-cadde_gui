import { Dataset } from "@/types/ckan";

export const findProviderID = (dataset: Dataset): string => {
  for (let extra of dataset.extras) {
    if (extra.key === "caddec_provider_id") {
      return extra.value;
    }
  }
  return "";
};