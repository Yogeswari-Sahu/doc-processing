import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function FileDropZone({ onFile }: { onFile: (f: File) => void }) {
  const onDrop = useCallback(
    (accepted: File[]) => accepted[0] && onFile(accepted[0]),
    [onFile]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "application/pdf": [] } });
  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed rounded-xl p-8 text-center bg-white shadow-md cursor-pointer"
    >
      <input {...getInputProps()} />
      {isDragActive ? "Drop the PDF here…" : "Drag ’n’ drop a PDF here, or click to select"}
    </div>
  );
}
