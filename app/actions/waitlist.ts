"use server";

export type WaitlistState = { ok: boolean; message: string } | null;

export async function joinWaitlist(
  _prev: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Enter a valid email." };
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return { ok: false, message: "Waitlist is not configured yet." };
  }

  const res = await fetch(`${url}/rest/v1/waitlist`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ email }),
  });

  if (res.status === 201) return { ok: true, message: "You're on the list." };
  // 23505 = unique_violation. Treat duplicates as success — don't leak membership state loudly, but also don't confuse the user.
  if (res.status === 409) return { ok: true, message: "You're already on the list." };

  return { ok: false, message: "Something went wrong. Try again." };
}
