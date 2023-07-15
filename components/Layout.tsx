import { Flex, VStack } from "@chakra-ui/react";
import { SimpleSidebar } from "./Sidebar";
import Header from "./Header";
import Head from "next/head";

const Layout = ({ children }) => {
  return (
    <>
      <Head>
          <title>UT-CADDE</title>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" crossOrigin="anonymous"></link>
      </Head>
      <VStack w="100%" overflowY="scroll">
        <Header />
        <Flex w="100%">
          <SimpleSidebar />
          <Flex w={{ base: "80%" }} flexDirection="column" p="10">
            {children}
          </Flex>
        </Flex>
      </VStack>
    </>
  );
};

export default Layout;