import { FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { UserPayload } from './auth';

export const tenantMiddleware = fp(async (server) => {
    server.addHook('preHandler', async (request: FastifyRequest, reply: FastifyReply) => {
        // Skip for public routes if needed, logic here
        const user = request.user as UserPayload | undefined;
        if (user && user.organizationId) {
            request.log.info({ tenantId: user.organizationId }, 'Request context set for tenant');
        }
    });
});
