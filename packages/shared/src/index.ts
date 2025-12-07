export const SharedConstants = {
    APP_NAME: 'AI Bug Bounty Hunter',
};


export enum ScanStatus {
    QUEUED = 'QUEUED',
    RUNNING = 'RUNNING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}

export interface ScanConfig {
    url: string;
    maxDepth: number;
    maxPages: number;
    templates: string[]; // e.g., 'XSS', 'SQLi', 'SensitiveData'
}

export interface Finding {
    id: string;
    scanId: string;
    type: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
    url: string;
    description: string;
    timestamp: Date;
}

export interface DashboardStats {
    activeScans: number;
    criticalFindings: number;
    attackSurfaceAssets: number;
    vulnScore: string;
}

export type UserRole = 'ADMIN' | 'SECOPS' | 'DEVELOPER' | 'READ_ONLY';

export * from './PromptManager';
