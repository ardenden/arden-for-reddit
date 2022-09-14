import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button } from 'react-bootstrap'

type Props = {
  listBefore: string
  listAfter: string
}

export default function Paginate({ listBefore, listAfter }: Props) {
  const router = useRouter()
  const { subreddit, limit, count, before, after, where, t } = router.query
  const limitInt = parseInt(limit as string, 10)
  const countInt = parseInt(count as string, 10)
  const prevCount = (count ? countInt : 0) + (after ? 1 : (limit ? -limitInt : -25))
  const nextCount = (count ? countInt : 0) + (before ? -1 : (limit ? limitInt : 25))
  const whereParam = where ? `/${where}` : ''
  const tParam = t ? `t=${t}&` : ''
  const limitParam = limit ? `limit=${limit}&` : ''
  const prevUrl = `/r/${subreddit}${whereParam}?${tParam}${limitParam}count=${prevCount}&before=${listBefore}`
  const nextUrl = `/r/${subreddit}${whereParam}?${tParam}${limitParam}count=${nextCount}&after=${listAfter}`

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
