import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    text: "ReportMate AI has saved our data science team at least 5 hours per week on report generation. The insights it surfaces automatically have helped us identify and resolve bottlenecks we didn't even know existed.",
    author: "Sarah Johnson",
    title: "Data Science Lead, Airbnb",
    rating: 5,
  },
  {
    text: "Our executives love the clear, concise reports that ReportMate AI generates. The ability to ask follow-up questions and drill down into specific metrics has changed how we approach data-driven decision making.",
    author: "Michael Chen",
    title: "CTO, Instacart",
    rating: 5,
  },
  {
    text: "The ML capabilities of ReportMate are incredible. It learns our team's patterns and priorities, and the reports get more relevant every week. Integration with our existing tools was also seamless.",
    author: "Alex Rodriguez",
    title: "Head of Analytics, Shopify",
    rating: 4.5,
  }
];

const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8
    }
  }
};

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <span className="block">Loved by Data Teams</span>
          </motion.h2>
          <motion.p 
            className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            See what our customers have to say about how ReportMate AI has transformed their workflow.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6"
              variants={cardVariants}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                  {testimonial.rating % 1 > 0 && (
                    <div className="relative">
                      <Star className="h-5 w-5 text-gray-300 dark:text-gray-600 fill-current" />
                      <div className="absolute top-0 left-0 overflow-hidden w-1/2">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                "{testimonial.text}"
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/20 dark:bg-primary/40 flex-shrink-0 flex items-center justify-center">
                  <span className="text-primary font-semibold">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{testimonial.author}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
