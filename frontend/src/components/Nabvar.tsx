import React from 'react';
import { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { Link, Box, Flex, Text, Button, Stack } from '@chakra-ui/react';
import { auth } from '@/lib/firebaseConfig';
import { useAuthContext } from '@/provider/AuthProvider';

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
function Navbar({ ...props }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <NavBarContainer {...props}>
            <MenuToggle toggle={toggle} isOpen={isOpen} />
            <MenuLinks isOpen={isOpen} />
        </NavBarContainer>
    );
}

function CloseIcon() {
    return (
        <svg width="24" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <title>Close</title>
            <path
                fill="white"
                d="M9.00023 7.58599L13.9502 2.63599L15.3642 4.04999L10.4142 8.99999L15.3642 13.95L13.9502 15.364L9.00023 10.414L4.05023 15.364L2.63623 13.95L7.58623 8.99999L2.63623 4.04999L4.05023 2.63599L9.00023 7.58599Z"
            />
        </svg>
    );
}

function MenuIcon() {
    return (
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
}

function MenuToggle({ toggle, isOpen }: MenuToggleProps) {
    return (
        <Box display={{ base: 'block', md: 'none' }} onClick={toggle}>
            {isOpen ? <CloseIcon /> : <MenuIcon />}
        </Box>
    );
}

function MenuItem({
    children,
    isLast,
    to = '/',
    ...rest
}: MenuItemProps): React.ReactNode {
    return (
        <Link as={NextLink} href={to}>
            <Text display="block" {...rest}>
                {children}
            </Text>
        </Link>
    );
}

function AuthButton(): React.ReactNode {
    const { user } = useAuthContext();
    const router = useRouter();

    const handleClick = () => {
        signOut(auth)
            .then(() => {
                router.push('/signin');
            })
            .catch((error) => {
                console.error(error);
            });
    };

    if (!user) {
        return (
            <MenuItem to="/signin">
                <Button
                    size="sm"
                    rounded="md"
                    colorScheme='gray'
                >
                    ログイン
                </Button>
            </MenuItem>
        );
    } else {
        return (
            <Button
                size="sm"
                rounded="md"
                colorScheme='gray'
                onClick={handleClick}
            >
                ログアウト
            </Button>
        );
    }
}

function MenuLinks({ isOpen }: MenuLinksProps): React.ReactNode {
    return (
        <Box
            display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
            flexBasis={{ base: '100%', md: 'auto' }}
            w="100%"
        >
            <Stack
                spacing={8}
                align="center"
                justify={['center', 'space-between', 'flex-end', 'flex-end']}
                direction={['column', 'column', 'row', 'row']}
                pt={[4, 4, 0, 0]}
            >
                <MenuItem to="/">ホーム</MenuItem>
                <MenuItem to="/profile">プロフィール</MenuItem>
                <MenuItem to="/group">グループ</MenuItem>
                <AuthButton />
            </Stack>
        </Box>
    );
}

function NavBarContainer({
    children,
    ...props
}: NavBarContainerProps): React.ReactNode {
    return (
        <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            w="100%"
            p={8}
            shadow="md"
            bg={['teal.400', 'teal.400', 'teal.400', 'teal.400']}
            color={['white', 'white', 'white', 'white']}
            {...props}
        >
            {children}
        </Flex>
    );
}

// コンポーネントのエクスポート
export default Navbar;
