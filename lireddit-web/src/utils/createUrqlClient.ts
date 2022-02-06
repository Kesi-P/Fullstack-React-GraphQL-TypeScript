import { dedupExchange, fetchExchange, stringifyVariables } from "urql";
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from "../generated/graphql";
import { cacheExchange, QueryInput, Cache, query, Resolver } from '@urql/exchange-graphcache'


function betterUpdateQuery<Result, Query>(
    cache: Cache,
    qi: QueryInput,
    result: any,
    fn: (r: Result, q: Query) => Query
  ){
    return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
  }

const cursorPagination= (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entitiKey, fieldName } = info;
    //console.log(entitiKey, fieldName);
    
    const allFields = cache.inspectFields(entitiKey);
    //console.log('Allfields:',allFields);
    
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName)
    const size = fieldInfos.length;
    //console.log('Size:', size);
    
    if(size === 0){
      return undefined
    }

    //console.log('fieldArgs: ', fieldArgs)
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    //console.log('key we create:', fieldKey)
    const isInTheCache = cache.resolve(cache.resolveFieldByKey(entitiKey, fieldKey) as string, 'blogs')
    //console.log('isItInTheCache:', isInTheCache)
    info.partial = !isInTheCache;
    let hasMore = true;
    const results: string[] =[]
    fieldInfos.forEach(fi => {
      const key = cache.resolveFieldByKey(entitiKey, fi.fieldKey) as string;
      const data = cache.resolve(key, 'blogs') as string[];
      const _hasMore = cache.resolve(key, 'hasMore') as boolean;
      if(!_hasMore){
        hasMore = _hasMore
      }
      //console.log('Data:',data);
      results.push(...data)
    });
    //console.log('resulr:', results);
    
    return {_typename:'PaginatedBlog',hasMore: true, blogs:results}
  }
}
export const createUrqlClient = (ssrExchange:any) => ( {
    url: "http://localhost:4000/graphql",
    fetchOptions: {
      credentials: "include" as const,
     // mode:'no-cors'
    },
    exchanges: [dedupExchange, cacheExchange({
      keys: {
        PaginatedBlog: () => null
      },
      resolvers:{
        Query: {
          //blog name match as blog resolver name
          blog: cursorPagination()
        }
      },
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

