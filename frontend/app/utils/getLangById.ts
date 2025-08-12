export const getLangById = (id: number) => {
    switch (id) {
      case 1:
        return "python";
        break;
      case 2:
        return "java";
        break;
      case 3:
        return "javascript";
        break;
      case 4:
        return "ruby";
        break;
      case 5:
        return "elixir";
        break;
      case 6:
        return "c";
        break;
      default:
        return "python";
    }
  };