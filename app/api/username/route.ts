import { NextResponse } from "next/server";
import { getFullUserProfile } from "@/lib/db";

// GET - Get public user profile by username
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username");

        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 });
        }

        const profile = await getFullUserProfile(username);

        if (!profile) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            username: profile.user.username,
            displayName: profile.user.displayName,
            bio: profile.user.bio,
            theme: profile.user.theme,
            showProfilePicture: profile.user.showProfilePicture,
            profilePictureUrl: profile.user.profilePictureUrl,
            links: profile.links.filter(l => l.visible).map(l => ({
                id: l.id.toString(),
                title: l.title,
                url: l.url,
            })),
            socialLinks: profile.socialLinks.filter(s => s.visible).map(s => ({
                id: s.id.toString(),
                platform: s.platform,
                url: s.url,
            })),
        });
    } catch (error) {
        console.error("Get username error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
