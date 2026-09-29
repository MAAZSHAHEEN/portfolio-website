export interface NavLink {
  label: string
  href: string
}

// Anchors match the section ids added to the Home page in Phase 2. The
// leading "/" lets these links work from any route (e.g. a project page).
export const NAV_LINKS: NavLink[] = [
  { label: 'About', href: '/#about' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Education', href: '/#education' },
  { label: 'Contact', href: '/#contact' },
]
