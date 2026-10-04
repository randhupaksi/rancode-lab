/** Editorial translations are keyed by exact source copy, never applied to code. */
const files = import.meta.glob<Record<string, string>>('./id/*.json', { eager: true, import: 'default' })
const dictionaries: Record<string, Record<string, string>> = Object.create(null)
const shared: Record<string, string> = Object.create(null)
for (const [path, copy] of Object.entries(files)) {
  const course = path.split('/').at(-1)!.replace('.json', '')
  dictionaries[course] = copy
  Object.assign(shared, copy)
}

function templateParts(source: string): { kind: 'hint' | 'answer'; parts: string[] } | undefined {
  const hint = /^Follow the (.+) step and compare it with the result\. (.+)$/s.exec(source)
  if (hint) return { kind: 'hint', parts: [hint[1], hint[2]] }
  const suffix = ' follows the pattern shown in this lesson.'
  if (source.endsWith(suffix)) return { kind: 'answer', parts: [source.slice(0, -suffix.length)] }
}

export function hasIndonesianLessonCopy(source: string, course: string): boolean {
  if (Object.hasOwn(dictionaries[course] ?? {}, source) || Object.hasOwn(shared, source)) return true
  const template = templateParts(source)
  return Boolean(template?.parts.every(part => hasIndonesianLessonCopy(part, course)))
}

export function translateLessonCopy(source: string, course: string): string {
  const dictionary = dictionaries[course]
  const copy = dictionary && Object.hasOwn(dictionary, source) ? dictionary[source] : shared[source]
  if (copy !== undefined) return copy
  const template = templateParts(source)
  if (template) {
    const parts = template.parts.map(part => translateLessonCopy(part, course))
    return template.kind === 'hint'
      ? `Perhatikan langkah “${parts[0]}”, lalu bandingkan dengan hasilnya. ${parts[1]}`
      : `Jawaban yang sesuai adalah “${parts[0]}”. Cocokkan dengan alur pada contoh di pelajaran ini.`
  }
  return source
}
