import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import TrendingSection from "./components/TrendingSection";

const App = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <TrendingSection isExpanded={isExpanded} />
    </div>
  );
};

export default App;
