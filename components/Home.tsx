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

export default function Home() {
    const [showLoginBox, setShowLoginBox] = useState(true)

    let box = <div />
    if (showLoginBox) {
        box = <Login setShowLoginBox={setShowLoginBox}/>
    } else {
        box = (
            <Flex flexDirection="row" align="center">
                <Link href="/search">
                    <Button size="lg" margin="5">
                        データ検索
                    </Button>
                </Link>
                    <Link href="/get_immediate">
                    <Button size="lg" margin="5">
                        データ取得
                    </Button>
                </Link>
            </Flex>  
        )
    }

    return (
        <Stack align="center">
            <Box
              color="blackAlpha.700"
              bg="whiteAlpha.100"
              fontSize="8xl"
            >
              UT-CADDE
            </Box>
            { box }
        </Stack>
    )
}
