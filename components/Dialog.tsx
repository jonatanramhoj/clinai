import { Dialog, DialogPanel, CloseButton } from "@headlessui/react";
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
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 rounded-2xl bg-[#2f2f2f] p-12 relative">
            <div className="w-full justify-items-end">
              <CloseButton className="cursor-pointer absolute right-5 top-5">
                <Close />
              </CloseButton>
            </div>
            {content}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default Modal;
