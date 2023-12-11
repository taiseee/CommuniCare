import React from 'react';
import { useState } from 'react';
import { Link, Box, Flex, Text, Button, Stack } from '@chakra-ui/react';


type NavbarProps = {
};

type MenuToggleProps = {
  toggle: () => void;
  isOpen: boolean;
};

type MenuItemProps = {
  children: React.ReactNode;
  isLast?: boolean;
  to?: string;
};

type MenuLinksProps = {
  isOpen: boolean;
};

type NavBarContainerProps = {
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<'nav'>;

// コンポーネントの定義
const Navbar: React.FC<NavbarProps> = ({ ...props }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <NavBarContainer {...props}>
      <MenuToggle toggle={toggle} isOpen={isOpen} />
      <MenuLinks isOpen={isOpen} />
    </NavBarContainer>
  );
};

const CloseIcon: React.FC = () => (
  <svg width="24" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <title>Close</title>
    <path
      fill="white"
      d="M9.00023 7.58599L13.9502 2.63599L15.3642 4.04999L10.4142 8.99999L15.3642 13.95L13.9502 15.364L9.00023 10.414L4.05023 15.364L2.63623 13.95L7.58623 8.99999L2.63623 4.04999L4.05023 2.63599L9.00023 7.58599Z"
    />
  </svg>
);

const MenuIcon: React.FC = () => (
  <svg
    width="24px"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    fill="white"
  >
    <title>Menu</title>
    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
  </svg>
);

const MenuToggle: React.FC<MenuToggleProps> = ({ toggle, isOpen }) => {
  return (
    <Box display={{ base: "block", md: "none" }} onClick={toggle}>
      {isOpen ? <CloseIcon /> : <MenuIcon />}
    </Box>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({ children, isLast, to = "/", ...rest }) => {
  return (
    <Link href={to}>
      <Text display="block" {...rest}>
        {children}
      </Text>
    </Link>
  );
};

const MenuLinks: React.FC<MenuLinksProps> = ({ isOpen }) => {
  return (
    <Box
      display={{ base: isOpen ? "block" : "none", md: "block" }}
      flexBasis={{ base: "100%", md: "auto" }}
      w="100%"
    >
      <Stack
        spacing={8}
        align="center"
        justify={["center", "space-between", "flex-end", "flex-end"]}
        direction={["column", "column", "row", "row"]}
        pt={[4, 4, 0, 0]}
      >
        <MenuItem to="/">ホーム</MenuItem>
        <MenuItem to="/search">検索</MenuItem>
        <MenuItem to="/faetures">チャット</MenuItem>
        <MenuItem to="/signin">
          <Button
            size="sm"
            rounded="md"
            color={["teal.400", "teal.400", "white", "white"]}
            bg={["white", "white", "teal.400", "teal.400"]}
            _hover={{
              bg: ["teal.400", "teal.400", "teal.400", "teal.400"]
            }}
          >
            ログイン
          </Button>
        </MenuItem>
      </Stack>
    </Box>
  );
};

const NavBarContainer: React.FC<NavBarContainerProps> = ({ children, ...props }) => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      mb={8}
      p={8}
      bg={["teal.400", "teal.400", "transparent", "transparent"]}
      color={["white", "white", "teal.400", "teal.400"]}
      {...props}
    >
      {children}
    </Flex>
  );
};


// コンポーネントのエクスポート
export default Navbar;