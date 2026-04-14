"use client";

import { useState } from "react";
import { Upload, FileText, X, Check } from "lucide-react";

interface ExamUploaderProps {
  courseId: string;
  onUploadComplete: () => void;
}

interface UploadedFile {
  name: string;
  status: "uploading" | "done" | "error";
  error?: string;
}

export function ExamUploader({ courseId, onUploadComplete }: ExamUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  function handleDrag(e: React.DragEvent, entering: boolean) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(entering);
  }

  async function processFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;

    const newFiles = Array.from(fileList).map((f) => ({
      name: f.name,
      status: "uploading" as const,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("courseId", courseId);
      formData.append("type", "exam");

      try {
        const res = await fetch("/api/materials", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          setFiles((prev) =>
            prev.map((f) =>
              f.name === file.name ? { ...f, status: "done" } : f
            )
          );
        } else {
          setFiles((prev) =>
            prev.map((f) =>
              f.name === file.name
                ? { ...f, status: "error", error: "שגיאה בהעלאה" }
                : f
            )
          );
        }
      } catch {
        setFiles((prev) =>
          prev.map((f) =>
            f.name === file.name
              ? { ...f, status: "error", error: "שגיאת רשת" }
              : f
          )
        );
      }
    }

    onUploadComplete();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    processFiles(e.dataTransfer.files);
  }

  function removeFile(name: string) {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  }

  return (
    <div>
      {/* Drop Zone */}
      <div
        onDragEnter={(e) => handleDrag(e, true)}
        onDragLeave={(e) => handleDrag(e, false)}
        onDragOver={(e) => handleDrag(e, true)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
          dragActive
            ? "border-primary-400 bg-primary-50"
            : "border-cream-400 hover:border-primary-300"
        }`}
      >
        <Upload className="w-14 h-14 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-primary-700 mb-2">
          העלאת מבחנים קודמים
        </h3>
        <p className="text-gray-500 mb-4">
          גרור קבצי PDF לכאן או לחץ לבחירה
        </p>
        <input
          type="file"
          className="hidden"
          id="exam-upload"
          accept=".pdf"
          multiple
          onChange={(e) => processFiles(e.target.files)}
        />
        <label
          htmlFor="exam-upload"
          className="btn-primary inline-block cursor-pointer"
        >
          בחר קבצים
        </label>
      </div>

      {/* Upload Progress */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file) => (
            <div
              key={file.name}
              className="flex items-center justify-between p-3 bg-cream-100 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary-500" />
                <span className="text-sm font-medium text-primary-700">
                  {file.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {file.status === "uploading" && (
                  <div className="w-5 h-5 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                )}
                {file.status === "done" && (
                  <Check className="w-5 h-5 text-green-500" />
                )}
                {file.status === "error" && (
                  <span className="text-xs text-red-500">{file.error}</span>
                )}
                <button
                  onClick={() => removeFile(file.name)}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
