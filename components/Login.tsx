import { useState } from "react";
import { useContext } from "react";
import { AuthToken } from "../pages/_app";
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

interface LoginProps {
  setShowLoginBox: (showLoginBox: boolean) => void
}

function Login(props: LoginProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [userID, setUserID] = useState("")
  const [password, setPassword] = useState("")
  const { token, setToken } = useContext(AuthToken)

  const handleShowClick = () => setShowPassword(!showPassword)
  const handleUserIDChange = (e) => setUserID(e.target.value)
  const handlePasswordChange = (e) => setPassword(e.target.value)

  const doAction = (e) => {
    e.preventDefault()
    // データの取得
    fetch("/api/login", {
      method: "POST", 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "userID": userID,
        "password": password
      })
    })
    .then(res  => res.json())
    .then(data => {
        console.log(data)
        setToken(data["access_token"])
        props.setShowLoginBox(false)
    })
  }

  return (
    // <Flex
    //   flexDirection="column"
    //   width="100wh"
    //   height="100vh"
    //   backgroundColor="gray.200"
    //   justifyContent="center"
    //   alignItems="center"
    // >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        {/* <Avatar bg="teal.500" /> */}
        {/* <Heading color="teal.400">Welcome</Heading> */}
        <Box minW={{ base: "90%", md: "468px" }}>
          <form>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >
              <FormControl>
                <InputGroup>
                  {/* <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  /> */}
                  <Input 
                    onChange={handleUserIDChange}
                    placeholder="user ID" 
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  {/* <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                  /> */}
                  <Input
                    onChange={handlePasswordChange}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {/* <FormHelperText textAlign="right">
                  <Link>forgot password?</Link>
                </FormHelperText> */}
              </FormControl>
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
                onClick={doAction}
              >
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      /* <Box>
        New to us?{" "}
        <Link color="teal.500" href="#">
          Sign Up
        </Link>
      </Box> */
    // </Flex>
  )
}

export default Login
