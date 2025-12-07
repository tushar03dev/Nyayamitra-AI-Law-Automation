import zod from 'zod';

export const createEventPayload = zod.object({
    title: zod.string().min(1, { message: 'Title is required' }),
    clientName: zod.string().optional(),
    description: zod.string().optional(),
    location: zod.string().optional(),
    date: zod.string().min(1, { message: 'Date is required' })
});

export const updateEventPayload = zod.object({
    title: zod.string().min(1).optional(),
    clientName: zod.string().optional(),
    description: zod.string().optional(),
    location: zod.string().optional(),
    date: zod.string().optional()
});

export const eventIdParam = zod.object({
    id: zod.string().min(1, { message: 'Event ID is required' })
});

export const dateQueryParam = zod.object({
    date: zod.string().min(1, { message: 'Date is required' })
});