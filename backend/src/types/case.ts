import zod from 'zod';

export const createCasePayload = zod.object({
    title: zod.string().min(1, { message: 'Title is required' }),
    caseNumber: zod.string().min(1, { message: 'Case number is required' }),
    clientNames: zod.array(zod.string()).min(1, { message: 'At least one client name is required' }),
    description: zod.string().optional(),
    status: zod.enum(['active', 'pending', 'resolved', 'closed']).optional(),
    priority: zod.enum(['low', 'medium', 'high']).optional(),
    assignedLawyers: zod.array(zod.string()).optional(),
    assignedJuniors: zod.array(zod.string()).optional(),
    nextHearingDate: zod.string().optional()
});

export const updateCasePayload = zod.object({
    title: zod.string().min(1).optional(),
    caseNumber: zod.string().min(1).optional(),
    clientNames: zod.array(zod.string()).optional(),
    description: zod.string().optional(),
    status: zod.enum(['active', 'pending', 'resolved', 'closed']).optional(),
    priority: zod.enum(['low', 'medium', 'high']).optional(),
    assignedLawyers: zod.array(zod.string()).optional(),
    assignedJuniors: zod.array(zod.string()).optional(),
    nextHearingDate: zod.string().optional()
});

export const caseIdParam = zod.object({
    id: zod.string().min(1, { message: 'Case ID is required' })
});

export const userIdParam = zod.object({
    userId: zod.string().min(1, { message: 'User ID is required' })
});