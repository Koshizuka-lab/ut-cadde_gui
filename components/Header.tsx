import { Box, Divider, Flex, Spacer } from "@chakra-ui/react";
import { LoginUser } from "../pages/_app";
import { useContext } from "react";

const Header = () => {
  const { user, setUser } = useContext(LoginUser)
  return (
    <Box bg="white" w="100%" h="80px" p="5" position="fixed">
        <Flex align="center" h="100%" color="blackAlpha.800" pr="10">
          <Box
            color="blackAlpha.700"
            bg="whiteAlpha.100"
            fontSize="4xl"
          >
            UT-CADDE
          </Box>
          <Spacer />
          <Box fontSize="xl" fontWeight="bold" ml="5">
              { user["userID"] ? "user ID: " + user["userID"] : ""}
          </Box>
        </Flex>
      <Divider borderColor="gray.100" />
    </Box>
  );
};

export default Header;