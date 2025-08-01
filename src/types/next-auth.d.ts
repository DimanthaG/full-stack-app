import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      isMerged?: boolean
      provider?: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: string
    isMerged?: boolean
    provider?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
  }
} 