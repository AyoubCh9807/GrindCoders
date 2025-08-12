"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { Problem } from "../types/Problem"
import axios from "axios";

interface ProblemContextType {
    problems: Problem[];
    loading: boolean;
    error: string | null
}

const ProblemContext = createContext<ProblemContextType | undefined>(undefined)

export const ProblemsProvider = ({children}: {children: React.ReactNode}) => {
    
    const [problems, setProblems] = useState<Problem[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    
    const getProblems = async() => {
        try {
            setLoading(true)
            setError(null)
            const token = localStorage.getItem("token")
            const res = await axios.get("http://localhost:8080/api/problems", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const pbArr = res.data.problems
            setProblems(pbArr || [])
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError(String(err))
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getProblems()
    }, [])

    return(
        <ProblemContext.Provider value={{problems, loading, error}}>
            {children}
        </ProblemContext.Provider>
    )
}

export const useProblems = () => {
    const ctx = useContext(ProblemContext);
    if (!ctx) throw new Error("useProblems mush be used within ProblemsProvider")
    return ctx
}