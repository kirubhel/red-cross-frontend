// How a person got into the system and how a fee was paid, in the words the admin screens use.

export type SourceTag = { label: string; detail?: string; manual: boolean };

/** registration_source from the API: ONLINE, ADMIN or IMPORT. Empty on records that predate tracking. */
export function registrationSource(source?: string | null): SourceTag | null {
  switch ((source || "").toUpperCase()) {
    case "ADMIN":
      return { label: "Manually added", detail: "Added by an admin", manual: true };
    case "IMPORT":
      return { label: "Manually added", detail: "Excel import", manual: true };
    case "ONLINE":
      return { label: "Registered online", manual: false };
    default:
      return null;
  }
}

export type PaymentChannel = "MANUAL" | "ARIFPAY" | "OTHER";

/** MANUAL is money an admin collected by hand; everything that went through checkout is ArifPay. */
export function paymentChannel(method?: string | null): PaymentChannel {
  const m = (method || "").trim().toUpperCase();
  if (m === "MANUAL") return "MANUAL";
  if (m === "" || m === "ARIFPAY" || m === "ONLINE") return "ARIFPAY";
  return "OTHER";
}

export function paymentMethodLabel(method?: string | null): string {
  switch (paymentChannel(method)) {
    case "MANUAL":
      return "Manually collected";
    case "ARIFPAY":
      return "ArifPay";
    default:
      return String(method);
  }
}

/**
 * The payment method a member row shows: Manual or ArifPay. Their latest paid membership
 * invoice decides. A member with no such invoice who is not waiting to pay (added by an admin,
 * imported or seeded) counts as manual, because nobody paid them online. Null only for a
 * member who registered and still owes the fee.
 */
export function memberPaymentChannel(paymentMethod?: string | null, status?: string | null): "MANUAL" | "ARIFPAY" | null {
  if ((paymentMethod || "").trim() !== "") return paymentChannel(paymentMethod) === "MANUAL" ? "MANUAL" : "ARIFPAY";
  return (status || "").toUpperCase() === "PENDING_PAYMENT" ? null : "MANUAL";
}
