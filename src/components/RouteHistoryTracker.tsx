import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const CURRENT_ROUTE_KEY = 'currentRoute'
const PREV_ROUTE_KEY = 'prevRoute'

export default function RouteHistoryTracker() {
  const location = useLocation()

  useEffect(() => {
    const nextRoute = `${location.pathname}${location.search}${location.hash}`
    const currentRoute = sessionStorage.getItem(CURRENT_ROUTE_KEY)

    if (currentRoute && currentRoute !== nextRoute) {
      sessionStorage.setItem(PREV_ROUTE_KEY, currentRoute)
    }

    sessionStorage.setItem(CURRENT_ROUTE_KEY, nextRoute)
    
    // Scroll to top on route change
    window.scrollTo(0, 0)
  }, [location.pathname, location.search, location.hash])

  return null
}
