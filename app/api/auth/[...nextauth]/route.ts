import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    async signIn({ user }) {
      return true;
    },
    jwt: ({ token, account }) => {
      if (account?.access_token) {
        token.accessToken = account.access_token; 
      }
      return token;
    },
    session: ({ session, token } : {session : any , token :any}) => {
      console.log( "token", token);
      if (token?.access_token) {
        session.user = {
          ...(session.user as { accessToken: string }),
          accessToken: token.access_token,
        };
      }
      return session;
      
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
