import { Box, Divider, Flex } from "@chakra-ui/react";

const Header = () => {
  return (
    <Box bg="white.100" w="100%" pl="5">
      <Flex flexDirection="row" align="center">
        <Box p="4" h="100px">
          <Flex align="center" h="100%" color="blackAlpha.800">
            <Box
              color="blackAlpha.700"
              bg="whiteAlpha.100"
              fontSize="4xl"
            >
              UT-CADDE
            </Box>
          </Flex>
        </Box>
      </Flex>
      <Divider borderColor="gray.100" />
    </Box>
  );
};

export default Header;