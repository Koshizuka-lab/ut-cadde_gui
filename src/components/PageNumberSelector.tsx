import { useMemo, useState } from "react";

export const PageNumberSelector = (props: {
  pageNumber: number; // 現在のページ番号
  setPageNumber: React.Dispatch<React.SetStateAction<number>>; // ページ番号を変更する関数
  displayCount: number;
  setDisplayCount: React.Dispatch<React.SetStateAction<number>>;
  dataCount: number;
}) => {
  const {
    pageNumber,
    setPageNumber,
    displayCount,
    setDisplayCount,
    dataCount,
  } = props;
  const maxPageNumber = useMemo(() => {
    return Math.ceil(dataCount / displayCount);
  }, [dataCount, displayCount]);
  const [open, setOpen] = useState<boolean>(false);
  const options = [5, 10, 20, 50];

  const pageNumbers = [];
  // ページ数が4個以下の場合は全て表示
  // 4個以上の場合は、現在のページの前後2個と、最初と最後のページを表示
  // 表示しているページと、最初と最後のページの間が2個以上ある場合は、...を表示
  if (maxPageNumber <= 4) {
    for (let i = 1; i <= maxPageNumber; i++) {
      pageNumbers.push(i);
    }
  } else if (pageNumber <= 3) {
    for (let i = 1; i <= 5; i++) {
      pageNumbers.push(i);
    }
    pageNumbers.push(-1);
    pageNumbers.push(maxPageNumber);
  } else if (pageNumber >= maxPageNumber - 2) {
    pageNumbers.push(1);
    pageNumbers.push(-1);
    for (let i = maxPageNumber - 4; i <= maxPageNumber; i++) {
      pageNumbers.push(i);
    }
  } else {
    pageNumbers.push(1);
    pageNumbers.push(-1);
    pageNumbers.push(pageNumber - 1);
    pageNumbers.push(pageNumber);
    pageNumbers.push(pageNumber + 1);
    pageNumbers.push(-1);
    pageNumbers.push(maxPageNumber);
  }

  return (
    <div className="flex flex-row flex-basis items-center w-full">
      <div className="basis-1/3" />
      <div className="basis-1/3 flex flex-row gap-2 justify-center">
        {pageNumber > 1 ? (
          <div className="bg-white border border-primary">
            <button
              className="w-8 h-8 pt-1"
              onClick={() => {
                if (pageNumber > 1) {
                  setPageNumber((prev) => prev - 1);
                }
              }}
            >
              <span className="material-symbols-outlined text-primary">
                keyboard_arrow_left
              </span>
            </button>
          </div>
        ) : (
          <div className="w-8 h-8" />
        )}
        {pageNumbers.map((num, index) => {
          if (num === -1)
            return (
              <div
                key={index}
                className="w-8 h-8 flex justify-center items-center text-primary"
              >
                ...
              </div>
            );
          const bgColor = num === pageNumber ? "bg-primary" : "bg-white";
          const textColor = num === pageNumber ? "text-white" : "text-primary";
          return (
            <div
              className={`border border-primary ${bgColor} ${textColor}`}
              key={index}
            >
              <button
                className="w-8 h-8 font-inter font-bold"
                onClick={() => {
                  setPageNumber(num);
                }}
              >
                {num}
              </button>
            </div>
          );
        })}
        {pageNumber < maxPageNumber ? (
          <div className="bg-white border border-primary">
            <button
              className="w-8 h-8 pt-1"
              onClick={() => {
                if (pageNumber < maxPageNumber) {
                  setPageNumber((prev) => prev + 1);
                }
              }}
            >
              <span className="material-symbols-outlined text-primary">
                keyboard_arrow_right
              </span>
            </button>
          </div>
        ) : (
          <div className="w-8 h-8" />
        )}
      </div>
      <div className="basis-1/3 flex flex-row gap-2 items-center justify-end">
        <div className="font-inter">Displayed Results</div>
        <div className="flex flex-row relative">
          <div className="flex flex-col justify-center items-center border border-primary w-16 h-8 font-inter">
            {displayCount}
          </div>
          <button
            className="w-8 h-8 font-bold material-symbols-outlined text-white bg-primary"
            onClick={() => {
              setOpen(!open);
            }}
          >
            expand_more
          </button>
          {open && (
            <div className="absolute top-9 left-0 w-24 bg-white border border-gray shadow-md">
              {options.map((option, index) => {
                const text =
                  option === displayCount ? "text-white" : "text-black";
                const bg = option === displayCount ? "bg-primary" : "bg-white";
                const hover =
                  option === displayCount
                    ? ""
                    : "hover:bg-primary hover:bg-opacity-10";
                return (
                  <div
                    className={`w-full h-10 flex justify-start items-center font-inter px-5 cursor-pointer ${text} ${bg} ${hover}`}
                    key={index}
                    onClick={() => {
                      setDisplayCount(option);
                      setPageNumber(1);
                      setOpen(false);
                    }}
                  >
                    {option}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
