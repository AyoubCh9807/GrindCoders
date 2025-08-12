"use client";
import LetterGlitch from "@/components/UI/LetterGlitch";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { easeInOut, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { ImSpinner9 } from "react-icons/im";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [visibility, setVisibility] = useState<boolean>(false);
  const [loginErr, setLoginErr] = useState<string | null>(null);
  const [usernameErr, setUsernameErr] = useState<string | null>(null);
  const [pwErr, setPwErr] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const usernameRegex = /^[a-zA-Z0-9._]+$/;

  const login = async () => {
    if (!usernameRegex.test(username)) {
      setUsernameErr(
        "username can only contain letter, numbers, underscores and dots."
      );
      return;
    }
    if (username.length > 16 || username.length < 5) {
      setUsernameErr("username must be 5-16 characters.");
      return;
    }
    if (password.length < 8 || password.length > 16) {
      setPwErr("password must be 8-16 characters.");
      return;
    }
    try {
      setLoading(true);
      setLoginErr(null);

      const res = await axios.post("http://localhost:8080/api/login", {
        username: username,
        password: password,
      });

      if (!res.data || !res.data.token) {
        setLoginErr("Internal server error, please try again later");
      }

      const decodedToken = jwtDecode<{ username: string; id: number }>(
        res.data.token
      );
      const id = decodedToken.id;
      const uName = decodedToken.username;

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", String(id));
      localStorage.setItem("username", uName);

      toast.success("Logged in successfully!");
      router.push("/problems");
    } catch (error: any) {
      setPassword("");
      console.log("Error response:", error.response?.data);

      const isTooManyReqs = error.response?.status === 429
       if (isTooManyReqs) {
        let seconds: number = error.response.data.retry_after
        let minutes: number = 0;
        if(seconds > 60) {
          minutes = Math.ceil(seconds / 60)
          seconds = seconds % 60
        }
        setLoginErr(
          `Too many login attempts. Try again in ${minutes > 0 ? ` ${minutes} minute(s)` : ""}
          and ${seconds > 0 ? ` ${seconds} second(s)` : ""}
          `
        )
      } else {
        setLoginErr(error instanceof Error ? error.message : String(error));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0b0c10]">
      <div className="absolute inset-0 z-[40]">
        <LetterGlitch />
      </div>

      <div className="bg-gray-700/10 border border-gray-200/50 backdrop-blur-sm p-10 rounded-2xl shadow-xl w-[90%] max-w-md z-50">
        <div className="grid place-items-center">
          <p className="font-outfit shiny-text-light-violet font-extrabold tracking-wide text-white text-4xl text-center mb-6">
            Welcome back!
          </p>
        </div>

        <motion.div
          className=""
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.4, ease: easeInOut }}
        >
          <div className="">
            <div className="space-y-6">
              {/* Username */}
              <div className="space-y-2">
                <label className="font-bold font-outfit shiny-text-header tracking-wide text-2xl">
                  Username
                </label>
                {usernameErr && (
                  <p className="text-red-400 font-sans text-sm">
                    {usernameErr}
                  </p>
                )}
                <input
                  required
                  value={username}
                  placeholder="spongebob123"
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setUsernameErr(null);
                    setPwErr(null);
                  }}
                  type="text"
                  spellCheck={false}
                  autoComplete="username"
                  className="w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200 px-6 py-2 rounded-xl text-black font-sans text-xl font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold font-outfit shiny-text-header tracking-wide text-2xl bg-clip-text z-20">
                  Password
                </label>
                {pwErr && (
                  <p className="text-red-400 font-sans text-sm">{pwErr}</p>
                )}
                <div className="relative w-full pr-20">
                  <input
                    required
                    placeholder="spongebob123#%1"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setUsernameErr(null);
                      setPwErr(null);
                    }}
                    type={visibility ? "text" : "password"}
                    spellCheck={false}
                    autoComplete="password"
                    className="w-full focus:outline-blue-600 bg-gray-200 px-6 py-2 rounded-xl text-black font-sans text-xl font-bold"
                  />
                  <FaEye
                    size={40}
                    className={`absolute top-1/2 right-0 translate-y-[-50%] mr-7.5 hover:cursor-pointer ${
                      visibility ? "hidden" : ""
                    }`}
                    onClick={() => setVisibility(!visibility)}
                  />
                  <FaEyeSlash
                    size={40}
                    className={`absolute top-1/2 right-0 translate-y-[-50%] mr-7.5 hover:cursor-pointer ${
                      visibility ? "" : "hidden"
                    }`}
                    onClick={() => setVisibility(!visibility)}
                  />
                </div>
              </div>

              <br />

              <div className="grid place-items-center">
                {loginErr && (
                  <p className="text-red-400 font-sans text-sm mt-3 text-center">
                    {loginErr}
                  </p>
                )}

                <p className="text-sm text-gray-300 font-semibold">
                  Don't have an account?{" "}
                  <a
                    className="underline text-blue-400 hover:text-blue-300"
                    href="/register"
                  >
                    Sign up instead
                  </a>
                </p>

                <button
                  disabled={loading}
                  aria-disabled={loading}
                  className={`
          px-16 py-2 text-2xl font-sans font-bold border-none  text-white rounded-lg
          hover:cursor-pointer transition-all duration-300
          ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 hover:opacity-80"
          } 
          
                    `}
                  onClick={() => {
                    login();
                  }}
                >
                  Submit
                </button>
                {loading && (
                  <ImSpinner9
                    size={25}
                    className="animate-spin transition-all duration-200 my-3"
                  />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
