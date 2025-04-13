import { users, type User, type InsertUser } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

// ChatMessage interface for storing chat history
interface ChatMessage {
  id?: number;
  userId: number;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Chat related methods
  saveChatMessage(message: ChatMessage): Promise<ChatMessage>;
  getChatHistory(userId: number): Promise<ChatMessage[]>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private chatMessages: Map<number, ChatMessage[]>;
  currentId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.chatMessages = new Map();
    this.currentId = 1;
    
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    // Initialize an empty chat history for the new user
    this.chatMessages.set(id, []);
    return user;
  }
  
  async saveChatMessage(message: ChatMessage): Promise<ChatMessage> {
    const userId = message.userId;
    
    // Get user's chat history or initialize if it doesn't exist
    if (!this.chatMessages.has(userId)) {
      this.chatMessages.set(userId, []);
    }
    
    const userMessages = this.chatMessages.get(userId)!;
    
    // Add message ID
    const newMessage = {
      ...message,
      id: userMessages.length + 1
    };
    
    // Add to history
    userMessages.push(newMessage);
    
    return newMessage;
  }
  
  async getChatHistory(userId: number): Promise<ChatMessage[]> {
    return this.chatMessages.get(userId) || [];
  }
}

export const storage = new MemStorage();
