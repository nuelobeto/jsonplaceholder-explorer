"use client"

import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"

/**
 * A CSS-only pin. Leaflet's default marker points at image files it resolves
 * relative to the stylesheet, which bundlers rewrite and break — a divIcon
 * sidesteps the whole problem and picks up the brand colour for free.
 */
const pin = L.divIcon({
  className: "",
  html: `<span class="block size-3.5 rounded-full border-2 border-white bg-brand shadow-md shadow-black/40"></span>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

export default function UserMapView({
  lat,
  lng,
  label,
}: {
  lat: number
  lng: number
  label: string
}) {
  return (
    <MapContainer
      center={[lat, lng]}
      // JSONPlaceholder's coordinates are random points, almost all of them in
      // open ocean. A close zoom is a featureless blue square that reads as a
      // broken map, so open at world scale where the pin has context.
      zoom={2}
      minZoom={2}
      scrollWheelZoom={false}
      // Leaflet's panes sit at z-index 400+; `isolate` traps them in their own
      // stacking context so they can't punch through the sticky topbar.
      className="isolate size-full bg-muted dark:[&_.leaflet-layer]:filter-[invert(1)_hue-rotate(180deg)_brightness(0.95)_contrast(0.9)]"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Leaflet makes the marker a focusable role="button"; `title` is what
          gives it an accessible name. */}
      <Marker position={[lat, lng]} icon={pin} title={label} alt={label}>
        <Popup>{label}</Popup>
      </Marker>
    </MapContainer>
  )
}
