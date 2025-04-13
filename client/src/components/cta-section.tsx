import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function CTASection() {
  // Simplified version without useAuth
  const user = null; // No user for simplicity

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="bg-gradient-to-r from-primary to-purple-500 rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="px-6 py-12 sm:px-12 lg:py-16 lg:px-16 lg:flex lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                <span className="block">Ready to streamline your reporting?</span>
                <span className="block text-primary-200">Get started with ReportMate AI today.</span>
              </h2>
              <p className="mt-4 text-lg leading-6 text-white">
                Try it free for 14 days. No credit card required.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <div className="sm:flex">
                {user ? (
                  <Link href="/chat">
                    <Button size="lg" className="sm:flex-shrink-0 w-full sm:w-auto bg-white text-primary hover:bg-primary-50 shadow-lg">
                      Go to Chat
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/auth?tab=signup">
                      <Button size="lg" className="sm:flex-shrink-0 w-full sm:w-auto bg-white text-primary hover:bg-primary-50 shadow-lg">
                        Get Started
                      </Button>
                    </Link>
                    <Link href="/auth">
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="mt-3 sm:mt-0 sm:ml-3 w-full sm:w-auto text-white border-white bg-primary/20 hover:bg-primary/30"
                      >
                        Request Demo
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
