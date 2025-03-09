'use client';

import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  Bookmark,
  Home,
  Settings,
  HelpCircle,
  LogOut,
  User,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  // Sample study kits for the sidebar
  const studyKits = [
    { id: '1', name: 'Calculus Fundamentals', active: true },
    { id: '2', name: 'Organic Chemistry', active: false },
    { id: '3', name: 'World History', active: false },
  ];

  // Sample recent activities
  const recentActivities = [
    { id: '1', title: 'Derivatives Quiz', type: 'quiz', time: '2 hours ago' },
    {
      id: '2',
      title: 'Limits Flashcards',
      type: 'flashcards',
      time: 'Yesterday',
    },
    { id: '3', title: 'Integration Video', type: 'video', time: '2 days ago' },
  ];

  return (
    <aside
      className={`bg-gray-50 border-r border-gray-200 h-screen sticky top-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
            </div>
            {!collapsed && (
              <span className="text-xl font-bold text-primary">AInstein</span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="overflow-y-auto flex-grow">
          <div className="p-2">
            <Link
              to="/"
              className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md mb-1 transition-colors"
            >
              <Home className="h-5 w-5 mr-3" />
              {!collapsed && <span>Dashboard</span>}
            </Link>

            {!collapsed && (
              <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase mt-4">
                Study Kits
              </div>
            )}

            {studyKits.map((kit) => (
              <Link
                key={kit.id}
                to={'/study-kit/$id'}
                params={{ id: kit.id }}
                className={`flex items-center p-2 rounded-md ${
                  kit.active
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-100'
                } mb-1 transition-colors`}
              >
                <BookOpen className="h-5 w-5 mr-3" />
                {!collapsed && <span className="truncate">{kit.name}</span>}
              </Link>
            ))}

            <Link
              to="/study-kit/create"
              className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md mb-1 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-3"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              {!collapsed && <span>New Study Kit</span>}
            </Link>
          </div>

          {!collapsed && (
            <>
              <div className="p-4 border-t border-gray-200">
                <h3 className="font-medium text-sm text-gray-500 mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Recent Activity
                </h3>
                <div className="space-y-2">
                  {recentActivities.map((activity) => (
                    <Link
                      key={activity.id}
                      to={'/study-kit/$id'}
                      params={{ id: activity.id }}
                      className="block text-sm p-2 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <div className="font-medium text-foreground">
                        {activity.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {activity.time}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-gray-200">
                <h3 className="font-medium text-sm text-gray-500 mb-2 flex items-center">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Saved Materials
                </h3>
                <Link
                  to={'/study-kit/create'}
                  className="block text-foreground text-sm p-2 hover:bg-gray-100 rounded-md transition-colors"
                >
                  View all saved materials
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="p-0 h-auto w-full flex items-center justify-start hover:bg-transparent"
                >
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="User"
                    />
                    <AvatarFallback>US</AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <div className="text-left">
                      <div className="text-sm font-medium text-foreground">
                        User Name
                      </div>
                      <div className="text-xs text-muted-foreground">
                        user@example.com
                      </div>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </aside>
  );
}
