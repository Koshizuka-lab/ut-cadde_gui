import { NextPage } from "next";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Page: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("user_id");
    router.push("/signin");
  }, []);

  return <div>Index Page
    {Cookies.get("access_token")}
    {Cookies.get("refresh_token")}
    {Cookies.get("user_id")}
  </div>;
}

export default Page