import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Copy } from "lucide-react";

const JwtParser = () => {
  const [jwtToken, setJwtToken] = useState("");
  const [decodedHeader, setDecodedHeader] = useState("");
  const [decodedPayload, setDecodedPayload] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!jwtToken.trim()) {
      setDecodedHeader("");
      setDecodedPayload("");
      setError("");
      setIsValid(false);
      return;
    }

    try {
      const parts = jwtToken.split(".");
      if (parts.length !== 3) {
        throw new Error(
          "Invalid JWT format. JWT should have 3 parts separated by dots.",
        );
      }

      // Decode header
      const headerDecoded = JSON.parse(
        atob(parts[0].replace(/-/g, "+").replace(/_/g, "/")),
      );
      const formattedHeader = JSON.stringify(headerDecoded, null, 2);
      setDecodedHeader(formattedHeader);

      // Decode payload
      const payloadDecoded = JSON.parse(
        atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
      );
      const formattedPayload = JSON.stringify(payloadDecoded, null, 2);
      setDecodedPayload(formattedPayload);

      setError("");
      setIsValid(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JWT token");
      setDecodedHeader("");
      setDecodedPayload("");
      setIsValid(false);
    }
  }, [jwtToken]);

  const formatJsonWithColors = (json: string) => {
    if (!json) return "";

    const braceColors = [
      "#e74c3c",
      "#2ecc71",
      "#3498db",
      "#f1c40f",
      "#e67e22",
      "#9b59b6",
    ];
    let braceStack: number[] = [];

    return json
      .split("\n")
      .map((line, index) => {
        const leadingSpaces = line.match(/^\s*/)?.[0].length || 0;
        const indentLevel = Math.floor(leadingSpaces / 2);

        let coloredLine = line;

        coloredLine = coloredLine.replace(/({)/g, (match) => {
          const currentLevel = braceStack.length;
          braceStack.push(currentLevel);
          const color = braceColors[currentLevel % braceColors.length];
          return `<span style="color: ${color}; font-weight: bold;">${match}</span>`;
        });

        coloredLine = coloredLine.replace(/(})/g, (match) => {
          const currentLevel = braceStack.pop() || 0;
          const color = braceColors[currentLevel % braceColors.length];
          return `<span style="color: ${color}; font-weight: bold;">${match}</span>`;
        });

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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="h-screen bg-yellow-50 p-4 overflow-hidden flex flex-col">
      <div className="flex-1 flex flex-col space-y-4">


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
              Valid JWT token detected!
            </AlertDescription>
          </Alert>
        )}

        <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0 mb-4">


                      {/* Decoded Payload */}
            <Card className="bg-white shadow-lg flex flex-col flex-1">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-700">
                  Decoded Payload
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(decodedPayload)}
                  disabled={!decodedPayload}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 p-4 bg-gray-50 rounded-md border font-mono text-sm overflow-auto min-h-[45rem] max-h-[47rem]">
                  {decodedPayload ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formatJsonWithColors(decodedPayload),
                      }}
                    />
                  ) : (
                    <div className="text-gray-400 italic ">
                      Decoded payload will appear here...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

          {/* Output Section */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            {/* Decoded Header */}
            <Card className="bg-white shadow-lg flex flex-col flex-1">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-700">
                  Decoded Header
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(decodedHeader)}
                  disabled={!decodedHeader}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 p-4 bg-gray-50 rounded-md border font-mono text-sm overflow-auto min-h-[20rem] max-h-[20rem]">
                  {decodedHeader ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formatJsonWithColors(decodedHeader),
                      }}
                    />
                  ) : (
                    <div className="text-gray-400 italic">
                      Decoded header will appear here...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
                      {/* JWT Token Input */}
          <Card className="bg-white shadow-lg flex flex-col flex-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-700">
                JWT Token Input
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <Textarea
                placeholder="Paste your JWT token here..."
                value={jwtToken}
                onChange={(e) => setJwtToken(e.target.value)}
                className="flex-1 font-mono text-sm resize-none min-h-[150px] max-h-[300px]"
              />
            </CardContent>
          </Card>


          </div>
        </div>
      </div>
    </div>
  );
};

export default JwtParser;
