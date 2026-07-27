import React from "react";
import { OpenProjectProvider } from "./providers/OpenProject";

interface AppProps {
  children: React.ReactNode;
}

const App: React.FC<AppProps> = ({ children }) => {
  return (
    <OpenProjectProvider>
      <div className="min-h-screen bg-gradient-to-br from-[#a66941]/10 via-[#d79b65]/20 to-[#c6895a]/30">
        {children}
      </div>
    </OpenProjectProvider>
  );
};

export default App;
