// Database Seeder
//
// Apa fungsi file ini?
// - Mengisi data awal (mock/sample data) produk ke dalam database secara otomatis.
// - Dijalankan secara mandiri dengan perintah 'npm run contoh4:seed'.
//
// Kenapa menggunakan pola Idempotent Upsert dengan CUID statis?
// - Supaya proses seeding bersifat 'Idempotent' (bisa dijalankan berkali-kali tanpa menghasilkan data duplikat).
// - Menggunakan ID CUID unik yang sudah ditentukan sejak awal, sehingga Prisma bisa membedakan
//   apakah data sudah ada atau belum lewat perintah 'upsert'.
// - Supaya apa? Nama produk di dunia nyata bisa saja sama (tidak unik). Dengan berpatokan pada ID unik,
//   seeder tidak akan salah mengira dua produk berbeda sebagai produk yang sama, dan tidak akan
//   menghapus data produk lain yang pernah dibuat manual lewat API.

import prisma from "../src/db/index.js";

// Data awal produk contoh (menggunakan ID CUID statis agar bisa disinkronisasi berulang kali)
const sampleProducts = [
  {
    id: "c595d5i0ofcoo4hhtwbow64v",
    name: "Sepatu Sneaker Classic",
    price: 350000,
    description: "Sepatu casual nyaman untuk sehari-hari dengan sol empuk",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  },
  {
    id: "vtbambihiz0rzgbr9pcwzqnc",
    name: "Kaos Polos Cotton Combed 30s",
    price: 75000,
    description: "Bahan katun asli 100% adem, menyerap keringat, dan lembut",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
  },
  {
    id: "jmoa0fjcy8lyzxfy5od6bjpp",
    name: "Tas Ransel Laptop Anti Air",
    price: 250000,
    description:
      "Tas ransel multifungsi muat laptop hingga 15.6 inch tahan air",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
  },
];

// Fungsi utama seeder untuk menyinkronkan data ke database
async function main() {
  console.log("Seeding data contoh produk (Idempotent upsert)...");

  // Looping setiap produk dan lakukan upsert (update jika sudah ada, create jika belum ada)
  for (const item of sampleProducts) {
    await prisma.product.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        price: item.price,
        description: item.description,
        image: item.image,
      },
      create: item,
    });
    console.log(`- Seed tersinkronisasi: [${item.id}] ${item.name}`);
  }

  console.log("Seeding selesai tanpa duplikasi!");
}

// Jalankan fungsi seeder, tangani jika terjadi error, dan pastikan koneksi ditutup
main()
  .catch((e) => {
    console.error("Gagal menjalankan seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Selalu putus koneksi database di akhir agar proses terminal tidak menggantung
    await prisma.$disconnect();
  });
