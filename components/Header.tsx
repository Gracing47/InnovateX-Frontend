import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from "lib/utils";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";

import { Menu } from 'lucide-react';
import { Button } from 'components/ui/button';

const NavigationMenuDemo: React.FC = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex flex-row items-center space-x-4">
        <NavigationMenuItem className="mb-2">
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-gray-800")}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="mb-2">
          <Link href="/about" legacyBehavior passHref>
            <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-gray-800")}>
              Über uns
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="mb-2">
          <Link href="/solutions" legacyBehavior passHref>
            <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-gray-800")}>
              Lösung
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="mb-2">
          <Link href="/blog" legacyBehavior passHref>
            <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-gray-800")}>
              Blog
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="mb-2">
          <Link href="/digitalization-score" legacyBehavior passHref>
            <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-gray-800")}>
              Digitalisierungs-Score
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-primary text-primary-foreground p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Image src="/logo.png" alt="InnovateX Logo" width={40} height={40} />
          <h1 className="text-2xl font-bold ml-2">InnovateX</h1>
        </div>
        <div className="hidden md:block">
          <NavigationMenuDemo />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      {mobileMenuOpen && (
        <div className="mt-4 md:hidden">
          <NavigationMenuDemo />
        </div>
      )}
    </header>
  );
};

export default Header;
