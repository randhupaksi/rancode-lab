import type { Challenge, Concept, Course, CourseModule, Lesson } from './types'
import type { Locale } from '../features/locale/LocaleProvider'
import { localizeLogicLesson } from './logic-lesson-locales'

const courseCopy: Record<string, Partial<Pick<Course, 'title' | 'eyebrow' | 'description' | 'prerequisite'>>> = {
  logic: { title: 'Logika & Pemecahan Masalah', eyebrow: 'Mulai dari cara berpikir', description: 'Uraikan masalah sehari-hari menjadi langkah, keputusan, dan instruksi yang dapat diulang.', prerequisite: 'Belum perlu pengalaman coding' },
  web: { title: 'Web & Alat Pengembangan', eyebrow: 'Kenali lingkungan belajarmu', description: 'Pahami browser, file, developer tools, dan langkah awal version control.', prerequisite: 'Dasar pemecahan masalah' },
  typescript: { eyebrow: 'Buat maksud JavaScript-mu lebih jelas', description: 'Bangun model mental yang kuat untuk types, data, dan kode aplikasi nyata.', prerequisite: 'Dasar JavaScript' },
  react: { eyebrow: 'Bangun antarmuka dari bagian yang jelas', description: 'Pahami components, state, effects, dan pertimbangan di balik UI yang responsif.', prerequisite: 'Dasar JavaScript dan browser' },
  nextjs: { eyebrow: 'Bangun pengalaman web yang utuh', description: 'Pelajari routes, batas rendering, alur data, dan pengalaman route yang andal.', prerequisite: 'Fondasi React' },
}

const moduleCopy: Record<string, Pick<CourseModule, 'title' | 'description'>> = {
  'logic-essentials': { title: 'Dasar Logika & Pemecahan Masalah', description: 'Mulai dengan instruksi, keputusan, pengulangan, dan pemecahan masalah.' },
  'logic-reasoning': { title: 'Penalaran dan Verifikasi', description: 'Rumuskan masalah, telusuri keputusan, bandingkan pendekatan, dan periksa hasilnya.' },
  'web-essentials': { title: 'Dasar Web & Alat Pengembangan', description: 'Pahami browser, file, developer tools, dan riwayat versi.' },
  'web-workflow': { title: 'Alur Kerja Developer', description: 'Kenali request, alat lokal, dokumentasi, dan proses publikasi.' },
  'getting-started': { title: 'Memulai', description: 'Pahami alasan types ada dan tulis kontrak pertamamu.' },
  'type-system': { title: 'Sistem Tipe', description: 'Jelajahi values, inference, koleksi, dan tipe alternatif.' },
  functions: { title: 'Functions', description: 'Hubungkan input, perilaku, dan hasil dengan kontrak yang jelas.' },
  structures: { title: 'Objects & Structures', description: 'Modelkan bentuk yang dapat digunakan ulang serta hubungannya.' },
  'advanced-types': { title: 'Advanced Types', description: 'Persempit kemungkinan dan turunkan tipe dari model yang ada.' },
  generics: { title: 'Generics', description: 'Pertahankan hubungan tipe saat kode menjadi dapat digunakan ulang.' },
  'real-world': { title: 'TypeScript di Dunia Nyata', description: 'Terapkan types pada batas data, kode async, dan components.' },
  'react-foundations': { title: 'Fondasi React', description: 'Bangun model yang jelas tentang components, JSX, dan props.' },
  'react-state': { title: 'State & Interaction', description: 'Modelkan UI yang berubah, events, dan lists.' },
  'react-effects': { title: 'Melampaui Render', description: 'Hubungkan sistem eksternal, logika yang dapat digunakan ulang, dan composition.' },
  'react-composition': { title: 'Berbagi & Menyusun State', description: 'Selaraskan komponen terkait, values bersama, dan transisi yang kompleks.' },
  'react-performance': { title: 'UI Responsif dan Aksesibel', description: 'Buat interaksi tetap cepat, fokus, dan bisa digunakan semua orang.' },
  'react-practice': { title: 'Fitur React yang Andal', description: 'Tangani forms, requests, recovery, testing, dan batas fitur.' },
  'next-routing': { title: 'Routes & Layouts', description: 'Gunakan App Router untuk membentuk navigasi dan UI bertingkat.' },
  'next-rendering': { title: 'Rendering & Data', description: 'Pilih batas server dan client, lalu ambil data dengan sengaja.' },
  'next-experience': { title: 'Pengalaman Route yang Andal', description: 'Rancang loading, error, metadata, dan perilaku HTTP route.' },
  'next-mutations': { title: 'Forms & Server Mutations', description: 'Validasi perubahan data, segarkan data yang berubah, dan tegakkan batas server.' },
  'next-optimization': { title: 'Routes Cepat dan Mudah Ditemukan', description: 'Kelola ukuran bundle, batas client, metadata, dan performa yang terasa oleh pengguna.' },
  'next-production': { title: 'Aplikasi Siap Produksi', description: 'Konfigurasikan, amati, lindungi, dan tinjau pengalaman route secara lengkap.' },
}

export function localizeCourse(course: Course, locale: Locale): Course {
  return locale === 'id' && courseCopy[course.id] ? { ...course, ...courseCopy[course.id] } : course
}

export function localizeModule(module: CourseModule, locale: Locale): CourseModule {
  return locale === 'id' && moduleCopy[module.id] ? { ...module, ...moduleCopy[module.id] } : module
}

const lessonTranslations = new WeakMap<Lesson, Lesson>()
export function localizeLesson(lesson: Lesson, locale: Locale): Lesson {
  if (locale !== 'id') return lesson
  const cached = lessonTranslations.get(lesson)
  if (cached) return cached
  const localized = localizeLogicLesson(lesson, locale)
  lessonTranslations.set(lesson, localized)
  return localized
}

export function localizeConcept(concept: Concept, lesson: Lesson, locale: Locale): Concept {
  const localizedLesson = localizeLesson(lesson, locale)
  if (localizedLesson === lesson) return concept
  return { ...concept, title: localizedLesson.title, category: localizedLesson.challenge.topic, description: localizedLesson.description, visual: localizedLesson.visual }
}

export function localizeChallenge(challenge: Challenge, lesson: Lesson, locale: Locale): Challenge {
  const localizedLesson = localizeLesson(lesson, locale)
  return localizedLesson === lesson ? challenge : localizedLesson.challenge
}
