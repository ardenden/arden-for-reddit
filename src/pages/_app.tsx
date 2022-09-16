import 'bootstrap/dist/css/bootstrap.min.css'
import '../custom.scss'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { SSRProvider } from 'react-bootstrap'
import Layout from '../components/Layout'
import { CookieContextProvider } from '../components/CookieContext'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  return (
    <SSRProvider>
      <CookieContextProvider>
        <Layout>
          <Component {...pageProps} key={router.asPath} />
        </Layout>
      </CookieContextProvider>
    </SSRProvider>
  )
}

export default MyApp
