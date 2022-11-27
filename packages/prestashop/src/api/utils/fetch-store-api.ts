import type { PrestashopConfig } from '../index'
import { PrestashopApiError, PrestashopNetworkError } from './errors'

const fetchStoreApi =
  <T>(getConfig: () => PrestashopConfig) =>
  async (
    endpoint: string,
    options?: {
      method?: string
      body?: any
      headers?: HeadersInit
    }
  ): Promise<T> => {
    const config = getConfig()
    let res: Response

    try {
      res = await fetch(config.storeApiUrl + endpoint, {
        ...options,
        headers: {
          ...options?.headers,
          'Content-Type': 'application/json',
          // 'X-Auth-Token': config.storeApiToken,
          // 'X-Auth-Client': config.storeApiClientId,
        },
      })
    } catch (error: any) {
      throw new PrestashopNetworkError(
        `Fetch to Prestashop failed: ${error.message}`
      )
    }

    const contentType = res.headers.get('Content-Type')
    const isJSON = contentType?.includes('application/json')

    if (!res.ok) {
      const data = isJSON ? await res.json() : await getTextOrNull(res)
      const headers = getRawHeaders(res)
      const msg = `Prestashop API error (${
        res.status
      }) \nHeaders: ${JSON.stringify(headers, null, 2)}\n${
        typeof data === 'string' ? data : JSON.stringify(data, null, 2)
      }`

      throw new PrestashopApiError(msg, res, data)
    }

    if (res.status !== 204 && !isJSON) {
      throw new PrestashopApiError(
        `Fetch to Prestashop API failed, expected JSON content but found: ${contentType}`,
        res
      )
    }

    // If something was removed, the response will be empty
    return res.status === 204 ? null : await res.json()
  }
export default fetchStoreApi

function getRawHeaders(res: Response) {
  const headers: { [key: string]: string } = {}

  res.headers.forEach((value, key) => {
    headers[key] = value
  })

  return headers
}

function getTextOrNull(res: Response) {
  try {
    return res.text()
  } catch (err) {
    return null
  }
}
