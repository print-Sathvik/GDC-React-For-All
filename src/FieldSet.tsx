import React from "react";
import "./styles.css";

export default function FieldSet(props: {
  id: number;
  type: string;
  label: string;
}) {
  return (
    <div key={props.id} className="inputSet relative w-full mt-[35px]">
      <input type={props.type} required={true} />
      <label>{props.label}</label>
      <i></i>
    </div>
  );
}
