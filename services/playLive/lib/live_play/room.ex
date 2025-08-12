defmodule Lievplay.Room do
  @derive Jason.Encoder
  @enforce_keys [:name]
  defstruct [
   :id,
   :name,
   :players,
   :language,
   :questions,
   :messages,
   :public,
   :started,
   :countfown_started,
  ]
end
