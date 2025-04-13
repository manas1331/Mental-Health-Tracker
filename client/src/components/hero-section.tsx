import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export function HeroSection() {
  // Simplified version without useAuth
  const user = null; // No user for simplicity

  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-900 py-12 sm:py-16 lg:py-20">
      <div className="absolute top-0 right-0 hidden lg:block">
        <div className="text-primary-100 dark:text-gray-800 opacity-30">
          <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="200" cy="200" r="200" fill="currentColor"/>
          </svg>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 hidden lg:block">
        <div className="text-purple-100 dark:text-gray-800 opacity-30">
          <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="150" cy="150" r="150" fill="currentColor"/>
          </svg>
        </div>
      </div>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <motion.div 
            className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1>
              <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                <span className="block text-gray-900 dark:text-white">Automate Your </span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">Progress Reports</span>
              </span>
            </h1>
            <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
              Generate comprehensive weekly reports from your project management tools in seconds, not hours. 
              Our AI learns from your team's workflow and gets smarter over time.
            </p>
            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
              {!user ? (
                <div className="mt-3 sm:flex">
                  <div className="min-w-0 flex-1">
                    <Input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white sm:text-sm" 
                    />
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link href="/auth?tab=signup">
                      <Button className="w-full py-3 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-600 transition-all duration-300">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-5">
                  <Link href="/chat">
                    <Button className="w-full sm:w-auto py-3 px-6 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-600 transition-all duration-300">
                      Go to My Chat
                    </Button>
                  </Link>
                </div>
              )}
              {!user && (
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  Start free, no credit card required. By signing up, you agree to our <a href="#" className="font-medium text-primary">Terms</a> and <a href="#" className="font-medium text-primary">Privacy Policy</a>.
                </p>
              )}
            </div>
          </motion.div>
          <motion.div 
            className="mt-12 sm:mt-16 lg:mt-0 lg:col-span-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white dark:bg-gray-800 sm:max-w-md sm:w-full sm:mx-auto sm:rounded-lg sm:overflow-hidden shadow-xl">
              <div className="px-4 py-8 sm:px-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 bg-white dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400">
                      Demo Preview
                    </span>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Report</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <span className="h-2 w-2 mr-1.5 bg-green-400 rounded-full"></span>
                      Auto-generated
                    </span>
                  </div>

                  {/* Report Charts */}
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tasks Completed</div>
                      <div className="relative w-full h-32">
                        <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
                          <motion.div 
                            className="w-1/5 bg-primary rounded-t"
                            initial={{ height: "0%" }}
                            animate={{ height: "20%" }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                          />
                          <motion.div 
                            className="w-1/5 bg-primary rounded-t ml-1"
                            initial={{ height: "0%" }}
                            animate={{ height: "40%" }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                          />
                          <motion.div 
                            className="w-1/5 bg-primary rounded-t ml-1"
                            initial={{ height: "0%" }}
                            animate={{ height: "60%" }}
                            transition={{ duration: 0.7, delay: 0.5 }}
                          />
                          <motion.div 
                            className="w-1/5 bg-primary rounded-t ml-1"
                            initial={{ height: "0%" }}
                            animate={{ height: "80%" }}
                            transition={{ duration: 0.7, delay: 0.6 }}
                          />
                          <motion.div 
                            className="w-1/5 bg-gradient-to-t from-primary to-purple-500 rounded-t ml-1"
                            initial={{ height: "0%" }}
                            animate={{ height: "100%" }}
                            transition={{ duration: 0.7, delay: 0.7 }}
                          />
                        </div>
                      </div>
                      <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">Mon - Fri</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team Productivity</div>
                      <div className="relative w-full h-32">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                            <motion.div 
                              className="w-20 h-20 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-2xl font-bold text-primary"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", duration: 0.5, delay: 0.8 }}
                            >
                              87%
                            </motion.div>
                          </div>
                        </div>
                      </div>
                      <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">+12% from last week</div>
                    </div>
                  </div>

                  <div className="mt-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Status</div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500 dark:text-gray-400">Data Pipeline Redesign</span>
                          <span className="text-primary">78%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <motion.div 
                            className="bg-gradient-to-r from-primary to-purple-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "78%" }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500 dark:text-gray-400">Dashboard Overhaul</span>
                          <span className="text-primary">45%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <motion.div 
                            className="bg-gradient-to-r from-primary to-purple-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "45%" }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500 dark:text-gray-400">ML Model Training</span>
                          <span className="text-primary">92%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <motion.div 
                            className="bg-gradient-to-r from-primary to-purple-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "92%" }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="relative">
                      <Button className="w-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-600 transition-all duration-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Export Report
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
