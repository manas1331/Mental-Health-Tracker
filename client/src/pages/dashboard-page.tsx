import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { 
  Layout, 
  Moon, 
  Sun, 
  LogOut, 
  MessageSquare,
  Home,
  User,
  Activity,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChatBubble } from "@/components/ui/chat-bubble";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [darkMode, setDarkMode] = useState(false);
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    // If user is not authenticated, redirect to auth page
    if (!user) {
      setLocation("/auth");
      return;
    }
    
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, [user, setLocation]);
  
  const toggleTheme = () => {
    const newMode = !darkMode;
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('darkMode', String(newMode));
    setDarkMode(newMode);
  };
  
  // Sample data for the wellness metrics
  const wellnessMetrics = [
    { id: 1, name: "Sleep Quality", value: 85, icon: Moon },
    { id: 2, name: "Heart Rate", value: 68, icon: Heart },
    { id: 3, name: "Activity", value: 72, icon: Activity },
    { id: 4, name: "Stress Level", value: 45, icon: Layout }
  ];
  
  // Sample recent messages for the dashboard
  const recentChatMessages = [
    { id: "1", content: "I've been feeling anxious lately, especially at work.", isUser: true },
    { id: "2", content: "I understand. It's important to recognize your feelings. Can you tell me more about what triggers this anxiety at work?", isUser: false },
    { id: "3", content: "Mainly when I have to present to large groups. I feel overwhelmed.", isUser: true }
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b dark:border-gray-700">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 text-transparent bg-clip-text">MindWell</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Mental Health Tracking</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            <Button 
              variant={activeTab === "overview" ? "default" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => setActiveTab("overview")}
            >
              <Home className="h-4 w-4 mr-2" />
              Overview
            </Button>
            <Button 
              variant={activeTab === "profile" ? "default" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => setActiveTab("profile")}
            >
              <User className="h-4 w-4 mr-2" />
              My Profile
            </Button>
            <Button 
              variant={activeTab === "chatbot" ? "default" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => setActiveTab("chatbot")}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Depression Chatbot
            </Button>
          </nav>
          
          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Dark Mode</span>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md dark:bg-gray-700 bg-gray-100"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
            <Button 
              variant="destructive" 
              className="w-full justify-start" 
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.username}</h1>
            <p className="text-gray-500 dark:text-gray-400">Here's your mental health summary</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src="/avatar.png" alt={user?.username} />
                  <AvatarFallback className="bg-primary">
                    {user?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setActiveTab("profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        
        {/* Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {wellnessMetrics.map((metric) => (
                <Card key={metric.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                      <metric.icon className="h-4 w-4 text-gray-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}{metric.name === "Heart Rate" ? " bpm" : "%"}</div>
                    <Progress value={metric.value} className="h-2 mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Mental Wellness Summary</CardTitle>
                  <CardDescription>Your weekly mental health report</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Mood Stability</span>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Anxiety Levels</span>
                        <span className="text-sm font-medium">35%</span>
                      </div>
                      <Progress value={35} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Depression Indicators</span>
                        <span className="text-sm font-medium">22%</span>
                      </div>
                      <Progress value={22} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Overall Wellbeing</span>
                        <span className="text-sm font-medium">81%</span>
                      </div>
                      <Progress value={81} className="h-2" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline" onClick={() => setActiveTab("chatbot")}>
                    Talk to AI Assistant
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Conversations</CardTitle>
                  <CardDescription>Your latest interactions with the AI assistant</CardDescription>
                </CardHeader>
                <CardContent className="max-h-[300px] overflow-y-auto">
                  <div className="space-y-4">
                    {recentChatMessages.map((message) => (
                      <ChatBubble
                        key={message.id}
                        content={message.content}
                        isUser={message.isUser}
                      />
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => setActiveTab("chatbot")}
                  >
                    Continue Conversation
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/avatar.png" alt={user?.username} />
                    <AvatarFallback className="text-2xl bg-primary">
                      {user?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Username</h3>
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                    {user?.username}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Settings</h3>
                  <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                    <span>Dark Mode</span>
                    <button
                      onClick={toggleTheme}
                      className="p-2 rounded-md dark:bg-gray-700 bg-gray-200"
                    >
                      {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Data Privacy</h3>
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Your data is securely stored and only used for analyzing your mental health patterns.
                      We never share your personal information with third parties.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="destructive" onClick={() => logoutMutation.mutate()}>
                  Logout
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Chatbot Tab */}
          <TabsContent value="chatbot">
            <Card className="h-[calc(100vh-12rem)]">
              <CardHeader className="bg-gradient-to-r from-primary to-purple-500 text-white">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center mr-3">
                    <span className="text-primary">
                      <MessageSquare className="h-5 w-5" />
                    </span>
                  </div>
                  <div>
                    <CardTitle>Depression Detection Chatbot</CardTitle>
                    <CardDescription className="text-primary-100">
                      Talk about how you're feeling
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow overflow-y-auto p-0">
                <iframe 
                  src="/chat" 
                  className="w-full h-full border-none"
                  title="Depression Detection Chatbot"
                ></iframe>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}