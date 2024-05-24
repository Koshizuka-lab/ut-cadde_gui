import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext } from "react";

import { ConsumerContext } from "@/hooks/useContext";

import { InputForm } from "@/components/InputForm";

import { Layout } from "@/layouts/Layout";

const Page: NextPage = () => {
  const { consumer, setConsumer } = useContext(ConsumerContext);
  const router = useRouter();

  return (
    <>
      <Layout>
        <div className="bg-white flex flex-col w-full">
          <div className="text-primary font-bold font-inter text-3xl p-10">
            Settings
          </div>
          <div className="flex flex-col pl-20">
            <div className="font-bold font-inter text-2xl py-5">
              Consumer Connector
            </div>
            <div className="flex flex-row items-end">
              <InputForm
                label="consumer connector url"
                value={consumer.connectorUrl}
                setValue={(value) => setConsumer({ ...consumer, connectorUrl: value })}
                required
              />
            </div>
            <div className="flex flex-row justify-start items-center pt-16">
              <button
                className="bg-primary text-white w-48 h-10 font-inter font-bold"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={() => router.push("/search")}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Page;
