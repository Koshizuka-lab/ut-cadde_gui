import { SearchBox } from "@/components/SearchBox";
import { Layout } from "@/layouts/Layout";
import { NextPage } from "next";
import { useState } from "react";

const Page: NextPage = () => {
  const [query, setQuery] = useState<string>("");
  const [dataspace, setDataspace] = useState<string>("dataex"); // dataex or ids-dsc
  const [searchType, setSearchType] = useState<string>("meta"); // meta or detail
  return <>
    <Layout>
      <div className="bg-white flex flex-col items-center w-full">
        <div className="text-4xl text-primary font-bold font-inter pt-10">
          Search for dataset in the Dataspace
        </div>
        <SearchBox
          query={query}
          setQuery={setQuery}
          onClick={() => { console.log("search") }}
        />
      </div>
    </Layout>
  </>
};

export default Page;