import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Accordion, Button as BSButton, Card, ListGroup } from 'react-bootstrap'
import { parseCookie, useSubredditAbout, useSubredditWidget } from '../services/API'
import { Cookie } from '../types/Cookie'
import { Button, Calendar, Community, Extra, Info, Menu2, Rule } from '../types/Widget'
import { getFullDate } from '../utils/DateUtils'

export default function SubredditSidebar() {
  const router = useRouter()
  const [cookie, setCookie] = useState<Cookie>()
  let info: Info | null = null
  let rule: Rule | null = null
  const communites: Community[] = []
  const extras: Extra[] = []
  const menus2: Menu2[] = []
  const calendars: Calendar[] = []
  const buttons: Button[] = []
  const { thingSubreddit } = useSubredditAbout(router, cookie)
  const { widgets } = useSubredditWidget(router, cookie)

  useEffect(() => {
    if (!cookie) {
      setCookie(parseCookie())
    }
  }, [])

  if (widgets) {
    for (const key in widgets.items) {
      if (Object.prototype.hasOwnProperty.call(widgets.items, key)) {
        const widget = widgets.items[key]

        if (widget.kind === 'id-card') {
          info = widget as Info
        } else if (widget.kind === 'subreddit-rules') {
          rule = widget as Rule
        } else if (widget.kind === 'textarea') {
          extras.push(widget as Extra)
        } else if (widget.kind === 'community-list') {
          communites.push(widget as Community)
        } else if (widget.kind === 'menu') {
          if (widget.hasOwnProperty('children')) {
            menus2.push(widget as Menu2)
          }
        } else if (widget.kind === 'calendar') {
          calendars.push(widget as Calendar)
        } else if (widget.kind === 'button') {
          buttons.push(widget as Button)
        }
      }
    }

    extras.sort((objectA, objectB) => {
      const valueA = objectA['id']
      const valueB = objectB['id']

      return valueA.localeCompare(valueB, undefined, { numeric: true })
    })

    communites.sort((objectA, objectB) => {
      const valueA = objectA['id']
      const valueB = objectB['id']

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
                  <Card.Text>Created {getFullDate(thingSubreddit?.data.created, 'short')}</Card.Text>
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
              buttons.length > 0 &&
              buttons.map((b, i) => (
                b &&
                <Card key={i}>
                  <Card.Header>{b.shortName}</Card.Header>
                  <Card.Body className="p-2 d-flex flex-column gap-1">
                    {
                      b.buttons.map((c, j) => (
                        <Link href={c.url} passHref>
                          <BSButton key={j} className="border-secondary rounded-pill text-blue bg-light fw-bold">
                            {c.text}
                          </BSButton>
                        </Link>
                      ))
                    }
                  </Card.Body>
                </Card>
              ))
            }

            {
              menus2.length > 0 &&
              menus2.map((m) => (
                m &&
                m.data.map((d, i) => (
                  <Card key={i}>
                    <Card.Header>{d.text}</Card.Header>
                    <Card.Body className="p-0">
                      <ListGroup variant="flush">
                        {
                          d.children.map((c, j) => (
                            <ListGroup.Item key={j}>
                              <Link href={c.url}>
                                <a>r/{c.text}</a>
                              </Link>
                            </ListGroup.Item>
                          ))
                        }
                      </ListGroup>
                    </Card.Body>
                  </Card>
                ))
              ))
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

            {
              calendars.length > 0 &&
              calendars.map((c, i) => (
                c &&
                <Card key={i}>
                  <Card.Header>{c.shortName}</Card.Header>
                  <Card.Body className="p-0">
                    <ListGroup variant="flush">
                      {
                        c.data.map((d, j) => (
                          <ListGroup.Item key={j}>
                            <div dangerouslySetInnerHTML={{ __html: d.titleHtml }} />
                            <div>{getFullDate(d.startTime, 'long')}</div>
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
