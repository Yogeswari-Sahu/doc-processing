import { useState } from "react";

export default function LineItemTable({ po, onChange }: { po: any; onChange: (p: any) => void }) {
  const [localPO, setLocalPO] = useState(po);

  const handleLineEdit = (idx: number, field: string, value: any) => {
    const copy = { ...localPO };
    copy.line_items[idx][field] = value;
    setLocalPO(copy);
    onChange(copy);
  };

  return (
    <table className="w-full border mt-6 bg-white shadow-md rounded-xl">
      <thead>
        <tr className="bg-gray-50 text-left">
          <th className="p-2">Description</th>
          <th className="p-2">Qty</th>
          <th className="p-2">SKU</th>
          <th className="p-2">Product Name</th>
          <th className="p-2">Score</th>
        </tr>
      </thead>
      <tbody>
        {localPO.line_items.map((li: any, i: number) => (
          <tr key={i} className="border-t">
            <td className="p-2">
              <input
                className="w-full"
                value={li.description}
                onChange={(e) => handleLineEdit(i, "description", e.target.value)}
              />
            </td>
            <td className="p-2">
              <input
                type="number"
                className="w-20"
                value={li.quantity}
                onChange={(e) => handleLineEdit(i, "quantity", +e.target.value)}
              />
            </td>
            <td className="p-2">
              <input
                className="w-full"
                value={li.match_sku ?? ""}
                onChange={(e) => handleLineEdit(i, "match_sku", e.target.value)}
              />
            </td>
            <td className="p-2">
              <input
                className="w-full"
                value={li.match_name ?? ""}
                onChange={(e) => handleLineEdit(i, "match_name", e.target.value)}
              />
            </td>
            <td className="p-2 text-right">{(li.match_score ?? 0).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
