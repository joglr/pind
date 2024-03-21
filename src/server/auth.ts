import type { GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
  Awaitable,
  RequestInternal,
  User,
} from "next-auth";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
// import AppleProvider from "next-auth/providers/apple";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "../env/server.mjs";
import { prisma } from "./db";
import { compare, hash } from "bcrypt";

/**
 * Module augmentation for `next-auth` types.
 * Allows us to add custom properties to the `session` object and keep type
 * safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks,
 * etc.
 *
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      debugger
      if (session.user) {
        session.user.id = user.id;
        session.user.email = user.email;
        session.user.image = user.image;
        // session.user.role = user.role; <-- put other properties on the session here
      }
      return session;
    },
    signIn({ account, profile, ...rest }) {
      debugger
    //   if (account?.provider === "google") {
    //     // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    //     return (profile as any).email_verified!
    //   }
      return true
    },
    redirect({ url, baseUrl }) {
      return baseUrl
    }
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM,
      sendVerificationRequest({ identifier, url, provider: { server, from } }) {
        console.log(url);
        console.log(server);
        console.log(from);
        console.log(identifier);
      },
    }),
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email.trim(),
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const passwordMatches = await compare(
          credentials.password,
          user.password
        );

        if (!passwordMatches) {
          return null;
        }
        return user;
      },
      id: "credentials",
      type: "credentials"
    }),
    // FacebookProvider({
    //   clientId: env.FACEBOOK_CLIENT_ID,
    //   clientSecret: env.FACEBOOK_CLIENT_SECRET,
    // }),
    // GoogleProvider({
    //   clientId: env.GOOGLE_CLIENT_ID,
    //   clientSecret: env.GOOGLE_CLIENT_SECRET,
    // }),
    // AppleProvider({
    //   clientId: env.APPLE_CLIENT_ID,
    //   clientSecret: env.APPLE_CLIENT_SECRET,
    // }),
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     **/
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the
 * `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
