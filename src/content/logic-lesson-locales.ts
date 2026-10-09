import type { Locale } from '../features/locale/LocaleProvider'
import type { Challenge, Lesson } from './types'

type LessonCopy = Pick<Lesson, 'title' | 'description' | 'explanation' | 'practice' | 'recap'> & {
  flow: [string, string, string]
  visual?: Lesson['visual']
  challenge: Pick<Challenge, 'title' | 'prompt' | 'explanation' | 'hint'> & {
    options: Record<string, string>
  }
}

const indonesianLogicLessons: Record<string, LessonCopy> = {
  'logic-instructions': {
    title: 'Instruksi dan Algoritma',
    description: 'Algoritma adalah urutan langkah yang jelas untuk menerima input dan menghasilkan output.',
    explanation: [
      'Algoritma adalah urutan langkah yang jelas untuk menerima input dan menghasilkan output.',
      'Bayangkan kamu menghitung total keranjang belanja. Baca harga dan jumlah barang, kalikan, lalu tampilkan totalnya. Urutan itu penting: menampilkan total sebelum menghitungnya tidak menyelesaikan masalah. JavaScript di bawah ini hanya cara menuliskan instruksi; pahami langkahnya lebih dulu. Baca const price = 12 sebagai “beri nama price pada nilai 12.” Simbol = menetapkan nilai, * mengalikan, dan console.log menampilkan hasil. Titik koma mengakhiri instruksi. Baca dari atas ke bawah, prediksi, lalu jalankan; kamu belum perlu pengalaman JavaScript.',
    ],
    practice: 'Prediksi totalnya. Jalankan kode, lalu ubah quantity menjadi 5 dan prediksi lagi.',
    flow: ['Harga + jumlah barang', 'Kalikan', 'Total belanja'],
    visual: {
      title: 'Ubah dua input menjadi total',
      description: 'Ubah nilainya, lalu ikuti bagaimana setiap input sampai ke hasil akhir.',
      nodes: [
        { id: 'price', label: 'Harga', detail: 'Ini biaya untuk satu barang.', tone: 'value' },
        { id: 'quantity', label: 'Jumlah barang', detail: 'Ini jumlah barang yang akan dibeli.', tone: 'value' },
        { id: 'multiply', label: 'Kalikan', symbol: '×', detail: 'Langkah perkalian menggabungkan harga dan jumlah barang.' },
        { id: 'total', label: 'Total belanja', detail: 'Ini hasil setelah kedua input dikalikan.', tone: 'value' },
      ],
      edges: [
        { from: 'price', to: 'multiply', label: 'harga', detail: 'Harga masuk ke langkah perkalian.' },
        { from: 'quantity', to: 'multiply', label: 'jumlah', detail: 'Jumlah barang menjadi input kedua untuk perkalian.' },
        { from: 'multiply', to: 'total', label: 'hasil', detail: 'Perkalian menghasilkan total belanja.' },
      ],
      simulation: { kind: 'multiply', inputs: [{ nodeId: 'price', initial: 12, min: 1, max: 50, step: 1 }, { nodeId: 'quantity', initial: 3, min: 1, max: 12, step: 1 }], outputNodeId: 'total' },
    },
    challenge: {
      title: 'Cek pemahaman: Instruksi dan Algoritma',
      prompt: 'Berapa output saat price bernilai 12 dan quantity bernilai 3?',
      options: { '36': '36', '15': '15', '123': '123' },
      explanation: 'Perkalian menggabungkan harga satu barang dengan jumlah barang: 12 × 3 = 36.',
      hint: 'Simbol * berarti perkalian.',
    },
    recap: ['Algoritma menjelaskan langkah yang teratur.', 'Prediksi hasil sebelum menjalankan contoh.'],
  },
  'logic-decisions': {
    title: 'Keputusan dan Kondisi',
    description: 'Kondisi membuat program memilih tindakan berdasarkan nilai yang benar.',
    explanation: [
      'Kondisi membuat program memilih tindakan berdasarkan nilai yang benar.',
      'Toko bisa memberi ongkir gratis saat total belanja mencapai 50. Perbandingan total >= 50 menghasilkan true atau false. Hanya cabang yang sesuai yang dijalankan. Coba nilai di bawah, tepat pada, dan di atas batas untuk memahami aturannya.',
    ],
    practice: 'Coba total 49, 50, dan 51. Jelaskan mengapa nilai 50 mendapat ongkir gratis.',
    flow: ['Total belanja', 'Minimal 50?', 'Pilih biaya kirim'],
    challenge: {
      title: 'Cek pemahaman: Keputusan dan Kondisi',
      prompt: 'Total berapa yang mendapat ongkir gratis?',
      options: { '50': '50', '49': '49', '0': '0' },
      explanation: 'Perbandingan >= menyertakan batasnya: total yang sama dengan 50 juga memenuhi aturan.',
      hint: 'Baca >= sebagai lebih besar dari atau sama dengan.',
    },
    recap: ['Kondisi menghasilkan keputusan bernilai boolean.', 'Periksa juga nilai yang tepat berada di batas.'],
  },
  'logic-repetition': {
    title: 'Mengulang Langkah Kecil',
    description: 'Loop mengulang instruksi selama aturannya menyatakan masih ada pekerjaan.',
    explanation: [
      'Loop mengulang instruksi selama aturannya menyatakan masih ada pekerjaan.',
      'Loop dimulai dari item = 1, memeriksa item <= 3, mencetak satu label, lalu menambah item. Saat nilainya menjadi 4, kondisinya false sehingga loop berhenti. Loop yang baik selalu punya cara untuk selesai.',
    ],
    practice: 'Ubah batas terakhir menjadi 5. Hitung jumlah baris output dan bandingkan dengan prediksimu.',
    flow: ['Mulai dari 1', 'Cetak lalu tambah 1', 'Berhenti setelah 3'],
    challenge: {
      title: 'Cek pemahaman: Pengulangan',
      prompt: 'Berapa label yang dicetak loop awal?',
      options: { '3': '3', '4': '4', Forever: 'Selamanya' },
      explanation: 'Loop mencetak untuk 1, 2, dan 3. Kondisinya menolak nilai 4.',
      hint: 'Tuliskan setiap nilai item yang memenuhi kondisi.',
    },
    recap: ['Loop membuat pekerjaan berulang menjadi jelas.', 'Kondisi berhenti mencegah pengulangan tanpa akhir.'],
  },
  'logic-decomposition': {
    title: 'Pecah Masalah Menjadi Bagian Kecil',
    description: 'Tugas besar lebih mudah dipahami saat tiap bagian punya satu tanggung jawab yang jelas.',
    explanation: [
      'Tugas besar lebih mudah dipahami saat tiap bagian punya satu tanggung jawab yang jelas.',
      'Proses checkout dapat menghitung subtotal secara terpisah dari ongkir. Di sini basketTotal menerima daftar harga dan mengembalikan angka. Kata kunci function memberi nama pada kelompok langkah ini; prices adalah input, sedangkan return mengirim hasil kembali ke pemanggilnya. Kurung siku berisi daftar nilai berurutan: [10, 15, 5] punya tiga harga, sedangkan [] kosong. Loop for...of membaca satu harga setiap kali; total += price berarti total = total + price. Dengan memisahkan perhitungan, kamu bisa mencoba berbagai keranjang tanpa mengubah langkah checkout lainnya.',
    ],
    practice: 'Prediksi kedua output. Coba keranjang berisi satu barang, lalu jelaskan mengapa keranjang kosong menghasilkan 0.',
    flow: ['Daftar harga', 'Jumlahkan satu per satu', 'Kembalikan total'],
    challenge: {
      title: 'Cek pemahaman: Pecah Masalah Menjadi Bagian Kecil',
      prompt: 'Apa tanggung jawab basketTotal?',
      options: { 'Adding the supplied prices': 'Menjumlahkan harga yang diberikan', 'Charging a bank card': 'Menagih kartu bank', 'Designing a checkout page': 'Merancang halaman checkout' },
      explanation: 'Input-nya adalah daftar harga dan output-nya jumlah semua harga. Tugas lain sebaiknya dikerjakan bagian berbeda.',
      hint: 'Lihat nilai yang masuk ke function dan nilai yang dikembalikan.',
    },
    recap: ['Berikan tiap bagian satu tugas yang mudah dipahami.', 'Coba input normal, kosong, dan yang berada di batas.'],
  },
  'logic-input-output': {
    title: 'Tentukan Input dan Output',
    description: 'Solusi yang berguna dimulai dari kesepakatan yang jelas: data apa yang masuk dan apa yang perlu dihasilkan.',
    explanation: [
      'Solusi yang berguna dimulai dari kesepakatan yang jelas: data apa yang masuk dan apa yang perlu dihasilkan.',
      'Pada kalkulator diskon, harga awal dan besaran diskon adalah input. Harga setelah diskon adalah output. Tentukan apakah nilai diskon memakai rentang 0–1 atau 0–100 sebelum menulis rumus; dua cara membaca angka memberi hasil berbeda.',
    ],
    practice: 'Catat satuan kedua input. Coba nilai rate 0 dan 1.',
    flow: ['Kontrak input', 'Terapkan pecahan', 'Harga akhir'],
    challenge: {
      title: 'Terapkan: Tentukan Input dan Output',
      prompt: 'Apa arti rate = 0.25 dalam contoh ini?',
      options: { 'A 25% discount': 'Diskon 25%', 'A 0.25 currency-unit discount': 'Diskon sebesar 0,25 satuan mata uang', 'A 250% discount': 'Diskon 250%' },
      explanation: 'Rate adalah pecahan dari harga, jadi 0.25 berarti seperempat atau 25%.',
      hint: 'Perhatikan apakah rate menyatakan pecahan atau nominal uang.',
    },
    recap: ['Tentukan makna dan satuan setiap input.', 'Hubungkan input dengan output lewat aturan yang jelas.'],
  },
  'logic-pseudocode': {
    title: 'Tulis Pseudocode Terlebih Dahulu',
    description: 'Pseudocode menjelaskan solusi tanpa terikat pada bahasa pemrograman tertentu.',
    explanation: [
      'Pseudocode menjelaskan solusi tanpa terikat pada bahasa pemrograman tertentu.',
      'Buat setiap langkah cukup jelas agar bisa diikuti orang lain. Sertakan cabang alternatif dan tuliskan kapan proses berhenti. Setelah logikanya jelas, ubah instruksi itu menjadi JavaScript satu per satu.',
    ],
    practice: 'Telusuri jumlah -1, 0, 2, dan 6 saat stok bernilai 5.',
    flow: ['Nyatakan aturannya', 'Telusuri kedua cabang', 'Terjemahkan nanti'],
    challenge: {
      title: 'Terapkan: Tulis Pseudocode Terlebih Dahulu',
      prompt: 'Aturan mana yang mencegah pesanan dengan jumlah negatif?',
      options: { 'Checking that quantity is positive': 'Memastikan quantity bernilai positif', 'Changing the output font': 'Mengubah font output', 'Sorting the stock value': 'Mengurutkan nilai stok' },
      explanation: 'Batas stok saja belum menolak jumlah nol atau negatif.',
      hint: 'Periksa syarat yang harus benar sebelum pesanan diterima.',
    },
    recap: ['Pseudocode membantu memeriksa logika sebelum menulis syntax.', 'Jelaskan cabang alternatif dan kondisi berhentinya.'],
  },
  'logic-truth-tables': {
    title: 'Periksa Aturan Gabungan',
    description: 'Tabel kebenaran memperlihatkan semua kombinasi pada aturan boolean yang sederhana.',
    explanation: [
      'Tabel kebenaran memperlihatkan semua kombinasi pada aturan boolean yang sederhana.',
      'Untuk akses yang membutuhkan tiket dan tempat yang sedang buka, tuliskan keempat kombinasinya. Setiap loop membaca daftar [false, true], jadi loop di dalam mencoba kedua nilai open untuk setiap nilai ticket. Operator && mengharuskan kedua nilai true. Menggantinya dengan || berarti salah satu nilai boleh true. Periksa keempat baris untuk melihat perubahan aturannya.',
    ],
    practice: 'Ganti && menjadi || lalu cari baris mana saja yang berubah.',
    flow: ['Input boolean', 'Periksa setiap pasangan', 'Bandingkan hasil'],
    challenge: {
      title: 'Terapkan: Periksa Aturan Gabungan',
      prompt: 'Berapa kombinasi yang memberi akses dengan ticket && open?',
      options: { One: 'Satu', Two: 'Dua', Four: 'Empat' },
      explanation: 'Hanya kombinasi saat kedua input bernilai true yang memenuhi aturan AND.',
      hint: 'AND mengharuskan setiap kondisi bernilai true.',
    },
    recap: ['Uji setiap kombinasi kondisi yang relevan.', 'AND dan OR menyatakan aturan yang berbeda.'],
  },
  'logic-validation': {
    title: 'Tolak Input Tidak Valid Sejak Awal',
    description: 'Validasi membuat asumsi menjadi jelas sebelum sebuah nilai dipakai dalam perhitungan.',
    explanation: [
      'Validasi membuat asumsi menjadi jelas sebelum sebuah nilai dipakai dalam perhitungan.',
      'Rata-rata membutuhkan setidaknya satu nilai. scores.length menghitung banyaknya nilai dalam daftar. Mengembalikan null untuk daftar kosong menyatakan bahwa hasilnya tidak tersedia; angka 0 justru terlihat seperti hasil yang sah. Jika daftar berisi nilai, loop menjumlahkan setiap score seperti contoh basketTotal, lalu membagi jumlahnya dengan banyaknya nilai. Tentukan cara bagian pemanggil menampilkan hasil yang tidak tersedia itu.',
    ],
    practice: 'Coba satu nilai dan daftar kosong. Jelaskan mengapa null dan 0 punya arti berbeda.',
    flow: ['Periksa asumsi', 'Tangani ketiadaan data', 'Hitung data valid'],
    challenge: {
      title: 'Terapkan: Validasi Input Sejak Awal',
      prompt: 'Mengapa daftar kosong perlu diperiksa sebelum menghitung rata-rata?',
      options: { 'There is no average to calculate': 'Tidak ada rata-rata yang bisa dihitung', 'Arrays cannot contain zero': 'Array tidak dapat berisi angka nol', 'Division only works inside a loop': 'Pembagian hanya bisa dilakukan di dalam loop' },
      explanation: 'Pemeriksaan awal membedakan hasil yang tidak tersedia dari rata-rata numerik yang sah.',
      hint: 'Pikirkan apa yang terjadi jika tidak ada satu pun nilai.',
    },
    recap: ['Nyatakan asumsi sebelum melakukan perhitungan.', 'Bedakan nilai yang tidak tersedia dari angka nol.'],
  },
  'logic-linear-search': {
    title: 'Cari Satu Item demi Satu Item',
    description: 'Linear search memeriksa kandidat sampai menemukan kecocokan atau mencapai akhir daftar.',
    explanation: [
      'Linear search memeriksa kandidat sampai menemukan kecocokan atau mencapai akhir daftar.',
      'Cara ini bekerja pada data yang belum diurutkan dan bisa berhenti lebih awal. Posisi dalam daftar dimulai dari 0: items[0] membaca nilai pertama, items[1] nilai kedua, dan items.length menghitung banyaknya nilai. Loop membandingkan setiap items[i] dengan target; === memeriksa apakah nilainya sama. Jika tidak ada kecocokan, semua kandidat diperiksa. Nilai -1 berarti tidak ada posisi yang cocok, jadi pemanggil perlu menanganinya secara tersendiri.',
    ],
    practice: 'Cari item pertama, item terakhir, dan item yang tidak ada. Hitung jumlah perbandingannya.',
    flow: ['Kandidat belum diurutkan', 'Bandingkan berurutan', 'Temukan atau nyatakan tidak ada'],
    challenge: {
      title: 'Terapkan: Linear Search',
      prompt: 'Nilai apa yang dikembalikan jika target tidak ditemukan?',
      options: { '-1': '-1', 'The last item automatically': 'Item terakhir secara otomatis', 'Always 0': 'Selalu 0' },
      explanation: 'Nilai di akhir fungsi menyatakan tidak ada kecocokan setelah seluruh kandidat diperiksa.',
      hint: 'Lihat nilai yang dikembalikan setelah loop selesai.',
    },
    recap: ['Linear search dapat bekerja pada data yang belum diurutkan.', 'Tentukan juga hasil saat kandidat tidak ditemukan.'],
  },
  'logic-binary-search': {
    title: 'Bagi Dua Ruang Pencarian yang Terurut',
    description: 'Binary search membuang separuh kandidat pada setiap perbandingan.',
    explanation: [
      'Binary search membuang separuh kandidat pada setiap perbandingan.',
      'Cara ini membutuhkan data yang sudah terurut. Variabel low dan high menandai posisi pertama dan terakhir yang masih diperiksa. Loop while mengulang langkah selama low <= high; Math.floor membulatkan titik tengah ke bawah menjadi posisi bulat. Bandingkan nilai tengah dengan target, lalu pindahkan batas bawah atau atas melewati posisi itu. Memajukan batas penting; jika tidak, pencarian dapat mengulang rentang yang sama tanpa akhir.',
    ],
    practice: 'Telusuri nilai low, high, dan mid di kertas untuk target 8 dan 7.',
    flow: ['Rentang sudah terurut', 'Bandingkan nilai tengah', 'Pertahankan satu bagian'],
    challenge: {
      title: 'Terapkan: Binary Search',
      prompt: 'Syarat apa yang membuat kita boleh membuang separuh kandidat?',
      options: { 'The values are sorted': 'Nilainya sudah diurutkan', 'Every value is a string': 'Semua nilainya berupa string', 'There are exactly ten items': 'Jumlah item tepat sepuluh' },
      explanation: 'Urutan memberi tahu bahwa nilai pada salah satu sisi tidak mungkin berisi target.',
      hint: 'Tanpa urutan, kita tidak tahu sisi mana yang aman untuk dibuang.',
    },
    recap: ['Binary search memerlukan data terurut.', 'Majukan batas pada setiap langkah agar rentang terus mengecil.'],
  },
  'logic-complexity': {
    title: 'Bandingkan Pertumbuhan, Bukan Hanya Kecepatan',
    description: 'Complexity menjelaskan bagaimana jumlah pekerjaan bertambah saat ukuran input membesar.',
    explanation: [
      'Complexity menjelaskan bagaimana jumlah pekerjaan bertambah saat ukuran input membesar.',
      'Satu putaran atas n item menghasilkan pekerjaan linear. Membandingkan setiap item dengan setiap item lain melakukan n × n pemeriksaan. Ini bukan prediksi waktu dalam milidetik karena lingkungan dan konstanta juga berpengaruh. Complexity membantu melihat solusi yang makin mahal saat data bertambah.',
    ],
    practice: 'Gandakan ukuran input dan bandingkan jumlah pemeriksaan, bukan waktu eksekusinya.',
    flow: ['Ukuran input', 'Hitung operasi', 'Bandingkan pertumbuhan'],
    challenge: {
      title: 'Terapkan: Ukur Pertumbuhan Pekerjaan',
      prompt: 'Jika size pada loop bersarang ini digandakan, jumlah pemeriksaannya menjadi berapa kali lipat?',
      options: { Four: 'Empat kali', Two: 'Dua kali', One: 'Satu kali' },
      explanation: 'Kedua batas loop menjadi dua kali lebih besar, sehingga pasangan yang diperiksa bertambah 2 × 2 kali.',
      hint: 'Hitung pertumbuhan pada kedua loop.',
    },
    recap: ['Complexity membandingkan laju pertumbuhan pekerjaan.', 'Loop bersarang dapat membuat pekerjaan tumbuh jauh lebih cepat.'],
  },
  'logic-test-cases': {
    title: 'Rancang Kasus Uji yang Berguna',
    description: 'Contoh yang baik dapat memeriksa satu jalur; kumpulan tes yang berguna juga memeriksa batas aturan.',
    explanation: [
      'Contoh yang baik dapat memeriksa satu jalur; kumpulan tes yang berguna juga memeriksa batas aturan.',
      'Untuk batas usia inklusif, periksa nilai tepat di bawah, sama dengan, dan di atas ambang. Setiap testCase adalah daftar berisi dua nilai: testCase[0] adalah usia, sedangkan testCase[1] adalah hasil yang diharapkan. Tentukan harapan itu sebelum menjalankan function bernama. Setiap baris output menampilkan usia, hasil aktual, hasil yang diharapkan, dan apakah keduanya cocok. Jika hasilnya berbeda, sederhanakan kasusnya sampai penyebabnya mudah dijelaskan.',
    ],
    practice: 'Ubah >= menjadi >. Temukan satu kasus uji yang mendeteksi kesalahannya.',
    flow: ['Hasil yang diharapkan', 'Input di sekitar batas', 'Bukti dari hasil aktual'],
    challenge: {
      title: 'Terapkan: Rancang Kasus Uji',
      prompt: 'Input mana yang membedakan >= 18 dari > 18?',
      options: { '18': '18', '19': '19', '100': '100' },
      explanation: 'Hanya nilai yang tepat sama dengan batas yang memberi hasil berbeda pada kedua aturan.',
      hint: 'Uji nilai yang tepat berada di ambang.',
    },
    recap: ['Tuliskan hasil yang diharapkan sebelum menjalankan contoh.', 'Periksa nilai normal, batas, dan kondisi kosong.'],
  },
}

export function localizeLogicLesson(lesson: Lesson, locale: Locale): Lesson {
  const copy = locale === 'id' ? indonesianLogicLessons[lesson.id] : undefined
  if (!copy) return lesson
  const options = lesson.challenge.options?.map(option => copy.challenge.options[option] ?? option)
  const explanation = copy.explanation
  return {
    ...lesson,
    ...copy,
    visual: copy.visual ?? {
      ...lesson.visual,
      title: copy.title,
      description: 'Ikuti tiap langkah, lalu coba ubah contohnya.',
      nodes: lesson.visual.nodes.map((node, index) => ({
        ...node,
        label: copy.flow[index] ?? node.label,
        detail: explanation[index] ?? copy.challenge.explanation,
      })),
    },
    challenge: {
      ...lesson.challenge,
      ...copy.challenge,
      options: lesson.challenge.options,
      optionLabels: options,
      answer: lesson.challenge.answer,
      topic: 'Logika & Pemecahan Masalah',
    },
  }
}
