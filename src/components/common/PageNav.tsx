/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon,
} from "@heroicons/react/20/solid";
import React, { useCallback, useEffect, useState } from "react";
import { getFormsCount } from "../../utils/apiUtils";
import { LIMIT } from "../../types/common";

const initializeFormsCount = async (
  setCountCB: React.Dispatch<React.SetStateAction<number>>
) => {
  try {
    let count = await getFormsCount();
    setCountCB(count);
  } catch (error) {
    console.log(error);
  }
};

export default function PageNav(props: {
  offSet: number;
  limit: number;
  setOffsetCB: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [count, setCount] = useState<number>(0);
  const [start, setStart] = useState<number>(1);

  useEffect(() => {
    initializeFormsCount(setCount);
  }, []);

  const navForm = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        props.offSet + props.limit < count &&
          props.setOffsetCB(props.offSet + LIMIT);
        if (
          props.offSet >= props.limit * 2 &&
          start <= Math.ceil(count / props.limit) - 3
        )
          setStart(start + 1);
      } else if (e.key === "ArrowLeft") {
        props.offSet > 0 && props.setOffsetCB(props.offSet - LIMIT);
        if (props.offSet >= start && start > 1) setStart(start - 1);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [count, props]
  );

  useEffect(() => {
    document.addEventListener("keydown", navForm);

    return () => {
      document.removeEventListener("keydown", navForm);
    };
  }, [navForm]);

  const renderPgNo = () => {
    let allPageNos = [];
    for (let i = start; i <= start + 2; i++) {
      allPageNos.push(
        props.offSet / props.limit === i - 1 ? (
          <a
            onClick={(_) => props.setOffsetCB((i - 1) * props.limit)}
            key={i}
            aria-current="page"
            className="relative z-10 inline-flex items-center bg-blue-400 cursor-pointer px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {" "}
            {i}{" "}
          </a>
        ) : (
          <a
            onClick={(_) => props.setOffsetCB((i - 1) * props.limit)}
            key={i}
            className="relative inline-flex items-center cursor-pointer px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          >
            {" "}
            {i}{" "}
          </a>
        )
      );
    }
    return allPageNos;
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{props.offSet + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(props.offSet + props.limit, count)}
            </span>{" "}
            of <span className="font-medium">{count}</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <a
              onClick={(_) => {
                setStart(1);
                props.setOffsetCB(0);
              }}
              className="relative inline-flex items-center cursor-pointer rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
            </a>
            <a
              onClick={(_) => {
                props.offSet !== 0 &&
                  props.setOffsetCB(props.offSet - props.limit);
                if (props.offSet >= start && start > 1) {
                  setStart(start - 1);
                }
              }}
              className="relative inline-flex items-center cursor-pointer rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </a>
            {renderPgNo()}
            <a
              onClick={(_) => {
                Math.ceil((props.offSet + 1) / props.limit) <
                  Math.ceil(count / props.limit) &&
                  props.setOffsetCB(props.offSet + props.limit);
                if (
                  props.offSet >= props.limit * 2 &&
                  start <= Math.ceil(count / props.limit) - 3
                ) {
                  setStart(start + 1);
                }
              }}
              className="relative inline-flex items-center cursor-pointer rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </a>
            <a
              onClick={(_) => {
                setStart(Math.ceil(count / props.limit) - 2);
                props.setOffsetCB(
                  Math.ceil((count - props.limit) / props.limit) * props.limit
                );
              }}
              className="relative inline-flex items-center cursor-pointer rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Next</span>
              <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}
