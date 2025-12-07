
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const orgId = 'org-demo-1';
    const userId = 'user-ss-1';

    // Upsert Organization
    const org = await prisma.organization.upsert({
        where: { id: orgId },
        update: {},
        create: {
            id: orgId,
            name: 'Demo Corp',
        },
    });
    console.log('Upserted Org:', org);

    // Upsert User
    const user = await prisma.user.upsert({
        where: { email: 'demo@bugbounty.ai' },
        update: {},
        create: {
            id: userId,
            email: 'demo@bugbounty.ai',
            name: 'Demo User',
            role: 'ADMIN',
            organizationId: orgId,
        },
    });
    console.log('Upserted User:', user);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
