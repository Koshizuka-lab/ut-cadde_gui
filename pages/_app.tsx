import '../styles/globals.css'
import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import { createContext, useState } from "react";
import { User, UserContext } from '../types';

export const LoginUser = createContext({} as UserContext)

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState({token: "", userID: ""} as User)

  return (
    <ChakraProvider>
      <LoginUser.Provider value={{ user, setUser }}>
        <Component {...pageProps} />
      </LoginUser.Provider>
    </ChakraProvider>
  )
}

export default MyApp
