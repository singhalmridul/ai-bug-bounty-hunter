import { FastifyRequest, FastifyReply } from 'fastify';
import { UserPayload } from '../middleware/auth';

declare module 'fastify' {
    export interface FastifyRequest {
        user: UserPayload;
    }
    export interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}
