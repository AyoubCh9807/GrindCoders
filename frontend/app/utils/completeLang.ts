export const completeLang = (lang: string) => {
    switch (lang.toLowerCase()) {
      case "py":
        return "python3";
      case "rb":
        return "ruby";
      case "php":
        return "php";
      case "cs":
        return "csharp";
      case "cpp":
        return "cpp";
      case "java":
        return "java";
      case "go":
        return "go";
      case "js":
        return "javascript";
      case "c":
        return "c";
      default:
        return "txt";
    }
  };