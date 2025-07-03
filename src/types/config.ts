import { AuroraCustom } from './custom'

export type AuroraConfig = Partial<{
  custom: AuroraCustom
  config: Partial<{
    id: Partial<{
      custom: Function
    }>
  }>
}>