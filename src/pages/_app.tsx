import 'bootstrap/dist/css/bootstrap.min.css'
import '../app.scss'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { SSRProvider } from 'react-bootstrap'
import Layout from '../components/Layout'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  return (
    <SSRProvider>
      <Layout>
        <Component {...pageProps} key={router.asPath} />
      </Layout>
    </SSRProvider>
  )
}

export default MyApp
