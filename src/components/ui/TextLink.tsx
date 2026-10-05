import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { Link, type To } from 'react-router-dom'

type SharedProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children' | 'className'> & {
  children: ReactNode
  className?: string
  tone?: 'primary' | 'muted'
}

type TextLinkProps = SharedProps & (
  | { to: To; href?: never }
  | { href: string; to?: never }
)

export default function TextLink(props: TextLinkProps) {
  const { to, href, className, tone = 'primary', children, ...anchorProps } = props
  const classes = ['text-link', className].filter(Boolean).join(' ')
  const dataTone = tone === 'primary' ? undefined : tone

  if (to !== undefined) {
    return <Link to={to} {...anchorProps} className={classes} data-tone={dataTone}>{children}</Link>
  }

  return <a href={href} {...anchorProps} className={classes} data-tone={dataTone}>{children}</a>
}
