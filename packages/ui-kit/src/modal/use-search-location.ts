import { useLocation } from 'wouter'

export function useSearchLocation() {
  const [location, setLocation] = useLocation()
  return [location, setLocation, window.location.search]
}
