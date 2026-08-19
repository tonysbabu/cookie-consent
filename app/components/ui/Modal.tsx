import { createPortal } from "react-dom";
import { cn } from "@/utils";
import { cva } from "class-variance-authority";
import type { Dispatch, ElementType, SetStateAction } from "react";
import { createContext, useMemo, use, useEffect } from "react";
import { Button } from "./Button";
import {
  useFocusFirstElement,
  useFocusTrap,
  useOnClickOutside,
  useOnkeyDown,
} from "@/utils/hooks";
import { useRef, useState, useId } from "react";

//Here we defined interface because we need to declare some common proptypes which can be extended
interface ModalCommonProps {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
}

type Exclude<T, K extends keyof T> = { [U in keyof T as U extends K? never:U]: T[U]}

type ModalFooterProps = Exclude<ModalCommonProps, "children"> & {
  children: ({onClose}: {onClose: () => void}) => React.ReactNode;
} 


export interface ModalProps extends ModalCommonProps {
  isOpen: boolean;
  onClose: () => void;
  size?: "sm" | "md" | "lg";
  showCloseButton?: boolean;
  closeOnClickOutside?: boolean;
}

type ModalContextType = Pick<
  ModalProps,
  "isOpen" | "onClose" | "showCloseButton" | "closeOnClickOutside"
>;

type ModalStackContextType = [
  Array<string>,
  Dispatch<SetStateAction<Array<string>>>,
];

const modalVariants = cva("flex flex-col items-center bg-primary p-4 md:py-6 gap-3", {
  variants: {
    size: {
      sm: ["w-lg"],
      md: ["w-md"],
      lg: ["w-lg"],
    },
  },
});

const ModalContext = createContext<ModalContextType | undefined>(undefined);
const ModalStackContext = createContext<ModalStackContextType | undefined>(
  undefined,
);

export const useModalStack = () => {
  const ctx = use(ModalStackContext);

  if (ctx === undefined) {
    throw new Error("Modal Stack can be used in only subtrees of ModalStack");
  }

  return ctx;
};

export const ModalStack = ({ children }: { children: React.ReactNode }) => {
  const [modalStack, setModalStack] = useState<Array<string>>([]);

  const value = useMemo<ModalStackContextType>(
    () => [modalStack, setModalStack],
    [modalStack],
  );

  return <ModalStackContext value={value}>{children}</ModalStackContext>;
};

function useModal() {
  const context = use(ModalContext);

  if (!context) {
    throw new Error("Context should be used inside Modal");
  }

  return context;
}

export const Modal = ({
  isOpen,
  onClose,
  children,
  className,
  size,
  showCloseButton = true,
  closeOnClickOutside = true,
}: ModalProps) => {
  const id = useId();
  const [modalStack, setModalStack] = useModalStack();
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    const activeModal = modalStack[modalStack.length - 1];
    if(activeModal === id) {
      onClose();
       setModalStack((prev: Array<string>) =>
        prev.filter((_id: string) => id !== _id),
      );
    }
  }

  
  useOnClickOutside(modalRef, handleClose, closeOnClickOutside);
  useOnkeyDown("Escape", handleClose);
  useFocusTrap(modalRef);
  useFocusFirstElement(modalRef, isOpen);
  const contextValue = useMemo(
    () => ({ isOpen, onClose: handleClose, showCloseButton }),
    [isOpen, handleClose],
  );

  useEffect(() => {
    if (isOpen) {
      setModalStack((prev: Array<string>) => {
        if (prev.includes(id)) {
          return prev;
        }
        return [...prev, id];
      });
    } 
  }, [isOpen, id]);

  return !isOpen
    ? null
    : createPortal(
        <ModalContext value={contextValue}>
          <div className="fixed inset-0 bg-surface-overlay flex justify-center items-center backdrop-blur-xs">
            <div ref={modalRef} className={cn(modalVariants({ size }), className)}>
              {children}
            </div>
          </div>
        </ModalContext>,
        document.body,
      );
};

Modal.Header = ({
  children,
  className,
  as: Component = "h2",
  ...rest
}: ModalCommonProps) => {
  const { onClose, showCloseButton } = useModal();

  return (
    <>
      <Component className={className} {...rest}>
        {children}
      </Component>
      {showCloseButton && (
        <Button
          className="absolute right-0 top-0 m-1"
          intent="secondary"
          onClick={onClose}
        >
          X
        </Button>
      )}
    </>
  );
};

Modal.Body = ({
  children,
  className,
  as: Component = "div",
  ...rest
}: ModalCommonProps) => {
  return (
    <Component className={className} {...rest}>
      {children}
    </Component>
  );
};

Modal.Footer = ({
  children,
  className,
  as: Component = "div",
  ...rest
}: ModalFooterProps) => {
  const {onClose} = useModal();
  return (
    <Component className={className} {...rest}>
      {typeof children === 'function'?children({onClose}): children}
    </Component>
  );
};
