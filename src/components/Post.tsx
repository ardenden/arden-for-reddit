import { Col, Image, Row } from 'react-bootstrap'
import { Link } from '../types/Link'
import NextLink from 'next/link'
import { getRelativeTime } from '../utils/DateUtils'
import { useRouter } from 'next/router'
import { formatScore } from '../utils/NumberUtils'
import { useState } from 'react'

type Props = {
  link: Link
}

export default function Post({ link }: Props) {
  const router = useRouter()
  const { subreddit, where } = router.query
  const stickiedClass = link.stickied && subreddit && subreddit !== 'popular' && subreddit !== 'all' ? 'stickied' : ''
  const shownAwards = link.all_awardings.filter((_, i) => i < 4 || (i === 4 && link.all_awardings.length === 5))
  const shownAwardsCount = shownAwards.reduce((prev, curr) => prev + curr.count, 0)
  const moreAwards = link.all_awardings.filter((ma) => !shownAwards.find((sa) => sa.id === ma.id))
  const [isCollapsed, setIsCollapsed] = useState(true)

  return (
    <>
      <Col className="d-flex align-items-center col-auto text-secondary fw-bold justify-content-center"
        style={{ width: '6ch' }}>
        {formatScore(link.score)}
      </Col>
      <Col className="d-flex align-items-center col-auto pe-0">
        {
          !link.thumbnail
            || link.thumbnail === 'self'
            || link.thumbnail === 'default'
            || link.thumbnail === 'nsfw'
            || link.thumbnail === 'spoiler'
            || link.thumbnail === 'image'
            ?
            <div className="d-flex align-items-center justify-content-center bg-secondary rounded-circle fs-1"
              style={{ height: '75px', width: '75px' }}>
              {
                link.thumbnail === 'self'
                  ? '📃'
                  : link.thumbnail === 'default'
                    ? '🔗'
                    : link.thumbnail === 'nsfw'
                      ? '🔞'
                      : link.thumbnail === 'spoiler'
                        ? '⚠️'
                        : link.thumbnail === 'image'
                          ? '🖼️'
                          : 'A'
              }
            </div>
            : <Image className="rounded-1" src={link.thumbnail} width="75" height="75"></Image>
        }
      </Col>
      <Col>
        <Row>
          <Col>
            {
              <NextLink href={link.is_self ? link.permalink : link.url}>
                <a dangerouslySetInnerHTML={{ __html: link.title }} target={link.is_self ? '_self' : '_blank'}
                  className={`lead fw-normal link me-2 ${stickiedClass}`} />
              </NextLink>
            }

            <small>
              {
                (link.link_flair_text || (link.link_flair_richtext && link.link_flair_richtext.length > 0)) &&
                <span className="d-inline-flex align-items-center gap-1 badge text-bg-light border border-secondary me-1">
                  {
                    link.link_flair_richtext && link.link_flair_richtext.length > 0
                      ? link.link_flair_richtext.map((f, i) => (
                        f.u
                          ? <span key={i} className="flair" style={{ backgroundImage: `url(${f.u})` }} />
                          : f.t &&
                          <span key={i}>{f.t}</span>
                      ))
                      : link.link_flair_text &&
                      link.link_flair_text
                  }
                </span>
              }

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
                <>
                  <NextLink href={`/user/${link.author}`}>
                    <a className={`${link.distinguished ? `text-${link.distinguished}` : 'text-blue'}`}>{link.author}</a>
                  </NextLink>
                  {
                    link.distinguished &&
                    <span className="ms-1">
                      [<span className={`distinguished text-${link.distinguished}`} />]
                    </span>
                  }
                </>
            }

            {
              (subreddit && subreddit !== 'popular' && subreddit !== 'all'
                && (link.author_flair_text || (link.author_flair_richtext && link.author_flair_richtext.length > 0))) &&
              <span className="d-inline-flex align-items-center gap-1 badge text-bg-light border border-secondary ms-2">
                {
                  link.author_flair_richtext && link.author_flair_richtext.length > 0
                    ? link.author_flair_richtext.map((f, i) => (
                      f.u
                        ? <span key={i} className="flair" style={{ backgroundImage: `url(${f.u})` }} />
                        : f.t &&
                        <span key={i}>{f.t}</span>
                    ))
                    : link.author_flair_text &&
                    link.author_flair_text
                }
              </span>
            }

            {
              (!subreddit || subreddit === 'popular' || subreddit === 'all'
                || (where === 'duplicates' && subreddit !== link.subreddit)) &&
              <>
                {' '} to {' '}
                <NextLink href={`/r/${link.subreddit}`}>
                  <a className="text-blue">{`${link.subreddit}`}</a>
                </NextLink>
              </>
            }

            {
              link.all_awardings.length > 0 &&
              <span className="ms-1">
                {
                  shownAwards.map((a, i) => (
                    <NextLink key={i} href={`/r/${link.subreddit}/gilded`}>
                      <a className="text-blue">
                        <Image src={a.resized_icons[2].url} width="16" height="16" className="ms-1" />
                        {
                          a.count > 1 &&
                          <small>{' '} {a.count}</small>
                        }
                      </a>
                    </NextLink>
                  ))
                }

                {
                  (isCollapsed && link.total_awards_received - shownAwardsCount > 0) &&
                  <>
                    {' '}
                    <a onClick={() => setIsCollapsed(false)} className="text-blue" style={{ cursor: 'pointer' }}>
                      & {link.total_awards_received - shownAwardsCount} more
                    </a>
                  </>
                }

                {
                  !isCollapsed &&
                  moreAwards.map((a, i) => (
                    <NextLink key={i} href={`/r/${link.subreddit}/gilded`}>
                      <a className="text-blue">
                        <Image src={a.resized_icons[2].url} width="16" height="16" className="ms-1" />
                        {
                          a.count > 1 &&
                          <small>{' '} {a.count}</small>
                        }
                      </a>
                    </NextLink>
                  ))
                }
              </span>
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
