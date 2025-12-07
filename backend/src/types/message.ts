import zod from 'zod';

export const createMessagePayload = zod.object({
    caseId: zod.string().min(1, { message: 'Case ID is required' }),
    message: zod.string().min(1, { message: 'Message is required' }),
    attachments: zod.array(zod.string()).optional()
});

export const caseIdParam = zod.object({
    id: zod.string().min(1, { message: 'Case ID is required' })
});