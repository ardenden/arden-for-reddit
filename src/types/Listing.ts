export interface Listing<T> {
  kind: 'Listing'
  data: {
    before: string
    after: string
    modhash: string
    children: T[]
    dist: number
  }
}
