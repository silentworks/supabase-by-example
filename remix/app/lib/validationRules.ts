import { z } from 'zod';

export const required = (name: string) => z.string().min(1, `${name} is required`);
export const email = (name = 'Email') => required(name).email(`${name} is not valid`);
export const phone = (name = 'Phone') => required(name).min(6, `${name} must be at least 6 numbers`).max(16, `${name} must be at maximum 16 characters`)
export const password = (number = 5, name = 'Password') =>
	required(name).min(number, `${name} must be at least ${number} characters`);
