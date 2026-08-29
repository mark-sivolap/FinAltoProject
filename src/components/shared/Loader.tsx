"use client";

export default function LoaderComponent(props: { type?: string }) {
  const text =
    props.type === "authenticate"
      ? "Authenticating user..."
      : "Loading...";

  return (
    <div className="card" style={{ textAlign: "center" }}>
      <p>{text}</p>
    </div>
  );
}
