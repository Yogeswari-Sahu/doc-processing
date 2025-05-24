import FileDropZone from "../components/FileDropZone";

export default function UploadStep({
  onFile,
  loading,
}: {
  onFile: (f: File) => void;
  loading: boolean;
}) {
  return (
    <div className="flex h-full">
      {/* LEFT – drop-zone */}
      <div className="flex-1 border-dashed border-2 m-6 rounded-xl flex items-center">
        <div className="w-full">
          <FileDropZone onFile={onFile} />
        </div>
      </div>

      {/* RIGHT – PO meta form (read-only for now) */}
      <div className="w-[420px] p-6 space-y-4 border-l bg-gray-50">
        <h2 className="text-xl font-semibold">Purchase Order Information</h2>

        <Field label="Request ID">
          <input disabled placeholder="Generated on upload" className="input" />
        </Field>

        <Field label="Extract Delivery Address">
          <input disabled placeholder="Address" className="input" />
        </Field>

        <Field label="Extract PO Date">
          <input disabled placeholder="Date" className="input" />
        </Field>

        <div className="flex gap-4 pt-4">
          <button
            disabled
            className="btn bg-emerald-600 text-white flex-1 opacity-50 cursor-not-allowed"
          >
            + Add Extract Field
          </button>
          <button disabled className="btn flex-1 opacity-50 cursor-not-allowed">
            Clear
          </button>
        </div>

        <button
          disabled
          className="btn flex w-full bg-slate-400 text-white opacity-50 cursor-not-allowed"
        >
          {loading ? "Uploading…" : "Confirm Details"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600">{label}</label>
      {children}
    </div>
  );
}
