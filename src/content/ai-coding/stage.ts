import type { JourneyStage } from '../journey'
import { aiCodingLessons } from './index'

export const aiCodingStage: JourneyStage = {
  courseId: 'ai-coding',
  outcome: 'Write a clear brief, guide an agent through a small build, and review the working result.',
  bridge: 'Use this workflow in a frontend project you understand. Revisit the relevant framework foundations before expanding the app.',
  project: {
    title: 'Build and review Study Sprint',
    mode: 'document',
    brief: 'Build a small study planner with an AI coding agent in your own local workspace. Add tasks, mark them complete, and filter remaining tasks. Use this space to record your brief, prompts, design decisions, and checks of the running app.',
    starter: 'STUDY SPRINT / BUILD JOURNAL\n\nUser and moment:\nMain outcome:\nFirst-version scope:\nVisual direction and why it fits:\nChosen stack and why:\n\nSLICE 1 / Add and render tasks\nPrompt used:\nFiles changed and decisions:\nExpected and observed checks:\n\nSLICE 2 / Complete and filter\nPrompt used:\nFiles changed and decisions:\nExpected and observed checks:\n\nSLICE 3 / Feedback and narrow layouts\nPrompt used:\nFiles changed and decisions:\nExpected and observed checks:\n\nProject location (optional public URL; no private paths or secrets):\nKnown limits:\nNext useful improvement:\n',
    steps: [
      'Write a brief for a student choosing one task during a short study break, plus first-version acceptance criteria.',
      'Choose a focused visual direction and a stack whose foundations you can explain.',
      'Build locally in three slices: add/render, complete/filter, and feedback/responsive review. Record the prompts you actually used.',
      'Review the diff and try the task flow, whitespace input, empty list, long title, keyboard interaction, and narrow layout.',
      'Record expected and observed results, known limits, and one next improvement. Download the journal if you want to keep a copy.',
    ],
    criteria: [
      'My brief names the user, moment, main outcome, and first-version scope.',
      'My visual direction explains hierarchy and the purpose of its treatments without invented claims.',
      'I recorded the actual prompts and decisions for three small implementation slices.',
      'I tried adding, completing, filtering, and clearing the filter in the running app.',
      'I checked empty and whitespace-only input, an empty list, and a long task title.',
      'I checked keyboard interaction, visible focus, and a narrow layout.',
      'I reviewed changed files and documented observed results and known limits.',
    ],
  },
  checkpoint: ['ai-agent-role', 'ai-context-budget', 'ai-avoid-slop', 'ai-debugging', 'ai-behavior-checks', 'ai-capstone'].map(id => {
    const lesson = aiCodingLessons.find(item => item.id === id)!
    return { id: id + '-checkpoint', lessonId: id, prompt: lesson.challenge.prompt, options: lesson.challenge.options!, answer: lesson.challenge.answer, explanation: lesson.challenge.explanation }
  }),
}

export const aiCodingStageCopyId = {
  outcome: 'Tulis brief yang jelas, arahkan agent saat membangun aplikasi kecil, dan tinjau hasil yang benar-benar bekerja.',
  bridge: 'Pakai alur ini di proyek frontend yang kamu pahami. Pelajari fondasi framework yang relevan sebelum memperluas aplikasinya.',
  project: {
    title: 'Bangun dan tinjau Study Sprint',
    brief: 'Bangun study planner kecil dengan AI coding agent di ruang kerja lokalmu. Tambah tugas, tandai selesai, dan filter tugas tersisa. Pakai ruang ini untuk mencatat brief, prompt, keputusan desain, dan pemeriksaan aplikasi yang berjalan.',
    starter: 'STUDY SPRINT / CATATAN PEMBANGUNAN\n\nPengguna dan momen:\nTujuan utama:\nRuang lingkup versi pertama:\nArah visual dan alasan kecocokannya:\nStack yang dipilih dan alasannya:\n\nBAGIAN 1 / Tambah dan tampilkan tugas\nPrompt yang dipakai:\nFile yang diubah dan keputusan:\nHasil pemeriksaan yang diharapkan dan diamati:\n\nBAGIAN 2 / Selesai dan filter\nPrompt yang dipakai:\nFile yang diubah dan keputusan:\nHasil pemeriksaan yang diharapkan dan diamati:\n\nBAGIAN 3 / Feedback dan layout sempit\nPrompt yang dipakai:\nFile yang diubah dan keputusan:\nHasil pemeriksaan yang diharapkan dan diamati:\n\nLokasi proyek (URL publik opsional; tanpa path privat atau rahasia):\nBatas yang diketahui:\nPerbaikan berguna berikutnya:\n',
    steps: [
      'Tulis brief untuk pelajar yang memilih satu tugas saat jeda singkat, beserta kriteria hasil versi pertama.',
      'Pilih arah visual yang fokus dan stack yang fondasinya bisa kamu jelaskan.',
      'Bangun secara lokal dalam tiga bagian: tambah/tampilkan, selesai/filter, dan tinjauan feedback/responsif. Catat prompt yang benar-benar dipakai.',
      'Tinjau diff lalu coba alur tugas, input spasi, daftar kosong, judul panjang, interaksi keyboard, dan layout sempit.',
      'Catat hasil yang diharapkan dan diamati, batas yang diketahui, serta satu perbaikan berikutnya. Unduh jurnal jika ingin menyimpan salinan.',
    ],
    criteria: [
      'Brief-ku menyebutkan pengguna, momen, tujuan utama, dan ruang lingkup versi pertama.',
      'Arah visualku menjelaskan hierarki dan tujuan tampilannya tanpa klaim karangan.',
      'Aku mencatat prompt nyata dan keputusan untuk tiga bagian implementasi kecil.',
      'Aku mencoba tambah, selesai, filter, dan penghapusan filter di aplikasi yang berjalan.',
      'Aku memeriksa input kosong dan spasi saja, daftar kosong, serta judul tugas panjang.',
      'Aku memeriksa interaksi keyboard, fokus terlihat, dan layout sempit.',
      'Aku meninjau file yang berubah dan mencatat hasil nyata serta batas yang diketahui.',
    ],
  },
} satisfies Pick<JourneyStage, 'outcome' | 'bridge'> & { project: Omit<JourneyStage['project'], 'mode'> }
