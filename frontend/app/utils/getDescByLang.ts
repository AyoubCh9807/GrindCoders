export const getDescByLang = (lang: string) => {
  switch (lang.toLowerCase()) {
    case "python":
      return `
        The beginner-friendly powerhouse - 
        readable syntax for everything from AI to web apps.
        'Batteries included' philosophy with massive libraries
        `;
    case "java":
      return `Write Once, Run Anywhere workhorse - 
      enterprise-grade and verbose.
        Android apps, banking systems, and Minecraft's backbone.
        `;
    case "javascript":
      return `
The web's universal language - runs in every browser.
From simple scripts to full-stack frameworks like React/Node.`;
    case "elixir":
      return `
       Functional programming meets Ruby elegance - built for scalability.
Concurrency magic powered by Erlang's BEAM VM.
        `;
    case "c":
      return `
        The mother of all languages - close to metal and blazing fast.
OS kernels, embedded systems, and where performance is critical.
        `;
    case "ruby":
      return `
Developer happiness first - elegant syntax for web and scripts.
Rails framework revolutionized web development.
        `;
    default:
      return `The core concepts that transcend languages - logic made executable.
Problem-solving through algorithms and data structures.`;
  }
};
