import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                    placeholder: "Enter email",
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "Enter Password",
                },
            },

            async authorize(credentials, req) {
                const email = credentials?.email;
                const password = credentials?.password;

                const res = await fetch(
                    "http://localhost:3000/api/user/login",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email,
                            password,
                        }),
                    }
                );
                const response = await res.json();
                const user = response.user;
                if (res.ok && user) {
                    return user;
                } else return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ user, token }) {
            if (user) {
                token.uid = user.id;
            }
            return token;
        },
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token from a provider.
            if (session?.user) {
                session.user.id = token.uid;
            }
            return session;
        },
    },
    pages: {
        signIn: "/user/login",
    },
};

export default NextAuth(authOptions);
