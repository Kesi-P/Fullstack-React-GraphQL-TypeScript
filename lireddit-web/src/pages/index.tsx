import {
  Link as ChakraLink,
  Text,
  Code,
  List,
  ListIcon,
  ListItem,
  Link,
} from '@chakra-ui/react'
import { NavBar } from '../components/NavBar'
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlCClient';
import { useBlogsQuery } from '../generated/graphql';
import { Layout } from '../components/Layout';
import NextLink from 'next/link'

const Index = () => {

  const [{ data }] = useBlogsQuery({
    variables: {
      limit:10
    }
    })
  return (
    <>
    <Layout>
      <NextLink href='/create-blog'>
        <Link>Create Blog</Link>
      </NextLink>
    { !data ? null : data.blogs.map((b) => <div key={b.id}>{b.title}</div>)}
    </Layout>
    </>
  )
}

export default withUrqlClient(createUrqlClient, {ssr: true})(Index)
