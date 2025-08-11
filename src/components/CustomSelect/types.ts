import { type Option } from '@inkjs/ui'

export type OptionSubtree = {
  /**
   * Header to show above sub-options.
   */
  readonly header?: string

  /**
   * Options.
   */
  readonly options: (Option | OptionSubtree)[]
}

export type OptionHeader = {
  readonly header: string

  readonly optionValues: string[]
}

export const optionHeaderKey = (optionHeader: OptionHeader): string =>
  `HEADER-${optionHeader.optionValues.join(',')}`
