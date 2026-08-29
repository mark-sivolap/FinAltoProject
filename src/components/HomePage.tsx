"use client";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="card">
      <h1>Home</h1>
      <p>
        Add a new screen by creating <code>src/app/&lt;feature&gt;/page.tsx</code>{" "}
        that renders <code>src/components/&lt;Feature&gt;/Main.tsx</code>.
      </p>
      <p>
        <Link href="/example">Open the example feature</Link>
      </p>
    </div>
  );
}
