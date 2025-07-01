import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GitCompare } from "lucide-react";

interface StringCompareProps {
  defaultText1?: string;
  defaultText2?: string;
}

const StringCompare = ({
  defaultText1 = "",
  defaultText2 = "",
}: StringCompareProps) => {
  const [text1, setText1] = useState<string>(defaultText1);
  const [text2, setText2] = useState<string>(defaultText2);
  const [comparisonResult, setComparisonResult] = useState<string>("");
  const [hasCompared, setHasCompared] = useState<boolean>(false);

  const handleText1Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText1(e.target.value);
  };

  const handleText2Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText2(e.target.value);
  };

  const compareTexts = () => {
    if (!text1.trim() && !text2.trim()) {
      setComparisonResult("");
      setHasCompared(false);
      return;
    }

    // Character-by-character comparison
    const maxLength = Math.max(text1.length, text2.length);
    let result = "";

    for (let i = 0; i < maxLength; i++) {
      const char1 = text1[i] || "";
      const char2 = text2[i] || "";

      if (char1 !== char2) {
        // Highlight differences with gray background
        const displayChar = char1 || "";
        if (displayChar === " ") {
          result += `<span style="background-color:rgb(248, 250, 146); padding: 2px 4px; border-radius: 3px;">&nbsp;</span>`;
        } else if (displayChar === "\n") {
          result += `<span style="background-color: rgb(248, 250, 146); padding: 2px 4px; border-radius: 3px;">↵</span><br>`;
        } else {
          result += `<span style="background-color: rgb(248, 250, 146); padding: 2px 4px; border-radius: 3px;">${displayChar}</span>`;
        }
      } else {
        if (char1 === "\n") {
          result += "<br>";
        } else if (char1 === " ") {
          result += "&nbsp;";
        } else {
          result += char1;
        }
      }
    }

    setComparisonResult(result);
    setHasCompared(true);
  };

  const clearComparison = () => {
    setText1("");
    setText2("");
    setComparisonResult("");
    setHasCompared(false);
  };

  return (
    <div className="bg-white h-full w-full p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <GitCompare className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Text Compare</h1>
        </div>

        <div className="space-y-6">
          {/* Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* First Text Box */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Text 1 (Original)</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="text1" className="sr-only">
                  First text for comparison
                </Label>
                <Textarea
                  id="text1"
                  placeholder="Paste or type your first text here..."
                  value={text1}
                  onChange={handleText1Change}
                  className="min-h-[300px] resize-none"
                />
              </CardContent>
            </Card>

            {/* Second Text Box */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Text 2 (Compare Against)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="text2" className="sr-only">
                  Second text for comparison
                </Label>
                <Textarea
                  id="text2"
                  placeholder="Paste or type your second text here..."
                  value={text2}
                  onChange={handleText2Change}
                  className="min-h-[300px] resize-none"
                />
              </CardContent>
            </Card>
          </div>

          {/* Compare Button */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={compareTexts}
              size="lg"
              className="px-8 py-3 text-lg"
              disabled={!text1.trim() && !text2.trim()}
            >
              <GitCompare className="h-5 w-5 mr-2" />
              Compare Texts
            </Button>
            {hasCompared && (
              <Button
                onClick={clearComparison}
                variant="outline"
                size="lg"
                className="px-8 py-3 text-lg"
              >
                Clear All
              </Button>
            )}
          </div>

          {/* Results Section */}
          {hasCompared && (
            <>
              <Separator className="my-6" />
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GitCompare className="h-5 w-5" />
                    Comparison Result
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Text 1 is shown below with character-level differences
                    highlighted in gray. Each highlighted character indicates
                    where Text 1 differs from Text 2.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg border min-h-[200px]">
                    {comparisonResult ? (
                      <div
                        className="whitespace-pre-wrap break-words leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: comparisonResult }}
                      />
                    ) : (
                      <p className="text-gray-500 italic">
                        No differences found or both texts are empty.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Instructions */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-blue-800 mb-2">How to use:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>
                  • Paste or type your original text in the left box (Text 1)
                </li>
                <li>
                  • Paste or type the text to compare against in the right box
                  (Text 2)
                </li>
                <li>• Click "Compare Texts" to see the differences</li>
                <li>
                  • Differences will be highlighted in gray in the result
                  section
                </li>
                <li>• Use "Clear All" to reset both text boxes and results</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StringCompare;
