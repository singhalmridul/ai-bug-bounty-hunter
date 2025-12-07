import { driver, auth, Driver, Session } from 'neo4j-driver';
import { SharedConstants } from '@bugbounty/shared';

let neo4jDriver: Driver;

export const initNeo4j = () => {
    const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
    const user = process.env.NEO4J_USER || 'neo4j';
    const password = process.env.NEO4J_PASSWORD || 'password';

    neo4jDriver = driver(uri, auth.basic(user, password));
    return neo4jDriver;
};

export const getDriver = () => {
    if (!neo4jDriver) {
        return initNeo4j();
    }
    return neo4jDriver;
};

export const closeNeo4j = async () => {
    if (neo4jDriver) {
        await neo4jDriver.close();
    }
};

export const runQuery = async (query: string, params: any = {}) => {
    const session = getDriver().session();
    try {
        const result = await session.run(query, params);
        return result;
    } finally {
        await session.close();
    }
};
