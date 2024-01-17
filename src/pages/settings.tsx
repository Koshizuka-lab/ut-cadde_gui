import { InputForm } from "@/components/InputForm";
import { Layout } from "@/layouts/Layout";
import { NextPage } from "next";
import { useState } from "react";
import { useRouter } from "next/router";

const Page: NextPage = () => {
  const [ip, setIp] = useState<string>("");
  const [port, setPort] = useState<string>("");
  const router = useRouter();

  return <>
    <Layout>
      <div className="bg-white flex flex-col w-full">
        <div className="text-primary font-bold font-inter text-3xl p-10">
          Settings
        </div>
        <div className="flex flex-col pl-20 pt-10">
          <div className="font-bold font-inter text-2xl">
            Consumer Connector
          </div>
          <div className="flex flex-row gap-10">
            <InputForm label="IP Address" value={ip} setValue={setIp} />
            <InputForm label="Port" value={port} setValue={setPort} type="number"/>
          </div>
          <div className="flex flex-row justify-center items-center pt-16">
            <button
              className="bg-primary text-white w-48 h-10 font-inter font-bold"
              onClick={() => router.push("/search")}
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