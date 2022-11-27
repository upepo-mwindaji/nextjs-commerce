import { SWRHook } from '@vercel/commerce/utils/types'
import useSearch, { UseSearch } from '@vercel/commerce/product/use-search'
import type { SearchProductsHook } from '@vercel/commerce/types/product'

export default useSearch as UseSearch<typeof handler>

export type SearchProductsInput = {
  search?: string
  categoryId?: string
  // brandId?: string // not supported
  // sort?: string. // not supported
  locale?: string
}

export const handler: SWRHook<SearchProductsHook> = {
  fetchOptions: {
    url: '/rest',
    method: 'GET',
  },
  fetcher({ input: { search, categoryId, brandId, sort }, options, fetch }) {
    const RESULTS_PER_PAGE = 10
    let url
    if (search) {
      url = new URL(options.url! + '/productSearch', 'http://a') // TO DO: check language
      // url.searchParams.set('iso_currency', params.currency) // TO DO: check currency
      url.searchParams.set('s', search)
      url.searchParams.set('resultsPerPage', RESULTS_PER_PAGE)
      return fetch({
        url: url.pathname + url.search,
        method: options.method,
      })
    }
    if (Number.isInteger(Number(categoryId))) {
      url = new URL(options.url! + '/categoryProducts', 'http://a') // TO DO: check language
      // url.searchParams.set('iso_currency', params.currency) // TO DO: check currency
      url.searchParams.set('id_category', String(categoryId))
      // url.searchParams.set('slug', params.input.categorySlug)
      // const facetsUrl = facetParams(params.input.filters) // TO DO: check facets
      // url.searchParams.set('q', facetsUrl)
      url.searchParams.set('page', '1') // TO DO: paginate
      url.searchParams.set('with_all_images', '0')
      url.searchParams.set('with_category_tree', '1')
      url.searchParams.set('image_size', 'home_default')
      // TO DO: add redirect follow
    }
    /* TO DO: NOT SUPPORTED ?
    if (Number.isInteger(Number(brandId)))
      url.searchParams.set('brandId', String(brandId))
    */
    /* TO DO: NOT SUPPORTED ?
    if (sort) url.searchParams.set('sort', sort)
    */
    return fetch({
      url: url.pathname + url.search,
      method: options.method,
    })
  },
  useHook:
    ({ useData }) =>
    (input = {}) => {
      return useData({
        input: [
          ['search', input.search],
          ['categoryId', input.categoryId],
          // ['brandId', input.brandId],
          // ['sort', input.sort],
        ],
        swrOptions: {
          revalidateOnFocus: false,
          ...input.swrOptions,
        },
      })
    },
}
