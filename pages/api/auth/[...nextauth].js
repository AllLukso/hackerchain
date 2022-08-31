import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import TwitterProvider from "next-auth/providers/twitter";
import DiscordProvider from "next-auth/providers/discord";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";


export default NextAuth({
  providers: [
    GithubProvider({
      clientId: "a3268ff962d7dcf64505",
      clientSecret: "b4d6e9ad3400bf49c18616d1f26de8ed27ac1aa5",
    }),
    TwitterProvider({
      clientId: "U1ZTNnU2alJQbkNONE5ocmRfcno6MTpjaQ",
      clientSecret: "WzGV-fc_QMke2iSIWGh4BBcts7o-H_zHVcNbvlkP_ls1pQTK4-",
      version: "2.0"
    }),
    DiscordProvider({
      clientId: "1013031820163551276",
      clientSecret: "sf52qPP390o7j2OOSXr9mbi41kIHWwjv"
    }),
    GoogleProvider({
      clientId: "857513529155-mhk3b6cdien65t8n5qb76flqbqhk1t86.apps.googleusercontent.com",
      clientSecret: "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"
    }),
    FacebookProvider({
      clientId: "468089741616847",
      clientSecret: "8862150f36f438e819771e701c914714"
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true      
    },
    async jwt({ token, account, profile }) { 
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        token.connectedProvider = account.provider
        token.loggedInfo = token.name
      }
      return token
    },
    async session({ session, token, account}) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken
      session.connectedProvider = token.connectedProvider
      session.loggedInfo = token.loggedInfo
      return session
    }
  }
})

