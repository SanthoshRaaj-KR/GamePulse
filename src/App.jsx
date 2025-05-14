import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Homepage from "./components/Homepage";

const App = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex h-screen bg-zinc-900 text-white overflow-hidden">
      <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <Homepage isExpanded={isExpanded} />
    </div>
  );
};

export default App;