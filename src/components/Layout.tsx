import { ReactNode } from 'react'
import Navbar from './Navbar'
import SubredditNav from './SubredditNav'
import SubredditSidebar from './SubredditSidebar'

type Props = {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div style={{ overflowX: 'hidden' }}>
      <Navbar />
      <SubredditNav />
      <div className="float-end">
        <SubredditSidebar />
      </div>
      <main>{children}</main>
    </div>
  )
}
