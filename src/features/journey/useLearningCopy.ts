import { useLocale } from '../locale/LocaleProvider'

export function useLearningCopy() {
  const { locale } = useLocale()
  return (english: string, indonesian: string) => locale === 'id' ? indonesian : english
}
