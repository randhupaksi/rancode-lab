import type { JourneyStage } from '../journey'
import { aiCodingLessons } from './index'
import { studySprintProjectStarter, studySprintProjectStarterId } from '../project-starters'

export const aiCodingStage: JourneyStage = {
  courseId: 'ai-coding',
  outcome: 'Write a clear brief, guide an agent through a small build, and review the working result.',
  bridge: 'Use this workflow in a frontend project you understand. Revisit the relevant framework foundations before expanding the app.',
  project: {
    title: 'Build and review Study Sprint',
    mode: 'vibe',
    brief: 'Shape a focused brief for Study Sprint, take it to an AI coding agent you choose, then build and review the working app in Rancode. The prompt is not sent automatically.',
    starter: studySprintProjectStarter,
    steps: [
      'Describe the user, moment, outcome, first-version scope, visual direction, and checks in the prompt brief.',
      'Review the generated prompt, edit it so it sounds like your actual project, and copy it to the AI coding agent you choose.',
      'Build or adjust Study Sprint in the live app workspace. Add tasks, complete them, and inspect how the page responds.',
      'Try blank and whitespace-only input, an empty list, a long task title, keyboard use, and the narrow preview.',
      'Record what you actually checked, what changed, and one improvement you would make next. Download a copy to keep your work.',
    ],
    criteria: [
      'My prompt names the user, moment, outcome, and first-version scope.',
      'The visual direction has a reason and matches the intended use.',
      'I copied the prompt myself; Rancode did not send it to an AI agent.',
      'Adding, completing, and reviewing tasks work in the live preview.',
      'I checked blank input, an empty list, and a long task title.',
      'I checked keyboard focus and the narrow preview.',
      'My notes describe what I actually reviewed and one next improvement.',
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
    brief: 'Susun brief yang terarah untuk Study Sprint, bawa ke AI coding agent pilihanmu, lalu bangun dan tinjau aplikasi yang berfungsi di Rancode. Prompt tidak dikirim otomatis.',
    starter: studySprintProjectStarterId,
    steps: [
      'Jelaskan pengguna, momen, tujuan, cakupan awal, arah visual, dan pemeriksaan di brief prompt.',
      'Tinjau prompt yang dihasilkan, sesuaikan agar cocok dengan proyekmu, lalu salin ke AI coding agent pilihanmu.',
      'Bangun atau sesuaikan Study Sprint di workspace aplikasi langsung. Tambah tugas, selesaikan, dan amati perubahan halaman.',
      'Coba input kosong dan spasi saja, daftar kosong, judul tugas panjang, keyboard, serta preview sempit.',
      'Catat apa yang benar-benar kamu periksa, perubahan yang dibuat, dan satu perbaikan berikutnya. Unduh salinan jika ingin menyimpan hasilnya.',
    ],
    criteria: [
      'Prompt-ku menyebutkan pengguna, momen, tujuan, dan cakupan awal.',
      'Arah visual punya alasan dan sesuai dengan cara aplikasi dipakai.',
      'Aku menyalin prompt sendiri; Rancode tidak mengirimkannya ke AI agent.',
      'Tambah, selesaikan, dan tinjau tugas berfungsi di preview langsung.',
      'Aku memeriksa input kosong, daftar kosong, dan judul tugas panjang.',
      'Aku memeriksa fokus keyboard dan preview sempit.',
      'Catatanku menjelaskan hal yang benar-benar ditinjau dan satu perbaikan berikutnya.',
    ],
  },
} satisfies Pick<JourneyStage, 'outcome' | 'bridge'> & { project: Omit<JourneyStage['project'], 'mode'> }
