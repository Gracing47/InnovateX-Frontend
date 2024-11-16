import * as React from "react";

export const Tabs = ({ defaultValue, className, children }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  return (
    <div className={`tabs ${className}`}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          activeTab,
          setActiveTab,
        })
      )}
    </div>
  );
};

export const TabsList = ({ className, children }) => (
  <div className={`tabs-list ${className}`}>{children}</div>
);

export const TabsTrigger = ({ value, children }) => (
  <button className="tab-trigger">{children}</button>
);

interface TabsContentProps {
  value: any;
  activeTab?: any;
  children: React.ReactNode;
}

export const TabsContent = ({ value, activeTab, children }: TabsContentProps) => {
  if (activeTab !== value) return null;
  return <div className="tab-content">{children}</div>;
};
