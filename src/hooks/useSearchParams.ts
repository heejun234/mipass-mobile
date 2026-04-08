'use client';

/**
 * @author 신희준
 *
 * @description 서치 파라미터 훅
 */

import {
  useSearchParams as useNextSearchParams,
  usePathname,
  useRouter,
} from 'next/navigation';
import { useCallback } from 'react';

export function useSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useNextSearchParams();

  const setSearchParam = useCallback(
    (
      key: string,
      value: string,
      options?: { scroll?: boolean; replace?: boolean },
    ) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === 'all' || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      const queryString = params.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;

      if (options?.replace) {
        router.replace(url, { scroll: options?.scroll ?? true });
      } else {
        router.push(url, { scroll: options?.scroll ?? true });
      }
    },
    [searchParams, pathname, router],
  );

  const setSearchParams = useCallback(
    (updates: Record<string, string>, options?: { replace?: boolean }) => {
      const params = options?.replace
        ? new URLSearchParams()
        : new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === 'all' || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    },
    [searchParams, pathname, router],
  );

  const deleteSearchParam = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  const clearSearchParams = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  const getSearchParam = useCallback(
    (key: string) => {
      return searchParams.get(key);
    },
    [searchParams],
  );

  return {
    setSearchParam,
    setSearchParams,
    deleteSearchParam,
    clearSearchParams,
    getSearchParam,
    searchParams,
  };
}
