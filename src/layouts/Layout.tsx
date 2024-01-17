import React from "react";
import { Sidebar } from "@/layouts/Sidebar";
import { Header } from "@/layouts/Header";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col w-full h-full">
    <Header />
    <div className="flex flex-row w-full h-screen">
      <Sidebar />
      {children}
    </div>
  </div>;
}