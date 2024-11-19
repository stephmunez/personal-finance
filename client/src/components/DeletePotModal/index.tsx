import { useEffect, useRef } from "react";
import iconCloseModal from "../../assets/images/icon-close-modal.svg";
import { Pot } from "../../types";

interface DeletePotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeletePot: (budget: Pot) => void;
  selectedPot: Pot | null;
}

const DeletePotModal = ({
  isOpen,
  onClose,
  onDeletePot,
  selectedPot,
}: DeletePotModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      const handleClickOutside = (event: MouseEvent) => {
        if (
          modalRef.current &&
          !modalRef.current.contains(event.target as Node)
        ) {
          onClose();
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      };
    }
  }, [isOpen, onClose]);

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed left-0 top-0 z-50 h-screen w-full overflow-auto bg-black/50 transition-opacity duration-300 ${
        isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="flex h-screen min-h-[480px] w-full flex-col items-center justify-center px-5 py-20"
      >
        <div
          ref={modalRef}
          className={`flex w-full max-w-96 flex-col gap-5 rounded-xl bg-white px-5 py-6 transition-transform duration-300 md:max-w-[560px] md:p-8 ${
            isOpen ? "translate-y-0" : "translate-y-5"
          }`}
        >
          <div className="flex w-full flex-col gap-5">
            <div className="flex w-full items-center justify-between gap-10">
              <h2 className="text-xl font-bold leading-[1.2] text-grey-900">
                Delete '{selectedPot?.name}'?
              </h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center"
              >
                <img
                  className="h-full w-full"
                  src={iconCloseModal}
                  alt="close modal icon"
                />
              </button>
            </div>
            <p className="text-sm leading-normal text-grey-500">
              Are you sure you want to delete this pot? This action cannot be
              reversed, and all the data inside it will be removed forever.
            </p>
          </div>
          <div className="flex w-full flex-col items-center gap-5">
            <button
              onClick={() => {
                if (selectedPot) {
                  onDeletePot(selectedPot);
                }
              }}
              className="flex w-full items-center justify-center rounded-lg bg-red py-4 text-sm font-bold leading-normal text-white"
            >
              Delete Pot
            </button>
            <button
              onClick={onClose}
              className="text-sm leading-normal text-grey-500"
            >
              No, I want to go back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletePotModal;
