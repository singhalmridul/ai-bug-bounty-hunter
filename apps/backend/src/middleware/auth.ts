import { FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';

export interface UserPayload {
    id: string;
    email: string;
    role: string;
    organizationId: string;
}

export const authMiddleware = fp(async (server) => {
    server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });
});
