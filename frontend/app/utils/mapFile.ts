export const mapFile = (lang: string) => {
    switch (lang.toLowerCase()) {
      case "py":
        return "main.py";
        break;
      case "cpp":
        return "main.cpp";
        break;
      case "java":
        return "Main.java";
        break;
      case "go":
        return "main.go";
        break;
      case "js":
        return "main.js";
        break;
      case "c":
        return "main.c";
        break;
      default:
        return "main.txt";
        break;
    }
  };