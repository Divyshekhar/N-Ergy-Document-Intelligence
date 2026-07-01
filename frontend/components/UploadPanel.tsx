"use client";

import { useRef, useState } from "react";
import { FileText, Loader2, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import { uploadDocuments } from "@/lib/api";

interface UploadedDoc {
  name: string;
  size: number;
}

export default function UploadPanel() {
  const [pending, setPending] = useState<File[]>([]);
  const [uploaded, setUploaded] = useState<UploadedDoc[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const pdfFiles = Array.from(fileList).filter((file) =>
      file.name.toLowerCase().endsWith(".pdf")
    );
    if (pdfFiles.length !== fileList.length) {
      toast.error("Only PDF files are supported — skipped the rest.");
    }
    if (pdfFiles.length > 0) {
      setPending((prev) => [...prev, ...pdfFiles]);
    }
  }

  function removePending(index: number) {
    setPending((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleUpload() {
    if (pending.length === 0) return;
    setIsUploading(true);
    try {
      const result = await uploadDocuments(pending);
      toast.success(
        `${result.documents_processed} document${result.documents_processed === 1 ? "" : "s"} processed`
      );
      setUploaded((prev) => [
        ...prev,
        ...pending.map((file) => ({ name: file.name, size: file.size })),
      ]);
      setPending([]);
    } catch (err) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail ?? "Upload failed. Please try again.";
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div>
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Documents
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Upload PDFs to ask questions about them.
        </p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => {inputRef.current?.click()}}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          isDragging
            ? "border-zinc-900 bg-zinc-100 dark:border-zinc-100 dark:bg-zinc-800"
            : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600"
        }`}
      >
        <Upload className="h-5 w-5 text-zinc-500" />
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          Drag &amp; drop PDFs, or click to browse
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {pending.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-zinc-500">Ready to upload</p>
          <ul className="flex flex-col gap-1">
            {pending.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between gap-2 rounded-md bg-zinc-100 px-2 py-1.5 text-xs dark:bg-zinc-800"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <FileText className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                  <span className="truncate">{file.name}</span>
                </span>
                <button
                  type="button"
                  onClick={() => removePending(index)}
                  className="shrink-0 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="flex items-center justify-center gap-2 rounded-md bg-zinc-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {isUploading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {isUploading
              ? "Uploading..."
              : `Upload ${pending.length} file${pending.length === 1 ? "" : "s"}`}
          </button>
        </div>
      )}

      {uploaded.length > 0 && (
        <div className="flex flex-col gap-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
          <p className="text-xs font-medium text-zinc-500">
            Ingested ({uploaded.length})
          </p>
          <ul className="flex flex-col gap-1 overflow-y-auto">
            {uploaded.map((doc, index) => (
              <li
                key={`${doc.name}-${index}`}
                className="flex items-center gap-1.5 truncate text-xs text-zinc-600 dark:text-zinc-400"
              >
                <FileText className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                <span className="truncate">{doc.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
