import { Stack, Box } from "@chakra-ui/react";
import Login from "../components/Login";
import MetaSearch from "./MetaSearch";
import { useContext } from "react";
import { LoginUser } from "../pages/_app";
import { UserContext } from "../types";

export default function Home() {
    const { user, setUser }: UserContext = useContext(LoginUser)

    const box = (user.token ? <MetaSearch /> : <Login />)

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
