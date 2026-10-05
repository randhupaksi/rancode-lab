import type { JourneyStage } from '../journey'
import { tailwindLessons } from './index'

export const tailwindStage: JourneyStage = {
  courseId: 'tailwind',
  outcome: 'Install Tailwind and build a responsive interface with clear layout, theme, and interaction choices.',
  bridge: 'Keep learning JavaScript on the main path, or apply this styling workflow in a React or Next.js project whose foundations you understand.',
  project: {
    title: 'Build your responsive study space',
    mode: 'tailwind',
    brief: 'Create a study page with a useful first action, a responsive practice grid, and native interactive controls. Develop the layout here, then connect Tailwind in your own local project and review its built output. Record what you actually checked.',
    starter: "<style type=\"text/tailwindcss\">\n@theme { --color-brand-700: #047857; --color-brand-50: #ecfdf5; }\n</style>\n<main class=\"min-h-screen bg-slate-50 px-4 py-10 text-slate-950 sm:px-8\">\n  <div class=\"mx-auto max-w-5xl\">\n    <header class=\"max-w-2xl\"><p class=\"text-sm font-semibold text-brand-700\">Your study space</p>\n    <h1 class=\"mt-3 text-3xl font-semibold tracking-tight sm:text-5xl\">Make one useful thing today</h1>\n    <p class=\"mt-4 text-slate-600\">Choose a small practice, try it, and explain the decisions you made.</p>\n    <a href=\"#practice\" class=\"mt-6 inline-flex rounded-lg bg-brand-700 px-4 py-3 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4\">Choose a practice</a></header>\n    <section id=\"practice\" class=\"mt-10 grid gap-4 sm:grid-cols-2\">\n      <article class=\"rounded-2xl border border-slate-200 bg-white p-6\"><h2 class=\"text-xl font-semibold\">Build a card</h2><p class=\"mt-3 text-slate-600\">Keep its title readable, even when the content grows.</p><label class=\"mt-5 flex items-center gap-3\"><input class=\"peer size-4 accent-emerald-700 focus-visible:outline-2\" type=\"checkbox\"><span class=\"peer-checked:line-through\">Ready to review</span></label></article>\n      <article class=\"rounded-2xl border border-slate-200 bg-white p-6\"><h2 class=\"text-xl font-semibold\">Review the layout</h2><details class=\"mt-3\"><summary class=\"cursor-pointer text-brand-700 focus-visible:outline-2\">Open the review notes</summary><p class=\"mt-3 text-slate-600\">Try a narrow screen and move through controls with the keyboard.</p></details></article>\n    </section>\n    <p class=\"mt-6 text-sm text-slate-500\">Demo controls reset when the preview reloads.</p>\n  </div>\n</main>",
    steps: [
      'Define the page purpose and write the headings, links, and practice content before styling.',
      'Choose a small theme and create a readable single-column layout with visible keyboard focus.',
      'Adapt the navigation and practice grid when more space is available. Include one long card title.',
      'Use a native checkbox or disclosure and explain which behavior belongs to HTML rather than Tailwind.',
      'Move the markup into a local Vite, CLI, or framework project. Put the lab theme directives in the input CSS after the Tailwind import. Build its CSS and record layout and interaction observations.',
    ],
    criteria: [
      'My local project uses one coherent Tailwind v4 installation and loads its generated stylesheet.',
      'The main heading and primary action explain what the page offers.',
      'The narrow layout is readable and has no unintended horizontal overflow.',
      'The wider layout uses a deliberate grid, spacing, and type hierarchy.',
      'My links have real destinations and interactive controls retain visible keyboard focus.',
      'A long title and expanded disclosure fit the layout.',
      'I can explain my theme choices, complete utility names, and the limits of the demo controls.',
      'I reviewed my local production build and recorded observed results in my notes.',
    ],
  },
  checkpoint: ['tw-vite-install', 'tw-mobile-first', 'tw-hover-focus', 'tw-theme', 'tw-variant-map', 'tw-production-build'].map(id => {
    const lesson = tailwindLessons.find(item => item.id === id)!
    return { id: id + '-checkpoint', lessonId: id, prompt: lesson.challenge.prompt, options: lesson.challenge.options!, answer: lesson.challenge.answer, explanation: lesson.challenge.explanation }
  }),
}

export const tailwindStageCopyId = {
  outcome: 'Pasang Tailwind dan bangun antarmuka responsif dengan keputusan layout, theme, dan interaksi yang jelas.',
  bridge: 'Lanjut belajar JavaScript di jalur utama, atau pakai alur styling ini di proyek React atau Next.js yang fondasinya sudah kamu pahami.',
  project: {
    title: 'Bangun ruang belajarmu yang responsif',
    brief: 'Buat halaman belajar dengan aksi awal yang berguna, grid latihan responsif, dan kontrol interaktif native. Kembangkan layout di sini, lalu pasang Tailwind di proyek lokalmu dan tinjau hasil build-nya. Catat hal yang benar-benar kamu periksa.',
    steps: [
      'Tentukan tujuan halaman, lalu tulis heading, link, dan isi latihan sebelum mengatur style.',
      'Pilih theme sederhana dan buat layout satu kolom yang nyaman dibaca dengan fokus keyboard yang terlihat.',
      'Sesuaikan navigasi dan grid latihan saat ruangnya bertambah. Sertakan satu judul kartu yang panjang.',
      'Pakai checkbox atau bagian buka-tutup native, lalu jelaskan perilaku mana yang berasal dari HTML, bukan Tailwind.',
      'Pindahkan markup ke proyek Vite, CLI, atau framework lokal. Letakkan direktif theme lab di CSS input setelah impor Tailwind. Build CSS-nya dan catat hasil pengamatan layout serta interaksi.',
    ],
    criteria: [
      'Proyek lokalku memakai satu alur instalasi Tailwind v4 yang konsisten dan memuat stylesheet hasil build.',
      'Heading utama dan aksi utama menjelaskan apa yang ditawarkan halaman.',
      'Layout sempit nyaman dibaca tanpa overflow horizontal yang tidak disengaja.',
      'Layout lebar memakai grid, spacing, dan hierarki teks yang punya tujuan jelas.',
      'Link-ku punya tujuan nyata dan kontrol interaktif tetap memiliki fokus keyboard yang terlihat.',
      'Judul panjang dan bagian buka-tutup yang terbuka tetap muat dalam layout.',
      'Aku bisa menjelaskan pilihan theme, nama utility yang utuh, dan batas kontrol demo.',
      'Aku meninjau build production lokal dan mencatat hasil yang diamati.',
    ],
  },
} satisfies Pick<JourneyStage, 'outcome' | 'bridge'> & { project: Omit<JourneyStage['project'], 'mode' | 'starter'> }
