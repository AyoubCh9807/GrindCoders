"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ImSpinner9 } from "react-icons/im";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import LetterGlitch from "@/components/UI/LetterGlitch";

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [visibility, setVisibility] = useState<boolean>(false);
  const [visibility2, setVisibility2] = useState<boolean>(false);
  const [registerErr, setRegisterErr] = useState<string | null>(null);
  const [inputErr, setInputErr] = useState<string | null>(null);
  const [pwErr, setPwErr] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const usernameRegex = /^[a-zA-Z0-9._]+$/;

  const verifyUsername = () => {
    if (!usernameRegex.test(username)) {
      setInputErr(
        "username can only contain letter, numbers, underscores and dots"
      );
      return false;
    }
    if (username.length > 16) {
      setInputErr("username cannot be longer than 16 characters");
      return false;
    }
    if (username.length < 5) {
      setInputErr("username cannot be shorter than 5 characters");
      return false;
    }
    setInputErr(null);
    return true;
  };

  const verifyPassword = () => {
    if (password != password2) {
      setPwErr("passwords do not match");
      setLoading(false);
      return false;
    }
    if (password.length < 8) {
      setPwErr("password too short");
      setLoading(false);
      return false;
    }
    if (password.length > 16) {
      setPwErr("password too long");
      setLoading(false);
      return false;
    }
    if (password2.length < 8) {
      setPwErr("password too short");
      setLoading(false);
      return false;
    }
    if (password2.length > 16) {
      setPwErr("password too long");
      setLoading(false);
      return false;
    }
    setPwErr(null);
    return true;
  };

  const register = async () => {
    try {
      setLoading(true);
      setRegisterErr(null);
      setInputErr(null);
      setPwErr(null);
      const usernameVerif = verifyUsername();
      const pwVerif = verifyPassword();
      if (!pwVerif || !usernameVerif) {
        return;
      }

      const res = await axios.post("http://localhost:8080/api/register", {
        username: username,
        password: password,
      });
      if (!res.data) {
        setRegisterErr("Internal server error, please try again later");
      }
      localStorage.setItem("token", res.data.token);
      console.log("TOKEN RECEIVED: ", res.data.token)
      console.log("TOKEN IN LOCALSTORAGE SET TO: ", localStorage.getItem("token"))
      router.push("/problems");
      toast.success("Registered successfully!")
    } catch (error) {
      setPassword("");
      error instanceof Error
        ? setRegisterErr(error.message)
        : setRegisterErr(String(error));
    } finally {
      setLoading(false);
    }
  };
  // <div className="absolute inset-0 bg-[url('/images/forest.png')] bg-center bg-cover blur-sm z-[-10] "/>
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      <div className="absolute inset-0">
        <LetterGlitch />
      </div>

      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-gray-700/10 backdrop-blur-md border border-white/20 p-10 rounded-2xl shadow-xl w-[90%] max-w-md mb-5">
          <div className="grid place-items-center mb-6">
            <p className="font-outfit shiny-text-light-violet text-center font-extrabold tracking-wide text-white text-4xl">
              Sign up!
            </p>
          </div>

          <div className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <label className="font-bold font-outfit shiny-text-header tracking-wide text-2xl">
                Username
              </label>
              {inputErr && (
                <p className="text-red-400 font-sans text-sm">{inputErr}</p>
              )}
              <input
                onBlur={verifyUsername}
                required
                value={username}
                placeholder="spongebob123"
                onChange={(e) => {
                  setUsername(e.target.value);
                  setInputErr(null);
                  setPwErr(null);
                  verifyUsername();
                }}
                type="text"
                spellCheck={false}
                autoComplete="username"
                className="w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200 px-6 py-2 rounded-xl text-black font-sans text-xl font-bold"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="font-bold font-outfit shiny-text-header tracking-wide text-2xl">
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
                    setInputErr(null);
                    setPwErr(null);
                    verifyPassword();
                  }}
                  onBlur={verifyPassword}
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="font-bold font-outfit shiny-text-header tracking-wide text-2xl bg-clip-text z-20">
                Confirm password
              </label>
              <div className="relative w-full pr-20">
                <input
                  required
                  placeholder="spongebob123#%1"
                  value={password2}
                  onChange={(e) => {
                    setPassword2(e.target.value);
                    setInputErr(null);
                    setPwErr(null);
                    verifyPassword();
                  }}
                  onBlur={verifyPassword}
                  type={visibility2 ? "text" : "password"}
                  spellCheck={false}
                  autoComplete="password"
                  className="w-full focus:outline-blue-600 bg-gray-200 px-6 py-2 rounded-xl text-black font-sans text-xl font-bold"
                />
                <FaEye
                  size={40}
                  className={`absolute top-1/2 right-0 translate-y-[-50%] mr-7.5 hover:cursor-pointer ${
                    visibility2 ? "hidden" : ""
                  }`}
                  onClick={() => setVisibility2(!visibility2)}
                />
                <FaEyeSlash
                  size={40}
                  className={`absolute top-1/2 right-0 translate-y-[-50%] mr-7.5 hover:cursor-pointer ${
                    visibility2 ? "" : "hidden"
                  }`}
                  onClick={() => setVisibility2(!visibility2)}
                />
              </div>
            </div>

            {/* Footer Section */}
            <div className="grid place-items-center space-y-4 pt-4">
              {registerErr && (
                <p className="text-red-400 font-sans text-sm text-center">
                  {registerErr}
                </p>
              )}
              <p className="text-sm text-gray-300 font-semibold">
                Already have an account?{" "}
                <a
                  className="underline text-blue-400 hover:text-blue-300"
                  href="/login"
                >
                  Log in instead
                </a>
              </p>
              <button
                className={`px-16 py-2 text-2xl font-sans font-bold border-none text-white rounded-lg transition-all duration-300 ${
                  loading
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 hover:opacity-80 hover:cursor-pointer"
                }`}
                disabled={loading}
                onClick={register}
              >
                Submit
              </button>
              {loading && (
                <ImSpinner9
                  size={25}
                  className="animate-spin transition-all duration-200"
                />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
