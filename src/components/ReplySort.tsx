import Link from 'next/link'
import { useRouter } from 'next/router'
import { Nav } from 'react-bootstrap'

export default function ReplySort() {
  const router = useRouter()
  const { sort } = router.query
  const sorts = ['confidence', 'new', 'controversial', 'top', 'old', 'qa']
  const url = router.asPath.includes('#') ? router.asPath.substring(0, router.asPath.indexOf('#')) : router.asPath

  return (
    <div className="d-flex align-items-center px-3">
      sort: {' '}
      <Nav defaultActiveKey="hot" activeKey={sort as string}>
        {
          sorts.map((s, i) => (
            <Nav.Item key={i}>
              <Link
                href={sort ? url.replace(`sort=${sort}`, `sort=${s}`) : `${url}?sort=${s}`}
                passHref>
                <Nav.Link eventKey={s}
                  className={
                    `nav-link fw-bold ${sort === s || (!sort && s === 'confidence')
                      ? 'text-gray text-decoration-underline'
                      : 'text-blue'}`
                  }>
                  {s === 'confidence' ? 'best' : s === 'qa' ? 'q&a' : s}
                </Nav.Link>
              </Link>
            </Nav.Item>
          ))
        }
      </Nav>
    </div>
  )
}
