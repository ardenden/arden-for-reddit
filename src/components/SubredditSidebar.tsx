import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Accordion, Card, ListGroup } from 'react-bootstrap'
import { parseCookie, useSubredditAbout, useSubredditWidget } from '../services/API'
import { Cookie } from '../types/Cookie'
import { Community, Extra, Info, Rule } from '../types/Sidebar'
import { getShortDate } from '../utils/DateUtils'

export default function SubredditSidebar() {
  const router = useRouter()
  const [cookie, setCookie] = useState<Cookie>()
  let info: Info | null = null
  let rule: Rule | null = null
  const communites: Community[] = []
  const extras: Extra[] = []
  const { thingSubreddit } = useSubredditAbout(router, cookie)
  const { sidebar } = useSubredditWidget(router, cookie)

  useEffect(() => {
    if (!cookie) {
      setCookie(parseCookie())
    }
  }, [])

  if (sidebar) {
    for (const key in sidebar.items) {
      if (Object.prototype.hasOwnProperty.call(sidebar.items, key)) {
        if (sidebar.items[key].kind === 'id-card') {
          info = sidebar.items[key] as Info
        } else if (sidebar.items[key].kind === 'subreddit-rules') {
          rule = sidebar.items[key] as Rule
        } else if (sidebar.items[key].kind === 'textarea') {
          extras.push(sidebar.items[key] as Extra)
        } else if (sidebar.items[key].kind === 'community-list') {
          communites.push(sidebar.items[key] as Community)
        }
      }
    }

    communites.sort((objectA, objectB) => {
      const valueA = objectA['shortName']
      const valueB = objectB['shortName']

      return valueA.localeCompare(valueB, undefined, { numeric: true })
    })
  }

  return (
    <>
      {
        thingSubreddit?.data &&
        <div className="px-3 py-2 border-start border-secondary">
          <div className="d-flex flex-column gap-3" style={{ width: '350px' }}>
            {
              info &&
              <Card>
                <Card.Header>About Community</Card.Header>
                <Card.Body className="p-2">
                  <Card.Text>{info.description}</Card.Text>
                  <hr className="mt-2 mb-1" />
                  <Card.Text className="font-monospace">{info.subscribersCount.toLocaleString()} members</Card.Text>
                  <Card.Text className="font-monospace">{info.currentlyViewingCount.toLocaleString()} online</Card.Text>
                  <hr className="mt-2 mb-1" />
                  <Card.Text>Created {getShortDate(thingSubreddit?.data.created)}</Card.Text>
                </Card.Body>
              </Card>
            }

            {
              rule &&
              <Card>
                <Card.Header>r/{thingSubreddit?.data.display_name} Rules</Card.Header>
                <Card.Body className="p-0">
                  <Accordion flush alwaysOpen>
                    {
                      rule.data.map((r, i) => (
                        <Accordion.Item key={i} eventKey={i.toString()}>
                          <Accordion.Button className="p-2">{r.priority + 1}. {r.shortName}</Accordion.Button>
                          <Accordion.Body dangerouslySetInnerHTML={{ __html: r.descriptionHtml }} />
                        </Accordion.Item>
                      ))
                    }
                  </Accordion>
                </Card.Body>
              </Card>
            }

            {
              extras.length > 0 &&
              extras.map((e, i) => (
                <Card key={i}>
                  <Card.Header>{e.shortName}</Card.Header>
                  <Card.Body>
                    <Card.Text dangerouslySetInnerHTML={{ __html: e.textHtml }} className="sidebar-extra" />
                  </Card.Body>
                </Card>
              ))
            }

            {
              communites.length > 0 &&
              communites.map((c, i) => (
                c &&
                <Card key={i}>
                  <Card.Header>{c.shortName}</Card.Header>
                  <Card.Body className="p-0">
                    <ListGroup variant="flush">
                      {
                        c.data.map((d, j) => (
                          <ListGroup.Item key={j}>
                            <Link href={`/r/${d.name}`}>
                              <a>r/{d.name}</a>
                            </Link>
                          </ListGroup.Item>
                        ))
                      }
                    </ListGroup>
                  </Card.Body>
                </Card>
              ))
            }
          </div>
        </div>
      }
    </>
  )
}
