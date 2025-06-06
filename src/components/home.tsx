import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Notepad from "./Notepad";
import KanbanBoard from "./KanbanBoard";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "backlog" | "pending" | "in-progress" | "completed";
  severity?: "low" | "medium" | "high" | "critical";
  isCompleted?: boolean;
}

const Home = () => {
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) {
      setActiveTab(savedTab);
    } else {
      setActiveTab("notepad");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 px-1 py-2 overflow-hidden flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 w-full overflow-hidden">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
            <TabsTrigger value="notepad" className="text-base">Notepad</TabsTrigger>
            <TabsTrigger value="todo" className="text-base">To-Do</TabsTrigger>
          </TabsList>

          <TabsContent value="notepad" className="flex-1 overflow-hidden">
            <Notepad />
          </TabsContent>

          <TabsContent value="todo" className="flex-1 overflow-hidden">
            <KanbanBoard />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="px-4 py-4 w-full text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Notebook App. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
