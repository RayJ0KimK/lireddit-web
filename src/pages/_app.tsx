import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import { Provider, createClient, dedupExchange, fetchExchange } from 'urql';
import { cacheExchange, QueryInput, Cache } from "@urql/exchange-graphcache";
import { LoginMutation, MeDocument, MeQuery, RegisterMutation } from '../generated/graphql'
import theme from '../theme'

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  //comeback and figure out what is going on here
  return cache.updateQuery(qi, data => fn(result, data as any) as any)
}


const client = createClient({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include",
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

      }
    }
  }), fetchExchange]
});


function MyApp({ Component, pageProps }: any) {
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
