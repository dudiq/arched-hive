import { useLocation } from 'wouter-preact'

export function useSearchLocation() {
  const [location, setLocation] = useLocation()
  return [location, setLocation, window.location.search]
}
