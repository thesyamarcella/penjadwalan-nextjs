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
    jwt: ({ token, user, account, profile, isNewUser }) => {
      console.log("token", token, "user", user, "account", account, "profile",profile)
      if (account?.access_token) {
        token.accessToken = account.access_token; 
      }
      console.log(token)
      return token;
    },
    session: ({ session, token } : {session : any , token :any}) => {
      console.log( "token", token);
      if (token?.accessToken || token?.access_token) {
        console.log("masuk")
        session.user = {
          ...(session.user as { accessToken: string }),
          accessToken: token.access_token || token.accessToken,
        };
      }
      return session;
      
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
