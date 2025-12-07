import { ZodError } from 'zod';

export function flattenZodError(err: ZodError) {
    return err.flatten().fieldErrors;
}