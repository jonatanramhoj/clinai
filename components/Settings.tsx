import { useState } from "react";
import { useAppContext } from "@/context/AppContext";

const themes = ["system", "dark", "light"];

const Settings = () => {
  const value = useAppContext();
  const [activeTheme, setActiveTheme] = useState(value?.theme || "system");

  const handleActiveTheme = (theme: string) => {
    setActiveTheme(theme);
    value?.toggleTheme(theme);
  };

  return (
    <div className="min-w-[500px] w-full rounded-2xl">
      <div className="w-full border-b border-b-gray-300 dark:border-b-gray-600 p-8">
        <h2 className="text-lg font-bold">Settings</h2>
      </div>
      <div className="flex w-full p-8 justify-between">
        <span>Theme</span>
        <div>
          {themes.map((theme) => (
            <button
              key={theme}
              className={`capitalize cursor-pointer p-2 ${
                activeTheme === theme
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-700 rounded-lg"
                  : "bg-none"
              }`}
              onClick={() => handleActiveTheme(theme)}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
