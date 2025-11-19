import { readSettings } from "./sqlite";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const row = readSettings();
        if (!row || !row.setup_complete) return null;

        if (!row?.password_hash) return null; // or throw error

        const valid = await bcrypt.compare(
          credentials.password,
          row.password_hash
        );

        if (!valid) return null;

        return { id: "admin", name: row.username };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/signin",
  },
};
