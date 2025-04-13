import { Link } from "wouter";
import { Bot, Twitter, Linkedin, Github, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">ReportMate AI</span>
            </Link>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              Automated progress reports for data teams, powered by AI.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary dark:hover:text-primary-400">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary dark:hover:text-primary-400">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary dark:hover:text-primary-400">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-300">Product</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="/#features" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400">Features</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400">Pricing</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400">Integrations</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400">Updates</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-300">Support</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400">Documentation</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400">Tutorials</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400">Guides</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400">API Status</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-300">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400">About</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400">Blog</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400">Careers</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-300">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400">Privacy</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400">Terms</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400">Cookies</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} ReportMate AI. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <button className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400 border border-gray-300 dark:border-gray-600">
              <Globe className="h-4 w-4 mr-2" /> English <span className="ml-2">▼</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
