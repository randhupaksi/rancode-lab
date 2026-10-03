import type { Locale } from '../features/locale/LocaleProvider'
import type { JourneyStage } from './journey'

type StageCopy = Pick<JourneyStage, 'outcome' | 'bridge'> & {
  project: Pick<JourneyStage['project'], 'title' | 'brief' | 'starter' | 'steps' | 'criteria'>
}

const stageCopy: Record<string, StageCopy> = {
  logic: {
    outcome: 'Jelaskan solusi lewat langkah, keputusan, dan pengulangan.',
    bridge: 'Kamu sudah bisa menguraikan solusi. Berikutnya, kenali alat yang mengubahnya menjadi halaman web.',
    project: {
      title: 'Rancang kalkulator keranjang belanja',
      brief: 'Buat rancangan kalkulator sederhana untuk keranjang belanja. Jumlahkan harga barang, berikan ongkir gratis mulai subtotal 50, lalu jelaskan total akhirnya.',
      starter: 'const prices = [15, 20, 10];\n// 1. Jumlahkan harga.\n// 2. Tentukan ongkir: 0 jika subtotal minimal 50, selain itu 5.\n// 3. Cetak total akhirnya.\n',
      steps: ['Catat input dan hasil yang diharapkan.', 'Susun perhitungannya satu langkah demi satu langkah.', 'Coba keranjang kosong dan subtotal tepat 50.'],
      criteria: ['Setiap harga masuk ke subtotal.', 'Subtotal tepat 50 mendapat ongkir gratis.', 'Keranjang kosong ditangani dengan sengaja.', 'Aku bisa menjelaskan langkahnya tanpa membaca kode.'],
    },
  },
  web: {
    outcome: 'Jelajahi file, periksa halaman, dan pahami riwayat versi lokal.',
    bridge: 'Alat dasarmu sudah siap. Gunakan HTML untuk memberi struktur yang bermakna pada halaman pertamamu.',
    project: {
      title: 'Siapkan ruang kerja web pertamamu',
      brief: 'Rancang website tiga file dan berlatih mencari petunjuk melalui developer tools di browser. Catat struktur folder dan jelaskan cara menyimpan versi yang bermakna.',
      starter: 'Folder proyek:\n  index.html\n  styles.css\n  app.js\n\nFungsi tiap file:\n\nSatu pengamatan dari panel Elements:\n\nSatu pengamatan dari panel Network:\n\nCara meninjau perubahan sebelum commit lokal:\n',
      steps: ['Buat folder proyek atau tuliskan strukturnya.', 'Periksa halaman publik lewat panel Elements dan Network.', 'Jelaskan perbedaan commit lokal dan push.'],
      criteria: ['Tiap file punya tanggung jawab yang jelas.', 'Lokasi stylesheet sesuai dengan struktur folder.', 'Ada satu pengamatan nyata dari developer tools.', 'Aku bisa membedakan menyimpan, commit, dan push.'],
    },
  },
  html: {
    outcome: 'Buat halaman semantik yang bisa dinavigasi dengan keyboard.',
    bridge: 'Kontenmu sudah punya struktur. CSS akan menampakkan hierarki dan tata letaknya.',
    project: {
      title: 'Buat halaman profil pribadi',
      brief: 'Perkenalkan dirimu dengan judul utama, bagian tentang diri, daftar minat, dan formulir kontak berlabel. Pastikan halaman tetap mudah dipahami tanpa styling.',
      starter: '<main>\n  <h1>Namamu</h1>\n  <!-- Tambahkan bagian tentang diri, minat, dan formulir kontak. -->\n</main>',
      steps: ['Susun konten dengan heading dan landmark yang sesuai.', 'Buat navigasi yang deskriptif dan input dengan label.', 'Gunakan Tab untuk memeriksa urutan fokus.'],
      criteria: ['Halaman punya satu heading utama dan landmark main.', 'Urutan heading mengikuti struktur konten.', 'Teks tautan menjelaskan tujuannya.', 'Setiap input punya label terlihat yang terhubung dengan for dan id.', 'Semua kontrol interaktif bisa dijangkau dengan keyboard.'],
    },
  },
  css: {
    outcome: 'Buat halaman responsif dengan jarak yang nyaman dan fokus yang terlihat.',
    bridge: 'Halamanmu kini mudah dibaca. JavaScript akan membuatnya merespons perubahan nilai dan keputusan.',
    project: {
      title: 'Tata galeri proyek yang responsif',
      brief: 'Kembangkan ide halaman profilmu dengan galeri satu kolom di layar kecil dan beberapa kolom saat ruangnya cukup.',
      starter: '<style>\n/* Tambahkan jarak, warna yang nyaman dibaca, dan grid responsif. */\n</style>\n<main><h1>Proyekku</h1><div class="projects"><article><h2>Profil</h2><a href="#profile">Lihat profil</a></article><article><h2>Galeri</h2><a href="#gallery">Lihat galeri</a></article></div></main>',
      steps: ['Tata layout yang nyaman untuk layar kecil terlebih dahulu.', 'Tambahkan breakpoint grid saat konten membutuhkannya.', 'Periksa layar lebar dan sempit, lalu uji fokus keyboard.'],
      criteria: ['Layar kecil menampilkan satu kolom yang nyaman dibaca.', 'Layar lebih lebar memakai grid yang terencana.', 'Konten tidak meluber dari area pratinjau.', 'Jarak membedakan heading, konten, dan kontrol.', 'Tautan memiliki penanda fokus yang terlihat.'],
    },
  },
  javascript: {
    outcome: 'Olah data dengan functions dan tangani kegagalan proses asynchronous.',
    bridge: 'Kamu sudah bisa mengolah data. Berikutnya, hubungkan nilainya dengan interaksi yang terlihat di browser.',
    project: {
      title: 'Rancang data daftar tugas belajar',
      brief: 'Representasikan tugas belajar dengan ID, judul, dan status selesai. Buat functions untuk mencari tugas yang tersisa dan mengembalikan daftar baru saat status tugas berubah.',
      starter: 'const tasks = [\n  { id: "read", title: "Baca pelajaran", done: true },\n  { id: "build", title: "Buat proyek", done: false },\n];\n\n// Tulis remainingTasks(tasks) dan toggleTask(tasks, id).\n// Cetak daftar awal dan daftar setelah diperbarui.\n',
      steps: ['Modelkan tugas sebagai object dengan ID yang stabil.', 'Gunakan filter untuk menemukan tugas yang belum selesai.', 'Gunakan map dan object spread untuk mengubah satu tugas tanpa mengubah data awal.'],
      criteria: ['Tugas memiliki ID stabil dan properti yang jelas.', 'Pencarian tugas tersisa berjalan pada daftar kosong.', 'Perubahan status menghasilkan array baru.', 'Nilai tugas lain tetap sama.', 'Data awal tidak ikut berubah.'],
    },
  },
  browser: {
    outcome: 'Bangun antarmuka tugas dengan state dan feedback yang jelas.',
    bridge: 'Kamu sudah membuat alur state-ke-tampilan sendiri. React membantumu menyusunnya menjadi komponen yang dapat digunakan ulang.',
    project: {
      title: 'Buat daftar belajar interaktif',
      brief: 'Hubungkan data tugas dengan formulir dan daftar yang tampil di halaman. Dukung penambahan serta penyelesaian tugas, dan tampilkan pesan berguna saat daftar kosong.',
      starter: '<form id="tasks-form"><label for="task-title">Tugas baru</label><input id="task-title" required><button>Tambah tugas</button></form>\n<p id="status" role="status"></p><ul id="tasks"></ul>\n<script>\nconst tasks = [];\n// Tambahkan submit handler dan render daftar berdasarkan tasks.\n</script>',
      steps: ['Tangani submit form dan validasi judul.', 'Buat elemen DOM dan tampilkan teks pengguna memakai textContent.', 'Gunakan fungsi render yang membentuk tampilan dari data tugas.'],
      criteria: ['Tugas bisa ditambahkan lewat keyboard maupun tombol.', 'Judul kosong atau hanya berisi spasi mendapat feedback yang berguna.', 'Teks dari pengguna ditampilkan sebagai teks, bukan HTML.', 'Menyelesaikan tugas memperbarui data dan tampilan.', 'Kondisi kosong memberi tahu langkah berikutnya.'],
    },
  },
  react: {
    outcome: 'Susun antarmuka dengan state menjadi komponen yang memiliki input jelas.',
    bridge: 'Model React-mu sudah terbentuk. TypeScript bisa menjelaskan kontrak komponen dan data yang sudah kamu pahami.',
    project: {
      title: 'Bangun ulang daftar belajar dengan React',
      brief: 'Gunakan proyek browser sebagai acuan perilaku. Bangun versi React dengan components, props, dan state di proyek lokal. Simpan rancangan komponen dan catatan review di sini.',
      starter: 'import { useState } from "react";\n\nexport default function StudyList() {\n  const [tasks, setTasks] = useState([]);\n  // Tambahkan form terkontrol dan tampilkan tugas dengan key yang stabil.\n  return <main><h1>Daftar belajarku</h1></main>;\n}',
      steps: ['Buat proyek React lokal dengan build tool yang didukung.', 'Pisahkan form dan item tugas saat keduanya punya tanggung jawab berbeda.', 'Uji keyboard, validasi, dan kondisi kosong seperti pada versi browser.'],
      criteria: ['Setiap komponen punya tanggung jawab yang terarah.', 'Props diperlakukan sebagai data yang tidak diubah.', 'Pembaruan state menghasilkan nilai baru.', 'Daftar berulang memakai key dari ID stabil.', 'Perilaku keyboard, validasi, dan kondisi kosong sudah diuji di aplikasi yang berjalan.'],
    },
  },
  typescript: {
    outcome: 'Jelaskan kontrak data dan persempit nilai yang belum pasti dengan sengaja.',
    bridge: 'Kamu sudah bisa memodelkan UI dan kontraknya. Next.js menambahkan routes serta batas server/client yang jelas.',
    project: {
      title: 'Tambahkan types ke model tugas',
      brief: 'Buat kontrak untuk model tugas dan representasikan status loading, sukses, serta error sebagai discriminated union. Persempit union sebelum membaca data khusus setiap status.',
      starter: 'type Task = { id: string; title: string; done: boolean };\n\n// Definisikan union LoadState dan function yang menjelaskan tiap status.\n// Coba contoh valid dan tidak valid dengan type checker.\n',
      steps: ['Definisikan Task tanpa memakai any.', 'Buat varian status yang hanya memuat properti relevan.', 'Persempit status sebelum membaca datanya.'],
      criteria: ['Field Task punya type yang direncanakan.', 'Status loading, sukses, dan error tidak tertukar.', 'Data hanya dibaca setelah status dipastikan sukses.', 'Type checker menolak object yang tidak valid.', 'Aku paham bahwa types tidak memvalidasi data jaringan saat runtime.'],
    },
  },
  nextjs: {
    outcome: 'Satukan routes, batas rendering, dan status data dalam satu aplikasi.',
    bridge: 'Akhiri dengan review proyek: jelaskan keputusanmu, tunjukkan pemulihan saat gagal, dan catat perbaikan berikutnya.',
    project: {
      title: 'Rangkai pengalaman daftar belajar',
      brief: 'Satukan aplikasi daftar belajar dengan routes Next.js, pilihan server/client, loading, kondisi kosong, error, metadata, dan interaksi keyboard. Gunakan catatan proyek sebagai panduan membangun serta mereview aplikasi lokal.',
      starter: '// app/page.tsx\nexport default function Page() {\n  return <main><h1>Dashboard belajar</h1></main>;\n}\n\n// Rencanakan route detail dan Client Component interaktif.\n// Kerjakan proyek di workspace Next.js lokal.\n',
      steps: ['Petakan route dan komponen server/client sebelum coding.', 'Rancang loading, kosong, sukses, dan error untuk setiap alur data.', 'Jalankan aplikasi lokal dan periksa navigasi langsung, keyboard, serta metadata.'],
      criteria: ['Dashboard dan route detail bisa dibuka langsung.', 'Komponen interaktif memiliki batas client yang terencana.', 'Tampilan loading, kosong, error, dan sukses mudah dipahami.', 'Input yang belum tepercaya divalidasi pada batas yang sesuai.', 'Aplikasi sudah diperiksa dengan keyboard dan layar sempit.', 'Review menjelaskan pertimbangan serta perbaikan berikutnya.'],
    },
  },
}

const checkpointCopy: Record<string, { prompt: string; options: Record<string, string>; explanation: string }> = {
  'logic-order': { prompt: 'Kamu ingin menghitung total belanja. Apa yang perlu dilakukan lebih dulu?', options: { 'Read prices and quantity': 'Baca harga dan jumlah barang', 'Display an uncalculated total': 'Tampilkan total sebelum dihitung', 'Choose a button color': 'Pilih warna tombol' }, explanation: 'Perhitungan membutuhkan input sebelum menghasilkan output.' },
  'logic-boundary': { prompt: 'Ongkir gratis mulai dari 50. Perbandingan mana yang juga menerima nilai tepat 50?', options: { 'total >= 50': 'total >= 50', 'total > 50': 'total > 50', 'total < 50': 'total < 50' }, explanation: 'Bagian sama dengan membuat batas 50 ikut diterima.' },
  'logic-stop': { prompt: 'Sebuah loop terus menambah counter sebesar 1. Apa lagi yang dibutuhkan?', options: { 'A reachable stopping condition': 'Kondisi berhenti yang bisa tercapai', 'An image': 'Sebuah gambar', 'A global stylesheet': 'Stylesheet global' }, explanation: 'Kondisi berhenti mencegah pengulangan berjalan tanpa akhir.' },
  'web-structure': { prompt: 'Apa yang membentuk struktur konten halaman web?', options: { HTML: 'HTML', CSS: 'CSS', Git: 'Git' }, explanation: 'HTML menyatakan struktur dan makna dokumen.' },
  'web-path': { prompt: 'styles.css berada di sebelah index.html. Path relatif mana yang tepat?', options: { './styles.css': './styles.css', './images/styles.css': './images/styles.css', '/a/random/folder': '/a/random/folder' }, explanation: './ mengarah dari folder dokumen saat ini.' },
  'web-history': { prompt: 'Sebuah commit Git baru dibuat secara lokal. Ke mana commit itu otomatis dipublikasikan?', options: { 'Nowhere; pushing is separate': 'Belum ke mana-mana; push adalah langkah terpisah', 'Every GitHub repository': 'Ke semua repository GitHub', 'The production website': 'Ke website produksi' }, explanation: 'Riwayat lokal tidak otomatis dipublikasikan.' },
  'html-label': { prompt: 'Apa yang menghubungkan label yang terlihat dengan input-nya?', options: { 'Matching for and id': 'Atribut for dan id yang nilainya cocok', 'Matching colors': 'Warna yang sama', 'A placeholder only': 'Placeholder saja' }, explanation: 'Atribut for pada label merujuk ke id milik input.' },
  'html-action': { prompt: 'Elemen mana yang sebaiknya dipakai untuk menyimpan draft pada halaman ini?', options: { button: 'button', 'div without keyboard support': 'div tanpa dukungan keyboard', h2: 'h2' }, explanation: 'Button native memiliki semantik tindakan dan bisa diaktifkan dengan keyboard.' },
  'html-list': { prompt: 'Struktur mana yang tepat untuk menyatakan urutan langkah?', options: { 'ol with li children': 'ol dengan elemen li di dalamnya', 'Several br tags': 'Beberapa tag br', 'A heading for every word': 'Heading untuk setiap kata' }, explanation: 'Daftar berurutan menyampaikan urutan yang bermakna.' },
  'css-space': { prompt: 'Apa yang membuat jarak antara konten dan border sebuah elemen?', options: { padding: 'padding', margin: 'margin', href: 'href' }, explanation: 'Padding memisahkan konten dari border.' },
  'css-parent': { prompt: 'Di elemen mana display: grid sebaiknya diterapkan?', options: { 'The parent of the items': 'Elemen induk dari item-itemnya', 'Only the last item': 'Hanya item terakhir', 'Every text node': 'Setiap node teks' }, explanation: 'Container mengatur layout untuk elemen anaknya.' },
  'css-small': { prompt: 'Apa titik awal yang baik untuk galeri responsif?', options: { 'A readable small-screen layout': 'Layout layar kecil yang mudah dibaca', 'A fixed 1600px width': 'Lebar tetap 1600px', 'Hiding all text on phones': 'Menyembunyikan semua teks di ponsel' }, explanation: 'Mulai dari konten yang nyaman di ruang sempit, lalu kembangkan secara terencana.' },
  'js-map': { prompt: 'Operasi mana yang menghasilkan satu nilai transformasi untuk setiap item array?', options: { map: 'map', filter: 'filter', 'console.log': 'console.log' }, explanation: 'map mengubah setiap item; filter memilih sebagian item.' },
  'js-copy': { prompt: 'Bagaimana membuat object baru dengan properti done yang diperbarui?', options: { '{ ...task, done: true }': '{ ...task, done: true }', 'task = null': 'task = null', 'Delete every property': 'Hapus semua properti' }, explanation: 'Spread membuat salinan dangkal; properti setelahnya mengganti done pada salinan itu.' },
  'js-reject': { prompt: 'Sebuah Promise yang di-await ditolak di dalam try. Di mana pemulihannya bisa dilakukan?', options: { catch: 'catch', 'A CSS selector': 'Selector CSS', 'An export statement': 'Pernyataan export' }, explanation: 'await melempar error dari Promise sehingga catch dapat menanganinya.' },
  'browser-null': { prompt: 'querySelector tidak menemukan elemen yang cocok. Apa nilai yang dikembalikan?', options: { null: 'null', 'An automatically created element': 'Elemen yang dibuat otomatis', true: 'true' }, explanation: 'Periksa nilai null sebelum menggunakan elemen hasil seleksi.' },
  'browser-text': { prompt: 'Properti mana yang menampilkan judul dari pengguna sebagai teks biasa?', options: { textContent: 'textContent', innerHTML: 'innerHTML', outerHTML: 'outerHTML' }, explanation: 'textContent tidak membaca nilai tersebut sebagai markup.' },
  'browser-empty': { prompt: 'Sebuah request berhasil tetapi mengembalikan array kosong. Apa yang sebaiknya ditampilkan UI?', options: { 'A useful empty state': 'Pesan kondisi kosong yang membantu', 'A network failure': 'Pesan kegagalan jaringan', 'A permanent spinner': 'Spinner yang terus berjalan' }, explanation: 'Hasil kosong yang berhasil berbeda dari error.' },
  'react-input': { prompt: 'Dari mana props pada sebuah child component berasal?', options: { 'Its parent': 'Komponen induknya', 'A global CSS file': 'File CSS global', 'Only its own state': 'Hanya state-nya sendiri' }, explanation: 'Komponen induk mengirim nilai ke komponen anak melalui props.' },
  'react-key': { prompt: 'Key mana yang cocok untuk daftar yang urutannya bisa berubah?', options: { 'A stable ID from the data': 'ID stabil dari data', 'Math.random() each render': 'Math.random() pada setiap render', 'Always the array index': 'Selalu index array' }, explanation: 'Identitas stabil membantu React mengenali item yang sama setelah render.' },
  'react-effect': { prompt: 'Untuk apa effect terutama digunakan?', options: { 'Synchronizing with an external system': 'Menyelaraskan React dengan sistem eksternal', 'Every derived value': 'Menghitung setiap nilai turunan', 'Mutating props': 'Mengubah props' }, explanation: 'Effect menghubungkan React dengan sistem di luar proses render.' },
  'ts-runtime': { prompt: 'Apakah anotasi TypeScript memvalidasi respons API saat runtime?', options: { 'No; runtime validation is separate': 'Tidak; validasi runtime dilakukan terpisah', 'Yes, automatically': 'Ya, secara otomatis', 'Only if the type name is long': 'Hanya jika nama type panjang' }, explanation: 'Anotasi type dihapus saat runtime; data dari luar tetap perlu diperiksa.' },
  'ts-narrow': { prompt: 'Bagaimana membaca properti yang hanya ada pada satu anggota union?', options: { 'Narrow to that member first': 'Pastikan dulu bahwa nilainya termasuk anggota tersebut', 'Use any everywhere': 'Gunakan any di semua tempat', 'Ignore the possible variants': 'Abaikan kemungkinan varian lain' }, explanation: 'Guard memastikan varian mana yang sedang digunakan.' },
  'ts-generic': { prompt: 'Apa kegunaan generic?', options: { 'Preserving relationships between types': 'Menjaga hubungan antar-type', 'Fetching data automatically': 'Mengambil data secara otomatis', 'Replacing all runtime logic': 'Menggantikan semua logika runtime' }, explanation: 'Parameter type dapat menghubungkan type input dengan type output.' },
  'next-page': { prompt: 'File mana yang menyediakan UI untuk sebuah route App Router?', options: { 'page.tsx': 'page.tsx', 'route.ts': 'route.ts', 'README.md': 'README.md' }, explanation: 'page.tsx menjadi entry point UI route; route.ts menangani request.' },
  'next-client': { prompt: 'Di mana interaksi tombol yang memakai state sebaiknya dijalankan?', options: { 'A Client Component': 'Client Component', 'A CSS file': 'File CSS', 'A metadata object': 'Object metadata' }, explanation: 'State interaktif dan event browser memerlukan batas client.' },
  'next-recovery': { prompt: 'Apa yang sebaiknya ditawarkan saat tampilan data gagal dimuat?', options: { 'A useful explanation and recovery action': 'Penjelasan yang berguna dan tindakan untuk mencoba lagi', 'A permanent spinner': 'Spinner yang terus berjalan', 'A blank screen': 'Layar kosong' }, explanation: 'Pengguna perlu memahami kegagalan dan tahu cara melanjutkan.' },
}

export function localizeJourneyStage(stage: JourneyStage, locale: Locale): JourneyStage {
  if (locale !== 'id') return stage
  const copy = stageCopy[stage.courseId]
  return {
    ...stage,
    ...(copy ? { outcome: copy.outcome, bridge: copy.bridge, project: { ...stage.project, ...copy.project } } : {}),
    checkpoint: stage.checkpoint.map(question => {
      const questionCopy = checkpointCopy[question.id]
      if (!questionCopy) return question
      const translate = (option: string) => questionCopy.options[option] ?? option
      return { ...question, prompt: questionCopy.prompt, options: question.options.map(translate), answer: translate(question.answer), explanation: questionCopy.explanation }
    }),
  }
}
