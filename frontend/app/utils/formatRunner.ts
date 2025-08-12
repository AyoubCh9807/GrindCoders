import { TestCase } from "../types/TestCase";
import { PY_runner, JS_runner, CPP_runner } from "./runners";
import { JS_genTests, PY_genTests, CPP_genTest } from "./genTests";
import { getReturnType_CPP } from "./getReturnType";
import { getStruct_CPP } from "./structs";

export const formatRunner = (
  code: string,
  testcases: TestCase[],
  runner: (fnName: string) => string,
  caseGenerator: (testcases: TestCase[]) => string,
  fnName: string,
  lang: string
) => {
  const PY_formatted =
    code + "\n" + caseGenerator(testcases) + "\n" + runner(fnName);
    const JS_formatted = code + "\n\n" + `globalThis["${fnName}"] = ${fnName};\n\n` + caseGenerator(testcases) + "\n" + runner(fnName);


  const testCasesCode = CPP_genTest(testcases);
  const returnType = getReturnType_CPP(code);
  const structs = getStruct_CPP(returnType || "");
  const runnerCode = CPP_runner(fnName);

  const CPP_formatted =
    "#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std; \n" +
    `
    struct TestCaseCpp {
      vector<string> input;
      string output;
    };`;
  structs + "\n\n" + "";
  testCasesCode + "\n\n" + code + "\n\n" + runnerCode;

  switch (lang.toLowerCase()) {
    case "python":
    case "py":
      return PY_formatted;
    case "javascript":
    case "js":
      return JS_formatted;
    case "cpp":
    case "c++":
      return CPP_formatted;
  }
};
