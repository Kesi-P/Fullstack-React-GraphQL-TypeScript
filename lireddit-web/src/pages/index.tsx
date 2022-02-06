import {
  Link as ChakraLink,
  Text,
  Code,
  List,
  ListIcon,
  ListItem,
  Link,
  Stack,
  Box,
  Heading,
  Flex,
  Button,
} from '@chakra-ui/react'
import { NavBar } from '../components/NavBar'
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useBlogsQuery } from '../generated/graphql';
import { Layout } from '../components/Layout';
import NextLink from 'next/link'
import { useState } from 'react';

const Index = () => {
  const [variables, setVariables] = useState({limit: 9, cursor:null as null | string})
  const [{ data, fetching }] = useBlogsQuery({ variables })
  console.log('Data are:',data);
  
  return (
    <>
    <Layout>
      <Flex mb={5}>
        <Heading>All Blogs</Heading>
      <NextLink href='/create-blog'>
        <Link ml='auto'>Create Blog</Link>
      </NextLink>
     </Flex>
       <>
      <Stack spacing={8}>
        {data!.blogs.blogs.map((b) =>(
          <Box p={5} shadow='md' borderWidth='1px'>
          <Heading fontSize='xl'>{b.title}</Heading>
          <Text mt={4}>{b.textSnippet}</Text>
        </Box>
        ))}
      </Stack>
      </>
      
      { data && !data.blogs.hasMore ?
      (
      <Flex>
          <Button 
          onClick = {() =>{
            setVariables({
              limit: variables.limit,
              cursor: data.blogs.blogs[data.blogs.blogs.length - 1].createdAt
            })
          }}
          isLoading={fetching} m='auto' my={8} >
            Load more
          </Button>
      </Flex>
      )
      : null }
    </Layout>
    </>
  )
}

export default withUrqlClient(createUrqlClient, {ssr: true})(Index)
