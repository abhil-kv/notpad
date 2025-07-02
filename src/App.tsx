import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Notepad from "./components/Notepad";
import KanbanBoard from "./components/KanbanBoard";
import WordCounter from "./components/WordCounter";
import StringCompare from "./components/StringCompare";
import UnitConverter from "./components/UnitConverter";
import JSONParser from "./components/JSONParser";
import RegexTester from "./components/RegexTester";
import JwtParser from "./components/JwtParser";
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
            <Route path="/json-parser" element={<JSONParser />} />
            <Route path="/regex-tester" element={<RegexTester />} />
            <Route path="/jwt-parser" element={<JwtParser />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </Layout>
      </Suspense>
  );
}

export default App;
