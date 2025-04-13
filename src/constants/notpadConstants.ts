import { Pilcrow, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6 } from "lucide-react";

export const blockTypeMap: Record<string, { type: string; icon: React.ElementType }> = {
  P: { type: "p", icon: Pilcrow },
  H1: { type: "h1", icon: Heading1 },
  H2: { type: "h2", icon: Heading2 },
  H3: { type: "h3", icon: Heading3 },
  H4: { type: "h4", icon: Heading4 },
  H5: { type: "h5", icon: Heading5 },
  H6: { type: "h6", icon: Heading6 },
};

export const fontSizeOptions = [
  { size: "1", label: "X-Small" },
  { size: "2", label: "Small" },
  { size: "3", label: "Normal" },
  { size: "4", label: "Large" },
  { size: "5", label: "X-Large" },
  { size: "6", label: "XX-Large" },
  { size: "7", label: "XXX-Large" },
];

export const fontColorOptions = [
  { color: "#000000", label: "Black" },
  { color: "#FF0000", label: "Red" },
  { color: "#00FF00", label: "Green" },
  { color: "#0000FF", label: "Blue" },
  { color: "#FFFF00", label: "Yellow" },
  { color: "#FF00FF", label: "Magenta" },
  { color: "#00FFFF", label: "Cyan" },
  { color: "#808080", label: "Gray" },
  { color: "#800000", label: "Maroon" },
  { color: "#808000", label: "Olive" },
  { color: "#008000", label: "Dark Green" },
  { color: "#800080", label: "Purple" },
  { color: "#008080", label: "Teal" },
  { color: "#000080", label: "Navy" },
];

export const fontStyleOptions = [
    { family: "Arial, sans-serif", label: "Arial" },
    { family: "Helvetica, sans-serif", label: "Helvetica" },
    { family: "Times New Roman, serif", label: "Times New Roman" },
    { family: "Courier New, monospace", label: "Courier New" },
    { family: "Georgia, serif", label: "Georgia" },
    { family: "Verdana, sans-serif", label: "Verdana" },
    { family: "Impact, sans-serif", label: "Impact" },
    { family: "Comic Sans MS, cursive", label: "Comic Sans" },
    { family: "Tahoma, sans-serif", label: "Tahoma" },
    { family: "Trebuchet MS, sans-serif", label: "Trebuchet MS" },
    { family: "Lucida Console, monospace", label: "Lucida Console" },
  ];

export const headingOptions = [
  { type: "p", command: "formatBlock", value: "<p>", label: "Paragraph", icon: Pilcrow },
  { type: "h1", command: "formatBlock", value: "<h1>", label: "Heading 1", icon: Heading1 },
  { type: "h2", command: "formatBlock", value: "<h2>", label: "Heading 2", icon: Heading2 },
  { type: "h3", command: "formatBlock", value: "<h3>", label: "Heading 3", icon: Heading3 },
  { type: "h4", command: "formatBlock", value: "<h4>", label: "Heading 4", icon: Heading4 },
  { type: "h5", command: "formatBlock", value: "<h5>", label: "Heading 5", icon: Heading5 },
  { type: "h6", command: "formatBlock", value: "<h6>", label: "Heading 6", icon: Heading6 },
];
