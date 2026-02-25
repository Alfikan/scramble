import { 
  LayoutDashboard,
  Users,
  Clock,
  Trophy,
  MessageSquare,
  Bot,
  Brain
} from 'lucide-react';
export const navigationItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    badge: null,
  },
  {
    name: "Study Rooms",
    icon: Users,
    path: "/rooms",
    badge: null,
  },
  {
    name: "Private Space",
    icon: Clock,
    path: "/private-space",
    badge: null,
  },
  {
    name: "AI Assistant",
    icon: Bot,
    path: "/ai-chat",
    badge: "New",
  },
  {
    name: "AI Quiz",
    icon: Brain,
    path: "/ai-quiz",
    badge: "New",
  },
  {
    name: "Leaderboard",
    icon: Trophy,
    path: "/leaderboard",
    badge: null,
  },
  {
    name: "Messages",
    icon: MessageSquare,
    path: "/messages",
    badge: null,
  },
];