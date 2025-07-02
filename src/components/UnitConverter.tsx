import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator } from "lucide-react";

interface UnitConverterProps {
  defaultTab?: string;
}

const UnitConverter = ({ defaultTab = "length" }: UnitConverterProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [result, setResult] = useState("");

  const units = {
    length: {
      meter: { name: "Meter", factor: 1 },
      kilometer: { name: "Kilometer", factor: 1000 },
      centimeter: { name: "Centimeter", factor: 0.01 },
      millimeter: { name: "Millimeter", factor: 0.001 },
      inch: { name: "Inch", factor: 0.0254 },
      foot: { name: "Foot", factor: 0.3048 },
      yard: { name: "Yard", factor: 0.9144 },
      mile: { name: "Mile", factor: 1609.34 },
      nautical_mile: { name: "Nautical Mile", factor: 1852 },
    },
    temperature: {
      celsius: { name: "Celsius" },
      fahrenheit: { name: "Fahrenheit" },
      kelvin: { name: "Kelvin" },
      rankine: { name: "Rankine" },
    },
    area: {
      square_meter: { name: "Square Meter", factor: 1 },
      square_kilometer: { name: "Square Kilometer", factor: 1000000 },
      square_centimeter: { name: "Square Centimeter", factor: 0.0001 },
      square_inch: { name: "Square Inch", factor: 0.00064516 },
      square_foot: { name: "Square Foot", factor: 0.092903 },
      acre: { name: "Acre", factor: 4046.86 },
      hectare: { name: "Hectare", factor: 10000 },
    },
    volume: {
      liter: { name: "Liter", factor: 1 },
      milliliter: { name: "Milliliter", factor: 0.001 },
      cubic_meter: { name: "Cubic Meter", factor: 1000 },
      cubic_centimeter: { name: "Cubic Centimeter", factor: 0.001 },
      gallon_us: { name: "Gallon (US)", factor: 3.78541 },
      gallon_uk: { name: "Gallon (UK)", factor: 4.54609 },
      quart: { name: "Quart", factor: 0.946353 },
      pint: { name: "Pint", factor: 0.473176 },
      cup: { name: "Cup", factor: 0.236588 },
      fluid_ounce: { name: "Fluid Ounce", factor: 0.0295735 },
    },
    weight: {
      kilogram: { name: "Kilogram", factor: 1 },
      gram: { name: "Gram", factor: 0.001 },
      pound: { name: "Pound", factor: 0.453592 },
      ounce: { name: "Ounce", factor: 0.0283495 },
      ton: { name: "Ton", factor: 1000 },
      stone: { name: "Stone", factor: 6.35029 },
      carat: { name: "Carat", factor: 0.0002 },
    },
    time: {
      second: { name: "Second", factor: 1 },
      minute: { name: "Minute", factor: 60 },
      hour: { name: "Hour", factor: 3600 },
      day: { name: "Day", factor: 86400 },
      week: { name: "Week", factor: 604800 },
      month: { name: "Month", factor: 2629746 },
      year: { name: "Year", factor: 31556952 },
      millisecond: { name: "Millisecond", factor: 0.001 },
    },
  };

  const convertTemperature = (
    value: number,
    from: string,
    to: string,
  ): number => {
    let celsius: number;

    // Convert to Celsius first
    switch (from) {
      case "celsius":
        celsius = value;
        break;
      case "fahrenheit":
        celsius = ((value - 32) * 5) / 9;
        break;
      case "kelvin":
        celsius = value - 273.15;
        break;
      case "rankine":
        celsius = ((value - 491.67) * 5) / 9;
        break;
      default:
        celsius = value;
    }

    // Convert from Celsius to target
    switch (to) {
      case "celsius":
        return celsius;
      case "fahrenheit":
        return (celsius * 9) / 5 + 32;
      case "kelvin":
        return celsius + 273.15;
      case "rankine":
        return (celsius * 9) / 5 + 491.67;
      default:
        return celsius;
    }
  };

  const convertValue = useCallback(
    (value: string, from: string, to: string, category: string): string => {
      if (!value || !from || !to || from === to) {
        return value;
      }

      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        return "";
      }

      if (category === "temperature") {
        const result = convertTemperature(numValue, from, to);
        return result.toFixed(2);
      } else {
        const categoryUnits = units[category as keyof typeof units] as any;
        const fromFactor = categoryUnits[from]?.factor || 1;
        const toFactor = categoryUnits[to]?.factor || 1;
        const result = (numValue * fromFactor) / toFactor;
        return result.toFixed(6).replace(/\.?0+$/, "");
      }
    },
    [],
  );

  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  const debouncedConvert = useCallback(
    debounce(
      (
        value: string,
        from: string,
        to: string,
        category: string,
        isFromInput: boolean,
      ) => {
        const converted = convertValue(value, from, to, category);
        if (isFromInput) {
          setToValue(converted);
        } else {
          setFromValue(converted);
        }

        if (value && from && to && converted) {
          const fromUnitName =
            units[category as keyof typeof units][from as keyof any]?.name ||
            from;
          const toUnitName =
            units[category as keyof typeof units][to as keyof any]?.name || to;
          setResult(
            `Result: ${value} ${fromUnitName} = ${converted} ${toUnitName}`,
          );
        } else {
          setResult("");
        }
      },
      500,
    ),
    [convertValue],
  );

  useEffect(() => {
    if (fromValue && fromUnit && toUnit) {
      debouncedConvert(fromValue, fromUnit, toUnit, activeTab, true);
    }
  }, [fromValue, fromUnit, toUnit, activeTab, debouncedConvert]);

  useEffect(() => {
    if (toValue && fromUnit && toUnit && fromValue !== toValue) {
      debouncedConvert(toValue, toUnit, fromUnit, activeTab, false);
    }
  }, [toValue, fromUnit, toUnit, activeTab, debouncedConvert, fromValue]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setFromUnit("");
    setToUnit("");
    setFromValue("");
    setToValue("");
    setResult("");
  };

  const handleFromValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromValue(e.target.value);
  };

  const handleToValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToValue(e.target.value);
  };

  const clearAll = () => {
    setFromValue("");
    setToValue("");
    setResult("");
  };

  const currentUnits = units[activeTab as keyof typeof units] as any;

  return (
    <div className="bg-white h-full w-full p-6 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Unit Converter</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Convert Units</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              {/* Desktop Tabs */}
              <TabsList className="hidden md:grid w-full grid-cols-6">
                <TabsTrigger value="length">Length</TabsTrigger>
                <TabsTrigger value="temperature">Temperature</TabsTrigger>
                <TabsTrigger value="area">Area</TabsTrigger>
                <TabsTrigger value="volume">Volume</TabsTrigger>
                <TabsTrigger value="weight">Weight</TabsTrigger>
                <TabsTrigger value="time">Time</TabsTrigger>
              </TabsList>

              {/* Mobile/Tablet Select */}
              <div className="md:hidden mb-6">
                <Label htmlFor="category-select">Select Category</Label>
                <Select value={activeTab} onValueChange={handleTabChange}>
                  <SelectTrigger id="category-select">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="length">Length</SelectItem>
                    <SelectItem value="temperature">Temperature</SelectItem>
                    <SelectItem value="area">Area</SelectItem>
                    <SelectItem value="volume">Volume</SelectItem>
                    <SelectItem value="weight">Weight</SelectItem>
                    <SelectItem value="time">Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {Object.keys(units).map((category) => (
                <TabsContent
                  key={category}
                  value={category}
                  className="space-y-6 mt-6"
                >
                  {/* Unit Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`from-${category}`}>From</Label>
                      <Select value={fromUnit} onValueChange={setFromUnit}>
                        <SelectTrigger id={`from-${category}`}>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(currentUnits).map(
                            ([key, unit]: [string, any]) => (
                              <SelectItem key={key} value={key}>
                                {unit.name}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`to-${category}`}>To</Label>
                      <Select value={toUnit} onValueChange={setToUnit}>
                        <SelectTrigger id={`to-${category}`}>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(currentUnits).map(
                            ([key, unit]: [string, any]) => (
                              <SelectItem key={key} value={key}>
                                {unit.name}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Value Input */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`from-input-${category}`}>
                        From Value
                      </Label>
                      <Input
                        id={`from-input-${category}`}
                        type="number"
                        placeholder="Enter value"
                        value={fromValue}
                        onChange={handleFromValueChange}
                        disabled={!fromUnit || !toUnit}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`to-input-${category}`}>To Value</Label>
                      <Input
                        id={`to-input-${category}`}
                        type="number"
                        placeholder="Converted value"
                        value={toValue}
                        onChange={handleToValueChange}
                        disabled={!fromUnit || !toUnit}
                      />
                    </div>
                  </div>

                  {/* Clear Button */}
                  {(fromValue || toValue) && (
                    <div className="flex justify-center">
                      <Button onClick={clearAll} variant="outline">
                        Clear All
                      </Button>
                    </div>
                  )}

                  {/* Result Display */}
                  {result && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-lg font-semibold text-blue-800 text-center">
                        {result}
                      </p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6 bg-gray-50 border-gray-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-gray-800 mb-2">How to use:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>
                • Select a category tab (Length, Temperature, Area, Volume,
                Weight, Time)
              </li>
              <li>• Choose the units you want to convert from and to</li>
              <li>• Enter a value in either input box</li>
              <li>
                • The conversion will happen automatically after you stop typing
              </li>
              <li>• The result will be displayed at the bottom</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnitConverter;
