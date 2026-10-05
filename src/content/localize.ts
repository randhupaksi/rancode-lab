import type { Challenge, Concept, Course, CourseModule, Lesson } from './types'
import type { Locale } from '../features/locale/LocaleProvider'
import { localizeLogicLesson } from './logic-lesson-locales'
import { lessonTitleId } from './lesson-title-locales'
import { translateLessonCopy } from './locales/id'

const courseCopy: Record<string, Partial<Pick<Course, 'title' | 'eyebrow' | 'description' | 'prerequisite'>>> = {
  tailwind: { eyebrow: 'Ubah fondasi CSS-mu menjadi antarmuka yang jelas', description: 'Pasang Tailwind, pahami utility-nya, dan bangun halaman responsif dengan sistem visual yang bisa kamu jelaskan.', prerequisite: 'Dasar HTML dan CSS; dasar React dan Next.js untuk contoh framework' },
  'ai-coding': { eyebrow: 'Bangun dengan terarah bersama AI coding agent', description: 'Ubah ide menjadi aplikasi kecil lewat prompt yang jelas, desain yang punya arah, dan hasil yang bisa kamu tinjau.', prerequisite: 'Dasar HTML, CSS, JavaScript, dan browser untuk latihan membangun aplikasi' },
  logic: { title: 'Logika & Pemecahan Masalah', eyebrow: 'Mulai dari cara berpikir', description: 'Uraikan masalah sehari-hari menjadi langkah yang jelas, lalu tentukan keputusan dan urutannya.', prerequisite: 'Belum perlu pengalaman coding' },
  web: { title: 'Web & Alat Developer', eyebrow: 'Kenali lingkungan belajarmu', description: 'Kenali browser, file proyek, alat developer, dan cara mencatat perubahan dengan version control.', prerequisite: 'Dasar pemecahan masalah' },
  html: { eyebrow: 'Susun konten dengan makna', description: 'Buat halaman yang rapi dan mudah digunakan dengan heading, tautan, daftar, dan formulir yang jelas.', prerequisite: 'Dasar web dan file' },
  css: { eyebrow: 'Atur tampilan dan tata letak', description: 'Ubah tampilan halaman, pahami cara kerja layout, dan sesuaikan dengan ukuran layar.', prerequisite: 'Dasar HTML semantik' },
  javascript: { eyebrow: 'Buat idemu jadi interaktif', description: 'Kenali nilai, function, kumpulan data, dan proses async sebelum memakai framework.', prerequisite: 'Dasar logika, HTML, dan CSS' },
  browser: { title: 'JavaScript di Browser', eyebrow: 'Hubungkan kode dengan halaman', description: 'Buat interaksi dengan DOM, events, form, dan kondisi data yang jelas.', prerequisite: 'Dasar function, object, dan async JavaScript' },
  typescript: { eyebrow: 'Jelaskan maksud kodemu', description: 'Pahami types dan data, lalu gunakan TypeScript pada kode aplikasi.', prerequisite: 'Dasar JavaScript' },
  react: { eyebrow: 'Susun antarmuka dari komponen', description: 'Pahami components, state, effects, dan cara membangun UI yang responsif.', prerequisite: 'Dasar JavaScript dan browser' },
  nextjs: { eyebrow: 'Rangkai pengalaman web yang utuh', description: 'Pelajari routes, rendering, alur data, dan cara menangani berbagai kondisi halaman.', prerequisite: 'Dasar React dan TypeScript' },
}

const moduleCopy: Record<string, Pick<CourseModule, 'title' | 'description'>> = {
  'logic-essentials': { title: 'Dasar Logika & Pemecahan Masalah', description: 'Ubah masalah sehari-hari menjadi langkah, keputusan, dan instruksi yang mudah diikuti.' },
  'logic-reasoning': { title: 'Bernalar dan Memeriksa Hasil', description: 'Rumuskan masalah, telusuri keputusan, bandingkan cara, lalu periksa hasilnya.' },
  'web-essentials': { title: 'Dasar Web & Alat Developer', description: 'Kenali browser, file, alat developer, dan riwayat perubahan proyek.' },
  'web-workflow': { title: 'Alur Kerja Developer', description: 'Pahami request, alat lokal, dokumentasi, dan cara memublikasikan pekerjaan.' },
  'html-essentials': { title: 'Dasar HTML', description: 'Susun halaman yang mudah dibaca dengan heading, tautan, daftar, dan form berlabel.' },
  'html-document-meaning': { title: 'Dokumen yang Punya Makna', description: 'Susun konten dengan elemen yang tepat sebelum mengatur tampilannya.' },
  'html-form-controls': { title: 'Kontrol Form yang Lengkap', description: 'Kumpulkan data lewat label dan pengelompokan yang jelas, lalu tangani pengirimannya.' },
  'html-media-content': { title: 'Gambar dan Konten Tersemat', description: 'Siapkan teks alternatif, ukuran yang stabil, dan konten sematan dengan cermat.' },
  'html-data-interaction': { title: 'Data dan Interaksi Bawaan', description: 'Buat tabel dan detail yang bisa dibuka sebelum menambahkan framework.' },
  'css-essentials': { title: 'Dasar CSS', description: 'Atur tampilan halaman, pahami layout, dan sesuaikan dengan ukuran layar.' },
  'css-values-type': { title: 'Nilai dan Tipografi', description: 'Bangun tampilan dasar yang nyaman dibaca dan mudah disesuaikan.' },
  'css-layout-depth': { title: 'Layout Lebih Lanjut', description: 'Pahami ukuran dan pembagian ruang tanpa menebak-nebak lebar elemen.' },
  'css-selector-system': { title: 'Selector dan Cascade', description: 'Pilih elemen sesuai tujuan dan buat aturan CSS tetap mudah diprediksi.' },
  'css-adaptive-layout': { title: 'Menyesuaikan dengan Ruang yang Tersedia', description: 'Sesuaikan komponen dengan layar, container, dan arah tulisan.' },
  'css-polish-access': { title: 'Animasi, Layer, dan Kondisi Akhir', description: 'Rapikan antarmuka tanpa mengorbankan keterbacaan dan kendali pengguna.' },
  'javascript-essentials': { title: 'Dasar JavaScript', description: 'Kenali nilai, function, kumpulan data, dan proses async sebelum memakai framework.' },
  'js-language-rules': { title: 'Memahami Perilaku JavaScript', description: 'Pahami konversi nilai, data yang tidak tersedia, dan scope.' },
  'js-collection-patterns': { title: 'Mengolah Data Terstruktur', description: 'Ubah, bandingkan, dan susun nilai tanpa kehilangan data.' },
  'js-function-patterns': { title: 'Function dan Perilaku Object', description: 'Atur dependency, state, dan perilaku yang bisa digunakan ulang.' },
  'js-async-practice': { title: 'Proses Async dan API Sehari-hari', description: 'Tangani urutan proses, kegagalan, dan format data yang umum dipakai.' },
  'browser-essentials': { title: 'JavaScript di Browser', description: 'Buat interaksi dengan DOM, events, form, dan kondisi data yang jelas.' },
  'browser-dom-patterns': { title: 'Memilih dan Memperbarui DOM', description: 'Perbarui dokumen dengan operasi yang jelas dan aman.' },
  'browser-input-patterns': { title: 'Form dan Waktu Event', description: 'Tanggapi input tanpa menghilangkan perilaku bawaan atau aksesibilitas.' },
  'browser-data-boundaries': { title: 'Request, URL, dan Penyimpanan', description: 'Tangani batasan browser dan tampilkan pesan yang jelas saat terjadi kegagalan.' },
  'browser-lifecycle-apis': { title: 'Mengamati Perubahan dan Membersihkan Proses', description: 'Tanggapi perubahan ukuran, visibilitas, navigasi, dan dukungan fitur.' },
  'react-foundations': { title: 'Dasar React', description: 'Pahami components, JSX, dan props sebagai bagian pembentuk antarmuka.' },
  'react-state': { title: 'State dan Interaksi', description: 'Kelola perubahan UI, events, dan daftar data.' },
  'react-effects': { title: 'Memahami Proses di Luar Render', description: 'Hubungkan sistem eksternal, logika yang bisa digunakan ulang, dan composition.' },
  'react-composition': { title: 'Berbagi dan Menyusun State', description: 'Selaraskan komponen terkait, nilai bersama, dan perubahan yang kompleks.' },
  'react-performance': { title: 'UI Responsif dan Aksesibel', description: 'Jaga interaksi tetap cepat, fokus, dan nyaman digunakan semua orang.' },
  'react-deeper-patterns': { title: 'State, Identitas, dan Integrasi', description: 'Pahami lebih dalam cara membangun komponen interaktif yang andal.' },
  'react-practice': { title: 'Fitur React yang Andal', description: 'Tangani form, request, pemulihan error, pengujian, dan batas fitur.' },
  'getting-started': { title: 'Memulai dengan TypeScript', description: 'Pahami kegunaan type dan tulis kontrak pertamamu.' },
  'type-system': { title: 'Sistem Type', description: 'Kenali nilai, type inference, kumpulan data, dan type alternatif.' },
  functions: { title: 'Function dan Type', description: 'Hubungkan input, perilaku, dan hasil lewat kontrak yang jelas.' },
  structures: { title: 'Object dan Struktur Data', description: 'Modelkan bentuk data yang bisa digunakan ulang dan hubungan antarbagian.' },
  'advanced-types': { title: 'Type Tingkat Lanjut', description: 'Persempit kemungkinan dan turunkan type dari model yang sudah ada.' },
  generics: { title: 'Generics', description: 'Jaga hubungan antar-type saat membuat kode yang bisa digunakan ulang.' },
  'ts-type-design': { title: 'Merancang Type dan Batas Data', description: 'Buat kontrak yang tepat dan periksa data yang masuk ke program.' },
  'real-world': { title: 'TypeScript di Proyek Nyata', description: 'Gunakan type pada batas data, kode async, dan komponen.' },
  'next-routing': { title: 'Route dan Layout', description: 'Gunakan App Router untuk menyusun navigasi dan UI bertingkat.' },
  'next-rendering': { title: 'Rendering dan Data', description: 'Tentukan batas server dan client, lalu ambil data sesuai kebutuhan.' },
  'next-experience': { title: 'Route yang Andal', description: 'Atur tampilan loading, error, metadata, dan perilaku HTTP.' },
  'next-mutations': { title: 'Form dan Perubahan Data di Server', description: 'Validasi perubahan, muat ulang data yang diperbarui, dan jaga batas server.' },
  'next-optimization': { title: 'Route yang Cepat dan Mudah Ditemukan', description: 'Atur ukuran bundle, batas client, metadata, dan kecepatan yang dirasakan pengguna.' },
  'next-request-contracts': { title: 'Request dan Batas Rendering', description: 'Jelaskan input route, batas data, dan perilaku server.' },
  'next-production': { title: 'Aplikasi Siap Produksi', description: 'Konfigurasikan, pantau, lindungi, dan tinjau pengalaman route secara menyeluruh.' },
}

export function localizeCourse(course: Course, locale: Locale): Course {
  return locale === 'id' && courseCopy[course.id] ? { ...course, ...courseCopy[course.id] } : course
}

export function localizeModule(module: CourseModule, locale: Locale): CourseModule {
  if (locale === 'id' && module.courseId && ['ai-coding', 'tailwind'].includes(module.courseId)) return { ...module, title: translateLessonCopy(module.title, module.courseId), description: translateLessonCopy(module.description, module.courseId) }
  return locale === 'id' && moduleCopy[module.id] ? { ...module, ...moduleCopy[module.id] } : module
}

const lessonTranslations = new WeakMap<Lesson, Lesson>()
export function localizeLesson(lesson: Lesson, locale: Locale): Lesson {
  if (locale !== 'id') return lesson
  const cached = lessonTranslations.get(lesson)
  if (cached) return cached
  const logicLocalized = localizeLogicLesson(lesson, locale)
  if (logicLocalized !== lesson) {
    lessonTranslations.set(lesson, logicLocalized)
    return logicLocalized
  }
  const tr = (value: string) => translateLessonCopy(value, lesson.courseId ?? 'typescript')
  const title = lessonTitleId[lesson.id] ?? tr(lesson.title)
  const localized: Lesson = {
    ...lesson,
    title,
    description: tr(lesson.description),
    explanation: lesson.explanation.map(tr),
    practice: lesson.practice ? tr(lesson.practice) : undefined,
    promptExample: lesson.promptExample ? tr(lesson.promptExample) : undefined,
    recap: lesson.recap.map(tr),
    visual: {
      ...lesson.visual,
      title: lesson.visual.title === lesson.title ? title : tr(lesson.visual.title),
      description: tr(lesson.visual.description),
      nodes: lesson.visual.nodes.map(node => ({ ...node, label: tr(node.label), detail: tr(node.detail) })),
      edges: lesson.visual.edges.map(edge => ({ ...edge, label: edge.label ? tr(edge.label) : undefined })),
    },
    challenge: {
      ...lesson.challenge,
      title: lesson.challenge.title.startsWith('Apply:') ? 'Coba: ' + title
        : lesson.challenge.title.startsWith('Check:') ? 'Cek pemahaman: ' + title
          : tr(lesson.challenge.title),
      topic: moduleCopy[lesson.moduleId]?.title ?? tr(lesson.challenge.topic),
      prompt: tr(lesson.challenge.prompt),
      hint: tr(lesson.challenge.hint),
      explanation: tr(lesson.challenge.explanation),
      optionLabels: lesson.challenge.options?.map(tr),
    },
    comparison: lesson.comparison ? {
      ...lesson.comparison,
      beforeLabel: tr(lesson.comparison.beforeLabel),
      afterLabel: tr(lesson.comparison.afterLabel),
    } : undefined,
    steps: lesson.steps?.map(step => ({ ...step, label: tr(step.label), explanation: tr(step.explanation) })),
  }
  lessonTranslations.set(lesson, localized)
  return localized
}

export function localizeConcept(concept: Concept, lesson: Lesson, locale: Locale): Concept {
  if (locale !== 'id') return concept
  const localized = localizeLesson(lesson, locale)
  const tr = (value: string) => translateLessonCopy(value, concept.courseId ?? lesson.courseId ?? 'typescript')
  return {
    ...concept,
    title: concept.title === lesson.title ? localized.title : tr(concept.title),
    category: tr(concept.category),
    description: concept.description === lesson.description ? localized.description : tr(concept.description),
    promptExample: concept.promptExample ? tr(concept.promptExample) : undefined,
    visual: concept.visual ? {
      ...concept.visual,
      title: concept.visual.title === lesson.visual.title ? localized.visual.title : tr(concept.visual.title),
      description: tr(concept.visual.description),
      nodes: concept.visual.nodes.map(node => ({ ...node, label: tr(node.label), detail: tr(node.detail) })),
      edges: concept.visual.edges.map(edge => ({ ...edge, label: edge.label ? tr(edge.label) : undefined })),
    } : undefined,
  }
}

export function localizeChallenge(challenge: Challenge, lesson: Lesson, locale: Locale): Challenge {
  const localizedLesson = localizeLesson(lesson, locale)
  return localizedLesson === lesson ? challenge : localizedLesson.challenge
}
