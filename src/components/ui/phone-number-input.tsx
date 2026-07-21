"use client";

import { useState } from "react";
import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";

// Country-specific local phone number lengths (digits after country code)
const COUNTRY_LOCAL_LENGTHS: Record<string, number> = {
  ET: 9,  // Ethiopia: 9xx xxx xxx
  US: 10,
  GB: 10,
  KE: 9,
  NG: 10,
  ZA: 9,
  EG: 10,
  GH: 9,
  TZ: 9,
  UG: 9,
  RW: 9,
  SD: 9,
  SO: 8,
  ER: 7,
  DJ: 8,
  SS: 9,
  DEFAULT: 10,
};

export function getLocalPhoneLength(countryCode: string): number {
  return COUNTRY_LOCAL_LENGTHS[countryCode] ?? COUNTRY_LOCAL_LENGTHS.DEFAULT;
}

/**
 * Generates flag emoji from country code (e.g., "ET" -> "🇪🇹")
 */
export function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

/**
 * Builds the full E.164 phone number by combining dial code + local number.
 * Strips any leading zeros from the local part before combining.
 */
export function buildFullPhoneNumber(
  countryCode: string,
  localNumber: string
): string {
  const dialCode = `+${getCountryCallingCode(countryCode as any)}`;
  const cleaned = localNumber.replace(/^0+/, "").replace(/\D/g, "");
  return `${dialCode}${cleaned}`;
}

/**
 * Strips the country calling code prefix from a full phone number,
 * returning just the local subscriber number.
 */
export function stripDialCode(
  fullPhone: string,
  countryCode: string
): string {
  if (!fullPhone) return "";
  const dialCode = `+${getCountryCallingCode(countryCode as any)}`;
  const stripped = fullPhone.startsWith(dialCode)
    ? fullPhone.slice(dialCode.length)
    : fullPhone.startsWith("0")
    ? fullPhone.slice(1)
    : fullPhone;
  return stripped.replace(/\D/g, "");
}

export const ALL_COUNTRIES = getCountries()
  .map((country) => ({
    code: country,
    name: (en as Record<string, string>)[country] || country,
    dialCode: `+${getCountryCallingCode(country)}`,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

type PhoneNumberInputProps = {
  /** ISO 3166-1 alpha-2 country code (e.g. "ET") */
  countryCode: string;
  onCountryChange: (code: string) => void;
  /** Local subscriber number only — no dial code */
  localNumber: string;
  onLocalNumberChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  /** Additional class for the wrapper div */
  className?: string;
  /** Additional class for the number input */
  inputClassName?: string;
  onBlur?: () => void;
};

/**
 * A controlled phone number input that:
 * - Shows a flag and country code selection in a compact format (no huge names)
 * - Accepts ONLY the local subscriber number (no country code prefix)
 * - Enforces per-country digit limits
 * - Allows only numeric input
 */
export default function PhoneNumberInput({
  countryCode,
  onCountryChange,
  localNumber,
  onLocalNumberChange,
  required = false,
  disabled = false,
  className = "",
  inputClassName = "",
  onBlur,
}: PhoneNumberInputProps) {
  const maxLength = getLocalPhoneLength(countryCode);
  const selectedCountry = ALL_COUNTRIES.find((c) => c.code === countryCode);
  const dialCode = selectedCountry?.dialCode ?? "";

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Strip non-numeric characters
    const digitsOnly = e.target.value.replace(/\D/g, "");
    // Enforce max length
    if (digitsOnly.length <= maxLength) {
      onLocalNumberChange(digitsOnly);
    }
  };

  return (
    <div className={`flex items-center w-full h-10 bg-gray-50 rounded-lg border border-gray-100 focus-within:ring-2 focus-within:ring-[#ED1C24]/10 transition-all ${className}`}>
      {/* Country selector wrapper to hide default select styling beautifully */}
      <div className="relative flex items-center h-full shrink-0">
        <select
          value={countryCode}
          onChange={(e) => {
            onCountryChange(e.target.value);
            // Reset local number on country change to avoid invalid lengths
            onLocalNumberChange("");
          }}
          disabled={disabled}
          aria-label="Select country"
          className={[
            "h-full pl-3 pr-6 bg-transparent border-none",
            "text-xs font-bold text-black appearance-none",
            "focus:ring-0 focus:outline-none",
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          ].join(" ")}
          style={{ width: "76px" }}
        >
          {ALL_COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {getFlagEmoji(c.code)} {c.code} - {c.name} ({c.dialCode})
            </option>
          ))}
        </select>
        {/* custom arrow indicator */}
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] pointer-events-none text-gray-400 select-none">
          ▼
        </span>
      </div>

      {/* Divider */}
      <div className="h-4 w-px bg-gray-200 shrink-0" />

      {/* Dial code badge */}
      <span
        className={[
          "flex items-center px-3 text-xs font-black text-gray-400 shrink-0 select-none",
        ].join(" ")}
      >
        {dialCode}
      </span>

      {/* Local number input */}
      <input
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        required={required}
        disabled={disabled}
        value={localNumber}
        onChange={handleNumberChange}
        onBlur={onBlur}
        maxLength={maxLength}
        placeholder={"X".repeat(maxLength)}
        aria-label="Phone number (local)"
        className={[
          "flex-1 h-full bg-transparent border-none font-bold text-black text-xs px-2",
          "focus:ring-0 focus:outline-none placeholder:text-gray-300",
          disabled ? "opacity-50 cursor-not-allowed" : "",
          inputClassName,
        ].join(" ")}
      />
    </div>
  );
}
