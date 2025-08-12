export const getColorByLang = (selectedLang: string) => {
    switch (selectedLang.toLowerCase()) {
      case "python":
        return "#3572A5";
        break;
      case "java":
        return "#b07219";
        break;
      case "javascript":
        return "#f1e05a";
        break;
      case "elixir":
        return "#6E4A7E";
        break;
      case "c":
        return "#555555";
        break;
      case "ruby":
        return "#701516";
        break;
      default:
        return "	#0f0f0f";
    }
  };