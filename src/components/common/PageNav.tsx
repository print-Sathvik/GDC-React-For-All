/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon,
} from "@heroicons/react/20/solid";
import React, { useState } from "react";

export default function PageNav(props: {
  offSet: number;
  limit: number;
  count: number;
  setOffsetCB: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [start, setStart] = useState<number>(1);

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
              {Math.min(props.offSet + props.limit, props.count)}
            </span>{" "}
            of <span className="font-medium">{props.count}</span> results
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
                  console.log(start);
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
                  Math.ceil(props.count / props.limit) &&
                  props.setOffsetCB(props.offSet + props.limit);
                if (
                  props.offSet >= props.limit * 2 &&
                  start <= Math.ceil(props.count / props.limit) - 3
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
                setStart(Math.ceil(props.count / props.limit) - 2);
                props.setOffsetCB(
                  Math.ceil((props.count - props.limit) / props.limit) *
                    props.limit
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
