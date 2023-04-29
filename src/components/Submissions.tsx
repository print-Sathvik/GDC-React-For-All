/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Link, navigate } from "raviger";
import { Submission, allSubmissions } from "../types/formTypes";
import { getSubmissions } from "../utils/apiUtils";
import { EyeIcon } from "@heroicons/react/24/outline";

const fetchSubmissions = async (
  form_id: number,
  setSubmissionsCB: (value: allSubmissions) => void
) => {
  try {
    const parsedResponse = await getSubmissions(form_id);
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

  return (
    //This renders list of submissions for the form id in url
    <div>
      <div className="divide-y-2">
        {submissions.results?.map((submission: Submission) => (
          <div key={submission.id} className="flex">
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
