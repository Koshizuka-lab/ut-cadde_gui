import { InputForm } from "@/components/InputForm";
import { Layout } from "@/layouts/Layout";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { consumerConnectorSlice } from "@/store/slices/consumerConnectorSlice";

const Page: NextPage = () => {
  const schema = useAppSelector(state => state.consumerConnector.schema);
  const host = useAppSelector(state => state.consumerConnector.host);
  const port = useAppSelector(state => state.consumerConnector.port);
  const origin = useAppSelector(state => state.consumerConnector.origin);
  const dispatch = useAppDispatch();
  const setSchema = (schema: string) => dispatch(consumerConnectorSlice.actions.setSchema(schema));
  const setHost = (host: string) => dispatch(consumerConnectorSlice.actions.setHost(host));
  const setPort = (port: string) => dispatch(consumerConnectorSlice.actions.setPort(port));
  const router = useRouter();

  return <>
    <Layout>
      <div className="bg-white flex flex-col w-full">
        <div className="text-primary font-bold font-inter text-3xl p-10">
          Settings
        </div>
        <div className="flex flex-col pl-20">
          <div className="font-bold font-inter text-2xl py-5">
            Consumer Connector
          </div>
          <div className="flex flex-row items-end gap-1">
            <InputForm label="Schema" value={schema} setValue={setSchema} required/>
            <div className="text-md font-inter pt-2 bg-white h-10">://</div>
            <InputForm label="Host" value={host} setValue={setHost} required/>
            <div className="text-md font-inter pt-2 bg-white h-10">:</div>
            <InputForm label="Port" value={port} setValue={setPort} required/>
          </div>
          <div className="flex flex-row justify-start items-center pt-16">
            <button
              className="bg-primary text-white w-48 h-10 font-inter font-bold"
              onClick={() => {
                console.log(host, port, origin);
                router.push("/search");
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </Layout>
  </>
};

export default Page;