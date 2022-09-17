import 'bootstrap/dist/css/bootstrap.min.css'
import '../custom.scss'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { SSRProvider } from 'react-bootstrap'
import Layout from '../components/Layout'
import { CookieProvider } from '../components/CookieContext'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  return (
    <SSRProvider>
      <CookieProvider>
        <Layout>
          <Component {...pageProps} key={router.asPath} />
        </Layout>
      </CookieProvider>
    </SSRProvider>
  )
}

export default MyApp
