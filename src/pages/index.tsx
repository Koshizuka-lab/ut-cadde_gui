import Cookies from "js-cookie";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Page: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      Cookies.remove("user_id");
      await router.push("/signin");
    })().catch((err) => console.log(err));
  }, []);

  return <div>Index Page</div>;
};

export default Page;
