"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/", label: "Work", on: (p: string) => p === "/" || p.startsWith("/work") },
  { href: "/curiosities", label: "Curiosities", on: (p: string) => p.startsWith("/curiosities") },
  { href: "/thinking", label: "Tabula rasa", on: (p: string) => p.startsWith("/thinking") },
  { href: "/about", label: "About", on: (p: string) => p.startsWith("/about") },
];

export default function Header() {
  const p = usePathname();
  return (
    <header className="hdr">
      <div className="col hdr-in">
        <Link href="/" className="mark" aria-label="JN, Jay Naik home">
          <svg viewBox="0 0 58 58" aria-hidden="true"><ellipse cx="29" cy="29" rx="27" ry="24" /><path d="M10 48c10 4 28 4 38 0" /><text x="29" y="35" textAnchor="middle">JN</text></svg>
        </Link>
        <nav aria-label="Primary">
          <ul>
            {links.map((l) => <li key={l.href}><Link href={l.href} aria-current={l.on(p) ? "page" : undefined}>{l.label}</Link></li>)}
            <li><ThemeToggle /></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
