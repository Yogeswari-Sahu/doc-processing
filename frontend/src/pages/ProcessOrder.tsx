import { useState } from "react";
import { Tab } from "@headlessui/react";
import clsx from "clsx";
import { uploadPDF, updatePO } from "../api";
import UploadStep from "./UploadStep";
import ExtractStep from "./ExtractStep";
import MatchStep from "./MatchStep";

export default function ProcessOrder() {
  const [po, setPO] = useState<any | null>(null);     // entire purchase-order object
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // === upload the PDF and flip to “Extract” =========================
  const handleUpload = async (f: File) => {
    setFile(f);
    setLoading(true);
    try {
      const data = await uploadPDF(f);
      setPO(data);
      setSelectedIndex(1);
    } finally {
      setLoading(false);
    }
  };

  // === persist edits made in Extract tab ============================
  const savePO = async (updated: any) => {
    const saved = await updatePO(updated);
    setPO(saved);
  };

  // === Tab handling =================================================
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="h-[calc(100vh-4rem)] w-screen overflow-hidden">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex space-x-8 px-10 py-4 border-b">
          {["Upload", "Extract", "Match"].map((t, i) => (
            <Tab
              key={i}
              className={({ selected }) =>
                clsx(
                  "px-2 pb-2 text-lg outline-none border-b-2",
                  selected ? "border-blue-600 font-semibold" : "border-transparent text-gray-500"
                )
              }
            >
              {t}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="h-full">
          <Tab.Panel className="h-full">
            <UploadStep onFile={handleUpload} loading={loading} />
          </Tab.Panel>

          <Tab.Panel className="h-full">
            <ExtractStep
              po={po}
              file={file}
              onPOChange={setPO}
              onSave={savePO}
              loading={loading}
            />
          </Tab.Panel>

          <Tab.Panel className="h-full">
            <MatchStep
                po={po}
                onPOChange={setPO}
                onSave={savePO}
            />
            </Tab.Panel>

        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
