import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import ProcessOrder from "./pages/ProcessOrder";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* landing screen  ───────────────────────── */}
        <Route
          path="/"
          element={
            <div className="h-screen flex flex-col items-center justify-center gap-8 bg-gray-50">
              <h1 className="text-4xl font-bold">Endeavor AI – PO Matcher</h1>

              {/* ←── the button you asked for */}
              <Link
                to="/process-order"
                className="rounded-xl bg-blue-600 px-6 py-3 text-white text-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                New Purchase Order
              </Link>
            </div>
          }
        />

        {/* 3-tab Upload ▸ Extract ▸ Match page ───── */}
        <Route path="/process-order" element={<ProcessOrder />} />

        {/* anything else → home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
