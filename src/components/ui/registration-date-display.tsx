"use client";

interface RegistrationDateDisplayProps {
  label?: string;
  dateStr?: string;
  className?: string;
}

/**
 * Intentionally renders nothing: the registration date is recorded by the system
 * and is no longer shown on the registration forms. The form data still carries
 * `registrationDate`, so only the visible field is gone.
 */
export default function RegistrationDateDisplay(_props: RegistrationDateDisplayProps) {
  return null;
}
