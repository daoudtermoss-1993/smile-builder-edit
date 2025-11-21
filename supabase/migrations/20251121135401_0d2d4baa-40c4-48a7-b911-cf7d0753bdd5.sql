-- Drop existing status constraint if it exists
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS valid_status;

-- Add new constraint with all status values for the confirmation workflow
ALTER TABLE appointments 
ADD CONSTRAINT valid_status 
CHECK (status IN (
  'pending',              -- legacy status
  'pending_doctor',       -- awaiting doctor confirmation
  'rejected_by_doctor',   -- doctor declined
  'pending_patient',      -- awaiting patient WhatsApp confirmation
  'confirmed',            -- fully confirmed
  'cancelled_by_patient', -- patient declined via WhatsApp
  'cancelled',            -- general cancellation
  'blocked'              -- time slot blocked by admin
));

-- Update existing 'pending' appointments to 'pending_doctor' to match new flow
UPDATE appointments 
SET status = 'pending_doctor' 
WHERE status = 'pending';

-- Add comment to status column to document all possible values
COMMENT ON COLUMN appointments.status IS 'Possible values: pending_doctor (awaiting doctor confirmation), rejected_by_doctor (doctor declined), pending_patient (awaiting patient WhatsApp confirmation), confirmed (fully confirmed), cancelled_by_patient (patient declined via WhatsApp), cancelled (general cancellation), blocked (time slot blocked by admin)';

-- Add index on status for faster filtering in admin dashboard
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Add index on appointment_date for faster date-based queries
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);