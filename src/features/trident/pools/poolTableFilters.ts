import { Fee } from '@zarclays/zswap-trident-sdk'
import { TridentPool } from 'app/services/graph/fetchers/pools'

type FilterSymbolsFunc<T> = (arg0: { original: TridentPool }[], arg1: string[], arg2: T) => any[]

export const filterForSearchQueryAndTWAP: FilterSymbolsFunc<{ searchQuery: string; twapEnabled: boolean }> = (
  rows,
  id,
  filterValue
) => {
  return rows.filter(({ original }) => {
    if (filterValue.twapEnabled && !original.twapEnabled) return false

    // Allow searching for symbol (LINK) or name (chainlink)
    const searchableText = [original.token0, original.token1]
      .map((asset) => asset.symbol)
      .concat([original.token0, original.token1].map((asset) => asset.name))
      .join(' ')
      .toLowerCase()
    return !filterValue.searchQuery.length || searchableText.includes(filterValue.searchQuery.toLowerCase())
  })
}

export const feeTiersFilter: FilterSymbolsFunc<{ feeTiersSelected: Fee[] }> = (rows, id, filterValue) =>
  rows.filter(
    ({ original }) => !filterValue.feeTiersSelected.length || filterValue.feeTiersSelected.includes(original.swapFee)
  )
