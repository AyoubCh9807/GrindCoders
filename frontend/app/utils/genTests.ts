import { TestCase } from "../types/TestCase";

export function PY_genTests(testCases: TestCase[]): string {
  return (
    "test_cases = [\n" +
    testCases
      .map((tc) => {
        const input = JSON.stringify(tc.input);
        const output = JSON.stringify(tc.output);
        return `    { "input": ${input}, "expected": ${output} }`;
      })
      .join(",\n") +
    "\n]"
  );
}

export function JS_genTests(testCases: TestCase[]): string {
  return `const test_cases = ${JSON.stringify(testCases, null, 2)}`;
}

export function CPP_genTest(testCases: TestCase[]): string {
    const formatValue = (val: any): string => {
      if (typeof val === "string") return `"${val}"`;
      if (Array.isArray(val)) return `{ ${val.map(formatValue).join(", ")} }`;
      return val.toString();
    };

    let holder = "";
    for (const tc of testCases) {
      const innerInput =
        Array.isArray(tc.input) && Array.isArray(tc.input[0])
          ? formatValue(tc.input[0]) // [["a", "b"]] → ["a", "b"]
          : formatValue(tc.input); // fallback
      const output = formatValue(tc.output);
      holder += `{ ${innerInput}, ${output} },\n`;
    }

    return holder.trim();
}

