import { z } from 'zod';

/**
 * SECURITY: Comprehensive validation schemas for all user inputs
 * This file contains zod schemas to validate and sanitize user data
 * before processing or storing in the database.
 */

// Phone regex: +digits with 8-15 total digits
const phoneRegex = /^\+?[0-9]{8,15}$/;

// Time regex: HH:MM or HH:MM:SS format
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;

// Date regex: YYYY-MM-DD format
const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

/**
 * Appointment booking validation schema
 * Used for validating appointment form submissions
 */
export const appointmentSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" })
    .regex(/^[a-zA-Z\u0600-\u06FF\s'-]+$/, { message: "Name contains invalid characters" }),
  
  email: z.string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" })
    .toLowerCase(),
  
  phone: z.string()
    .trim()
    .regex(phoneRegex, { message: "Invalid phone number format. Use format: +96512345678" })
    .min(8, { message: "Phone number too short" })
    .max(20, { message: "Phone number too long" }),
  
  service: z.string()
    .trim()
    .min(3, { message: "Service must be at least 3 characters" })
    .max(100, { message: "Service must be less than 100 characters" }),
  
  date: z.string()
    .regex(dateRegex, { message: "Invalid date format. Use YYYY-MM-DD" })
    .refine((date) => {
      const d = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return d >= today;
    }, { message: "Appointment date must be today or in the future" })
    .refine((date) => {
      const d = new Date(date);
      const maxDate = new Date();
      maxDate.setMonth(maxDate.getMonth() + 6); // Max 6 months in advance
      return d <= maxDate;
    }, { message: "Cannot book more than 6 months in advance" }),
  
  time: z.string()
    .regex(timeRegex, { message: "Invalid time format. Use HH:MM" }),
  
  notes: z.string()
    .trim()
    .max(500, { message: "Notes must be less than 500 characters" })
    .optional()
    .transform(val => val || undefined)
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;

/**
 * Lead collection validation schema
 * Used for validating lead form submissions from chatbot or contact forms
 */
export const leadSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" })
    .regex(/^[a-zA-Z\u0600-\u06FF\s'-]+$/, { message: "Name contains invalid characters" }),
  
  email: z.string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" })
    .toLowerCase(),
  
  phone: z.string()
    .trim()
    .regex(phoneRegex, { message: "Invalid phone number format" })
    .min(8, { message: "Phone number too short" })
    .max(20, { message: "Phone number too long" })
    .optional()
    .transform(val => val || undefined),
  
  message: z.string()
    .trim()
    .max(1000, { message: "Message must be less than 1000 characters" })
    .optional()
    .transform(val => val || undefined)
});

export type LeadInput = z.infer<typeof leadSchema>;

/**
 * Voice assistant appointment parameters validation
 * Used when AI voice assistant collects appointment data
 */
export const voiceAppointmentSchema = appointmentSchema.extend({
  // All fields from appointmentSchema
}).partial({
  // Make notes optional for voice bookings
  notes: true
});

export type VoiceAppointmentInput = z.infer<typeof voiceAppointmentSchema>;

/**
 * Sanitize HTML to prevent XSS attacks
 * Removes potentially dangerous HTML tags and attributes
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate and sanitize user input
 * Returns sanitized data if valid, throws error if invalid
 */
export function validateAndSanitize<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const firstError = result.error.errors[0];
    throw new Error(firstError.message);
  }
  
  return result.data;
}
