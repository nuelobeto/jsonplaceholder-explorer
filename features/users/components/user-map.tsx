"use client"

import dynamic from "next/dynamic"

import { Skeleton } from "@/components/ui/skeleton"

/**
 * Leaflet reaches for `window` at import time, so the map can only ever load in
 * the browser. This wrapper exists because `ssr: false` is illegal in a Server
 * Component — the detail page renders this, and this renders the real map.
 */
const UserMapView = dynamic(() => import("./user-map-view"), {
  ssr: false,
  loading: () => <Skeleton className="size-full rounded-none" />,
})

export const UserMap = ({
  lat,
  lng,
  label,
}: {
  lat: number
  lng: number
  label: string
}) => <UserMapView lat={lat} lng={lng} label={label} />
