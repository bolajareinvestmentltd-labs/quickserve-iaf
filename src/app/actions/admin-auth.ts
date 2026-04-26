"use server";
import { cookies } from "next/headers";

export async function loginAdmin(formData: FormData) {
  const username = formData.get("username");
  const password = formData.get("password");

  const masterUser = process.env.ADMIN_USERNAME;
  const masterPass = process.env.ADMIN_PASSWORD;

  if (username === masterUser && password === masterPass) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });
    return { success: true };
  }

  return { success: false, message: "Invalid Command Credentials" };
}
