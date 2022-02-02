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
} from '@chakra-ui/react'
import { NavBar } from '../components/NavBar'
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useBlogsQuery } from '../generated/graphql';
import { Layout } from '../components/Layout';
import NextLink from 'next/link'

const Index = () => {

  const [{ data, fetching }] = useBlogsQuery({
    variables: {
      limit:10
    }
    })
  return (
    <>
    <Layout>
      <Flex mb={5}>
        <Heading>All Blogs</Heading>
      <NextLink href='/create-blog'>
        <Link ml='auto'>Create Blog</Link>
      </NextLink>
      </Flex>
      <Stack spacing={8}>
        {data.blogs.map((b) =>(
          <Box p={5} shadow='md' borderWidth='1px'>
          <Heading fontSize='xl'>{b.title}</Heading>
          <Text mt={4}>{b.textSnippet}</Text>
        </Box>
        ))}
      </Stack>
    
    </Layout>
    </>
  )
}

export default withUrqlClient(createUrqlClient, {ssr: true})(Index)
