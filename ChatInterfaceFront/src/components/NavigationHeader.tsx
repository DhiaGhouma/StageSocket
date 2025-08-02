import React from 'react';
import { 
  Home, 
  FolderOpen, 
  Users, 
  ClipboardList, 
  Search, 
  Bell, 
  User,
} from 'lucide-react';

const NavigationHeader: React.FC = () => {
  return (
    <header className="bg-[#1A1C24] h-[60px] flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Left Section - Logo and Navigation */}
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2">
          
          <span className="text-white font-bold text-lg">LOGO</span>
        </div>
        
        <nav className="flex items-center space-x-6">
          <button className="flex items-center space-x-2 text-[#B0B3B8] hover:text-white transition-colors">
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>
          <button className="flex items-center space-x-2 text-[#B0B3B8] hover:text-white transition-colors">
            <FolderOpen className="w-4 h-4" />
            <span>Project Management</span>
          </button>
          <button className="flex items-center space-x-2 text-[#B0B3B8] hover:text-white transition-colors">
            <Users className="w-4 h-4" />
            <span>Vendor Pool</span>
          </button>
          <button className="flex items-center space-x-2 text-[#B0B3B8] hover:text-white transition-colors">
            <ClipboardList className="w-4 h-4" />
            <span>Task Management</span>
          </button>
        </nav>
      </div>

      {/* Right Section - Actions and Profile */}
      <div className="flex items-center space-x-4">
        <button className="text-[#B0B3B8] hover:text-white transition-colors">
          <Search className="w-5 h-5" />
        </button>
        <button className="text-[#B0B3B8] hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#2D99A7] rounded-full"></span>
        </button>
        <button className="text-[#B0B3B8] hover:text-white transition-colors">
          <User className="w-5 h-5" />
        </button>
        <button className="border border-[#2D99A7] text-[#2D99A7] px-4 py-2 rounded-lg hover:bg-[#2D99A7] hover:text-white transition-all duration-200">
          My Projects
        </button>
      </div>
    </header>
  );
};

export default NavigationHeader;