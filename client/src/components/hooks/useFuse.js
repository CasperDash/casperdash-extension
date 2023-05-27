import Fuse from 'fuse.js';
import { debounce } from 'lodash-es';
import { useCallback, useMemo, useState } from 'react';

export const useFuse = (list, options) => {
  // defining our query state in there directly
  const [query, updateQuery] = useState('');

  // removing custom options from Fuse options object
  // NOTE: `limit` is actually a `fuse.search` option, but we merge all options for convenience
  const { limit, matchAllOnEmptyQuery, ...fuseOptions } = options;

  // let's memoize the fuse instance for performances
  const fuse = useMemo(
    () => new Fuse(list, fuseOptions),
    [list, fuseOptions]
  );

  // memoize results whenever the query or options change
  const hits = useMemo(
    // if query is empty and `matchAllOnEmptyQuery` is `true` then return all list
    // NOTE: we remap the results to match the return structure of `fuse.search()`
    () => !query && matchAllOnEmptyQuery
      ? fuse.getIndex().docs.slice(0, limit).map((item, refIndex) => ({ item, refIndex }))
      : fuse.search(query, { limit }),
    [fuse, limit, matchAllOnEmptyQuery, query]
  );

  // debounce updateQuery and rename it `setQuery` so it's transparent
  const setQuery = useMemo(
    () => debounce(updateQuery, 100),
    []
  );

  // pass a handling helper to speed up implementation
  const onSearch = useCallback(
    (e) => setQuery(e.target.value.trim()),
    [setQuery]
  );

  // still returning `setQuery` for custom handler implementations
  return {
    hits,
    onSearch,
    query,
    setQuery,
  };
};