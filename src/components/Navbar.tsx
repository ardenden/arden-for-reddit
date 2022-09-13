import Link from 'next/link'
import { useRouter } from 'next/router'
import { Nav, Navbar as BSNavbar } from 'react-bootstrap'
import { Subreddit } from '../types/Subreddit'
import { Thing } from '../types/Thing'

type Props = {
  thingSubreddits?: Thing<Subreddit>[]
}

export default function Navbar({ thingSubreddits }: Props) {
  const router = useRouter()
  const { subreddit } = router.query

  return (
    <>
      <BSNavbar bg="light" variant="light" className="py-0 px-2 border-bottom border-secondary">
        <Link href="/" passHref>
          <BSNavbar.Brand>Arden</BSNavbar.Brand>
        </Link>

        <Nav className="me-auto">
          <Link href="/r/popular" passHref>
            <Nav.Link className={`${subreddit === 'popular' ? 'text-orange fw-bold' : ''}`}>popular</Nav.Link>
          </Link>
          <Link href="/r/all" passHref>
            <Nav.Link className={`${subreddit === 'all' ? 'text-orange fw-bold' : ''}`}>all</Nav.Link>
          </Link>
          <Link href="/r/random" passHref>
            <Nav.Link>random</Nav.Link>
          </Link>
          {
            thingSubreddits &&
            thingSubreddits.map((thingSubreddit, i) => (
              <Link key={i} href={thingSubreddit.data.url} passHref>
                <Nav.Link className={
                  `text-lowercase ${thingSubreddit.data.display_name === subreddit ? 'text-orange fw-bold' : ''}`
                }>
                  {thingSubreddit.data.display_name}
                </Nav.Link>
              </Link>
            ))
          }
        </Nav>
      </BSNavbar>
    </>
  )
}
