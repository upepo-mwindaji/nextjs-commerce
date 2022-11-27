// Used for GraphQL errors
// export class BigcommerceGraphQLError extends Error {}

export class PrestashopApiError extends Error {
  status: number
  res: Response
  data: any

  constructor(msg: string, res: Response, data?: any) {
    super(msg)
    this.name = 'PrestashopApiError'
    this.status = res.status
    this.res = res
    this.data = data
  }
}

export class PrestashopNetworkError extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'PrestashopNetworkError'
  }
}
