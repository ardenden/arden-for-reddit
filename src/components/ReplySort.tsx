import Link from 'next/link'
import { useRouter } from 'next/router'
import { Nav } from 'react-bootstrap'

export default function ReplySort() {
  const router = useRouter()
  const { sort } = router.query
  const sorts = ['confidence', 'new', 'top']

  return (
    <div className="d-flex align-items-center px-3">
      sort: {' '}
      <Nav defaultActiveKey="hot" activeKey={sort as string} className="border-0">
        {
          sorts.map((s, i) => (
            <Nav.Item key={i}>
              <Link
                href={`${sort ? router.asPath.substring(0, router.asPath.indexOf('?')) : router.asPath}?sort=${s}`}
                passHref>
                <Nav.Link eventKey={s}
                  className={
                    `nav-link fw-bold ${sort === s || (!sort && s === 'confidence') ? 'text-dark' : 'text-blue'}`
                  }>
                  {s === 'confidence' ? 'best' : s}
                </Nav.Link>
              </Link>
            </Nav.Item>
          ))
        }
      </Nav>
    </div>
  )
}
