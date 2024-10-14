import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import dbConnect from "@/lib/dbconfig";
import UserModel from "@/models/userModel";
import bcryptjs from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [{ email: credentials.identifier }, { username: credentials.identifier }]
          });

          if (!user) {
            throw new Error("User does not exist");
          }

          if (!user.isVerified) {
            throw new Error("Kindly verify the account first");
          }

          const verifiedPassword = await bcryptjs.compare(credentials.password, user.password);

          if (verifiedPassword) {
            return user;
          } else {
            throw new Error("Incorrect password");
          }
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.username = user.username;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.isVerified = user.isVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id=token._id;
        session.user.username=token.username;
        session.user.isAcceptingMessages=token.isAcceptingMessages;
        session.user.isVerified=token.isVerified;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: '/sign-in',
  },
  secret: process.env.NEXT_AUTH_KEY
};
