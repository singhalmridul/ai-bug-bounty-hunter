import { PrismaClient } from '@prisma/client';
import neo4j from 'neo4j-driver';
import Redis from 'ioredis';

// Prisma
export const prisma = new PrismaClient();

// Neo4j
const neo4jUri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const neo4jUser = process.env.NEO4J_USER || 'neo4j';
const neo4jPassword = process.env.NEO4J_PASSWORD || 'password';

export const neo4jDriver = neo4j.driver(
    neo4jUri,
    neo4j.auth.basic(neo4jUser, neo4jPassword)
);

// Redis
const redisHost = process.env.REDIS_HOST || 'localhost';
export const redis = new Redis({
    host: redisHost,
    port: 6379,
});
