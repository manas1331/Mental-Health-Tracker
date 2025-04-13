import { motion } from "framer-motion";
import {
  Bot,
  Plug,
  Brain,
  LineChart,
  Calendar,
  Shield,
} from "lucide-react";

const featureItems = [
  {
    icon: <Bot className="h-6 w-6" />,
    title: "AI-Powered Insights",
    description:
      "Our AI analyzes project data to identify trends, blockers, and opportunities that might otherwise go unnoticed.",
    color: "bg-primary-100 dark:bg-primary-900 text-primary dark:text-primary-300",
  },
  {
    icon: <Plug className="h-6 w-6" />,
    title: "Multiple Integrations",
    description:
      "Connect with Jira, Asana, Github, Trello, Monday, and more to pull data from your entire workflow.",
    color: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300",
  },
  {
    icon: <Brain className="h-6 w-6" />,
    title: "Adaptive Learning",
    description:
      "The system learns from feedback and user behavior to continuously improve report quality and relevance.",
    color: "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300",
  },
  {
    icon: <LineChart className="h-6 w-6" />,
    title: "Custom Visualizations",
    description:
      "Generate beautiful, interactive charts and graphs that make complex data easy to understand.",
    color: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300",
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: "Scheduled Reports",
    description:
      "Set up automated reporting schedules and deliver reports directly to stakeholders' inboxes.",
    color: "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Enterprise Security",
    description:
      "Bank-level encryption and compliance with SOC 2, GDPR, and HIPAA to keep your data secure.",
    color: "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <span className="block">Supercharge Your Data Team's Workflow</span>
          </motion.h2>
          <motion.p 
            className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Our AI-powered automation saves your team hours every week by intelligently generating detailed progress reports.
          </motion.p>
        </div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {featureItems.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 transform transition duration-300 hover:scale-105"
              variants={itemVariants}
            >
              <div className={`h-12 w-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
