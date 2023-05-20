import { PrismaClient } from "@prisma/client";

export class PrismaContext {
  private static context: PrismaClient;
  
  private constructor() {
  }
  
  static getInstance(): PrismaClient {
    if (!PrismaContext.context) {
      PrismaContext.context = new PrismaClient();
    }
    return PrismaContext.context;
  }
}
