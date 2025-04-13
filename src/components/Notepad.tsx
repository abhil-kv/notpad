import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Download, Link as LinkIcon, File as FileIcon, Text, Type, Palette, Heading, Strikethrough, Subscript, Superscript } from "lucide-react";
import { Document, Packer, Paragraph, HeadingLevel } from "docx";
import saveAs from "file-saver";
import { blockTypeMap, fontSizeOptions, fontColorOptions, fontStyleOptions, headingOptions } from "../constants/notpadConstants";
import "./style.css";

interface NotepadProps {
  onSave?: (content: string) => void;
}

const Notepad = ({}: NotepadProps) => {
  const [content, setContent] = useState<string>("");
  const [selectedFontSize, setSelectedFontSize] = useState<string | null>(null);
  const [selectedFontColor, setSelectedFontColor] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(false);
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({
    bold: false,
    italic: false,
    underline: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
    insertUnorderedList: false,
    insertOrderedList: false,
  });
  const [currentBlockType, setCurrentBlockType] = useState<string>("p");

  useEffect(() => {
    isMounted.current = true;
    const editorNode = editorRef.current;
    if (!editorNode) return;
    try {
      const savedContent = localStorage.getItem("notebook-app-notepadContent");
      if (savedContent && editorRef.current) {
        setContent(savedContent);
        editorRef.current.innerHTML = savedContent;
      }
    } catch (error) {
      console.error("Error loading content from localStorage:", error);
    }
    const handleLinkClick = (e: MouseEvent) => {
      let target = e.target as HTMLElement | null;
      while (target && target !== editorNode) {
        if (target.tagName === "A") {
          e.preventDefault();
          window.open((target as HTMLAnchorElement).href, "_blank");
          break;
        }
        target = target.parentElement;
      }
    };
    editorNode.addEventListener("click", handleLinkClick);
    return () => {
      isMounted.current = false;
      editorNode.removeEventListener("click", handleLinkClick);
    };
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      try {
        localStorage.setItem("notebook-app-notepadContent", content);
      } catch (error) {
        console.error("Error saving content to localStorage:", error);
      }
    }
  }, [content]);

  const handleExecCommand = (command: string, value: string = "") => {
    if (editorRef.current) {
      editorRef.current.focus();
      try {
        document.execCommand("styleWithCSS", false, "true");
      } catch (error) {
        console.error("Error setting styleWithCSS:", error);
      }
      try {
        document.execCommand(command, false, value);
      } catch (error) {
        console.error("Error during execCommand:", error);
      }
      updateToolbarState();
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleDownload = async () => {
    const currentContent = editorRef.current?.innerHTML || "";
    if (!currentContent.trim()) {
      alert("No content available to download.");
      return;
    }
    const container = document.createElement("div");
    container.innerHTML = currentContent;
    const paragraphs = [];
    for (let i = 0; i < container.children.length; i++) {
      const child = container.children[i];
      const text = child.textContent ? child.textContent.trim() : "";
      if (text) {
        let heading;
        switch (child.tagName.toLowerCase()) {
          case "h1":
            heading = HeadingLevel.HEADING_1;
            break;
          case "h2":
            heading = HeadingLevel.HEADING_2;
            break;
          case "h3":
            heading = HeadingLevel.HEADING_3;
            break;
          case "h4":
            heading = HeadingLevel.HEADING_4;
            break;
          case "h5":
            heading = HeadingLevel.HEADING_5;
            break;
          case "h6":
            heading = HeadingLevel.HEADING_6;
            break;
          default:
            heading = undefined;
        }
        paragraphs.push(new Paragraph({ text: text, heading: heading }));
      }
    }
    if (paragraphs.length === 0) {
      const plainText = container.textContent ? container.textContent.trim() : "";
      paragraphs.push(new Paragraph({ text: plainText }));
    }
    const doc = new Document({ sections: [{ children: paragraphs }] });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "my-notes.docx");
  };

  const handleInsertLink = () => {
    const url = prompt("Enter URL:", "http://");
    if (url) handleExecCommand("createLink", url);
  };

  const handleLoadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editorRef.current) {
      try {
        const text = await file.text();
        editorRef.current.innerHTML = text;
        setContent(text);
        updateToolbarState();
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }
    if (event.target) {
      event.target.value = "";
    }
  };

  const updateToolbarState = useCallback(() => {
    if (!editorRef.current || document.activeElement !== editorRef.current)
      return;
    const newActiveFormats: Record<string, boolean> = {};
    let blockType = "p";
    let textAlign = "left";
    try {
      newActiveFormats["bold"] = document.queryCommandState("bold");
      newActiveFormats["italic"] = document.queryCommandState("italic");
      newActiveFormats["underline"] = document.queryCommandState("underline");
      newActiveFormats["strikethrough"] = document.queryCommandState("strikethrough");
      newActiveFormats["subscript"] = document.queryCommandState("subscript");
      newActiveFormats["superscript"] = document.queryCommandState("superscript");
    
      newActiveFormats["insertUnorderedList"] = document.queryCommandState("insertUnorderedList");
      newActiveFormats["insertOrderedList"] = document.queryCommandState("insertOrderedList");
      const fs = document.queryCommandValue("fontSize");
      const fc = document.queryCommandValue("foreColor");
      setSelectedFontSize(fs);
      setSelectedFontColor(fc);
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        let node = selection.getRangeAt(0).startContainer;
        if (node.nodeType === 3) node = node.parentNode as Node;
        while (node && node !== editorRef.current) {
          const nodeName = node.nodeName.toUpperCase();
          if (blockTypeMap[nodeName]) {
            blockType = blockTypeMap[nodeName].type;
            if (node instanceof HTMLElement) {
              const align =
                node.style.textAlign || window.getComputedStyle(node).textAlign;
              textAlign = ["center", "right", "justify"].includes(align)
                ? align
                : "left";
            }
            break;
          }
          node = node.parentNode as Node;
        }
      }
    } catch (error) {
      console.error("Error querying command state:", error);
      blockType = "p";
      textAlign = "left";
    }
    newActiveFormats["justifyLeft"] = textAlign === "left";
    newActiveFormats["justifyCenter"] = textAlign === "center";
    newActiveFormats["justifyRight"] = textAlign === "right";
    setActiveFormats(newActiveFormats);
    setCurrentBlockType(blockType);
  }, []);

  useEffect(() => {
    const editorNode = editorRef.current;
    if (!editorNode) return;
    const handleSelectionChange = () => {
      if (document.activeElement === editorNode) updateToolbarState();
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    editorNode.addEventListener("focus", updateToolbarState);
    editorNode.addEventListener("blur", updateToolbarState);
    editorNode.addEventListener("keyup", updateToolbarState);
    editorNode.addEventListener("mouseup", updateToolbarState);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      if (editorNode) {
        editorNode.removeEventListener("focus", updateToolbarState);
        editorNode.removeEventListener("blur", updateToolbarState);
        editorNode.removeEventListener("keyup", updateToolbarState);
        editorNode.removeEventListener("mouseup", updateToolbarState);
      }
    };
  }, [updateToolbarState]);

  const handleFontSize = (size: string) => {
    handleExecCommand("fontSize", size);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleFontColor = (color: string) => {
    handleExecCommand("foreColor", color);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleFontFamily = (family: string) => {
    handleExecCommand("fontName", family);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const formattingActions = [
    { name: "loadFile", handleClick: () => {}, icon: <FileIcon className="h-4 w-4" />, tooltip: "Load File" },
    { type: "separator" },
    { name: "bold", handleClick: () => handleExecCommand("bold"), icon: <Bold className="h-4 w-4" />, tooltip: "Bold" },
    { name: "italic", handleClick: () => handleExecCommand("italic"), icon: <Italic className="h-4 w-4" />, tooltip: "Italic" },
    { name: "underline", handleClick: () => handleExecCommand("underline"), icon: <Underline className="h-4 w-4" />, tooltip: "Underline" },
    { name: "strikethrough", handleClick: () => handleExecCommand("strikethrough"), icon: <Strikethrough className="h-4 w-4" />, tooltip: "Strikethrough" },
    { name: "subscript", handleClick: () => handleExecCommand("subscript"), icon: <Subscript className="h-4 w-4" />, tooltip: "Subscript" },
    { name: "superscript", handleClick: () => handleExecCommand("superscript"), icon: <Superscript className="h-4 w-4" />, tooltip: "Superscript" },
    { type: "separator" },
    { name: "justifyLeft", handleClick: () => handleExecCommand("justifyLeft"), icon: <AlignLeft className="h-4 w-4" />, tooltip: "Align Left" },
    { name: "justifyCenter", handleClick: () => handleExecCommand("justifyCenter"), icon: <AlignCenter className="h-4 w-4" />, tooltip: "Align Center" },
    { name: "justifyRight", handleClick: () => handleExecCommand("justifyRight"), icon: <AlignRight className="h-4 w-4" />, tooltip: "Align Right" },
    { type: "separator" },
    { name: "insertUnorderedList", handleClick: () => handleExecCommand("insertUnorderedList"), icon: <List className="h-4 w-4" />, tooltip: "Bullet List" },
    { name: "insertOrderedList", handleClick: () => handleExecCommand("insertOrderedList"), icon: <ListOrdered className="h-4 w-4" />, tooltip: "Numbered List" },
    { type: "separator" },
    { name: "createLink", handleClick: handleInsertLink, icon: <LinkIcon className="h-4 w-4" />, tooltip: "Insert Link" },
    { name: "download", handleClick: handleDownload, icon: <Download className="h-4 w-4" />, tooltip: "Download as DOCX" },
    { type: "separator" },
    {
      name: "fontSize",
      type: "dropdown",
      icon: <Heading className="h-4 w-4" />,
      tooltip: "Font Size",
      options: fontSizeOptions,
      handleSelect: handleFontSize,
      labelKey: "label",
      valueKey: "size",
      active: selectedFontSize !== null,
    },
    {
      name: "fontColor",
      type: "dropdown",
      icon: <Palette className="h-4 w-4" />,
      tooltip: "Font Color",
      options: fontColorOptions,
      handleSelect: handleFontColor,
      labelKey: "label",
      valueKey: "color",
      showColorSwatch: true,
      active: selectedFontColor !== null,
    },
    { name: "fontFamily", type: "dropdown", icon: <Type className="h-4 w-4" />, tooltip: "Font Style", options: fontStyleOptions, handleSelect: handleFontFamily, labelKey: "label", valueKey: "family" },
  ];

  formattingActions[0].handleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt,.md,.html";
    input.onchange = handleLoadFile;
    input.click();
  };

  const CurrentBlockIcon = blockTypeMap[currentBlockType.toUpperCase()]?.icon || Text;
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setContent(e.currentTarget.innerHTML);
  };

  return (
    <div className="flex flex-col h-full w-full bg-amber-50 overflow-hidden">
      <Card className="p-2 rounded-none border-b shadow-sm bg-white sticky top-0 z-20">
        <div className="flex flex-wrap items-center gap-1">
          <TooltipProvider>
            {formattingActions.map((action, index) =>
              action.type === "separator" ? (
                <Separator key={`separator-${index}`} orientation="vertical" className="h-6 mx-1 self-center" />
              ) : action.type === "dropdown" ? (
                <DropdownMenu key={action.name || `action-${index}`}>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant={
                            action.name === "fontSize"
                              ? selectedFontSize ? "secondary" : "ghost"
                              : action.name === "fontColor"
                              ? selectedFontColor
                                ? "secondary"
                                : "ghost"
                              : activeFormats[action.name]
                              ? "secondary"
                              : "ghost"
                          }
                          size="sm"
                          className="h-8 w-8 p-0"
                          aria-label={action.tooltip}
                        >
                          {action.name === "fontColor" && selectedFontColor
                            ? <div style={{ backgroundColor: selectedFontColor, borderRadius: "2px", height: "16px", width: "16px" }} />
                            : action.icon}
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{action.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                  <DropdownMenuContent align="start">
                    {action.options?.map((option: any) => (
                      <DropdownMenuItem
                        key={option[action.valueKey]}
                        onSelect={() => action.handleSelect(option[action.valueKey])}
                        className="flex items-center"
                      >
                        {action.showColorSwatch && (
                          <div
                            className="h-4 w-4 mr-2 rounded-sm border border-gray-300"
                            style={{ backgroundColor: option[action.valueKey] }}
                          />
                        )}
                        <span style={action.name === "fontFamily" ? { fontFamily: option[action.valueKey] } : {}}>
                          {option[action.labelKey]}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Tooltip key={action.name || `action-${index}`} delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeFormats[action.name] ? "secondary" : "ghost"}
                      size="sm"
                      onClick={action.handleClick}
                      className="h-8 w-8 p-0"
                      aria-label={action.tooltip}
                      aria-pressed={activeFormats[action.name]}
                    >
                      {action.icon}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{action.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              )
            )}
            <DropdownMenu onOpenChange={(open) => { if (open) updateToolbarState(); }}>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={currentBlockType !== "p" ? "secondary" : "ghost"}
                      size="sm"
                      className="h-8 w-8 p-0"
                      aria-label="Text formatting"
                    >
                      <CurrentBlockIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Text Format</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="start">
                {headingOptions.map((option) => (
                  <DropdownMenuItem key={option.label} onSelect={() => handleExecCommand(option.command, option.value)} className="flex items-center">
                    <option.icon className="h-4 w-4 mr-2" />
                    <span>{option.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipProvider>
        </div>
      </Card>
      <div className="flex-1 overflow-auto relative" style={{ lineHeight: "24px" }}>
        <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: "linear-gradient(to bottom, transparent 23px, #fde68a 24px)", backgroundSize: "100% 24px", top: "6px", left: "6px", right: "6px" }} aria-hidden="true" />
        <div
          className="min-h-full p-6 relative z-10 focus:outline-none whitespace-pre-wrap break-words notepad-editor-content"
          contentEditable
          ref={editorRef}
          onInput={handleInput}
          style={{ outline: "none" }}
          role="textbox"
          aria-multiline="true"
          suppressContentEditableWarning={true}
        />
      </div>
    </div>
  );
};

export default Notepad;
