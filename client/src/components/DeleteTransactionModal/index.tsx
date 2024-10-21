import iconCloseModal from "../../assets/images/icon-close-modal.svg";
import { Transaction } from "../../types";

interface DeleteTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteTransaction: (transaction: Transaction) => void;
  selectedTransaction: Transaction | null;
}

const DeleteTransactionModal = ({
  isOpen,
  onClose,
  onDeleteTransaction,
  selectedTransaction,
}: DeleteTransactionModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed left-0 top-0 z-50 h-screen w-full overflow-auto bg-black/50">
      <div className="flex h-screen min-h-[480px] w-full flex-col items-center justify-center px-5 py-20">
        <div className="flex w-full flex-col gap-5 rounded-xl bg-white px-5 py-6">
          <div className="flex w-full flex-col gap-5">
            <div className="flex w-full items-center justify-between gap-10">
              <h2 className="text-xl font-bold leading-[1.2] text-grey-900">
                Delete '{selectedTransaction?.name}'?
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
              Are you sure you want to delete this transaction? This action
              cannot be reversed, and all the data inside it will be removed
              forever.
            </p>
          </div>
          <div className="flex w-full flex-col items-center gap-5">
            <button
              onClick={() => {
                if (selectedTransaction) {
                  onDeleteTransaction(selectedTransaction);
                }
              }}
              className="flex w-full items-center justify-center rounded-lg bg-red py-4 text-sm font-bold leading-normal text-white"
            >
              Delete Transaction
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

export default DeleteTransactionModal;