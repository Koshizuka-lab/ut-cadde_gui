import { NextPage } from "next";
import Cookies from "js-cookie";

const Page: NextPage = () => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  Cookies.remove("user_id");
  return <div>Index Page
    {Cookies.get("access_token")}
    {Cookies.get("refresh_token")}
    {Cookies.get("user_id")}
  </div>;
}

export default Page