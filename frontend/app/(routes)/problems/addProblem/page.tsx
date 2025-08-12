"use client";

import { useState, useRef } from "react";
import axios from "axios";

export default function AddProblem() {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [diff, setDiff] = useState("Easy");
  const [topic, setTopic] = useState("");
  const [companies, setCompanies] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!["Easy", "Medium", "Hard"].includes(diff)) {
        console.log("Invalid difficulty");
        return;
      }
      const res = await axios.post("http://localhost:8080/api/problems", {
        title: title,
        description: description,
        difficulty: diff,
        topic: topic,
        companies: companies
      });
      console.log(res.data);
      setTitle("");
      setDescription("");
      setDiff("Easy");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <p className="text-3xl text-white font-sans font-extrabold tracking wide text-center my-10">
        Add problem
      </p>

      <div className="grid place-items-center">
        <div className="flex flex-row ">
          <p className="text-2xl text-white font-sans font-semibold">title:</p>

          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            type="text"
            className="mx-10 border-none font-sans font-bold text-black py-2 px-2 bg-gray-200 border-2 rounded-xl outline-none"
          />
        </div>
      </div>
      <br />
      <div className="grid place-items-center">
        <div className="flex flex-col text-center ">
          <p className="text-2xl text-white font-sans font-semibold">
            description:
          </p>

          <textarea
            value={description}
            ref={textAreaRef}
            className="mx-10 resize-none border-none text-black py-2 px-2 bg-gray-200 border-2 rounded-xl outline-none
            w-max max-w-[80vw] min-w-[40vw] font-sans font-bold"
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              if (textAreaRef.current) {
                textAreaRef.current.style.height = "auto";
                textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
              }
              setDescription(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="grid place-items-center">
        <div className="flex flex-col align-center justify-evenly">
          <label
            htmlFor="selection"
            className="text-2xl text-white font-sans font-semibold"
          >
            select difficutly
          </label>
          <select
            name="selection"
            className="text-black font-sans font-semibold bg-gray-300"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setDiff(e.target.value)
            }
          >
            <option value="Easy" className="text-green-700">
              Easy
            </option>
            <option value="Medium" className="text-yellow-500">
              Medium
            </option>
            <option value="Hard" className="text-red-700">
              Hard
            </option>
          </select>
        </div>

        <div className="flex flex-row my-10">
          <p className="text-2xl text-white font-sans font-semibold">Topic:</p>

          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTopic(e.target.value)
            }
            type="text"
            className="mx-10 border-none font-sans font-bold text-black py-2 px-2 bg-gray-200 border-2 rounded-xl outline-none"
          />
        </div>
        <div className="flex flex-row my-10">
          <p className="text-2xl text-white font-sans font-semibold">Companies:</p>

          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCompanies(e.target.value)
            }
            type="text"
            className="mx-10 border-none font-sans font-bold text-black py-2 px-2 bg-gray-200 border-2 rounded-xl outline-none"
          />
        </div>
      </div>

      <div className="grid place-items-center">
        <button
          className="text-2xl px-4 py-2 my-10 border-2 border-gray-500 hover:cursor-pointer rounded-xl text-black bg-gray-100 font-sans font-bold"
          onClick={() => {
            submitInfo();
          }}
        >
          Submit problem
        </button>
      </div>

      {loading && <p>Loading</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
