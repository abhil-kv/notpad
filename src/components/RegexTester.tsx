import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Play } from "lucide-react";

const RegexTester = () => {
  const [regex, setRegex] = useState("");
  const [testString, setTestString] = useState("");
  const [result, setResult] = useState<{
    isValid: boolean;
    message: string;
    highlightedString?: string;
  } | null>(null);
  const [error, setError] = useState("");

  const testRegex = () => {
    if (!regex.trim()) {
      setError("Please enter a regular expression");
      setResult(null);
      return;
    }
  
    if (!testString.trim()) {
      setError("Please enter a test string");
      setResult(null);
      return;
    }
  
    try {
      const matchParts = regex.match(/^\/(.+)\/([a-z]*)$/i);
      const pattern = matchParts ? matchParts[1] : regex;
      const flags = matchParts ? matchParts[2] : "";
  
      const regexObj = new RegExp(pattern, flags);
      const testPassed = regexObj.test(testString);
      const match = testString.match(regexObj);
  
      setError("");
  
      const isAnchored = pattern.startsWith("^") && pattern.endsWith("$");
  
      if (testPassed && isAnchored) {
        setResult({
          isValid: true,
          message: `Full match: string completely matches the pattern: /${pattern}/${flags}`,
        });
        return;
      }
  
      let highlightedString = testString;
      if (match && match.index !== undefined) {
        const beforeMatch = testString.slice(0, match.index);
        const matched = match[0];
        const afterMatch = testString.slice(match.index + matched.length);
  
        highlightedString = `
          <span style="background-color: #ffebee; color: #c62828;">${beforeMatch}</span>
          <span style="background-color: #e8f5e8; color: #2e7d32;">${matched}</span>
          <span style="background-color: #ffebee; color: #c62828;">${afterMatch}</span>
        `;
      } else {
        highlightedString = `<span style="background-color: #ffebee; color: #c62828;">${testString}</span>`;
      }
  
      setResult({
        isValid: false,
        message: testPassed
          ? `Partial match found (pattern: /${pattern}/${flags}), but not full match.`
          : `No match found for pattern: /${pattern}/${flags}`,
        highlightedString,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid regular expression");
      setResult(null);
    }
  };
  

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      testRegex();
    }
  };

  return (
    <div className="h-full bg-yellow-50 p-6 overflow-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Regex Tester
          </h2>
          <p className="text-gray-600">
            Test your regular expressions against strings
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Regex Input */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-700">
                Regular Expression
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Enter your regex pattern (e.g., ^[a-zA-Z0-9]+$ or /abc/i)"
                value={regex}
                onChange={(e) => setRegex(e.target.value)}
                onKeyPress={handleKeyPress}
                className="font-mono"
              />
              <p className="text-xs text-gray-500 mt-2">
                Tip: Press Ctrl+Enter to test quickly
              </p>
            </CardContent>
          </Card>

          {/* Test String Input */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-700">
                Test String
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter the string to test against the regex..."
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                onKeyPress={handleKeyPress}
                className="min-h-[100px] font-mono resize-none"
              />
            </CardContent>
          </Card>
        </div>

        {/* Test Button */}
        <div className="text-center">
          <Button onClick={testRegex} size="lg" className="px-8 py-3 text-lg">
            <Play className="h-5 w-5 mr-2" />
            Test
          </Button>
        </div>

        {/* Result Display */}
        {result && (
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                {result.isValid ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                Test Result
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert
                className={
                  result.isValid
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }
              >
                <AlertDescription
                  className={result.isValid ? "text-green-800" : "text-red-800"}
                >
                  {result.message}
                </AlertDescription>
              </Alert>

              {result.highlightedString && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">
                    String Analysis:
                  </h4>
                  <div
                    className="p-4 bg-gray-50 rounded-md border font-mono text-sm"
                    dangerouslySetInnerHTML={{
                      __html: result.highlightedString,
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    <span className="inline-block w-3 h-3 bg-green-100 border border-green-300 mr-1"></span>
                    Matching portions
                    <span className="inline-block w-3 h-3 bg-red-100 border border-red-300 mr-1 ml-4"></span>
                    Non-matching portions
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RegexTester;
