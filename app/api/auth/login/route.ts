import { NextResponse } from "next/server";
import { getUserByEmail, getUserByUsername, createUser } from "@/lib/db";
import { verifyPassword, generateToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Find user by email or username
        let user = await getUserByEmail(email);
        if (!user) {
            user = await getUserByUsername(email);
        }

        // If user doesn't exist, create a demo user for testing
        if (!user) {
            // Create a new user with the provided credentials
            const bcrypt = require('bcryptjs');
            const passwordHash = await bcrypt.hash(password, 12);

            try {
                user = await createUser({
                    username: email.split('@')[0],
                    email,
                    passwordHash,
                    displayName: email.split('@')[0],
                });
            } catch (createError) {
                // If create fails, try to find by email again
                user = await getUserByEmail(email);
            }
        }

        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Verify password
        const isValid = await verifyPassword(password, user.passwordHash);
        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

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
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
