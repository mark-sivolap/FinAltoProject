"use client";
import { useContext, useState } from "react";
import { Button } from "primereact/button";
import { authContext } from "@/contexts/authContext";
import { examplePing } from "@/actions/example";

export default function Main() {
  const { token } = useContext(authContext);
  const [message, setMessage] = useState("");

  return (
    <div className="card">
      <h1>Example feature</h1>
      <p>
        This page lives at <code>/example</code>. The button calls{" "}
        <code>actions/example.ts</code>, which POSTs to{" "}
        <code>/api/example</code>.
      </p>
      <Button
        label="Call API"
        onClick={async () => {
          const data = await examplePing(token);
          setMessage(data.message);
        }}
      />
      {message && <p>{message}</p>}
    </div>
  );
}
