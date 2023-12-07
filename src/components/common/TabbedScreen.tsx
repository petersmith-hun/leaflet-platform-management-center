import { ReactNode, useEffect } from "react";

interface TabItemProps {
  id: string;
  title: string;
}

interface TabContentProps {
  id: string;
  child: ReactNode;
}

interface TabbedScreenProps {
  titles: string[];
  children: ReactNode[];
}

const createTabID = (index: number): string => {
  return `tab-${index}`;
}

const defaultTab = createTabID(0);

/**
 * Renders a tab item.
 *
 * @param id ID of the tab
 * @param title title of tab
 */
const TabItem = ({ id, title }: TabItemProps): ReactNode => {

  const props: any = {
    href: `#${id}`,
    className: "my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400",
    "data-te-toggle": "pill",
    "data-te-target": `#${id}`,
    role: "tab",
    "aria-controls": id,
    "aria-selected": id
  }

  if (id === defaultTab) {
    props["data-te-nav-active"] = "";
  }

  return (
    <li role="presentation">
      <a {...props}>
        {title}
      </a>
    </li>
  );
}

/**
 * Renders a tab content wrapper.
 *
 * @param id ID of the tab content
 * @param child child React node of this tab
 */
const TabContentWrapper = ({ id, child }: TabContentProps): ReactNode => {

  const props: any = {
    className: "hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block",
    id: id,
    role: "tabpanel",
    "aria-labelledby": id
  }
  if (id === defaultTab) {
    props["data-te-tab-active"] = ""
  }

  return (
    <div {...props}>
      {child}
    </div>
  );
}

/**
 * Renders a TW-Elements Tab screen. The number of titles and child nodes must match, otherwise an error message is rendered.
 * Content nodes are attached to the tabs in the same order as the titles are provided.
 *
 * @param titles titles to show on the tabs
 * @param children contents to be rendered within, attached to the tabs
 */
export const TabbedScreen = ({ titles, children }: TabbedScreenProps): ReactNode => {

  useEffect(() => {
    const init = async () => {
      const { Tab, initTE } = await import("tw-elements");
      initTE({ Tab });
    };
    init();
  }, []);

  if (titles.length !== children.length) {
    return <p>Invalid tab configuration</p>
  }

  return (
    <div>
      <ul className="mb-5 flex list-none flex-row flex-wrap border-b-0 pl-0" role="tablist" data-te-nav-ref="">
        {titles.map((title, index) =>
          <TabItem key={`tab-item-${index}`} id={createTabID(index)} title={title} />
        )}
      </ul>

      <div className="mb-6">
        {children.map((child, index) =>
          <TabContentWrapper key={`tab-content-${index}`}  id={createTabID(index)} child={child} />
        )}
      </div>
    </div>
  )
}
