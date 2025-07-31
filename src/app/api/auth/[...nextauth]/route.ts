// src/app/api/auth/[...nextauth]/route.ts

import { authOptions } from '@/lib/auth';
import NextAuth from 'next-auth';

const handler = NextAuth(authOptions);

// Ekspor handler untuk metode GET dan POST
export { handler as GET, handler as POST };