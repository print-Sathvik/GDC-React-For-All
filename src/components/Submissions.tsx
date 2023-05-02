/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";
import { Link, navigate } from "raviger";
import { Submission, allSubmissions } from "../types/formTypes";
import { getSubmissions } from "../utils/apiUtils";
import { EyeIcon } from "@heroicons/react/24/outline";

const fetchSubmissions = async (
  form_id: number,
  setSubmissionsCB: (value: allSubmissions) => void
) => {
  try {
    let parsedResponse = await getSubmissions(form_id);
    setSubmissionsCB(parsedResponse);
  } catch (error) {
    console.log(error);
  }
};

export default function Submissions(props: { id: number }) {
  const [submissions, setSubmissions] = useState<allSubmissions>({
    count: 0,
    results: [],
  });

  useEffect(() => {
    fetchSubmissions(props.id, setSubmissions);
  }, []);

  const openForm = useCallback(
    (e: KeyboardEvent) => {
      if (
        "123456789".includes(e.key) &&
        submissions.results.length >= Number(e.key)
      ) {
        navigate(
          `/forms/${props.id}/submission/${
            submissions.results[Number(e.key) - 1].id
          }`
        );
      } else if (e.shiftKey && e.code === "KeyN") {
        navigate(`/forms/${props.id}/submission/new`);
      } else if (e.key === "Escape") navigate("/");
    },
    [submissions]
  );

  useEffect(() => {
    document.addEventListener("keydown", openForm);
    return () => {
      document.removeEventListener("keydown", openForm);
    };
  }, [openForm, submissions]);

  return (
    //This renders list of submissions for the form id in url
    <div>
      <div className="divide-y-2">
        {submissions.results?.map((submission: Submission, ind: number) => (
          <div key={ind + 1} className="flex">
            <h2 className="py-4 px-2 ml-4 flex-1">
              Submission ID: {submission.id}
            </h2>
            <Link
              href={`/forms/${props.id}/submission/${submission.id}`}
              className="p-2 my-2 mr-2"
            >
              <EyeIcon className="w-6 h-6" />
            </Link>
          </div>
        ))}
      </div>
      <div className="text-center my-2">
        <button
          onClick={(_) => navigate(`/forms/${props.id}/submission/new`)}
          className="bg-blue-600 hover:bg-blue-800 text-white font-bold p-2 my-4 rounded"
        >
          New Submission
        </button>
      </div>
    </div>
  );
}
