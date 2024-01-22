import React from "react";
import { Sidebar } from "@/layouts/Sidebar";
import { Header } from "@/layouts/Header";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col h-screen">
    <Header />
    <div className="flex flex-row">
      <Sidebar />
      <div className="pt-12 pl-56 w-full">
        {children}
      </div>
    </div>
  </div>;
}