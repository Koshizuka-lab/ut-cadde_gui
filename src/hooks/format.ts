import { Dataset } from "@/types/ckan";

export const extractFormats = (dataset: Dataset) => {
  const formats = new Set<string>();
  dataset.resources.forEach((resource) => {
    formats.add(resource.format);
  });
  return formats;
};

export const joinFormats = (formats: Set<string>) => {
  let formatStr = "";
  formats.forEach((format) => {
    formatStr += format + ", ";
  });
  return formatStr.slice(0, -2);
};
