import bcrypt from 'bcryptjs';
import { prisma } from '../config/db';
import { SharedConstants } from '@bugbounty/shared';

export class AuthService {
    private readonly SALT_ROUNDS = 10;

    async register(email: string, password: string, name?: string, role: string = 'READ_ONLY'): Promise<any> {
        // 1. Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error('User already exists');
        }

        // 2. Hash Password
        const passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS);

        // 3. Create Org (For MVP, every user gets their own org or joins default)
        // Check if a default org exists, or create one for the user
        let org = await prisma.organization.findFirst({ where: { name: 'Default Org' } });
        if (!org) {
            org = await prisma.organization.create({ data: { name: 'Default Org' } });
        }

        // 4. Create User
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                name,
                role,
                organizationId: org.id
            }
        });

        const { passwordHash: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return null;

        const { passwordHash: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
