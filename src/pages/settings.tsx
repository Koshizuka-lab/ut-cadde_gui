import { InputForm } from "@/components/InputForm";
import { Layout } from "@/layouts/Layout";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { consumerConnectorSlice } from "@/store/slices/consumerConnectorSlice";

const Page: NextPage = () => {
  const origin = useAppSelector(state => state.consumerConnector.origin);
  const dispatch = useAppDispatch();
  const setOrigin = (origin: string) => {
    dispatch(consumerConnectorSlice.actions.setOrigin(origin));
  }
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
          <div className="flex flex-row items-end">
            <InputForm
              label="Origin"
              value={origin}
              setValue={setOrigin}
              placeholder="http://example.com/"
              required
            />
          </div>
          <div className="flex flex-row justify-start items-center pt-16">
            <button
              className="bg-primary text-white w-48 h-10 font-inter font-bold"
              onClick={() => {
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