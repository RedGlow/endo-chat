import React, { useCallback, useMemo, useState } from "react";
import { memo } from "react";

export interface Tab {
  title: string;
  content: React.ReactNode;
}

export interface TabbedProps {
  tabs: Tab[];
}

interface TabHeaderProps {
  tab: Tab;
  selected: boolean;
  i: number;
  onTabClick(i: number): void;
}

const TabHeader = ({ tab, selected, i, onTabClick }: TabHeaderProps) => {
  const onClick = useCallback(() => {
    onTabClick(i);
  }, [i]);
  return (
    <li
      className={"tabbed__tab" + (selected ? " tabbed__selected" : "")}
      onClick={onClick}
    >
      {tab.title}
    </li>
  );
};

export const Tabbed = memo(function Tabbed({ tabs }: TabbedProps) {
  const [index, setIndex] = useState(0);

  const actualIndex = useMemo(
    () => Math.min(tabs.length, Math.max(0, index)),
    [tabs.length, index]
  );

  return (
    <>
      <ul className="tabbed__container">
        {tabs.map((tab, i) => (
          <TabHeader
            key={i}
            i={i}
            onTabClick={setIndex}
            tab={tab}
            selected={i === actualIndex}
          />
        ))}
      </ul>
      {tabs[actualIndex].content}
    </>
  );
});
