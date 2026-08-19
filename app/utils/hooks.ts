import { useEffect, type RefObject } from "react";

export function useOnClickOutside(
  ref: RefObject<HTMLDivElement | null>,
  onClose: () => void,
  isActive: boolean,
) {
  useEffect(() => {
    const handler = (e) => {
      if (!ref.current || !isActive) {
        return;
      }
      if (!ref.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [onClose]);
}

const isTabbable = (el: Element) => {
  const htmlEl = el as HTMLElement;

  // Some elements (input, button, select, textarea) have a `disabled` property.
  // Narrow to HTMLElement and check either the attribute or the specific property.
  if (
    (htmlEl.hasAttribute && htmlEl.hasAttribute("disabled")) ||
    ("disabled" in htmlEl && (htmlEl as HTMLInputElement).disabled)
  ) {
    return false;
  }

  return htmlEl.tabIndex >= 0;
};

const getTabbableEls = (container: HTMLElement | null) => {
  if (!container) {
    return [];
  }

  return Array.from(
    container.querySelectorAll("input, textarea, button, select"),
  ).filter(isTabbable);
};

export function useFocusFirstElement(
  ref: RefObject<HTMLElement | null>,
  isOpen: boolean,
) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const tabbableEls = getTabbableEls(ref?.current);

    (tabbableEls[0] as HTMLElement)?.focus();
  }, [isOpen]);
}

export function useOnkeyDown(key: string, handler: (event: any) => void) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === key) {
        handler(e);
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [handler]);
}

export function useFocusTrap(ref: RefObject<HTMLElement | null>) {
  const focusTrap = (e) => {
    const tabbableEls = getTabbableEls(ref?.current);
    if (tabbableEls.length === 0) {
      return;
    }
    const lastEl = tabbableEls[tabbableEls.length - 1];
    const firstEl = tabbableEls[0];
    const activeEl = document.activeElement;

    if (activeEl == firstEl) {

      if (e.shiftKey) {
        e.preventDefault();
        (lastEl as HTMLElement).focus();
      }
    } else if (activeEl === lastEl) {

      if (!e.shiftKey) {
        e.preventDefault();
        (firstEl as HTMLElement).focus();
      }
    }
  };

  useOnkeyDown("Tab", focusTrap);
}

export const useCookies = () => {
  const setCookie = async (name: string, value: string) => {
    const day = 24 * 60 * 60 * 1000;
    try {
      await cookieStore.set({ name, value, expires: Date.now() + day });
    } catch (error) {
      console.log(`Error setting cookie ${name}: ${error}`);
    }
  };

  const getCookie = async (name: string) => {
    try {
      const cookie = await cookieStore.get(name);
      return cookie
    } catch (error) {
      console.log(`Error setting cookie ${name}: ${error}`);
    }
  };

  return {
    setCookie,
    getCookie,
  };
};
