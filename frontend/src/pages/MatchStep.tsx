import { useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import EditMatchModal from "../components/EditMatchModal";

export default function MatchStep({
  po,
  onPOChange,
  onSave,
}: {
  po: any;
  onPOChange: (p: any) => void;
  onSave: (p: any) => Promise<void>;
}) {
  const [modalIdx, setModalIdx] = useState<number | null>(null);

  const replaceMatch = (idx: number, sku: string, name: string) => {
    const copy = { ...po };
    copy.line_items[idx].match_sku = sku;
    copy.line_items[idx].match_name = name;
    onPOChange(copy);
  };

  return (
    <div className="flex flex-col h-full">
      {/* save btn */}
      <div className="flex justify-end p-4">
        <button
          onClick={() => onSave(po)}
          className="btn bg-blue-600 text-white w-52"
        >
          Save Purchase Order
        </button>
      </div>

      {/* table */}
      <div className="flex-1 overflow-auto">
        <input
          className="input w-full max-w-md ml-4 mb-2"
          placeholder="Search mapped line items..."
        />

        <table className="w-full border-t">
          <thead className="text-left bg-gray-50">
            <tr>
              <th className="px-4 py-2">Request Item</th>
              <th className="px-4 py-2 w-1/2">Top Matches</th>
              <th className="px-4 py-2 w-20 text-right">ITM</th>
              <th className="px-4 py-2 w-32 text-right">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {po?.line_items.map((li: any, i: number) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{li.description}</td>
                <td
                  className="px-4 py-2 bg-blue-50 cursor-pointer"
                  onClick={() => setModalIdx(i)}
                >
                  <div className="flex items-center justify-between">
                    <span>{li.match_name || "—"}</span>
                    <PencilSquareIcon className="w-5 h-5 opacity-60" />
                  </div>
                </td>
                <td className="px-4 py-2 text-right">{li.itm ?? li.id}</td>
                <td className="px-4 py-2 text-right">
                  {li.quantity ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* modal */}
      {modalIdx !== null && (
        <EditMatchModal
            lineItem={po.line_items[modalIdx]}
            matchCount={po.line_items.length} // ← This fixes the error
            onClose={() => setModalIdx(null)}
            onSelect={(sku, name) => {
                replaceMatch(modalIdx, sku, name);
                setModalIdx(null);
            }}
            />
      )}
    </div>
  );
}
