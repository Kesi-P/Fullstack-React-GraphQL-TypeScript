import { dedupExchange, fetchExchange } from "urql";
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from "../generated/graphql";
import { cacheExchange, QueryInput, Cache, query } from '@urql/exchange-graphcache'


function betterUpdateQuery<Result, Query>(
    cache: Cache,
    qi: QueryInput,
    result: any,
    fn: (r: Result, q: Query) => Query
  ){
    return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
  }

export const createUrqlClient = (ssrExchange:any) => ( {
    url: "http://localhost:4000/graphql",
    fetchOptions: {
      credentials: "include" as const,
     // mode:'no-cors'
    },
    exchanges: [dedupExchange, cacheExchange({
      updates: {
        Mutation: {
          logout: (_result, args, cache, info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              //just only return, don't care if both mutation return the same value
              () => ({ me: null})
            )
          },
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
    }),
    ssrExchange,
    fetchExchange]
}  )

