import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface WordCounterProps {
  defaultText?: string;
}

const WordCounter = ({ defaultText = "" }: WordCounterProps) => {
  const [text, setText] = useState<string>(defaultText);
  const [stats, setStats] = useState({
    words: 0,
    paragraphs: 0,
    characters: 0,
    specialCharacters: 0,
  });

  useEffect(() => {
    const calculateStats = () => {
      if (!text.trim()) {
        setStats({
          words: 0,
          paragraphs: 0,
          characters: 0,
          specialCharacters: 0,
        });
        return;
      }

      // Word count
      const words = text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;

      // Paragraph count
      const paragraphs = text
        .split(/\n\s*\n/)
        .filter((para) => para.trim().length > 0).length;

      // Total characters
      const characters = text.length;

      // Special characters (non-alphanumeric and non-whitespace)
      const specialCharacters = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;

      setStats({
        words,
        paragraphs,
        characters,
        specialCharacters,
      });
    };

    calculateStats();
  }, [text]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="bg-white h-full w-full p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Word Counter</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Input Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Text Input</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste or type your text here..."
                value={text}
                onChange={handleTextChange}
                className="min-h-[400px] resize-none"
              />
            </CardContent>
          </Card>

          {/* Statistics Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Text Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <span className="font-medium text-blue-800">
                    Words Count:
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {stats.words}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <span className="font-medium text-green-800">
                    Paragraph Count:
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    {stats.paragraphs}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                  <span className="font-medium text-purple-800">
                    Total Characters:
                  </span>
                  <span className="text-2xl font-bold text-purple-600">
                    {stats.characters}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                  <span className="font-medium text-orange-800">
                    Special Characters:
                  </span>
                  <span className="text-2xl font-bold text-orange-600">
                    {stats.specialCharacters}
                  </span>
                </div>
              </div>

              {text.trim() && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Quick Summary:
                  </h3>
                  <p className="text-sm text-gray-600">
                    Your text contains <strong>{stats.words}</strong> words
                    across <strong>{stats.paragraphs}</strong> paragraph
                    {stats.paragraphs !== 1 ? "s" : ""}, with a total of{" "}
                    <strong>{stats.characters}</strong> characters including{" "}
                    <strong>{stats.specialCharacters}</strong> special
                    characters.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WordCounter;
