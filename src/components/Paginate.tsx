import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button } from 'react-bootstrap'

type Props = {
  listBefore: string
  listAfter: string
}

export default function Paginate({ listBefore, listAfter }: Props) {
  const router = useRouter()
  const { limit, count, before, after } = router.query
  const limitInt = parseInt(limit as string, 10)
  const countInt = parseInt(count as string, 10)
  const prevCount = (count ? countInt : 0) + (after ? 1 : (limit ? -limitInt : -25))
  const nextCount = (count ? countInt : 0) + (before ? -1 : (limit ? limitInt : 25))
  const hasQuery = router.asPath.includes('?')
  const hasCountFirst = router.asPath.includes(`?count=${count}`)
  const affix = hasQuery ? hasCountFirst ? '?' : '&' : '?'
  const path = router.asPath
    .replace(`?count=${count}`, '')
    .replace(`&count=${count}`, '')
    .replace(`&before=${before}`, '')
    .replace(`&after=${after}`, '')
  const prevUrl = path.concat(`${affix}count=${prevCount}&before=${listBefore}`)
  const nextUrl = path.concat(`${affix}count=${nextCount}&after=${listAfter}`)

  return (
    <>
      view more: {' '}
      {
        listBefore &&
        <Link href={prevUrl}>
          <a>
            <Button variant="outline-light" size="sm" className="text-primary fw-bold bg-light">
              &lt; prev
            </Button>
          </a>
        </Link>
      }

      {
        (listBefore && listAfter) &&
        <>
          {' '} <span className="text-muted fw-light">|</span> {' '}
        </>
      }

      {
        listAfter &&
        <Link href={nextUrl}>
          <a>
            <Button variant="outline-light" size="sm" className="text-primary fw-bold bg-light">
              next &gt;
            </Button>
          </a>
        </Link>
      }
    </>
  )
}
