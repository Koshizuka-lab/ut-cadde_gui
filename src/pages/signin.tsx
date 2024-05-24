/* eslint-disable @typescript-eslint/no-floating-promises */
import Cookies from "js-cookie";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

import { InputForm } from "@/components/InputForm";

import { LoginAuthResponse } from "@/types/api_external";

import { Header } from "@/layouts/Header";

const Page: NextPage = () => {
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  Cookies.remove("user_id");

  const login = () => {
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: userID,
        password: password,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const error = (await res.json()) as { message: string };
          throw error;
        } else {
          return res.json();
        }
      })
      .then((data: LoginAuthResponse) => {
        console.log(data);
        Cookies.set("access_token", data.access_token, {
          expires: 1,
          path: "/",
        });
        Cookies.set("refresh_token", data.refresh_token, {
          expires: 1,
          path: "/",
        });
        Cookies.set("user_id", userID, { expires: 1, path: "/" });
        router.push("/settings");
      })
      .catch((error: { message: string }) => {
        console.log(error);
        alert(error.message);
      });
  };

  return (
    <>
      <Header />
      <div className="flex justify-center items-center w-full h-screen bg-form">
        <div className="bg-white">
          <div className="flex flex-col justify-center items-center pt-10 px-20 pb-2">
            <div className="text-3xl text-primary font-bold font-inter">
              Sign In
            </div>
            <div className="pt-5">
              <InputForm
                label="ID"
                value={userID}
                setValue={setUserID}
              />
            </div>
            <div className="pt-5">
              <InputForm
                label="Password"
                value={password}
                setValue={setPassword}
                type="password"
              />
            </div>
            <div className="flex justify-center items-center py-10">
              <button
                className="bg-primary text-white w-48 h-10 font-inter font-bold"
                onClick={login}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
