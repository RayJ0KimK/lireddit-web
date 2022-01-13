import { dedupExchange, fetchExchange } from "urql"
import { cacheExchange } from "@urql/exchange-graphcache"
import { LoginMutation, MeQuery, MeDocument, RegisterMutation, LogoutMutation } from "../generated/graphql"
import { betterUpdateQuery } from "./betterUpdateQuery"

export const createUrqlClient = (ssrExchange: any) => ({
    url: "http://localhost:4000/graphql",
    fetchOptions: {
        credentials: "include" as const,
      },
    
      //Why do we need to do this ?
      exchanges: [dedupExchange, cacheExchange({
        updates: {
          Mutation: {
    
            /*
            1. Results: API Response
            2. Args:  Args passed into to call the API
            3. Cache: This is how you interact with local cache
            */
    
            login: (_result, args, cache, info) => {
              //this is as if it is a resolver here on its own
              betterUpdateQuery<LoginMutation, MeQuery>(
                cache,
                //MeDocument is fields that you want as your returns, which is also why its know as your query input
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.login.errors) {
                    return query
                  } else {
                    return {
                      me: result.login.user,
                    }
                  }
                }
              )
            },
    
            register: (_result, args, cache, info) => {
              betterUpdateQuery<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.register.errors) {
                    return query
                  } else {
                    return {
                      me: result.register.user,
                    }
                  }
                }
              )
            },
    
            //just figure out what this part is doing when you comeback 
            logout: (_result, args, cache, info) => {
              betterUpdateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => ({ me: null })
              )
            },
    
    
          }
        }
      }), 
      ssrExchange,
      fetchExchange] 
})