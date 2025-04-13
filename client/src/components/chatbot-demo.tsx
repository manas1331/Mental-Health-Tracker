import { motion } from "framer-motion";
import { ChatBubble } from "@/components/ui/chat-bubble";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, FileText, Clock, SendIcon } from "lucide-react";

export function ChatbotDemo() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <motion.div 
            className="lg:col-span-5"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              <span className="block">Interactive AI Assistant</span>
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
              Chat with your data in natural language to get insights, generate custom reports, or troubleshoot issues. Our AI assistant helps you get the most out of your data.
            </p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 text-primary dark:text-primary-300 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">Natural Conversations</h4>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">Ask questions in plain English and get detailed answers.</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                    <FileText className="h-5 w-5" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">Custom Report Generation</h4>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">Create tailored reports by describing what you need.</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300 flex items-center justify-center">
                    <Clock className="h-5 w-5" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">Conversation History</h4>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">Pick up where you left off with saved conversations.</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Link href="/chat">
                <Button className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-600 transition-all duration-300">
                  Try It Now
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div 
            className="mt-12 lg:mt-0 lg:col-span-7"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-purple-500 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                      <span className="text-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                        >
                          <path d="M12 8V4H8" />
                          <rect width="16" height="12" x="4" y="8" rx="2" />
                          <path d="M2 14h2" />
                          <path d="M20 14h2" />
                          <path d="M15 13v2" />
                          <path d="M9 13v2" />
                        </svg>
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-white font-medium">ReportMate Assistant</p>
                      <p className="text-primary-100 text-sm">Online</p>
                    </div>
                  </div>
                  <div>
                    <button className="text-white hover:text-primary-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="19" cy="12" r="1" />
                        <circle cx="5" cy="12" r="1" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4 h-96 overflow-y-auto bg-gray-50 dark:bg-gray-700 space-y-4">
                <ChatBubble 
                  content="Hi there! I'm your ReportMate Assistant. How can I help you with your data reporting today?" 
                />
                
                <ChatBubble 
                  content="I need a weekly report showing task completion rates for the data engineering team."
                  isUser={true}
                />
                
                <ChatBubble 
                  content="I'll generate that for you! Would you like to include any specific metrics alongside task completion rates, such as time spent per task or blockers identified?"
                />
                
                <ChatBubble 
                  content="Yes, please include time estimates vs. actual time spent, and highlight the top 3 blockers from the past week."
                  isUser={true}
                />
                
                <ChatBubble
                  isTyping={true}
                />
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
                <div className="flex items-center">
                  <Input 
                    type="text" 
                    placeholder="Ask something..." 
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white" 
                  />
                  <Button className="px-4 py-2 bg-primary rounded-r-lg hover:bg-primary/90">
                    <SendIcon className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
