export const PY_runner = (fn: string) => {
  return `
TestCasesPassedXXX = 0

if not test_cases:
    print("Test cases were loading, try again")
else:
    for case in test_cases:
        try:
            input_args = case["input"]
            expected = case["expected"]
            result = ${fn}(*input_args)  # always unpack

            if result == expected:
                TestCasesPassedXXX += 1
            else:
                print(f"❌ FAIL: ${fn}{case['input']} = {result}, expected {expected}")
                print(f"passed cases: {(TestCasesPassedXXX / len(test_cases)) * 100}%")
                break
        except Exception as e:
            print(f"💥 ERROR: ${fn}{case['input']} raised {repr(e)}")
            break
    else:
        print("passed cases: 100%")
`;
};


export const JS_runner = (fnName: string) => `
let passed = 0;
const fn = globalThis["${fnName}"];
if (typeof fn !== "function") {
  console.error("Function ${fnName} not found");
} else {
  for (const testCase of test_cases) {
    try {
      const result = fn(...testCase.input);
      const expected = testCase.output;

      const isEqual = JSON.stringify(result) === JSON.stringify(expected);
      if (isEqual) {
        passed++;
      } else {
        console.log("❌ FAIL:", testCase.input, "=>", result, ", expected:", expected);
        break;
      }
    } catch (err) {
      console.log("💥 ERROR:", testCase.input, "=>", err);
      break;
    }
  }
  console.log("Passed cases:", ((passed / test_cases.length) * 100).toFixed(2) + "%");
}
`;

export const CPP_runner = (fnName: string) => {
  return `
  int main() {
    int passed = 0;
    int total = sizeof(test_cases) / sizeof(test_cases[0]);

    for(int i = 0; i < total; i++) {
      auto result = ${fnName}(test_cases[i].input);
      if(result == test_cases[i].output) {
        passed++;
      } else {
        cout << "❌ FAIL:" << testCase.input << "=>" << result << ", expected:" << expected << endl;
        break;
      }
    }
    cout << "Passed cases: " << (((double)passed / total) * 100) << "%" << endl;
    return 0;
  }
  `
}
