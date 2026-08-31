"use client";

import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_STATEMENT_API_URL ||
  "http://localhost:7071/api";
const API_BASE = API_URL.replace(/\/$/, "");

const ACCEPTED_EXTENSIONS = [
  ".pdf",
  ".docx",
  ".png",
  ".jpg",
  ".jpeg",
  ".tiff",
  ".tif",
  ".bmp",
  ".heic",
];

function readableSize(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.ceil(bytes / 1024)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isAccepted(file: File) {
  const name = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((extension) => name.endsWith(extension));
}

function readBlobAsText(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read the error response."));
    reader.readAsText(blob);
  });
}

function submitStatements(
  files: File[],
  onProgress: (percent: number) => void,
): Promise<Blob> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("POST", `${API_BASE}/process-statements`);
    request.responseType = "blob";
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    request.onerror = () => reject(new Error("Could not reach the server."));
    request.onload = async () => {
      if (request.status >= 200 && request.status < 300) {
        resolve(request.response as Blob);
        return;
      }
      const message = await readBlobAsText(request.response as Blob);
      reject(new Error(message || `Request failed (${request.status}).`));
    };
    request.send(formData);
  });
}

export default function StatementUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);
  const totalBytes = useMemo(
    () => files.reduce((sum, file) => sum + file.size, 0),
    [files],
  );

  function addFiles(incoming: File[]) {
    setError("");
    setCompleted(false);
    const invalid = incoming.find((file) => !isAccepted(file));
    if (invalid) {
      setError(`${invalid.name} is not a supported bank statement file.`);
      return;
    }
    setFiles((current) => {
      const existing = new Set(
        current.map((file) => `${file.name}:${file.size}:${file.lastModified}`),
      );
      const combined = [
        ...current,
        ...incoming.filter(
          (file) =>
            !existing.has(`${file.name}:${file.size}:${file.lastModified}`),
        ),
      ];
      return combined;
    });
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(event.target.files || []));
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    if (!busy) addFiles(Array.from(event.dataTransfer.files));
  }

  async function processStatements() {
    if (!files.length || busy) return;
    setBusy(true);
    setProgress(0);
    setError("");
    setCompleted(false);
    try {
      const csv = await submitStatements(files, setProgress);
      const url = URL.createObjectURL(csv);
      const link = document.createElement("a");
      link.href = url;
      link.download = "transactions.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setCompleted(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setFiles([]);
    setProgress(0);
    setError("");
    setCompleted(false);
  }

  return (
    <main className="statement-shell">
      <section className="statement-hero">
        <span className="eyebrow">Bank statement intelligence</span>
        <p>
          Drop your bank statements and receive one spreadsheet-ready CSV of
          every transaction.
        </p>
      </section>

      <section className="upload-card" aria-busy={busy}>
        <div
          className={`drop-zone ${dragging ? "is-dragging" : ""}`}
          onDragEnter={(event) => {
            event.preventDefault();
            if (!busy) setDragging(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node))
              setDragging(false);
          }}
          onDrop={handleDrop}
          onClick={() => !busy && inputRef.current?.click()}
          role="button"
          tabIndex={busy ? -1 : 0}
          onKeyDown={(event) => {
            if (!busy && (event.key === "Enter" || event.key === " "))
              inputRef.current?.click();
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS.join(",")}
            multiple
            hidden
            onChange={handleInput}
          />
          <div className="upload-icon">
            <i className="pi pi-cloud-upload" />
          </div>
          <h2>{dragging ? "Drop statements here" : "Drag and drop bank statements"}</h2>
          <p>
            or <span>browse your files</span> · PDF, DOCX, PNG, JPG, TIFF, BMP, HEIC
          </p>
        </div>

        {files.length > 0 && (
          <div className="file-panel">
            <div className="file-summary">
              <div>
                <strong>
                  {files.length} statement{files.length === 1 ? "" : "s"}
                </strong>
                <span>{readableSize(totalBytes)} total</span>
              </div>
              {!busy && (
                <button type="button" onClick={reset}>
                  Clear all
                </button>
              )}
            </div>
            <ul className="file-list">
              {files.map((file, index) => (
                <li key={`${file.name}-${file.size}-${file.lastModified}`}>
                  <i className="pi pi-file" />
                  <div>
                    <strong>{file.name}</strong>
                    <span>{readableSize(file.size)}</span>
                  </div>
                  {!busy && (
                    <button
                      type="button"
                      aria-label={`Remove ${file.name}`}
                      onClick={() =>
                        setFiles((current) =>
                          current.filter((_, itemIndex) => itemIndex !== index),
                        )
                      }
                    >
                      <i className="pi pi-times" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && (
          <div className="message error-message" role="alert">
            <i className="pi pi-exclamation-circle" />
            {error}
          </div>
        )}
        {busy && (
          <div className="upload-progress">
            <div>
              <strong>Processing statements</strong>
              <span>{progress}%</span>
            </div>
            <div className="progress-track">
              <span style={{ width: `${progress}%` }} />
            </div>
            <p>This tab must stay open until the CSV is ready.</p>
          </div>
        )}
        {completed && (
          <div className="result-panel">
            <div className="success-mark">
              <i className="pi pi-check" />
            </div>
            <div>
              <h3>Your CSV was downloaded</h3>
              <p>The combined transaction data is ready to open.</p>
            </div>
          </div>
        )}
        <div className="action-row">
          {!completed ? (
            <button
              className="primary-button"
              type="button"
              disabled={!files.length || busy}
              onClick={() => void processStatements()}
            >
              <i className="pi pi-sparkles" />
              {busy ? "Processing…" : "Process statements"}
            </button>
          ) : (
            <button className="secondary-button" type="button" onClick={reset}>
              Process another batch
            </button>
          )}
        </div>
      </section>

    </main>
  );
}
