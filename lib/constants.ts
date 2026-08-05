import {
  Users,
  FileText,
  MessageSquare,
  Library,
  Image as ImageIcon,
  CircleCheck,
  LayoutDashboard,
} from "lucide-react"

export const ROUTES = {
  landing: {
    features: "#features",
    resources: "#resources",
    about: "#about",
  },
  dashboard: {
    overview: "/dashboard/overview",
    users: "/dashboard/users",
    user: (id: number | string) => `/dashboard/users/${id}`,
    posts: "/dashboard/posts",
    comments: "/dashboard/comments",
    albums: "/dashboard/albums",
    photos: "/dashboard/photos",
    todos: "/dashboard/todos",
  },
}

export const LANDING_NAV_LINKS = [
  { href: ROUTES.landing.features, label: "Features" },
  { href: ROUTES.landing.resources, label: "Resources" },
  { href: ROUTES.landing.about, label: "About" },
] as const

export const DASHBOARD_NAV_LINKS = [
  { href: ROUTES.dashboard.overview, label: "Overview", icon: LayoutDashboard },
  { href: ROUTES.dashboard.users, label: "Users", icon: Users },
  { href: ROUTES.dashboard.posts, label: "Posts", icon: FileText },
  { href: ROUTES.dashboard.comments, label: "Comments", icon: MessageSquare },
  { href: ROUTES.dashboard.albums, label: "Albums", icon: Library },
  { href: ROUTES.dashboard.photos, label: "Photos", icon: ImageIcon },
  { href: ROUTES.dashboard.todos, label: "Todos", icon: CircleCheck },
]
