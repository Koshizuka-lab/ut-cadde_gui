import { useState } from "react";
import { useContext } from "react";
import { LoginUser } from "../pages/_app";
import {
  Input,
  Button,
  InputGroup,
  Stack,
  Box,
  FormControl,
  InputRightElement
} from "@chakra-ui/react";
import { LoginAuthResponse, User, UserContext } from "../types";


function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [userID, setUserID] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const { user, setUser }: UserContext = useContext(LoginUser)

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
    .then(res  => {
      if (!res.ok) {
        throw new Error("error")
      } else {
        return res.json()
      }
    })
    .then((data: LoginAuthResponse) => {
        console.log(data)
        setUser({"token": data["access_token"], "userID": userID} as User)
        setError(false)
    }).catch(error => {
      console.log(error)
      setError(true)
    })
  }

  const LoginFailed = () => {
    if (error) {
      return (
        <Box
          mt="1rem"
          textAlign="center"
          fontSize="md"
          color="red.600"
        >
          User ID or Password is incorrect.
        </Box>
      )
    }
  }

  return (
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
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
                  <Input 
                    onChange={handleUserIDChange}
                    placeholder="user ID" 
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
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
              </FormControl>
              <Button
                borderRadius={0}
                type="submit"
                letiant="solid"
                colorScheme="teal"
                width="full"
                onClick={doAction}
              >
                Login
              </Button>
              {LoginFailed()}
            </Stack>
          </form>
        </Box>
      </Stack>
  )
}

export default Login
