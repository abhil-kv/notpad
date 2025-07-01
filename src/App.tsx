import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Notepad from "./components/Notepad";
import KanbanBoard from "./components/KanbanBoard";
import WordCounter from "./components/WordCounter";
import StringCompare from "./components/StringCompare";
import UnitConverter from "./components/UnitConverter";
import routes from "tempo-routes";
//import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    // <ThemeProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/notepad" replace />} />
            <Route path="/notepad" element={<Notepad />} />
            <Route path="/todo" element={<KanbanBoard />} />
            <Route path="/word-counter" element={<WordCounter />} />
            <Route path="/string-compare" element={<StringCompare />} />
            <Route path="/unit-converter" element={<UnitConverter />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </Layout>
      </Suspense>
  );
}

export default App;
