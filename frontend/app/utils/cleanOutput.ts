export const cleanOutput = (output: string) => {
    if(output.includes(".txt")) { return "Invalid code, please try writing valid code." }
    const updated = output
    .trim()
    .split("\n")
    .filter((p) => !p.includes("%"))
    .join("\n")
    return updated
    //return updated.length > 50 ? `${updated.slice(97)}...` : updated
}