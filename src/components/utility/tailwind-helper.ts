let itemMap: Map<TWElement, object> = new Map<TWElement, object>();
let initTERef: any;

interface TailwindElementsLoader {

  /**
   * Loads the given TW-Elements elements.
   *
   * @param elements TWE elements to be loaded
   * @param allowReInitialization allows re-initialization of the elements, defaults to true
   */
  load(elements: TWElement[], allowReInitialization?: boolean): void;
}

/**
 * Registered TWE item types.
 */
export enum TWElement {
  Clipboard = "Clipboard",
  Collapse = "Collapse",
  Dropdown = "Dropdown",
  Input = "Input",
  Modal = "Modal",
  Popconfirm = "Popconfirm",
  Select = "Select",
  Sidenav = "Sidenav",
  Sticky = "Sticky",
  Tab = "Tab",
  Toast = "Toast",
  Tooltip = "Tooltip"
}

/**
 * Pre-loads references of the registered TWE items.
 */
export const tailwindElementsLoader = async (): Promise<TailwindElementsLoader> => {

  if (!initTERef) {
    const {
      initTE,
      Clipboard,
      Collapse,
      Dropdown,
      Input,
      Modal,
      Popconfirm,
      Select,
      Sidenav,
      Sticky,
      Tab,
      Toast,
      Tooltip
    } = await import("tw-elements");

    initTERef = initTE;

    itemMap = new Map<TWElement, object>([
      [TWElement.Clipboard, Clipboard],
      [TWElement.Collapse, Collapse],
      [TWElement.Dropdown, Dropdown],
      [TWElement.Input, Input],
      [TWElement.Modal, Modal],
      [TWElement.Popconfirm, Popconfirm],
      [TWElement.Select, Select],
      [TWElement.Sidenav, Sidenav],
      [TWElement.Sticky, Sticky],
      [TWElement.Tab, Tab],
      [TWElement.Toast, Toast],
      [TWElement.Tooltip, Tooltip]
    ]);
  }

  return {

    load(elements: TWElement[], allowReInitialization = true): void {

      const loaderObject: any = {};
      elements.forEach(element => loaderObject[element] = itemMap.get(element)!);
      initTERef(loaderObject, { allowReinits: allowReInitialization });
    }
  }
}
