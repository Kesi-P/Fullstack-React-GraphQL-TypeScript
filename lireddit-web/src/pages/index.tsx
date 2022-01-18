import {
  Link as ChakraLink,
  Text,
  Code,
  List,
  ListIcon,
  ListItem,
} from '@chakra-ui/react'
import { NavBar } from '../components/NavBar'
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlCClient';
import { useBlogsQuery } from '../generated/graphql';


const Index = () => {

  const [{ data }] = useBlogsQuery()
  return (
    <>
    <NavBar/>
    { !data ? null : data.blogs.map((b) => <div key={b.id}>{b.title}</div>)}
    </>
  )
}

export default withUrqlClient(createUrqlClient, {ssr: true})(Index)
