defmodule LivePlay.Question do
  @derive Jason.Encoder
  @enforce_keys [:title, :answers, :correct_answers]
  defstruct [:title, :answers, :correct_answers]
end
