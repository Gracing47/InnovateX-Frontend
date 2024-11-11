import React from 'react';
import Link from 'next/link';

const Navigation: React.FC = () => {
  return (
    <nav className="bg-accent text-accent-foreground p-4">
      <ul className="flex space-x-4">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/about">Über uns</Link></li>
        <li><Link href="/solutions">Lösung</Link></li>
        <li><Link href="/blog">Blog</Link></li>
        <li><Link href="/contact">Kontakt</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;