import usePagination from "@mui/material/usePagination";
import iconCaretLeft from "../../assets/images/icon-caret-left.svg";
import iconCaretRight from "../../assets/images/icon-caret-right.svg";

interface TransactionsPaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  scrollToTop: () => void;
}

const TransactionsPagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
  scrollToTop,
}: TransactionsPaginationProps) => {
  const { items } = usePagination({
    count: totalPages,
    page: currentPage,
    onChange: (_, page) => {
      setCurrentPage(page);
      scrollToTop();
    },
  });

  return (
    <nav>
      <ul className="flex items-center justify-between">
        <li>
          <button
            type="button"
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
                scrollToTop();
              }
            }}
            disabled={currentPage === 1}
            className="mr-4 flex h-10 w-12 items-center justify-center rounded-lg border border-solid border-beige-500 disabled:cursor-not-allowed disabled:opacity-80"
          >
            <img src={iconCaretLeft} alt="Previous Page" />
          </button>
        </li>

        <div className="flex flex-1 justify-center gap-2">
          {items.map(({ page, type, selected, ...item }, index) => {
            let children = null;

            if (type === "start-ellipsis" || type === "end-ellipsis") {
              children = (
                <span className="flex h-10 w-10 items-center justify-center">
                  ...
                </span>
              );
            } else if (type === "page") {
              children = (
                <button
                  type="button"
                  style={{
                    fontWeight: selected ? "bold" : undefined,
                  }}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border border-solid border-beige-500 ${
                    selected
                      ? "bg-grey-900 text-white"
                      : "bg-white text-grey-900"
                  }`}
                  {...item}
                >
                  {page}
                </button>
              );
            } else {
              return null;
            }

            return <li key={index}>{children}</li>;
          })}
        </div>

        <li>
          <button
            type="button"
            onClick={() => {
              if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1);
                scrollToTop();
              }
            }}
            disabled={currentPage === totalPages}
            className="ml-4 flex h-10 w-12 items-center justify-center rounded-lg border border-solid border-beige-500 disabled:cursor-not-allowed disabled:opacity-80"
          >
            <img src={iconCaretRight} alt="Next Page" />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default TransactionsPagination;
