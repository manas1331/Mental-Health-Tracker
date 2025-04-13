import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { setupChatbot } from "./chatbot";

export async function registerRoutes(app: Express): Promise<Server> {
  // sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);
  
  // sets up /api/chat, /api/chat/history, and /api/mental-health/analysis
  setupChatbot(app);

  const httpServer = createServer(app);

  return httpServer;
}
