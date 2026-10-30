export interface NavLink {
  label: string
  href: string
}

// The leading "/" lets these links work from any route (e.g. a project page).
export const NAV_LINKS: NavLink[] = [
  { label: 'Projects', href: '/#projects' },
  { label: 'About', href: '/#about' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Education', href: '/#education' },
  { label: 'Contact', href: '/#contact' },
]
