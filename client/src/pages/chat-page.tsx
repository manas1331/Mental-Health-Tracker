import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ChatBubble } from "@/components/ui/chat-bubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";
import { SendHorizontal, Trash2, AlertTriangle, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  depressionScore?: number;
}

interface MentalHealthAnalysis {
  depressionScore: number;
  anxietyScore: number;
  stressScore: number;
  recommendations: string[];
}

export default function ChatPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  useEffect(() => {
    // If user is not authenticated, redirect to auth page
    if (!user) {
      setLocation("/auth");
      return;
    }
  }, [user, setLocation]);

  // Fetch chat history
  const { data: chatHistory } = useQuery({
    queryKey: ["/api/chat/history"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/chat/history");
      return await res.json();
    }
  });
  
  // Set messages when chatHistory is loaded
  useEffect(() => {
    if (chatHistory && chatHistory.length > 0) {
      setMessages(chatHistory.map((msg: any) => ({
        id: msg.id.toString(),
        content: msg.content,
        isUser: msg.isUser,
        timestamp: new Date(msg.timestamp)
      })));
    } else {
      // Set initial welcome message if no history
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: `Hi ${user?.username}! I'm your Mental Health Assistant. How are you feeling today?`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [chatHistory, user?.username]);

  // Fetch mental health analysis
  const { data: analysis } = useQuery<MentalHealthAnalysis>({
    queryKey: ["/api/mental-health/analysis"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/mental-health/analysis");
      return await res.json();
    },
  });

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send the message to backend
      const response = await apiRequest("POST", "/api/chat", { message: input });
      const data = await response.json();

      // Add response after a small delay to show typing indicator
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          isUser: false,
          timestamp: new Date(),
          depressionScore: data.depressionScore
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: `Let's start a new conversation. How are you feeling today?`,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    toast({
      title: "Chat cleared",
      description: "Your conversation has been reset.",
    });
  };

  const getDepressionLevelLabel = (score: number) => {
    if (score >= 70) return "Severe";
    if (score >= 40) return "Moderate";
    if (score >= 20) return "Mild";
    return "Minimal";
  };

  const getDepressionLevelColor = (score: number) => {
    if (score >= 70) return "bg-red-500";
    if (score >= 40) return "bg-orange-500";
    if (score >= 20) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col h-full">
        {/* Chat header */}
        <div className="bg-gradient-to-r from-primary to-purple-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                <span className="text-primary">
                  <Heart className="h-5 w-5" />
                </span>
              </div>
              <div className="ml-3">
                <p className="text-white font-medium">Mental Health Assistant</p>
                <p className="text-primary-100 text-sm">How are you feeling today?</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/10"
                onClick={() => setShowAnalysis(!showAnalysis)}
              >
                <AlertTriangle className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/10"
                onClick={clearChat}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mental health analysis */}
        {showAnalysis && analysis && (
          <div className="p-4 bg-white/10 dark:bg-black/10 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div>
                <div className="text-sm mb-1 flex justify-between">
                  <span>Depression</span>
                  <span className="font-semibold">{getDepressionLevelLabel(analysis.depressionScore)}</span>
                </div>
                <Progress value={analysis.depressionScore} className={`h-2 ${getDepressionLevelColor(analysis.depressionScore)}`} />
              </div>
              <div>
                <div className="text-sm mb-1 flex justify-between">
                  <span>Anxiety</span>
                  <span className="font-semibold">{getDepressionLevelLabel(analysis.anxietyScore)}</span>
                </div>
                <Progress value={analysis.anxietyScore} className={`h-2 ${getDepressionLevelColor(analysis.anxietyScore)}`} />
              </div>
              <div>
                <div className="text-sm mb-1 flex justify-between">
                  <span>Stress</span>
                  <span className="font-semibold">{getDepressionLevelLabel(analysis.stressScore)}</span>
                </div>
                <Progress value={analysis.stressScore} className={`h-2 ${getDepressionLevelColor(analysis.stressScore)}`} />
              </div>
            </div>
            
            {(analysis.depressionScore > 70 || analysis.anxietyScore > 70 || analysis.stressScore > 70) && (
              <Alert className="mb-3 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertTitle className="text-red-600 dark:text-red-400">
                  Please seek professional help
                </AlertTitle>
                <AlertDescription className="text-red-600 dark:text-red-400 text-sm">
                  Your responses indicate significant distress. This app is not a substitute for professional mental health care.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="text-sm font-medium mb-2">Recommendations:</div>
            <ul className="text-xs space-y-1 list-disc list-inside">
              {analysis.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Chat messages */}
        <div className="flex-grow p-4 overflow-y-auto bg-gray-50 dark:bg-gray-700 space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                content={message.content}
                isUser={message.isUser}
              />
            ))}
            {isLoading && (
              <ChatBubble 
                content="..." 
                isTyping={true}
                isUser={false}
              />
            )}
            <div ref={messagesEndRef} />
          </motion.div>
        </div>

        {/* Chat input */}
        <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
          <div className="flex items-center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type how you're feeling..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="px-4 py-3 bg-primary rounded-r-lg hover:bg-primary/90 transition-colors"
            >
              <SendHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
