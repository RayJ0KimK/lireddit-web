import { Box, Button, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link'
import React from 'react'
import { useLogoutMutation, useMeQuery } from '../generated/graphql';

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({ }) => {
    //What the fuck is this logoutFecthing ? He just pulled this out of his ass ?
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation()
    const [{ data, fetching }] = useMeQuery()

    let body = null
    // data is loading
    if (fetching) {
        // user net logged in
    } else if (!data?.me) {
        body = (
            <>
                <NextLink href='/login'>
                    <Link color='yellow' mr={4}>login</Link>
                </NextLink>
                <NextLink href='/register'>
                    <Link color='yellow' mr={4}>register</Link>
                </NextLink>
            </>
        )
        //user is logged in
    } else {
        body = (
            <Flex>
                <Box mr={2}>{data.me.username}</Box>
                < Button
                    onClick={() => {
                        logout();
                    }}
                    isLoading={logoutFetching}
                    variant='link'
                >
                    logout
                </Button>
            </Flex >
        )
    }

    return (
        <Flex bg='red' p={4}>
            <Box ml={"auto"}>{body}</Box>
        </Flex>
    );
}