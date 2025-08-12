import { JSONValue } from "./JSONValue"

export type TestCase = {
    id: number;
    input: JSONValue;
    output: JSONValue;
    problem_id: number;
}