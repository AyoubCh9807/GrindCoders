defmodule LivePlay.Player do
  @derive Jason.Encoder
  @enforce_keys [:username, :id, :score, :correct_answers, :incorrect_answers]
  defstruct [:id, :username, :score, :correct_answers, :incorrect_answers]

end
