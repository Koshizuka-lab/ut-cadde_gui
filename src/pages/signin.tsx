import { NextPage } from "next";
import { Header } from "@/layouts/Header"
import { useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { InputForm } from "@/components/InputForm";


const Page: NextPage = () => {
  const [userID, setUserID] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  Cookies.remove("user_id");

  const login = async () => {
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "userID": userID,
        "password": password
      })
    })
    .then(res  => {
      console.log(res)
      if (!res.ok) {
        throw new Error("error")
      }
      return res.json()
    })
    .then((data) => {
      console.log(data)
      Cookies.set("access_token", data.access_token, { expires: 1, path: "/" });
      Cookies.set("refresh_token", data.refresh_token, { expires: 1, path: "/" });
      Cookies.set("user_id", userID, { expires: 1, path: "/" });
      router.push("/settings")
    })
    .catch(error => {
      console.log(error)
      alert("ID or Password is invalid")
    })
  }

  return <>
    <Header />
    <div className="flex justify-center items-center w-full h-screen bg-form">
      <div className="bg-white">
        <div className="flex flex-col justify-center items-center pt-10 px-20 pb-2">
          <div className="text-3xl text-primary font-bold font-inter">
            Sign In
          </div>
          <div className="pt-5">
            <InputForm label="DATA-EX ID" value={userID} setValue={setUserID} />
          </div>
          <div className="pt-5">
            <InputForm label="Password" value={password} setValue={setPassword} type="password" />
          </div>
          <div className="flex justify-center items-center py-10">
            <button
              className="bg-primary text-white w-48 h-10 font-inter font-bold"
              onClick={login}
            >
              Sign In
            </button>
          </div>
          <div className="text-primary font-inter text-sm">
            Don&apos;t have DATA-EX ID? <a className="text-primary underline">Create one</a>
          </div>
        </div>
      </div>
    </div>
  </>;
}

export default Page