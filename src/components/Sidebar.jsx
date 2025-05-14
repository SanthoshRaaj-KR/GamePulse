import { useState } from "react";
import logo_dark from "../assets/logo1.jpg";
import cricketlogo from "../assets/cricket1.jpg";
import {
  Home,
  BarChart2,
  Zap,
  MessageCircle,
  User,
  ChevronDown,
  ChevronUp,
  Award,
  LayoutGrid,
  Moon,
  Sun,
  Trophy,
} from "lucide-react";

const Sidebar = ({ isExpanded, setIsExpanded }) => {
  const [activeItem, setActiveItem] = useState("Home");
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div
      className={`h-screen bg-gradient-to-b from-zinc-900 to-black text-white flex flex-col justify-between py-6 transition-all duration-300 border-r border-zinc-800 ${
        isExpanded ? "w-64" : "w-20"
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div>
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <img src={logo_dark} alt="logo" className="w-10 h-10 rounded-md" />
            {isExpanded && <span className="ml-3 font-bold text-xl tracking-tight">GamePulse</span>}
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col px-3 space-y-1">
          <SidebarItem 
            icon={<Home size={20} />} 
            label="Home" 
            isExpanded={isExpanded} 
            isActive={activeItem === "Home"}
            onClick={() => setActiveItem("Home")}
          />
          <SidebarItem 
            icon={<BarChart2 size={20} />} 
            label="Stats" 
            isExpanded={isExpanded} 
            isActive={activeItem === "Stats"}
            onClick={() => setActiveItem("Stats")}
          />
          <SidebarItem 
            icon={<Zap size={20} />} 
            label="Live Matches" 
            isExpanded={isExpanded}
            isActive={activeItem === "Live Matches"} 
            onClick={() => setActiveItem("Live Matches")}
          />
          <SidebarItem 
            icon={<MessageCircle size={20} />} 
            label="Channels" 
            isExpanded={isExpanded}
            isActive={activeItem === "Channels"}
            onClick={() => setActiveItem("Channels")}
          />
          <SidebarItem 
            icon={<User size={20} />} 
            label="Myself" 
            isExpanded={isExpanded}
            isActive={activeItem === "Myself"}
            onClick={() => setActiveItem("Myself")}
          />

          {/* Sports Dropdown */}
          <SportsDropdown isExpanded={isExpanded} activeItem={activeItem} setActiveItem={setActiveItem} />
        </nav>
      </div>

      {/* Theme Toggle */}
      <div className="px-3 mt-auto">
        <div 
          className={`flex items-center cursor-pointer p-3 rounded-lg transition-all duration-200 ${
            isExpanded ? "justify-between" : "justify-center"
          } hover:bg-white/5 hover:shadow-lg hover:shadow-purple-500/10`}
          onClick={toggleTheme}
        >
          <div className="flex items-center">
            <div className={`${isDark ? "text-purple-400" : "text-yellow-400"}`}>
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            {isExpanded && <span className="ml-3 text-sm font-medium">{isDark ? "Dark Mode" : "Light Mode"}</span>}
          </div>
          {isExpanded && (
            <div className="h-5 w-10 bg-zinc-700 rounded-full p-1 flex items-center">
              <div className={`h-3 w-3 rounded-full bg-purple-400 transform transition-transform duration-300 ${isDark ? "translate-x-0" : "translate-x-5"}`}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, isExpanded, isActive, onClick }) => (
  <div
    className={`flex items-center cursor-pointer p-3 rounded-lg transition-all duration-200 ${
      isActive 
        ? "bg-gradient-to-r from-purple-500/20 to-transparent text-purple-400 shadow-lg shadow-purple-500/10" 
        : "hover:bg-white/5 hover:shadow-lg hover:shadow-purple-500/10"
    }`}
    onClick={onClick}
  >
    <div className={`flex items-center justify-center ${isExpanded ? "" : "mx-auto"}`}>
      {icon}
    </div>
    {isExpanded && <span className={`ml-3 text-sm font-medium`}>{label}</span>}
    {!isExpanded && (
      <div className="absolute left-20 bg-zinc-800 text-white px-3 py-2 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
        {label}
      </div>
    )}
  </div>
);

const SportsDropdown = ({ isExpanded, activeItem, setActiveItem }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className={`flex items-center cursor-pointer p-3 rounded-lg transition-all duration-200 ${
          activeItem.includes("Sports") 
            ? "bg-gradient-to-r from-purple-500/20 to-transparent text-purple-400 shadow-lg shadow-purple-500/10" 
            : "hover:bg-white/5 hover:shadow-lg hover:shadow-purple-500/10"
        } ${isExpanded ? "justify-between" : "justify-center"}`}
        onClick={() => setActiveItem("Sports")}
      >
        <div className="flex items-center">
          <div>
            <Award size={20} />
          </div>
          {isExpanded && <span className="ml-3 text-sm font-medium">Sports</span>}
        </div>
        {isExpanded && (
          <div>
            {isHovering ? (
              <ChevronUp size={16} className="text-gray-400" />
            ) : (
              <ChevronDown size={16} className="text-gray-400" />
            )}
          </div>
        )}
      </div>

      {/* Dropdown menu */}
      {(isHovering && isExpanded) && (
        <div className="absolute left-0 right-0 mt-1 py-2 bg-zinc-800/95 backdrop-blur-sm rounded-lg shadow-lg shadow-purple-500/5 z-10 overflow-hidden transition-all duration-300">
          <SportsItem
            icon={<img src= {cricketlogo} alt="Football" className="w-4 h-4" />}
            label="Football"
            isActive={activeItem === "Sports-Football"}
            onClick={() => setActiveItem("Sports-Football")}
          />
          <SportsItem
            icon={<Trophy size={16} />}
            label="Cricket"
            isActive={activeItem === "Sports-Cricket"}
            onClick={() => setActiveItem("Sports-Cricket")}
          />
          <SportsItem
            icon={<LayoutGrid size={16} />}
            label="Basketball"
            isActive={activeItem === "Sports-Basketball"}
            onClick={() => setActiveItem("Sports-Basketball")}
          />
        </div>
      )}
      
      {/* Tooltip for collapsed state */}
      {(!isExpanded) && (
        <div className="absolute left-20 bg-zinc-800 text-white px-3 py-2 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
          Sports
        </div>
      )}
    </div>
  );
};

const SportsItem = ({ icon, label, isActive, onClick }) => (
  <div
    className={`flex items-center p-2 px-4 cursor-pointer transition-all duration-200 ${
      isActive ? "bg-purple-500/20 text-purple-400" : "hover:bg-white/5"
    }`}
    onClick={onClick}
  >
    <div className="flex items-center">
      <div>{icon}</div>
      <span className="ml-3 text-sm">{label}</span>
    </div>
  </div>
);

export default Sidebar;