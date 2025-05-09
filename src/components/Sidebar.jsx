import { useState } from 'react';
import logo_dark from "../assets/logo1.jpg";
import { Home, Search, Film, Tv, Star, Clock, List, User } from "lucide-react";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={`h-screen bg-black text-white flex flex-col gap-6 py-6 px-4 fixed transition-all duration-300 ${isExpanded ? 'w-56' : 'w-16'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo */}
      <div className="flex items-center justify-center">
        <span className="text-red-500 text-2xl">
          <img src={logo_dark} alt="logo" className="w-8 h-8"/>
        </span>
        {isExpanded && <span className="ml-2 font-bold">StreamMax</span>}
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col gap-5 mt-6">
        <SidebarItem icon={<Home size={20} />} label="Home" isExpanded={isExpanded} />
        <SidebarItem icon={<Search size={20} />} label="Search" isExpanded={isExpanded} />
        <SidebarItem icon={<Film size={20} />} label="Movies" isExpanded={isExpanded} />
        <SidebarItem icon={<Tv size={20} />} label="TV Shows" isExpanded={isExpanded} />
        <SidebarItem icon={<Star size={20} />} label="Top Picks" isExpanded={isExpanded} />
        <SidebarItem icon={<Clock size={20} />} label="New & Latest" isExpanded={isExpanded} />
        <SidebarItem icon={<List size={20} />} label="My List" isExpanded={isExpanded} />
        <SidebarItem icon={<User size={20} />} label="My Space" isExpanded={isExpanded} />
      </nav>
    </div>
  );
};

const SidebarItem = ({ icon, label, isExpanded }) => (
  <div className="flex items-center group cursor-pointer transition-all relative">
    <div className={`flex items-center justify-center p-2 rounded-full group-hover:bg-white/10 transition-all ${isExpanded ? '' : 'mx-auto'}`}>
      {icon}
    </div>
    {isExpanded ? (
      <span className="ml-3">{label}</span>
    ) : (
      <div className="absolute left-16 bg-gray-800 text-white px-3 py-2 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
        {label}
      </div>
    )}
  </div>
);

export default Sidebar;