import { useState, useEffect } from "react";
import { useLocation, useRoute, Link } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
// Import removed - simplified version
import { Bot } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const registerSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  gender: z.string(),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  preExistingConditions: z.array(z.string()).optional().default([]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function AuthPage() {
  // Simplified version without useAuth
  const user = null;
  const loginMutation = { 
    mutate: (data: any) => { console.log('Login attempt', data); },
    isPending: false
  };
  const registerMutation = { 
    mutate: (data: any) => { console.log('Register attempt', data); },
    isPending: false
  };
  
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/auth');
  const [activeTab, setActiveTab] = useState<string>("login");

  useEffect(() => {
    // Check for tab parameter in URL
    const searchParams = new URLSearchParams(window.location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam === 'signup') {
      setActiveTab('register');
    }
  }, []);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "",
      dateOfBirth: "",
      preExistingConditions: [],
    },
  });

  const onLoginSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(values);
  };

  const onRegisterSubmit = (values: z.infer<typeof registerSchema>) => {
    const { confirmPassword, ...credentials } = values;
    registerMutation.mutate(credentials);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          {/* Left side - Authentication forms */}
          <div className="w-full lg:w-1/2 p-8 sm:p-12">
            <div className="mb-8 text-center lg:text-left">
              <Link href="/" className="inline-flex items-center mb-6">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">ReportMate AI</span>
              </Link>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                {activeTab === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {activeTab === "login" 
                  ? "Sign in to your account to continue"
                  : "Join us and start automating your report generation"
                }
              </p>
            </div>

            <Tabs 
              defaultValue="login" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <AnimatePresence mode="wait">
                <TabsContent value="login" key="login">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Enter your password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-600"
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? "Signing in..." : "Sign in"}
                        </Button>
                      </form>
                    </Form>
                  </motion.div>
                </TabsContent>
                <TabsContent value="register" key="register">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Choose a username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Enter your email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Create a password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Confirm your password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <FormControl>
                                <select 
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  {...field}
                                >
                                  <option value="">Select gender</option>
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                  <option value="Non-binary">Non-binary</option>
                                  <option value="Prefer not to say">Prefer not to say</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Birth</FormLabel>
                              <FormControl>
                                <Input type="date" placeholder="Enter your date of birth" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div>
                          <FormLabel className="block mb-2">Pre-existing Conditions</FormLabel>
                          <div className="space-y-2">
                            {['Anxiety', 'Depression', 'Insomnia', 'ADHD', 'PTSD'].map((condition) => (
                              <div key={condition} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`condition-${condition}`}
                                  name="preExistingConditions"
                                  value={condition}
                                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                  onChange={(e) => {
                                    const currentConditions = registerForm.getValues("preExistingConditions") || [];
                                    if (e.target.checked) {
                                      registerForm.setValue("preExistingConditions", [...currentConditions, condition]);
                                    } else {
                                      registerForm.setValue(
                                        "preExistingConditions",
                                        currentConditions.filter((c) => c !== condition)
                                      );
                                    }
                                  }}
                                />
                                <label htmlFor={`condition-${condition}`} className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                                  {condition}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-600"
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? "Creating account..." : "Create account"}
                        </Button>
                      </form>
                    </Form>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </div>

          {/* Right side - Hero image/content */}
          <div className="hidden lg:block w-1/2 bg-gradient-to-br from-primary to-purple-600 p-12 text-white">
            <div className="h-full flex flex-col justify-center">
              <h3 className="text-3xl font-bold mb-6">Transform your data team's workflow</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="h-6 w-6 mr-2 text-primary-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Generate comprehensive weekly reports in seconds</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 mr-2 text-primary-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Integrate with all your favorite project management tools</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 mr-2 text-primary-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>AI assistant learns from your team's workflow patterns</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 mr-2 text-primary-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Beautiful visualizations that make data easy to understand</span>
                </li>
              </ul>

              <div className="mt-12 p-6 bg-white/10 rounded-lg backdrop-blur-sm">
                <p className="text-sm italic text-white/90">
                  "ReportMate AI has transformed how our data team communicates progress to stakeholders. What used to take hours now happens automatically."
                </p>
                <div className="mt-4 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary-200 flex items-center justify-center text-primary">
                    <span className="font-bold">JD</span>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Jessica Davis</p>
                    <p className="text-sm text-primary-100">VP of Engineering, Netflix</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
