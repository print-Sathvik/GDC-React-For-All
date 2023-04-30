import React, { useEffect, useState } from "react";
import { Link, useQueryParams } from "raviger";
import { Form } from "../types/formTypes";
import Modal from "./common/Modal";
import CreateForm from "./CreateForm";
import { deleteForm, listForms, me } from "../utils/apiUtils";
import { Pagination } from "../types/common";
import PageNav from "./common/PageNav";
import { PencilSquareIcon } from "@heroicons/react/20/solid";
import { TrashIcon, EyeIcon } from "@heroicons/react/24/outline";

const fetchForms = async (
  offset: number,
  setFormsCB: (value: Form[]) => void
) => {
  try {
    const currentUser = await me();
    if (currentUser.username === "") {
      setFormsCB([]);
      return;
    }
    const parsedResponse: Pagination<Form> = await listForms({
      offset: offset,
      limit: 2,
    });
    setFormsCB(parsedResponse.results);
  } catch (error) {
    console.log(error);
    return false;
  }
};

const removeForm = async (formId: number) => {
  try {
    await deleteForm(formId);
    return true;
  } catch (error) {
    console.log(error);
  }
};

export default function Home() {
  const [savedFormsState, setFormsState] = useState<Form[]>([]);
  const [{ search }, setQuery] = useQueryParams();
  const [searchString, setSearchString] = useState("");
  const [newForm, setNewForm] = useState(false);
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    fetchForms(offset, setFormsState);
  }, [offset]);

  return (
    //This renders form title, edit and delte buttons and a button to create new form
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setQuery({ search: searchString });
        }}
      >
        <input
          type="text"
          name="search"
          value={searchString}
          placeholder="Search"
          onChange={(e) => setSearchString(e.target.value)}
          className="border-2 border-gray-400 rounded p-2 my-2 w-full flex-1"
        />
      </form>
      <div className="divide-y-2">
        {savedFormsState
          ?.filter((form: Form) =>
            form.title.toLowerCase().includes(search?.toLowerCase() || "")
          )
          .map((form: Form) => (
            <div key={form.id} className="flex">
              <h2 className="py-4 px-2 flex-1">
                {form.title || "Untitled Form"}
              </h2>
              <Link href={`/forms/${form.id}`} className="p-2 my-2">
                <PencilSquareIcon color="blue" className="w-6 h-6" />
              </Link>
              <Link href={`/submissions/${form.id}`} className="p-2 my-2">
                <EyeIcon className="w-6 h-6" />
              </Link>
              <button
                className="px-2 my-2"
                onClick={() => {
                  const deleteResult = form.id && removeForm(form.id);
                  if (deleteResult)
                    setFormsState(
                      savedFormsState.filter(
                        (savedForm) => form.id !== savedForm.id
                      )
                    );
                }}
              >
                <TrashIcon color="red" className="w-6 h-6" />
              </button>
            </div>
          ))}
      </div>
      <div className="text-center my-2">
        <button
          onClick={(_) => {
            setNewForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-800 text-white font-bold p-2 my-4 rounded"
        >
          New Form
        </button>
      </div>
      <PageNav offSet={offset} limit={2} setOffsetCB={setOffset} />
      <Modal open={newForm} closeCB={() => setNewForm(false)}>
        <CreateForm closeCB={() => setNewForm(false)} />
      </Modal>
    </div>
  );
}
