import { NextResponse } from "next/server";
import { createUser, getUserByUsername, getUserByEmail } from "@/lib/db";
import { hashPassword, generateToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, email, password, displayName } = body;

        // Validate input
        if (!username || !email || !password) {
            return NextResponse.json(
                { error: "Username, email and password are required" },
                { status: 400 }
            );
        }

        // Check username length
        if (username.length < 3 || username.length > 50) {
            return NextResponse.json(
                { error: "Username must be between 3 and 50 characters" },
                { status: 400 }
            );
        }

        // Check password length
        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        // Check if username exists
        const existingUsername = await getUserByUsername(username);
        if (existingUsername) {
            return NextResponse.json(
                { error: "Username already taken" },
                { status: 400 }
            );
        }

        // Check if email exists
        const existingEmail = await getUserByEmail(email);
        if (existingEmail) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 400 }
            );
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create user
        const user = await createUser({
            username,
            email,
            passwordHash,
            displayName: displayName || username,
        });

        // Generate token
        const token = generateToken({
            id: user.id,
            username: user.username,
            email: user.email,
            displayName: user.displayName,
        });

        // Set cookie
        await setAuthCookie(token);

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                displayName: user.displayName,
            }
        });
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
