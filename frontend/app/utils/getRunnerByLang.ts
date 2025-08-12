import { CPP_runner, JS_runner, PY_runner } from "./runners"

export const getRunnerByLang = (lang: string) => {
    switch (lang.toLowerCase()) {
        case "javascript":
        case "js": return JS_runner 
        case "python": 
        case "py": return PY_runner 
        case "c++":
        case "cpp": return CPP_runner
        default: throw new Error(`Unsupported language: ${lang}`);
    }
}