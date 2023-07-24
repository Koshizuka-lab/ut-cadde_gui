import {
    Flex,
    Heading,
    Input,
    Button,
    InputGroup,
    Stack,
    InputLeftElement,
    chakra,
    Box,
    Link,
    Avatar,
    FormControl,
    FormHelperText,
    InputRightElement
  } from "@chakra-ui/react";
import Login from "../components/Login";
import { useState } from "react";
import MetaSearch from "./MetaSearch";
import { useContext } from "react";
import { AuthToken } from "../pages/_app";

export default function Home() {
    const { token, setToken } = useContext(AuthToken)

    let box = <div />
    if (!token) {
        box = <Login />
    } else {
        box = <MetaSearch />
    }

    return (
        <div>
        <Stack align="center">
            <Box
              color="blackAlpha.700"
              bg="whiteAlpha.100"
              fontSize="8xl"
            >
              UT-CADDE
            </Box>
        </Stack>
            <Box>{ box }</Box>
        </div>
    )
}
