import React, {
  useContext,
  createContext,
  useEffect,
  useState,
  ReactElement,
} from "react";

type AppProps = {
  theme: string;
  toggleTheme: (theme: string) => void;
};

const AppContext = createContext<AppProps | null>(null);

const AppProvider = ({ children }: { children: ReactElement }) => {
  const [theme, setTheme] = useState("system");

  // apply theme on load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [theme]);

  // handle the class toggling
  // switching to system and then toggling in system settings is not working atm
  useEffect(() => {
    if (theme === "system") {
      const isDark = window.matchMedia("prefers-color-scheme: dark").matches;
      document.documentElement.classList.toggle("dark", isDark);
    } else {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  // toggle theme manually
  const toggleTheme = (newTheme: string) => {
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

export default AppProvider;
