import { CPP_genTest, JS_genTests, PY_genTests } from "./genTests";

export const getTestGenByLang = (lang: string) => {
    switch (lang.toLowerCase()) {
        case "python": 
        case "py": return PY_genTests
        case "javascript":
        case "js": return JS_genTests
        case "c++":
        case "cpp": return CPP_genTest
        default: throw new Error(`unsupported lang: ${lang}`)
    }
  }