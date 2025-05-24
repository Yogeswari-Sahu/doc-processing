import { Dialog, Combobox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Search } from "lucide-react";
import clsx from "clsx";

// -----------------------------------------------------
// tiny util type
type CatItem = { sku: string; name: string };

export default function EditMatchModal({
  lineItem,
  onClose,
  onSelect,
  matchCount,
}: {
  lineItem: any;
  onClose: () => void;
  onSelect: (sku: string, name: string) => void;
  matchCount: number;
}) {
  /* ───────────────────────── state */
  const [catalog, setCatalog] = useState<CatItem[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<CatItem | null>(null);

  /* ───────────────────────── load CSV once */
  useEffect(() => {
    fetch("/product_catalog.csv")
      .then((r) => r.text())
      .then((txt) => {
        const rows = txt.split("\n");
        const clean: CatItem[] = [];
        rows.forEach((row) => {
          if (!row.includes(",") || row.startsWith("<") || !row.trim()) return;
          const [sku, ...rest] = row.split(",");
          clean.push({ sku: sku.trim(), name: rest.join(",").trim() });
        });
        setCatalog(clean);
      });
  }, []);

  /* ───────────────────────── filtered options */
  const filtered =
    query === ""
      ? catalog.slice(0, 15)
      : catalog.filter(
          (c) =>
            c.sku.toLowerCase().includes(query.toLowerCase()) ||
            c.name.toLowerCase().includes(query.toLowerCase())
        );

  /* ───────────────────────── jsx */
  return (
    <Transition appear show as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50" onClose={onClose}>
        {/* backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 bg-black/30" />
        </Transition.Child>

        {/* panel */}
        <div className="flex min-h-full items-start justify-center p-6">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-[600px] max-h-[90vh] overflow-y-auto rounded-xl bg-white p-8 shadow-xl space-y-6">
              {/* title */}
              <h2 className="text-3xl font-semibold">Edit Product Matching</h2>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">{matchCount}</span> line items have
                been matched.
              </p>

              {/* ─── Combobox ────────────────────────────── */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Top Product Catalog Matches
                </label>

                <Combobox
                    value={selected}
                    onChange={(c: CatItem | null) => {
                        if (!c) return;          // ← safely ignore the null case
                        setSelected(c);
                        onSelect(c.sku, c.name); // no more TS18047
                    }}
>

                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Combobox.Input
                      className="w-full border rounded-md pl-10 pr-3 py-2"
                      placeholder="Search product catalog…"
                      onChange={(e) => setQuery(e.target.value)}
                      displayValue={(c: CatItem) => (c ? `${c.sku}, ${c.name}` : "")}
                    />
                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black/5">
                      {filtered.map((opt) => (
                        <Combobox.Option
                          key={opt.sku}
                          value={opt}
                          className={({ active }) =>
                            clsx(
                              "cursor-pointer px-3 py-2",
                              active ? "bg-blue-600 text-white" : ""
                            )
                          }
                        >
                          <span className="font-medium">{opt.sku}</span>{" "}
                          <span className="text-gray-600 text-sm">{opt.name}</span>
                        </Combobox.Option>
                      ))}
                      {filtered.length === 0 && (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          No results
                        </div>
                      )}
                    </Combobox.Options>
                  </div>
                </Combobox>
              </div>

              {/* ─── Request item (read-only) ───────────── */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  REQUEST ITEM
                </label>
                <input
                  readOnly
                  value={lineItem.description}
                  className="w-full border rounded-md px-3 py-2 bg-gray-100"
                />
              </div>

              {/* ─── 2×2 grid for details ──────────────── */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="ITM" value={lineItem.itm ?? lineItem.id} />
                <Field label="Quantity" value={lineItem.quantity} />
                <Field label="UOM" value={lineItem.uom ?? "—"} />
                <Field label="Price/Unit" value={lineItem.unit_price ?? "—"} />
                <Field label="Amount" value={lineItem.total ?? "—"} />
              </div>

              {/* buttons */}
              <div className="flex justify-end gap-4">
                <button
                  onClick={onClose}
                  className="rounded-md border px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    selected
                      ? onSelect(selected.sku, selected.name)
                      : onClose()
                  }
                  className="rounded-md bg-blue-600 px-6 py-2 text-white"
                >
                  Keep Current
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

/* tiny helper */
function Field({ label, value }: { label: string; value: any }) {
  return (
    <div className="space-y-1">
      <span className="text-xs font-semibold text-gray-500">{label}</span>
      <div className="border rounded-md px-3 py-2 bg-gray-100">{value}</div>
    </div>
  );
}
