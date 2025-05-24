import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import LineItemTable from "../components/LineItemTable";
pdfjs.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function ExtractStep({
  po,
  file,
  onPOChange,
  onSave,
  loading,
}: {
  po: any;
  file: File | null;
  onPOChange: (p: any) => void;
  onSave: (p: any) => Promise<void>;
  loading: boolean;
}) {
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!po) return;
    setSaving(true);
    await onSave(po);
    setSaving(false);
    alert("Saved!");
  };

  return (
    <div className="flex h-full">
      {/* LEFT – PDF viewer */}
      <div className="flex-1 overflow-auto border-r">
        {file && (
          <Document file={file} className="mx-auto my-4">
            <Page pageNumber={1} scale={1.1} />
          </Document>
        )}
      </div>

      {/* RIGHT – extractor form + line-item grid */}
      <div className="w-[540px] flex flex-col">
        {/* header fields */}
        <div className="p-6 space-y-4 border-b">
          <Field label="Request ID">
            <input value={po?.id ?? ""} disabled className="input" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Extract Delivery Address">
              <input
                value={po?.delivery_address ?? "NA"}
                onChange={(e) =>
                  onPOChange({ ...po, delivery_address: e.target.value })
                }
                className="input"
              />
            </Field>

            <Field label="Extract PO Date">
              <input
                value={po?.po_date ?? ""}
                onChange={(e) => onPOChange({ ...po, po_date: e.target.value })}
                className="input"
              />
            </Field>
          </div>

          <Field label="Extract PO Number">
            <input
              value={po?.po_number ?? "NA"}
              onChange={(e) => onPOChange({ ...po, po_number: e.target.value })}
              className="input"
            />
          </Field>

          <button
            className="btn w-full bg-blue-600 text-white"
            onClick={save}
            disabled={!po || saving}
          >
            {saving ? "Saving…" : "Generate Mapping / Save"}
          </button>
        </div>

        {/* line-item table */}
        <div className="flex-1 overflow-auto">
          {loading && <p className="p-4">Loading items…</p>}
          {po && <LineItemTable po={po} onChange={onPOChange} />}
        </div>
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
