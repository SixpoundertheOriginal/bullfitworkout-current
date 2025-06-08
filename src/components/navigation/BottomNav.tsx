
import { Clock, User as UserIcon, Dumbbell, BarChart3, Zap } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useWorkoutNavigation } from "@/context/WorkoutNavigationContext";
import { useWorkoutState } from "@/hooks/useWorkoutState";
import { cn } from "@/lib/utils";

export const BottomNav = () => {
  const location = useLocation();
  const { confirmNavigation } = useWorkoutNavigation();
  const { exercises, elapsedTime } = useWorkoutState();
  
  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path === "/overview" && location.pathname === "/overview") return true;
    if (path === "/training-session" && location.pathname === "/training-session") return true;
    if (path === "/workouts" && location.pathname === "/workouts") return true;
    if (path === "/profile" && location.pathname === "/profile") return true;
    if (path === "/all-exercises" && location.pathname === "/all-exercises") return true;
    return false;
  };
  
  const isWorkoutActive = Object.keys(exercises).length > 0 && elapsedTime > 0;
  
  // Prevent showing bottom nav on dialog or auth page
  const isDialogOpen = document.querySelector('[role="dialog"]') !== null;
  const isAuthPage = location.pathname === '/auth';
  
  if (isDialogOpen || isAuthPage) {
    return null;
  }
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 grid grid-cols-5 border-t border-gray-800/50 bg-gray-900/95 backdrop-blur-sm z-10 safe-bottom">
      <NavButton 
        icon={<Clock size={20} />} 
        label="Home" 
        active={isActive('/')} 
        onClick={() => confirmNavigation('/')} 
      />
      <NavButton 
        icon={<BarChart3 size={20} />} 
        label="Overview" 
        active={isActive('/overview')}
        onClick={() => confirmNavigation('/overview')} 
      />
      <NavButton 
        icon={<Zap size={20} />} 
        label="Training"
        active={isActive('/training-session')}
        onClick={() => confirmNavigation('/training-session')}
        highlight={isWorkoutActive}
      />
      <NavButton 
        icon={<Dumbbell size={20} />} 
        label="Exercises"
        active={isActive('/all-exercises')}
        onClick={() => confirmNavigation('/all-exercises')}
      />
      <NavButton 
        icon={<UserIcon size={20} />} 
        label="Profile" 
        active={isActive('/profile')}
        onClick={() => confirmNavigation('/profile')} 
      />
    </nav>
  );
};

const NavButton = ({ 
  icon, 
  label, 
  active = false, 
  onClick,
  highlight = false
}: { 
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  highlight?: boolean;
}) => {
  return (
    <button 
      onClick={onClick} 
      className={cn(
        "flex flex-col items-center justify-center py-3 transition-all duration-200 ease-out",
        "active:scale-95 active:bg-gray-800/30",
        "hover:bg-gray-800/20",
        active ? 'text-white' : 'text-gray-500',
        highlight && 'relative'
      )}
    >
      <div className="transition-transform duration-200 ease-out">
        {icon}
      </div>
      <span className="text-xs mt-1 transition-colors duration-200">{label}</span>
      {highlight && (
        <span className="absolute top-2 right-1/4 h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
      )}
    </button>
  );
};
