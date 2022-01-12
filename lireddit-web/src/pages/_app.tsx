import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import { Provider, createClient, dedupExchange, fetchExchange } from 'urql'
import { cacheExchange, QueryInput, Cache, query } from '@urql/exchange-graphcache'
import theme from '../theme'
import { LoginMutation, MeDocument, MeQuery, RegisterMutation } from '../generated/graphql'

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
){
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

//urql client - ponit to graphql
const client = createClient({ 
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include",
   // mode:'no-cors'
  },
  exchanges: [dedupExchange, cacheExchange({
    updates: {
      Mutation: {
        login: (_result, args, cache, info) => {
          //the user return are need to be the same (username/ updatedAt/ id)
          betterUpdateQuery<LoginMutation, MeQuery>(
            cache,
            {query: MeDocument},
            _result,
            (result, query) => {
              if (result.login.errors){
                return query;
              } else {
                return {
                  //(username/ updatedAt/ id)
                  me: result.login.user
                }
              }
            }
          )
        },
        register: (_result, args, cache, info) => {
          betterUpdateQuery<RegisterMutation, MeQuery>(
            cache,
            {query: MeDocument},
            _result,
            (result, query) => {
              if (!result.register){
                return query;
              } else {
                return {
                  //(username/ updatedAt/ id)
                  me: result.register
                }
              }
            }
          )
        }
      }
    }
  }), fetchExchange]

})



function MyApp({ Component, pageProps }) {
  return (
    <Provider value={client}>
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{
          useSystemColorMode: true,
        }}
      >
        <Component {...pageProps} />
      </ColorModeProvider>
    </ChakraProvider>
    </Provider>
  )
}

export default MyApp
