import '../styles/globals.css'
import { SessionProvider } from "next-auth/react"
import TopComponent from '../components/topComponent'

function MyApp({ Component, session, pageProps }) {
  return (
    <div style={{padding:'0 2rem'}}>
    <SessionProvider session={session}>
    <header>
    <TopComponent/>
    </header>
    <Component {...pageProps} />
    </SessionProvider>
    </div>
  )
}

export default MyApp
