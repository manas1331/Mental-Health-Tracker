import { Express, Request, Response } from "express";
import { storage } from "./storage";

export function setupChatbot(app: Express) {
  // Mental health chatbot implementation
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
      
      // Save the message to chat history
      const userId = req.user!.id;
      await storage.saveChatMessage({
        userId,
        content: message,
        isUser: true,
        timestamp: new Date(),
      });
      
      // Analyze message for depression indicators and generate a response
      const { response, depressionScore } = analyzeSentiment(message);
      
      // Save the bot response
      await storage.saveChatMessage({
        userId,
        content: response,
        isUser: false,
        timestamp: new Date(),
      });
      
      res.json({ response, depressionScore });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process your message" });
    }
  });
  
  app.get("/api/chat/history", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const userId = req.user!.id;
      const messages = await storage.getChatHistory(userId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  });
  
  // Add endpoint to get mental health analysis
  app.get("/api/mental-health/analysis", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const userId = req.user!.id;
      const messages = await storage.getChatHistory(userId);
      
      // Only analyze user messages
      const userMessages = messages.filter(msg => msg.isUser);
      
      if (userMessages.length === 0) {
        return res.json({
          depressionScore: 0,
          anxietyScore: 0,
          stressScore: 0,
          recommendations: ["Not enough data to provide analysis. Please continue chatting with our AI assistant."]
        });
      }
      
      // Calculate scores based on message content
      let depressionScore = 0;
      let anxietyScore = 0;
      let stressScore = 0;
      
      userMessages.forEach(msg => {
        const { depressionValue, anxietyValue, stressValue } = analyzeMessage(msg.content);
        depressionScore += depressionValue;
        anxietyScore += anxietyValue;
        stressScore += stressValue;
      });
      
      // Average the scores
      const messageCount = userMessages.length;
      depressionScore = Math.min(100, Math.round((depressionScore / messageCount) * 100));
      anxietyScore = Math.min(100, Math.round((anxietyScore / messageCount) * 100));
      stressScore = Math.min(100, Math.round((stressScore / messageCount) * 100));
      
      // Generate recommendations based on scores
      const recommendations = generateRecommendations(depressionScore, anxietyScore, stressScore);
      
      res.json({
        depressionScore,
        anxietyScore,
        stressScore,
        recommendations
      });
    } catch (error) {
      console.error("Error analyzing mental health:", error);
      res.status(500).json({ error: "Failed to analyze mental health data" });
    }
  });
}

// Analyze message for depression indicators
function analyzeMessage(message: string): { 
  depressionValue: number; 
  anxietyValue: number; 
  stressValue: number; 
} {
  const lowercaseMessage = message.toLowerCase();
  
  // Depression keywords
  const depressionKeywords = [
    "sad", "depressed", "hopeless", "worthless", "empty", "tired", 
    "exhausted", "alone", "lonely", "crying", "suicidal", "die", 
    "death", "unhappy", "miserable", "meaningless", "numb", "pain"
  ];
  
  // Anxiety keywords
  const anxietyKeywords = [
    "anxious", "worried", "nervous", "panic", "fear", "scared", 
    "stress", "overthinking", "terror", "afraid", "dread", "uneasy", 
    "apprehensive", "restless", "uncomfortable", "tense"
  ];
  
  // Stress keywords
  const stressKeywords = [
    "stress", "overwhelmed", "pressure", "burnout", "overworked", 
    "deadline", "tension", "strain", "burden", "difficult", 
    "challenging", "too much", "can't handle"
  ];
  
  // Calculate scores based on keyword matches
  let depressionValue = 0;
  let anxietyValue = 0;
  let stressValue = 0;
  
  depressionKeywords.forEach(keyword => {
    if (lowercaseMessage.includes(keyword)) {
      depressionValue += 0.2; // Increase depression score for each match
    }
  });
  
  anxietyKeywords.forEach(keyword => {
    if (lowercaseMessage.includes(keyword)) {
      anxietyValue += 0.2; // Increase anxiety score for each match
    }
  });
  
  stressKeywords.forEach(keyword => {
    if (lowercaseMessage.includes(keyword)) {
      stressValue += 0.2; // Increase stress score for each match
    }
  });
  
  // Cap values at 1.0
  return {
    depressionValue: Math.min(1, depressionValue),
    anxietyValue: Math.min(1, anxietyValue),
    stressValue: Math.min(1, stressValue)
  };
}

// Generate recommendations based on mental health scores
function generateRecommendations(
  depressionScore: number,
  anxietyScore: number,
  stressScore: number
): string[] {
  const recommendations: string[] = [];
  
  // General recommendation for everyone
  recommendations.push("Consider tracking your mood daily to identify patterns and triggers.");
  
  // Depression-specific recommendations
  if (depressionScore > 70) {
    recommendations.push("Your messages indicate severe depression symptoms. Please consider seeking professional help immediately.");
    recommendations.push("Establish a daily routine with small achievable goals to build momentum.");
  } else if (depressionScore > 40) {
    recommendations.push("Your messages show moderate depression indicators. Consider speaking with a mental health professional.");
    recommendations.push("Try to engage in activities you used to enjoy, even if you don't feel like it initially.");
  } else if (depressionScore > 20) {
    recommendations.push("Some mild depression indicators detected. Regular exercise and social connection can help improve your mood.");
  }
  
  // Anxiety-specific recommendations
  if (anxietyScore > 70) {
    recommendations.push("Your messages indicate severe anxiety symptoms. Professional support could be beneficial.");
    recommendations.push("Practice deep breathing exercises: inhale for 4 counts, hold for 4, exhale for 6 counts.");
  } else if (anxietyScore > 40) {
    recommendations.push("Moderate anxiety indicators detected. Consider mindfulness meditation to help manage anxious thoughts.");
  } else if (anxietyScore > 20) {
    recommendations.push("Some mild anxiety indicators detected. Regular physical activity can help reduce anxiety levels.");
  }
  
  // Stress-specific recommendations
  if (stressScore > 70) {
    recommendations.push("High stress levels detected. Consider prioritizing tasks and learning to delegate when possible.");
    recommendations.push("Schedule regular breaks throughout your day to reset and recharge.");
  } else if (stressScore > 40) {
    recommendations.push("Moderate stress indicators present. Try progressive muscle relaxation techniques to release physical tension.");
  } else if (stressScore > 20) {
    recommendations.push("Mild stress indicators noted. Consider practicing gratitude journaling to shift focus to positive aspects of life.");
  }
  
  return recommendations;
}

// Main function to analyze sentiment and generate a response
function analyzeSentiment(message: string): { response: string; depressionScore: number } {
  const lowercaseMessage = message.toLowerCase();
  const { depressionValue, anxietyValue, stressValue } = analyzeMessage(message);
  
  // Convert to percentage for scoring
  const depressionScore = Math.round(depressionValue * 100);
  
  // Greeting responses
  if (lowercaseMessage.includes("hello") || lowercaseMessage.includes("hi")) {
    return {
      response: "Hello! I'm here to chat about how you're feeling. How has your day been going?",
      depressionScore
    };
  }
  
  // Responses for detected depression
  if (depressionValue > 0.6) {
    return {
      response: "I notice you're expressing some difficult feelings. Depression can make everything feel overwhelming. Have you been able to talk to anyone about how you're feeling? Remember that seeking professional help is a sign of strength, not weakness.",
      depressionScore
    };
  } else if (depressionValue > 0.3) {
    return {
      response: "It sounds like you might be going through a tough time. Sometimes talking about our feelings can help. What self-care activities have you found helpful in the past?",
      depressionScore
    };
  }
  
  // Responses for detected anxiety
  if (anxietyValue > 0.6) {
    return {
      response: "It sounds like you're experiencing quite a bit of anxiety. When you feel anxious, try focusing on your breath. Slow, deep breaths can help calm your nervous system. Would you like to try a quick breathing exercise together?",
      depressionScore
    };
  } else if (anxietyValue > 0.3) {
    return {
      response: "I'm noticing some anxiety in your message. Sometimes our thoughts can spiral, making us more anxious than the situation warrants. Have you tried any mindfulness practices to stay present?",
      depressionScore
    };
  }
  
  // Responses for detected stress
  if (stressValue > 0.6) {
    return {
      response: "You seem to be under a lot of stress right now. It's important to take breaks and practice self-care. What are some activities that help you relax and recharge?",
      depressionScore
    };
  } else if (stressValue > 0.3) {
    return {
      response: "I can sense you're dealing with some stressors. Remember that it's okay to set boundaries and prioritize your wellbeing. What small step could you take today to reduce your stress level?",
      depressionScore
    };
  }
  
  // Other common topics
  if (lowercaseMessage.includes("sleep") || lowercaseMessage.includes("tired") || lowercaseMessage.includes("insomnia")) {
    return {
      response: "Sleep issues can significantly impact mental health. Establishing a regular sleep routine, avoiding screens before bedtime, and creating a comfortable sleep environment can help. Have you tried any sleep hygiene techniques?",
      depressionScore
    };
  }
  
  if (lowercaseMessage.includes("exercise") || lowercaseMessage.includes("workout") || lowercaseMessage.includes("physical activity")) {
    return {
      response: "Exercise can be a powerful tool for managing mental health. Even a short walk can release endorphins that improve mood. What types of physical activity do you enjoy?",
      depressionScore
    };
  }
  
  if (lowercaseMessage.includes("meditation") || lowercaseMessage.includes("mindful") || lowercaseMessage.includes("breathing")) {
    return {
      response: "Mindfulness practices like meditation can help ground us when emotions feel overwhelming. Even just 5 minutes of focused breathing can make a difference. Would you like some guided meditation recommendations?",
      depressionScore
    };
  }
  
  if (lowercaseMessage.includes("thank")) {
    return {
      response: "You're welcome! Remember that taking care of your mental health is an ongoing journey. I'm here whenever you want to talk.",
      depressionScore
    };
  }
  
  // Default response
  return {
    response: "I'm here to support you through your mental health journey. How are you feeling right now? You can talk about anything that's on your mind.",
    depressionScore
  };
}
