import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Menu, FileText, CheckSquare, Calculator } from "lucide-react";
import Notepad from "./Notepad";
import KanbanBoard from "./KanbanBoard";
import WordCounter from "./WordCounter";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("notepad");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    // Determine active menu based on current route
    // if (location.pathname === "/todo") {
    //   setActiveMenu("todo");
    // } else if (location.pathname === "/word-counter") {
    //   setActiveMenu("word-counter");
    // } else {
    //   setActiveMenu("notepad");
    //   // If we're on the home route, redirect to notepad
    //   if (location.pathname === "/") {
    //     navigate("/notepad", { replace: true });
    //   }
    // }
  }, [location.pathname, navigate]);

  const handleMenuChange = (value: string) => {
    setActiveMenu(value);
    localStorage.setItem("activeMenu", value);
    navigate(`/${value === "notepad" ? "notepad" : value}`);
    setIsDrawerOpen(false);
  };

  const menuItems = [
    {
      id: "notepad",
      label: "Notepad",
      icon: <FileText className="h-5 w-5" />,
      component: <Notepad />,
    },
    {
      id: "todo",
      label: "To-Do App",
      icon: <CheckSquare className="h-5 w-5" />,
      component: <KanbanBoard />,
    },
    {
      id: "word-counter",
      label: "Word Counter",
      icon: <Calculator className="h-5 w-5" />,
      component: <WordCounter />,
    },
  ];

  const currentMenuItem = menuItems.find((item) => item.id === activeMenu);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gray-50">
      {/* Left Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 bg-white shadow-md hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-full w-80 rounded-none">
          <div className="flex flex-col h-full">
            {/* Drawer Header */}
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Notebook App</h2>
              <p className="text-sm text-gray-600 mt-1">
                Choose your workspace
              </p>
            </div>

            {/* Menu Items */}
            <div className="flex-1 p-4">
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeMenu === item.id ? "default" : "ghost"}
                    className="w-full justify-start gap-3 h-12"
                    onClick={() => handleMenuChange(item.id)}
                  >
                    {item.icon}
                    <span className="text-base">{item.label}</span>
                  </Button>
                ))}
              </nav>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                &copy; {new Date().getFullYear()} Notebook App
              </p>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm pl-16 pr-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                {currentMenuItem?.icon}
                {currentMenuItem?.label || "Notebook"}
              </h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        {/* <main className="flex-1 overflow-hidden">
          {currentMenuItem?.component || <Notepad />}
        </main> */}
      </div>
    </div>
  );
};

export default Home;