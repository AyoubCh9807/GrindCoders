defmodule LivePlay.QuestionBank do
  alias LivePlay.Question

  def get_questions(language) do
    case String.downcase(language) do
      "elixir" ->
        [
          %Question{
            title: "What is a macro in Elixir?",
            answers: [
              "A function that is evaluated at compile-time",
              "A special kind of variable",
              "A database connection",
              "An HTTP request handler"
            ],
            correct_answers: [0]
          },
          %Question{
            title: "Which module is commonly used for concurrency in Elixir?",
            answers: [
              "GenServer",
              "Ecto",
              "Phoenix",
              "Plug"
            ],
            correct_answers: [0]
          },
          %Question{
            title: "What does the pipe operator (|>) do in Elixir?",
            answers: [
              "Chains function calls, passing the result as the first argument",
              "Starts a process",
              "Defines a module",
              "Performs pattern matching"
            ],
            correct_answers: [0]
          }
        ]

      "python" ->
        [
          %Question{
            title: "What does the 'def' keyword do in Python?",
            answers: [
              "Defines a function",
              "Declares a variable",
              "Imports a module",
              "Starts a loop"
            ],
            correct_answers: [0]
          },
          %Question{
            title: "Which data type is immutable in Python?",
            answers: [
              "Tuple",
              "List",
              "Dictionary",
              "Set"
            ],
            correct_answers: [0]
          },
          %Question{
            title: "What keyword is used to handle exceptions in Python?",
            answers: [
              "try/except",
              "catch/throw",
              "handle/rescue",
              "error/catch"
            ],
            correct_answers: [0]
          }
        ]

      "javascript" ->
        [
          %Question{
            title: "What is the keyword used to declare a constant in JavaScript?",
            answers: [
              "const",
              "let",
              "var",
              "constant"
            ],
            correct_answers: [0]
          },
          %Question{
            title: "Which method is used to parse JSON strings in JavaScript?",
            answers: [
              "JSON.parse()",
              "JSON.stringify()",
              "parseJSON()",
              "JSON.toObject()"
            ],
            correct_answers: [0]
          },
          %Question{
            title: "What is a closure in JavaScript?",
            answers: [
              "A function with access to its own scope plus outer scopes",
              "A way to close files",
              "An error handling mechanism",
              "A type of loop"
            ],
            correct_answers: [0]
          }
        ]

      "go" ->
        [
          %Question{
            title: "How do you declare a variable in Go?",
            answers: [
              "var x int = 10",
              "int x = 10",
              "let x = 10",
              "x := 10"
            ],
            correct_answers: [0, 3]  # both are correct
          },
          %Question{
            title: "Which keyword is used to start a new goroutine?",
            answers: [
              "go",
              "start",
              "goroutine",
              "spawn"
            ],
            correct_answers: [0]
          },
          %Question{
            title: "What is the zero value of an int in Go?",
            answers: [
              "0",
              "nil",
              "undefined",
              "-1"
            ],
            correct_answers: [0]
          }
        ]

      _ ->
        []
    end
  end
end
