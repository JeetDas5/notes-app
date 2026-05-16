import db from "@/db";
import argon2 from "argon2";
import { ZodError } from "zod";
import { NextRequest, NextResponse } from "next/server";

import { users } from "@/db/schema";
import { signupSchema } from "@/validations";
import { signToken } from "@/lib";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = signupSchema.parse(body);
    const { name, email, password } = validatedData;

    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 },
      );
    }

    const hashedPassword = await argon2.hash(password);

    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
      })
      .returning();

    const token = signToken({ userId: newUser.id });

    const response = NextResponse.json(
      {
        message: "User created successfully",
        user: { id: newUser.id, email: newUser.email },
      },
      { status: 201 },
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
    console.log("Error signing up", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues[0].message },
        { status: 400 },
      );
    } else if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message || "Error signing up" },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
