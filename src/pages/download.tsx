import Cookies from "js-cookie";
import { NextPage } from "next";
import { useContext, useState } from "react";

import { downloadFile } from "@/utils/downloadFile";

import { ConsumerContext } from "@/hooks/useContext";
import { fetchWithRefresh, FetchOptions } from "@/hooks/useFetch";

import { InputForm } from "@/components/InputForm";

import { Layout } from "@/layouts/Layout";

const Page: NextPage = () => {
  const [providerID, setProviderID] = useState<string>("");
  const [resourceURL, setResourceURL] = useState<string>("");
  const [resourceAPIType, setResourceAPIType] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const { consumer } = useContext(ConsumerContext);
  const consumerConnectorOrigin = consumer.connectorUrl;

  const handleSubmit = () => {
    const requestUrl = "/api/dataex/download";
    const requestOptions: FetchOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("access_token")}`,
        "x-cadde-provider": providerID,
        "x-cadde-resource-url": resourceURL,
        "x-cadde-resource-api-type": resourceAPIType,
        "consumer-connector-origin": consumerConnectorOrigin,
      },
    };
    fetchWithRefresh(requestUrl, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw res;
        } else {
          return res.blob();
        }
      })
      .then((blob: Blob) => {
        downloadFile(blob, fileName);
      })
      .catch((error: { message: string }) => {
        alert(error.message);
      });
  };

  return (
    <Layout>
      <div className="bg-white flex flex-col w-full">
        <div className="text-primary font-bold font-inter text-3xl p-10">
          Download by Resource URL
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-start px-16 gap-8"
        >
          <InputForm
            label="Provider ID"
            value={providerID}
            setValue={setProviderID}
            required
          />
          <InputForm
            label="Resource URL"
            value={resourceURL}
            setValue={setResourceURL}
            required
          />
          <InputForm
            label="Resource API Type"
            value={resourceAPIType}
            setValue={setResourceAPIType}
            required
          />
          <InputForm
            label="File Name"
            value={fileName}
            setValue={setFileName}
            required
          />
          <button
            className="bg-primary text-white w-48 h-10 font-inter font-bold"
            type="submit"
          >
            Download
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Page;
