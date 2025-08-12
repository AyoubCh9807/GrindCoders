export type Problem = {
    id: number;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard'
    topic: string;
    companies: string;
    boilerplate_PY: string;
    boilerplate_JS: string;
    boilerplate_CPP: string;
}