import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";;
import { NextRequest } from "next/server";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET!,

  // Enable this if you need session persistence.
  // session: {
  //   strategy: "jwt",
  // },

  callbacks: {
    async signIn({ user }: { user: any }) {
      // Check if user exists in your database here
      return true; // Allow sign-in
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
