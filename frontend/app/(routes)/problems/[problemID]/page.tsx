"use client";
import { useProblems } from "@/app/contexts/ProblemsProvider";
import { use, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import axios from "axios";
import { oneDark } from "@uiw/react-codemirror";
import ReactCodeMirror from "@uiw/react-codemirror";
import { FaPlay } from "react-icons/fa";
import { mapFile } from "@/app/utils/mapFile";
import { DynamicProblemProps } from "@/app/types/DynamicProblemProps";
import { TestCase } from "@/app/types/TestCase";
import { Problem } from "@/app/types/Problem";
import { getPassPercentage } from "@/app/utils/getPassPercentage";
import { cleanOutput } from "@/app/utils/cleanOutput";
import { RiResetRightFill } from "react-icons/ri";
import { getFnName_PY, getFnName_JS } from "@/app/utils/getFnName";
import { formatRunner } from "@/app/utils/formatRunner";
import { getRunnerByLang } from "@/app/utils/getRunnerByLang";
import { getTestGenByLang } from "@/app/utils/getTestGenByLang";
import { useRouter } from "next/navigation";
import { FaBackward } from "react-icons/fa";
import GlareHover from "@/components/UI/GlareHover";
import { jwtDecode } from "jwt-decode";

export default function DynamicProblem({ params }: DynamicProblemProps) {
  const router = useRouter();
  const [code, setCode] = useState<string>("");
  const [lang, setLang] = useState<string>("python");
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [testLoading, setTestLoading] = useState<boolean>(false);
  const [fnName, setFnName] = useState<string>("");
  // boilerplate codes
  const [boiler_PY, setBoiler_PY] = useState<string>("");
  const [boiler_JS, setBoiler_JS] = useState<string>("");
  const [currentBoiler, setCurrentBoiler] = useState<string>("");
  // The pass rate here is the percentage of the passed test cases
  const [passRate, setPassRate] = useState<number>(0);
  // The cleaned output here is just the output without the percentage of the passed test cases for better UX
  const [cleanedOutput, setCleanedOutput] = useState<string>("");
  // THESE BELOW WILL BE USED FOR CACHING TO PREVENT VALUES CHANGING ON THE SAME CASE
  const [lastSolution, setLastSolution] = useState<string>("");
  const [lastPassRate, setLastPassRate] = useState<number | null>(null);
  const [token, setToken] = useState<string>("");
  // Checks if the current problem is already solved to avoid XP exploits
  const [isSolved, setIsSolved] = useState<boolean>(false);

  const { problems, loading, error } = useProblems();
  const { problemID } = use(params);

  const pistonExec = async (testCases: TestCase[]) => {
    if (output.toLowerCase().includes("test cases were loading")) {
      setCode(code + " ");
    }
    if (code == lastSolution && lastPassRate !== null) {
      // we already have the result cached
      return;
    }
    if (isSolved) {
      setErr("problem already solved");
      setOutput("You already solved this problem");
      return;
    }
    try {
      setIsLoading(true);
      setErr(null);
      setOutput("");
      const res = await axios.post("https://emkc.org/api/v2/piston/execute", {
        language: lang.toLowerCase(),
        version: "*",
        files: [
          {
            name: mapFile(lang),
            content: formatRunner(
              code,
              testCases,
              getRunnerByLang(lang),
              getTestGenByLang(lang),
              fnName,
              lang
            ),
          },
        ],
        stdin: "",
        compile_timeout: 10000,
        run_timeout: 3000,
        compile_memory_limit: -1,
        run_memory_limit: -1,
      });
      const cout = res.data.run.output;
      setOutput(cout);
      setLastSolution(code);
      setLastPassRate(getPassPercentage(cout));
    } catch (error) {
      if (error instanceof Error) {
        setErr(error.message);
      } else {
        setErr(String(err));
      }
    } finally {
      setIsLoading(false);
    }
  };
  const fetchTestCases = async (problem: Problem) => {
    try {
      setTestLoading(true);
      setErr(null);
      const solved_problems = await getSolvedProblems();
      if(isSolved) {
        setErr("problem already solved")
        setOutput("You already solved this problem")
        return
      }
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:8080/api/test_cases?problem_id=${problem.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.data) {
        return;
      }
      if (res.data.test_cases?.length == 0) {
        if (res.data.test_cases?.length === 0) {
          setErr("No test cases found for this problem.");
        }
      }
      setTestCases(res.data.test_cases || []);
      setCleanedOutput(cleanOutput(output)); // returns either success message or err message without passrate
      setPassRate(getPassPercentage(output)); // takes the output and returns the percentage of passed cases
    } catch (error) {
      error instanceof Error ? setErr(error.message) : setErr(String(error));
    } finally {
      setTestLoading(false);
    }
  };

  const problem = problems.find((p) => p.id == Number(problemID)); // gets current problem

  useEffect(() => {
    if (!problem) return;
    setBoiler_PY(problem.boilerplate_PY);
    setBoiler_JS(problem.boilerplate_JS);
  }, [problem]);

  useEffect(() => {
    if (!problem) return;
    fetchTestCases(problem);
  }, [problem]);

  useEffect(() => {
    if (!problem) return;
    const boilerPy = problem.boilerplate_PY;
    setFnName(getFnName_PY(boilerPy) || getFnName_PY(code) || "no function");
  }, [problem, lang]);

  const getBoilerByLang = (problem: Problem, lang: string) => {
    switch (lang.toLowerCase()) {
      case "py":
      case "python":
        return problem.boilerplate_PY;
      case "js":
      case "javascript":
        return problem.boilerplate_JS;
      case "c++":
      case "cpp":
        return problem.boilerplate_CPP;
    }
  };

  //On reload, either return the last user code saved, the boilerplate or the error message
  useEffect(() => {
    if (!problem) return;
    const loadCode = async () => {
      const lastCode = localStorage.getItem(`problem-${problem?.id}`);
      const newBoiler = getBoilerByLang(problem, lang);
      setCurrentBoiler(newBoiler || "no boiler available");
      setCode(lastCode || newBoiler || "");
      localStorage.setItem("lang", lang);
      console.log("just set localStorage to be: ", lang);
    };
    loadCode();
  }, [problem, lang]);

  // debounce language saving
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(`problem-${problem?.id}`, code);
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [code]);

  //DEBUG
  /*
    useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) {
      setLang(savedLang);
      console.log("Loaded language from localStorage:", savedLang);
    } else {
      localStorage.setItem("lang", lang);
      console.log("No saved language. Defaulting to:", lang);
    }
  }, []);
  */

  useEffect(() => {
    if (lang) {
      localStorage.setItem("lang", lang);
      console.log("Saved language to localStorage:", lang);
    }
  }, [lang]);

  useEffect(() => {
    const boilerPY = problem?.boilerplate_PY;
    const boilerJS = problem?.boilerplate_JS;
    const boilerCPP = problem?.boilerplate_CPP;
    setBoiler_PY(boilerPY || "py boiler unavailable");
    setBoiler_JS(boilerJS || "py boiler unavailable");
  }, [problem, lang]);

  useEffect(() => {
    setCleanedOutput(cleanOutput(output));
    setPassRate(getPassPercentage(output));
  }, [output]);

  useEffect(() => {
    if (!problem) {
      return;
    }
    setCode(
      localStorage.getItem("") || getBoilerByLang(problem, lang) || "idk"
    );
  }, [problem, lang]);

  // using cached code, if not, then use the boilerplate code
  useEffect(() => {
    if (!problem) return;
    if (!code) {
      setCode(
        localStorage.getItem(`problem-${problem?.id}`) ||
          getBoilerByLang(problem, "python") ||
          "no boiler"
      );
    }
  }, [problem]);

  const handleSubmissions = async () => {
    try {
      setIsLoading(true);
      setErr(null);
      const mytoken = localStorage.getItem("token");
      if (!mytoken) {
        router.push("/login");
        return;
      }
      setToken(mytoken);
      if (passRate > 99) {
        await axios.post(
          "http://localhost:8080/api/increment_correct_subs",
          {},
          {
            headers: {
              Authorization: `Bearer ${mytoken}`,
            },
          }
        );
        await axios.post(
          "http://localhost:8080/api/add_to_problems_solved",
          {
            problem_ID: problem?.id || -1,
          },
          {
            headers: {
              Authorization: `Bearer ${mytoken}`,
            },
          }
        );
        let points: number = 0;
        if (problem?.difficulty.toLowerCase() == "easy") {
          points = 10;
        } else if (problem?.difficulty.toLowerCase() == "medium") {
          points = 25;
        } else if (problem?.difficulty.toLowerCase() == "hard") {
          points = 50;
        }
        await axios.post(
          "http://localhost:8080/api/increment_points",
          {
            points: points,
          },
          {
            headers: {
              Authorization: `Bearer ${mytoken}`,
            },
          }
        );
      } else {
        await axios.post(
          "http://localhost:8080/api/increment_subs",
          {},
          {
            headers: {
              Authorization: `Bearer ${mytoken}`,
            },
          }
        );
      }
    } catch (error: any) {
      setErr(error instanceof Error ? error.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const getSolvedProblems = async () => {
    try {
      setIsLoading(true);
      setErr(null);
      const res = await axios.get(
        "http://localhost:8080/api/get_solved_problems",
        {
          headers: {
            Authorization: `Bearer ${
              token || localStorage.getItem("token") || "no token"
            }`,
          },
        }
      );
      if (!res.data) {
        setErr("No data found");
        return;
      }
      console.log("retreived problemos: ", res.data.solved_problems)
      setIsSolved(res.data.solved_problems.includes(problem?.id))
      return res.data.solved_problems;
    } catch (error) {
      setErr(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSolvedProblems()
  }, [isSolved])

  if (loading) {
    return (
      <div className="grid place-items-center my-5">
        <div style={{ height: "600px", position: "relative" }}>
          <GlareHover
            glareColor="#ffffff"
            glareOpacity={0.3}
            glareAngle={-30}
            glareSize={300}
            transitionDuration={800}
            playOnce={false}
          >
            <h2
              className="animate-pulse"
              style={{
                fontSize: "1.75rem",
                fontWeight: "900",
                color: "#333",
                margin: 0,
              }}
            >
              Loading...
            </h2>
          </GlareHover>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="grid place-items-center my-5">
        <div style={{ height: "600px", position: "relative" }}>
          <GlareHover
            glareColor="#ffffff"
            glareOpacity={0.3}
            glareAngle={-30}
            glareSize={300}
            transitionDuration={800}
            playOnce={false}
          >
            <h2
              className="animate-pulse"
              style={{
                fontSize: "1rem",
                fontWeight: "900",
                color: "#333",
                margin: 0,
              }}
            >
              error: {err}
            </h2>
          </GlareHover>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="grid place-items-center my-5">
        <div style={{ height: "600px", position: "relative" }}>
          <GlareHover
            glareColor="#ffffff"
            glareOpacity={0.3}
            glareAngle={-30}
            glareSize={300}
            transitionDuration={800}
            playOnce={false}
          >
            <h2
              className="animate-pulse"
              style={{
                fontSize: "1.5rem",
                fontWeight: "900",
                color: "#333",
                margin: 0,
              }}
            >
              Problem not found
            </h2>
          </GlareHover>
        </div>
      </div>
    );
  }
  if (testLoading) {
    return (
      <div className="grid place-items-center my-5">
        <div style={{ height: "600px", position: "relative" }}>
          <GlareHover
            glareColor="#ffffff"
            glareOpacity={0.3}
            glareAngle={-30}
            glareSize={300}
            transitionDuration={800}
            playOnce={false}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "900",
                color: "#333",
                margin: 0,
              }}
              className="animate-pulse"
            >
              Loading test cases
            </h2>
          </GlareHover>
        </div>
      </div>
    );
  }

  return (
    <div className="text-left text-xl text-gray-300 break-words whitespace-pre-wrap max-w-full flex flex-row justify-center gap-2">
      <div className="text-gray-300 text-sm border-2 w-[50vw] font-mono p-8">
        <p className="text-2xl text-center font-sans font-bold mb-5 shiny-text-java">
          {" "}
          {problem.title}{" "}
        </p>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {problem.description}
        </ReactMarkdown>
      </div>

      <div className="">
        <div className="w-full bg-[var(--gray-dark)] mt-5 py-2 rounded-tl-xl rounded-tr-xl">
          <p className="mx-2">Code</p>
        </div>

        <select
          value={lang}
          className="bg-[var(--gray-dark)] text-white font-sans font-semibold px-4 rounded-b-xl outline-none focus:outline-2 focus:outline-sky-500 focus:ring-2"
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const newLang = e.target.value;
            localStorage.setItem("lang", newLang);
            setLang(newLang);
            setCode(getBoilerByLang(problem, newLang) || "boiler not found");
          }}
        >
          <option value="python">Python</option>
          <option value="java" disabled>
            Java
          </option>
          <option value="cpp" disabled>
            SQL
          </option>
          <option value="c" disabled>
            C
          </option>
          <option value="javascript">Javascript</option>
          <option value="ruby" disabled>
            Ruby
          </option>
          <option value="php" disabled>
            PHP
          </option>
          <option value="perl" disabled>
            Perl
          </option>
          <option value="csharp" disabled>
            C#
          </option>
        </select>

        <hr className="w-full my-2 text-[var(--gray-light)]" />

        <div className="custom-scrollbar py-4 px-4 bg-[var(--gray-medium)] overflow-scroll text-sm resize-none w-[48vw] min-h-[32.5vh] max-h-[50vh] outline-none rounded-xl font-mono font-light">
          <ReactCodeMirror
            basicSetup={true}
            value={code}
            onChange={setCode}
            theme={oneDark}
            className="custom-scrollbar"
          />
        </div>

        <div className="grid place-items-center">
          <div className="flex flex-row space-x-2 align-center px-4">
            <button
              onClick={async () => {
                if (isSolved) {
                  setOutput("You already solved this problem")
                  return;
                }
                if (!testCases.length) {
                  await fetchTestCases(problem);
                }
                pistonExec(testCases);
                handleSubmissions();
              }}
              disabled={loading}
              role="button"
              aria-label="run button"
              className={` 
              active:scale-90 transition-all duration-300 hover:bg-[var(--gray-light))] hover:opacity-80 w-full flex flex-row items-center gap-5 bg-[var(--gray-dark)] py-4 px-8 rounded-xl my-2 hover:cursor-pointer`}
            >
              <FaPlay size={40} className="mt-1 text-[var(--color-success)]" />
              <p className="text-xl text-[var(--color-success)]">Run</p>
            </button>

            <button
              aria-label="reset to original button"
              className="active:scale-90 transition-all duration-300 hover:bg-[var(--gray-light))] hover:opacity-80 w-full flex flex-row items-center gap-5 bg-[var(--gray-dark)] py-4 px-8 rounded-xl my-2 hover:cursor-pointer"
              onClick={() => {
                setCode(getBoilerByLang(problem, lang) || "boiler not found");
              }}
            >
              <RiResetRightFill size={50} className="text-cyan-400" />
              <p className="text-xl text-cyan-400">Reset to original</p>
            </button>

            <button
              aria-label="go back button"
              className="active:scale-90 transition-all duration-300 hover:bg-[var(--gray-light))] hover:opacity-80 w-full flex flex-row items-center gap-5 bg-[var(--gray-dark)] py-4 px-8 rounded-xl my-2 hover:cursor-pointer"
              onClick={() => {
                router.push("/problems");
              }}
            >
              <FaBackward size={50} className="text-orange-500" />
              <p className="text-xl text-orange-500">Go back</p>
            </button>
          </div>
        </div>

        <div className="max-w-[48vw] max-h-[20vh] overflow-y-scroll custom-scrollbar bg-[var(--gray-light)] font-mono font-semibold px-4 py-4">
          <p>output: {cleanedOutput} </p>
          <p
            className={`
            ${
              passRate > 75
                ? "text-green-500"
                : passRate > 50
                ? "text-lime-500"
                : passRate > 25
                ? "text-yellow-600"
                : "text-red-600"
            }
            `}
          >
            test cases passed: {passRate}%{" "}
          </p>
        </div>
      </div>
    </div>
  );
}
