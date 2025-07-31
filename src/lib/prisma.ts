import { PrismaClient } from '@prisma/client';

// Deklarasikan variabel global untuk menyimpan instance Prisma Client
declare global {
  var prisma: PrismaClient | undefined;
}

// Inisialisasi PrismaClient.
// Di lingkungan pengembangan, kita menggunakan variabel global untuk mencegah
// pembuatan instance PrismaClient baru setiap kali ada hot-reload.
// Di lingkungan produksi, kita selalu membuat instance baru.
const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;

export default client;