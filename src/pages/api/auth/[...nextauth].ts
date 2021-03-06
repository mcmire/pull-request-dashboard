import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export default NextAuth({
  secret: process.env.NEXT_AUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization:
        'https://github.com/login/oauth/authorize?scope=read:user+user:email+read:org+repo+public_repo',
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account != null) {
        // Persist the OAuth access token to the token right after sign-in.
        return { ...token, accessToken: account?.access_token };
      }
      return token;
    },
    async session({ session, token }) {
      // Send the access_token to the client by putting it in the session.
      return { ...session, accessToken: token.accessToken };
    },
  },
});
