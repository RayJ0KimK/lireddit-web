import { Box, Button, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link'
import React from 'react'
import { useMeQuery } from '../generated/graphql';

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({ }) => {
    const [{ data, fetching }] = useMeQuery()
    let body = null
    // data is loading
    if (fetching) {
        console.log("Feching")
        // user net logged in
    } else if (!data?.me) {
        <>
            <NextLink href='/login'>
                <Link color='yellow' mr={4}>login</Link>
            </NextLink>
            <NextLink href='/register'>
                <Link color='yellow' mr={4}>register</Link>
            </NextLink>
        </>
        //user is logged in
    } else {
        console.log(data.me.username)
        body = (<Box>{data.me.username}</Box>)
    }

    console.log(body)
    return (
        < Flex bg='tan' p={4} ml={'auto'} >
            < Box mr={2} ml={'auto'}> {body} </Box >
            <Button variant='link'> logout </Button>
        </Flex >
    );
}