import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Sidebar />
      <main style={{ marginLeft: '220px', padding: '20px' }}>
        <Component {...pageProps} />
      </main>
    </>
  )
}

export default MyApp
