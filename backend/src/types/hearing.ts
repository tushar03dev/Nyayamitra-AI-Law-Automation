import zod from 'zod';

export const createHearingPayload = zod.object({
    caseId: zod.string().min(1, { message: 'Case ID is required' }),
    date: zod.string().min(1, { message: 'Date is required' }),
    time: zod.string().min(1, { message: 'Time is required' }),
    location: zod.string().optional(),
    judge: zod.string().optional(),
    notes: zod.string().optional(),
    status: zod.enum(['scheduled', 'completed', 'cancelled', 'postponed']).optional()
});

export const updateHearingPayload = zod.object({
    date: zod.string().optional(),
    time: zod.string().optional(),
    location: zod.string().optional(),
    judge: zod.string().optional(),
    notes: zod.string().optional(),
    status: zod.enum(['scheduled', 'completed', 'cancelled', 'postponed']).optional()
});

export const hearingIdParam = zod.object({
    id: zod.string().min(1, { message: 'Hearing ID is required' })
});