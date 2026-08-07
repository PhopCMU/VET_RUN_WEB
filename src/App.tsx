import React from "react";
import { OpenProjectProvider } from "./providers/OpenProject";

interface AppProps {
  children: React.ReactNode;
}

const App: React.FC<AppProps> = ({ children }) => {
  return (
    <OpenProjectProvider>
      <div className="app-shell theme-scope">{children}</div>
    </OpenProjectProvider>
  );
};

export default App;
