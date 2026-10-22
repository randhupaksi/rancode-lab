export type Seed = {
  id: string
  title: string
  moduleId: string
  minutes: number
  description: string
  code: string
  symbols: string[]
  topic: string
  question: string
  answer: string
  recap: string[]
}

type ExpansionSeed = Omit<Seed, 'minutes'> & { minutes?: number }

export function expandSeed(seed: ExpansionSeed): Seed {
  return {
    ...seed,
    minutes: seed.minutes ?? 7,
  }
}
