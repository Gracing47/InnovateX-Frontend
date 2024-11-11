import * as React from "react";
import { cn } from "lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu"; // Corrected import path

const NavigationMenuDemo = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {/* Navigation items have been removed to avoid duplication */}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavigationMenuDemo;
