import {
  Dialog,
  DialogPanel,
  CloseButton,
  DialogBackdrop,
} from "@headlessui/react";
import Close from "@/icons/Close";
import { ReactElement } from "react";

const Modal = ({
  isOpen,
  setIsOpen,
  content,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  content: ReactElement;
}) => {
  return (
    <>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50 bg-red"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/50" />
        <div className="fixed inset-0 flex w-screen items-center justify-center">
          <DialogPanel className="max-w-lg space-y-4 rounded-2xl bg-white dark:bg-[#2f2f2f] relative">
            <CloseButton className="cursor-pointer absolute right-5 top-5">
              <Close />
            </CloseButton>
            {content}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default Modal;
