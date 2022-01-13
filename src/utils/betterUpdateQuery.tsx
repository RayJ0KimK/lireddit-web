import { QueryInput, Cache } from "@urql/exchange-graphcache";

export function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query) {
  // Comeback and figure out what is going on hereon
  // Where did $data come from ? and what the fuck is stored in there ?
  return cache.updateQuery(qi, ((data) => fn(result, data as any) as any));
}
