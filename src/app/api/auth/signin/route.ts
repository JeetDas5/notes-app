import db from "@/db";
import { verifyPassword } from "@/lib/password";
import { ZodError } from "zod";
import { NextRequest, NextResponse } from "next/server";

import { signToken } from "@/lib/jwt";

import { loginSchema } from "@/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);
    const { email, password } = validatedData;

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await verifyPassword(user.password, password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = signToken({ userId: user.id });

    const response = NextResponse.json(
      {
        message: "User signed in successfully",
        user: { id: user.id, email: user.email, token },
      },
      { status: 200 },
    );

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.log("Error signing in", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues[0].message },
        { status: 400 },
      );
    } else if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message || "Error signing in" },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
