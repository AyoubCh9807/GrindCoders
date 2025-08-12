"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Problem } from "@/app/types/Problem";
import "highlight.js/styles/github.css";

import GlareHover from "@/components/UI/GlareHover";
import { getTopics } from "@/app/utils/getTopics";

import { TopicBadge } from "@/components/TopicBadge";
import { CompanyBadge } from "@/components/CompanyBadge";
import { topics } from "../../../data/topics";
import { companies } from "../../../data/companies";
import { getCompanies } from "@/app/utils/getCompanies";
import { FaRegFileAlt, FaSearch } from "react-icons/fa";
import { easeIn, easeInOut, motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

export default function Problems() {
  const [selectedTopic, setSelectedTopic] = useState("General");
  const [selectedCompany, setSelectedCompany] = useState("Any");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filtered, setFiltered] = useState<Problem[]>([]);
  const [query, setQuery] = useState<string>("");
  const router = useRouter();

  const getProblems = async () => {
    try {
      setError(null);
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/problems", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data;
      setProblems(data.problems || []);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    const decoded = jwtDecode(token) as {username: string, id: number}
    const uName = decoded.username;
    if (!decoded) {
      router.push("/login");
      return;
    }
    const id = decoded.id;
    if (!uName || !id) {
      router.push("/login");
    }
  });

  useEffect(() => {
    getProblems();
  }, []);

  useEffect(() => {
    setFiltered(problems);
  }, []);

  useEffect(() => {
    if (
      selectedTopic.trim().toLowerCase() === "general" &&
      selectedCompany.trim().toLowerCase() === "any"
    ) {
      setFiltered(problems);
    } else {
      const results: Problem[] = problems.filter((p) => {
        const matchesTopic =
          selectedTopic.toLowerCase() === "general" ||
          getTopics(p.topic).includes(selectedTopic.toLowerCase());

        const matchesCompany =
          selectedCompany.toLowerCase() === "any" ||
          getCompanies(p.companies).includes(selectedCompany.toLowerCase());

        return matchesTopic && matchesCompany;
      });

      setFiltered(results);
    }
  }, [selectedTopic, selectedCompany, query, problems]);

  return (
    <div className="mb-10">
      {loading && (
        <>
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
                  Loading problems...
                </h2>
              </GlareHover>
            </div>
          </div>
        </>
      )}
      <div className="flex flex-row justify-evenly gap-5 bg-[var(--background)] mb-20 mt-10">
        {topics.map(({ label, icon }) => {
          return (
            <TopicBadge
              key={label}
              label={label}
              icon={icon}
              selected={selectedTopic == label}
              onClick={() => {
                setSelectedTopic(label);
              }}
            />
          );
        })}
      </div>

      <div className="flex flex-row justify-evenly gap-7 bg-[var(--background)] mb-20 mt-10 flex-wrap">
        {companies.map(({ label, icon }) => {
          return (
            <CompanyBadge
              key={label}
              label={label}
              icon={icon}
              selected={selectedCompany == label}
              onClick={() => {
                setSelectedCompany(label);
              }}
            />
          );
        })}
      </div>

      <div className="grid place-items-center min-h-[40vh]">
        <div className="my-2 border border-white/20 w-[30vw] flex flex-col items-center gap-4 p-6 bg-[var(--gray-dark)] rounded-2xl shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <FaSearch size={22} className="text-rose-500" />
            <p className="text-xl sm:text-2xl font-bold text-white">
              Search Problems
            </p>
          </div>
          <div className="w-full max-w-md">
            <div className="relative">
              <input
                type="text"
                className="w-full px-5 py-3 pr-12 bg-white/10 text-white border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all duration-200 placeholder:text-white/60"
                placeholder="e.g., Two Sum, Linked List..."
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setQuery(e.target.value)
                }
              />
              <FaSearch
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"
                size={18}
              />
            </div>

            <div className="grid place-items-center">
              <div
                aria-label="suggestions"
                className="w-[20vw]
                bg-[var(--gray-dark)] overflow-hidden shadow-xl 
               px-4 py-4 rounded-xl flex flex-col space-y-2"
              >
                {filtered.filter((p) =>
                  p.title.toLowerCase().includes(query.toLowerCase())
                ).length > 0 &&
                  filtered
                    .filter((p) =>
                      p.title.toLowerCase().includes(query.toLowerCase())
                    )
                    .slice(0, 3)
                    .map((s, i) => {
                      return (
                        <motion.div
                          className="bg-white/10 text-white border border-white/20 px-4 py-2
                         hover:bg-rose-300/35 transition-all duration-200 hover:cursor-pointer
                         rounded-xl"
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 100, y: 0 }}
                          transition={{ ease: easeInOut }}
                        >
                          <div className="flex items-center gap-2">
                            <FaRegFileAlt className="text-rose-400" />
                            <a
                              className={`truncate ${
                                s.difficulty.toLowerCase() == "easy"
                                  ? "text-green-600"
                                  : s.difficulty.toLowerCase() == "medium"
                                  ? "text-orange-400"
                                  : "text-red-500"
                              }`}
                              href={`/problems/${s.id}`}
                            >
                              {s.title}
                            </a>
                          </div>
                        </motion.div>
                      );
                    })}
                {filtered.filter((p) =>
                  p.title.toLowerCase().includes(query.toLowerCase())
                ).length == 0 && (
                  <motion.div
                    className="bg-white/10 text-white border border-white/20 px-4 py-2
                         hover:bg-rose-300/35 transition-all duration-200 hover:cursor-pointer
                         rounded-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 100, y: 0 }}
                    transition={{ ease: easeInOut }}
                  >
                    <div className="flex items-center gap-2">
                      <FaRegFileAlt className="text-rose-400" />
                      <p className="truncate">No problem found</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {filtered
        .filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
        .map((problem, index) => {
          return (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 100 }}
              transition={{ ease: easeInOut }}
              key={index}
            >
              <div
                className={`${
                  index % 2 == 0
                    ? "bg-[var(--gray-medium)] z-0 hover:cursor-pointer hover:bg-[var(--gray-dark)] hover:opacity-80"
                    : "bg-transparent hover:bg-[var(--gray-dark)] hover:opacity-80 z-0"
                } flex flex-row justify-between mx-20 px-10 py-4 rounded-lg`}
              >
                <a
                  href={`/problems/${problem.id}`}
                  className="text-gray-200 font-sans font-bold tracking-wide"
                >
                  {index + 1}. {problem.title}
                </a>

                <p
                  className={`
              ${
                problem.difficulty == "Easy"
                  ? "text-green-500"
                  : problem.difficulty == "Medium"
                  ? "text-yellow-500"
                  : "text-red-700"
              }
                text-center`}
                >
                  {problem.difficulty === "Medium"
                    ? "Med."
                    : problem.difficulty}
                </p>
              </div>
            </motion.div>
          );
        })}

      {error && (
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
      )}
    </div>
  );
}

/*
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {problem.description}
            </ReactMarkdown>
*/
