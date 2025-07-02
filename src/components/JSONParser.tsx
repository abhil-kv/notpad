import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

const JSONParser = () => {
  const [inputJson, setInputJson] = useState("");
  const [formattedJson, setFormattedJson] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!inputJson.trim()) {
      setFormattedJson("");
      setError("");
      setIsValid(false);
      return;
    }

    try {
      const parsed = JSON.parse(inputJson);
      const formatted = JSON.stringify(parsed, null, 2);
      setFormattedJson(formatted);
      setError("");
      setIsValid(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON format");
      setFormattedJson("");
      setIsValid(false);
    }
  }, [inputJson]);

  const formatJsonWithColors = (json: string) => {
    if (!json) return "";

    const braceColors = [
      "#e74c3c",
      "#2ecc71",
      "#3498db",
      "#f1c40f",
      "#e67e22",
      "#9b59b6",
    ]; // red, green, blue, yellow, orange, purple
    let braceStack: number[] = [];

    return json
      .split("\n")
      .map((line, index) => {
        // Calculate indentation level based on leading spaces
        const leadingSpaces = line.match(/^\s*/)?.[0].length || 0;
        const indentLevel = Math.floor(leadingSpaces / 2);

        let coloredLine = line;

        // Handle opening braces
        coloredLine = coloredLine.replace(/({)/g, (match) => {
          const currentLevel = braceStack.length;
          braceStack.push(currentLevel);
          const color = braceColors[currentLevel % braceColors.length];
          return `<span style="color: ${color}; font-weight: bold;">${match}</span>`;
        });

        // Handle closing braces
        coloredLine = coloredLine.replace(/(})/g, (match) => {
          const currentLevel = braceStack.pop() || 0;
          const color = braceColors[currentLevel % braceColors.length];
          return `<span style="color: ${color}; font-weight: bold;">${match}</span>`;
        });

        // Color other JSON elements
        coloredLine = coloredLine
          .replace(
            /(\[)/g,
            '<span style="color: #3498db; font-weight: bold;">$1</span>',
          )
          .replace(
            /(\])/g,
            '<span style="color: #3498db; font-weight: bold;">$1</span>',
          )
          .replace(
            /"([^"]+)":/g,
            '<span style="color: #2ecc71; font-weight: bold;">"$1"</span>:',
          )
          .replace(
            /: "([^"]*)"/g,
            ': <span style="color: #f39c12;">"$1"</span>',
          )
          .replace(
            /: (true|false)/g,
            ': <span style="color: #9b59b6; font-weight: bold;">$1</span>',
          )
          .replace(
            /: (null)/g,
            ': <span style="color: #95a5a6; font-style: italic;">$1</span>',
          )
          .replace(
            /: (\d+)/g,
            ': <span style="color: #e67e22; font-weight: bold;">$1</span>',
          );

        return `<div key="${index}" style="position: relative; padding-left: ${indentLevel * 20}px;">
          <span style="position: absolute; left: 0; top: 0; color: #ccc; font-size: 10px;">${indentLevel > 0 ? indentLevel : ""}</span>
          ${coloredLine}
        </div>`;
      })
      .join("");
  };

  return (
    <div className="h-screen bg-yellow-50 p-4 overflow-hidden flex flex-col">
      <div className="flex-1 flex flex-col space-y-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">JSON Parser</h2>
          <p className="text-gray-600">
            Paste your JSON data to format and validate it
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isValid && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Valid JSON format detected!
            </AlertDescription>
          </Alert>
        )}

        <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0 mb-4">
          {/* Input JSON */}
          <Card className="bg-white shadow-lg flex flex-col w-full md:w-1/4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-700">
                Raw JSON Input
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <Textarea
                placeholder="Paste your JSON data here..."
                value={inputJson}
                onChange={(e) => setInputJson(e.target.value)}
                className="flex-1 font-mono text-sm resize-none min-h-[200px] h-auto"
                style={{
                  height: `${Math.max(200, inputJson.split("\n").length * 20 + 40)}px`,
                }}
              />
            </CardContent>
          </Card>

          {/* Formatted JSON Output */}
          <Card className="bg-white shadow-lg flex flex-col w-full md:w-3/4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-700">
                Formatted JSON Output
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div
                className="flex-1 p-4 bg-gray-50 rounded-md border font-mono text-sm overflow-auto min-h-[200px]"
                style={{
                  height: `${Math.max(200, formattedJson.split("\n").length * 20 + 40)}px`,
                }}
              >
                {formattedJson ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: formatJsonWithColors(formattedJson),
                    }}
                  />
                ) : (
                  <div className="text-gray-400 italic">
                    Formatted JSON will appear here...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JSONParser;
