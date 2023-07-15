import '../styles/globals.css'
import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import { createContext, useState } from "react";

export const AuthToken = createContext(null)

function MyApp({ Component, pageProps }: AppProps) {
  const [token, setToken] = useState("")
  const value = {
    token,
    setToken
  }
  return (
    <ChakraProvider>
      <AuthToken.Provider value={value}>
        <Component {...pageProps} />
      </AuthToken.Provider>
    </ChakraProvider>
  )
}

export default MyApp
