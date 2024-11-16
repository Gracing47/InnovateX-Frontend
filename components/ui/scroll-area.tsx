import * as React from "react";

export const ScrollArea = ({ className, children }) => (
  <div className={`scroll-area ${className}`}>{children}</div>
);
