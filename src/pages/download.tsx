import { InputForm } from "@/components/InputForm";
import { FetchOptions } from "@/hooks/useFetch";
import { Layout } from "@/layouts/Layout";
import { NextPage } from "next";
import { useState } from "react";
import { downloadFile } from "@/hooks/downloadFile";
import { fetchWithRefresh } from "@/hooks/useFetch";
import { useAppSelector } from "@/hooks/useStore";
import Cookies from "js-cookie";


const Page: NextPage = () => {
  const [providerID, setProviderID] = useState<string>("");
  const [resourceURL, setResourceURL] = useState<string>("");
  const [resourceAPIType, setResourceAPIType] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const consumerConnectorOrigin = useAppSelector(state => state.consumerConnector.origin);

  const handleSubmit = () => {
    const requestUrl = "/api/dataex/download";
    const requestOptions: FetchOptions = {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${Cookies.get("access_token")}`,
        "x-cadde-provider": providerID,
        "x-cadde-resource-url": resourceURL,
        "x-cadde-resource-api-type": resourceAPIType,
        "consumer-connector-origin": consumerConnectorOrigin,
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
        downloadFile(blob, fileName)
      })
      .catch(error => {
        alert(error.message);
      })
  }

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
            label="DATA-EX ID (Provider)"
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

export default Page