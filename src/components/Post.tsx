import { Col, Image, Row } from 'react-bootstrap'
import { Link } from '../types/Link'
import NextLink from 'next/link'
import { getRelativeTime } from '../utils/DateUtils'
import { useRouter } from 'next/router'
import { formatScore } from '../utils/NumberUtils'

type Props = {
  link: Link
}

export default function Post({ link }: Props) {
  const router = useRouter()
  const { subreddit } = router.query

  return (
    <>
      <Col className="d-flex align-items-center col-auto text-secondary fw-bold justify-content-center"
        style={{ width: '6ch' }}>
        {formatScore(link.score)}
      </Col>
      <Col className="d-flex align-items-center col-auto pe-0">
        <Image src={link.thumbnail} width="75" height="75"></Image>
      </Col>
      <Col>
        <Row>
          <Col>
            {
              link.is_self
                ?
                <NextLink href={link.permalink}>
                  <a className="lead fw-normal link"
                    dangerouslySetInnerHTML={{ __html: link.title }} />
                </NextLink>
                : <a href={link.url}
                  className="lead fw-normal link"
                  dangerouslySetInnerHTML={{ __html: link.title }} />
            }
            {' '}
            <small>
              <NextLink href={link.is_self ? `/r/${link.subreddit}` : `/domain/${link.domain}`}>
                <a className="text-muted">({link.domain})</a>
              </NextLink>
            </small>
          </Col>
        </Row>
        <Row>
          <small className="text-gray">
            {getRelativeTime(link.created)} by {' '}
            {
              link.author === '[deleted]'
                ? <span className="text-muted">{link.author}</span>
                :
                <NextLink href={`/user/${link.author}`}>
                  <a className="text-blue">{link.author}</a>
                </NextLink>
            }
            {
              (!subreddit || subreddit === 'popular' || subreddit === 'all') &&
              <>
                {' '} to {' '}
                <NextLink href={`/r/${link.subreddit}`}>
                  <a className="text-blue">{`r/${link.subreddit}`}</a>
                </NextLink>
              </>
            }
          </small>
        </Row>
        <Row>
          <small>
            <NextLink href={link.permalink}>
              <a className="text-secondary fw-bold">{link.num_comments} comments</a>
            </NextLink>
          </small>
        </Row>
      </Col>
    </>
  )
}
