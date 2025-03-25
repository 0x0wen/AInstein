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
} from "@/components/ui/dropdown-menu"
import { useParams } from "@tanstack/react-router"
import {data} from "@/dummy"
export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { id } = useParams({ strict: false })
  return (
    <aside
      className={`bg-gray-50 border-r border-gray-200 h-screen sticky top-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2 p-1">
            <svg width="370" height="328" viewBox="0 0 370 328" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M141.5 208L150.5 198" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M216.5 204L225.5 194" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M154.5 204L142.5 217" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M229.5 200L217.5 213" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M173.5 218.5H203" stroke="white" strokeWidth="10" strokeLinejoin="round"/>
<path d="M173.5 210C173.5 223.153 163.892 233 153 233C142.108 233 132.5 223.153 132.5 210C132.5 196.847 142.108 187 153 187C163.892 187 173.5 196.847 173.5 210Z" stroke="white" strokeWidth="10"/>
<path d="M242.5 208.5C242.5 222.94 232.94 233 223 233C213.06 233 203.5 222.94 203.5 208.5C203.5 194.06 213.06 184 223 184C232.94 184 242.5 194.06 242.5 208.5Z" stroke="white" strokeWidth="10"/>
<path d="M271.5 266C269.667 281.333 258.7 313.4 229.5 319C200.3 324.6 165.667 322.667 152 321C141 319.167 116.8 307 108 273M271.5 266C272 261.667 278.8 258.3 302 279.5C308.8 275.9 322.167 274.667 328 274.5C327.833 269.167 326.4 258.6 322 259C317.6 259.4 309.833 250.833 306.5 246.5C306.5 241 305.6 229.5 302 227.5C312.4 220.3 322.333 235.5 326 244C332.667 246.5 346.1 250.2 346.5 245C346.9 239.8 338.667 232.833 334.5 230L333 213.5C331.667 206.833 326.4 193.5 316 193.5C319.2 188.7 333 186.833 339.5 186.5C346 190.5 360.1 195.2 364.5 182C355.3 179.2 347 169.833 344 165.5C340.5 159.167 329.2 148.2 312 155C321.6 131.8 335.667 132.333 341.5 135.5C348.667 137 362.8 136 362 120C351.6 123.6 336.333 105.5 330 96C325 91.8333 310.4 86 292 96C295.6 83.2 316.167 78.3333 326 77.5C321.833 72.1667 307.2 63.7 282 72.5C299.6 38.9 289.333 21.1667 282 16.5C286 23.5 284.9 34.9 248.5 24.5C240.1 20.9 230.333 38 226.5 47C225.333 37.5 226.4 16.5 240 8.5C217.6 4.5 198 23.1667 191 33C190.167 28.1667 190.5 15.8 198.5 5C177.3 8.6 169 26.8333 167.5 35.5C161.167 23.6667 142.8 2.7 120 13.5C132 11.1 136.333 37.5 137 51C134.167 40.1667 122.8 21.4 100 33C85.2 41.8 78.8333 32.3333 77.5 26.5C72 26 64.7 35.5 79.5 77.5C56.3 75.1 41.5 84.8333 37 90C44.3333 85.1667 62.2 81.2 75 104C49.8 88.8 31.8333 110.333 26 123C25 125.5 19.4 131 5 133C7.4 149.4 26 147.5 35 144.5C37.8333 141.833 46.1 142 56.5 164C40.9 162 30.6667 172.833 27.5 178.5C24.8333 181.5 17.2 188.6 8 193C13.6 204.6 29.6667 200.833 37 197.5C44.8333 198.833 59 201.7 53 202.5C47 203.3 43.1667 212.5 42 217V240C35 245.667 23.1 257.8 31.5 261C42 256 45.5 258.5 50 257C54.5 255.5 55.5 248 56.5 241.5C57.5 235 78 235 75 236C72 237 69.5 248.5 70.5 255C71.5 261.5 62.5 264 55.5 268.5C49.9 272.1 50.5 282 51.5 286.5C51.8333 284.167 54.5 280.4 62.5 284C70.5 287.6 79.5 287.167 83 286.5C86.3333 279.667 96 267.4 108 273M271.5 266C271.314 257.188 269.818 242.975 265.837 231M108 273C107.304 257.174 109.089 245.825 111.796 237.5M111.796 237.5C116.873 221.89 125.196 216.913 126.5 213C126.888 211.837 127.501 208.946 128.212 205M111.796 237.5C104.364 235.833 90.2 228.2 93 211C95.8 193.8 106.697 192.833 111.796 194.5C112.672 194.333 117.181 196.2 128.212 205M128.212 205C131.169 188.589 135.822 153.934 133 149.5C175.4 109.9 221.333 131 239 146.5C240.759 161.273 244.2 186.537 247.339 200.5M247.339 200.5C248.663 206.385 249.933 210.263 251 210.5C257.918 213.338 262.666 221.459 265.837 231M247.339 200.5C252.893 192.833 266.6 180.9 277 194.5C287.4 208.1 281.333 220.5 277 225C274.391 227 268.507 231 265.837 231" stroke="white" strokeWidth="10" strokeLinejoin="round"/>
</svg>

            </div>
            {!collapsed && (
              <span className="text-xl font-bold text-foreground"><span className='text-primary'>ai</span>nstein</span>
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

            {data.studyKits.map((kit) => (
              <Link
                key={kit.id}
                to={'/study-kit/$id'}
                params={{ id: kit.id }}
                className={`flex items-center p-2 rounded-md ${
                  kit.id == id
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
                  {data.recentActivities.map((activity) => (
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
                  Bookmark
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
