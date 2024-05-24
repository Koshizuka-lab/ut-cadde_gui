import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { useState } from "react";
const inter = Inter({
  weight: ["400", "700"],
  subsets: ["latin"],
});
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import {
  DatasetContext,
  initialDataset,
  ConsumerContext,
} from "@/hooks/useContext";

import { Consumer } from "@/types/api_internal";
import { Dataset } from "@/types/ckan";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const [consumer, setConsumer] = useState<Consumer>({
    name: "",
    connectorUrl: "",
    dashboardUrl: "",
  });
  const [dataset, setDataset] = useState<Dataset>(initialDataset);
  return (
    <ConsumerContext.Provider value={{ consumer, setConsumer }}>
      <DatasetContext.Provider value={{ dataset, setDataset }}>
        <ToastContainer />
        <main className={inter.className}>
          <Component {...pageProps} />
        </main>
      </DatasetContext.Provider>
    </ConsumerContext.Provider>
  );
}