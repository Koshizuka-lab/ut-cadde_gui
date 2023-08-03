import { Stack, Box } from "@chakra-ui/react";
import Login from "../components/Login";
import MetaSearch from "./MetaSearch";
import { useContext } from "react";
import { AuthToken } from "../pages/_app";

export default function Home() {
    const { token, setToken } = useContext(AuthToken)

    const box = (token ? <MetaSearch /> : <Login />)

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
