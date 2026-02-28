import { NextResponse } from "next/server";
import { getFullUserProfileById, updateUser, createLink, updateLink, deleteLink, createSocialLink, updateSocialLink, deleteSocialLink, getUserById } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

// GET - Get current user profile
export async function GET() {
    try {
        console.log("GET /api/user called");

        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        console.log("Token found:", !!token);

        if (!token) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const authUser = verifyToken(token);
        console.log("Auth user:", authUser);

        if (!authUser) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        console.log("Fetching profile for userId:", authUser.id);

        const profile = await getFullUserProfileById(authUser.id);

        console.log("Profile found:", !!profile);

        if (!profile) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            id: profile.user.id,
            username: profile.user.username,
            displayName: profile.user.displayName,
            bio: profile.user.bio,
            theme: profile.user.theme,
            showProfilePicture: profile.user.showProfilePicture,
            profilePictureUrl: profile.user.profilePictureUrl,
            links: profile.links.map(l => ({
                id: l.id.toString(),
                title: l.title,
                url: l.url,
                visible: l.visible,
            })),
            socialLinks: profile.socialLinks.map(s => ({
                id: s.id.toString(),
                platform: s.platform,
                url: s.url,
                visible: s.visible,
            })),
        });
    } catch (error) {
        console.error("Get user error:", error);
        return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 });
    }
}

// POST - Save/update user profile
export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const authUser = verifyToken(token);
        if (!authUser) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const body = await request.json();
        const { displayName, bio, theme, showProfilePicture, profilePictureUrl, links, socialLinks } = body;

        // Update basic user info
        if (displayName !== undefined || bio !== undefined || theme || showProfilePicture !== undefined || profilePictureUrl !== undefined) {
            await updateUser(authUser.id, {
                displayName,
                bio,
                theme,
                showProfilePicture,
                profilePictureUrl,
            });
        }

        // Handle links if provided
        if (links && Array.isArray(links)) {
            const profile = await getFullUserProfileById(authUser.id);
            const existingLinkIds = new Set(profile?.links.map(l => l.id) || []);
            const newLinkIds = new Set(links.map((l: any) => parseInt(l.id)).filter(Boolean));

            for (const existingLink of (profile?.links || [])) {
                if (!newLinkIds.has(existingLink.id)) {
                    await deleteLink(existingLink.id, authUser.id);
                }
            }

            for (const link of links) {
                if (link.id && existingLinkIds.has(parseInt(link.id))) {
                    await updateLink(parseInt(link.id), authUser.id, {
                        title: link.title,
                        url: link.url,
                        visible: link.visible,
                    });
                } else if (link.title && link.url) {
                    await createLink(authUser.id, {
                        title: link.title,
                        url: link.url,
                    });
                }
            }
        }

        // Handle social links if provided
        if (socialLinks && Array.isArray(socialLinks)) {
            const profile = await getFullUserProfileById(authUser.id);
            const existingSocialIds = new Set(profile?.socialLinks.map(s => s.id) || []);
            const newSocialIds = new Set(socialLinks.map((s: any) => parseInt(s.id)).filter(Boolean));

            for (const existingSocial of (profile?.socialLinks || [])) {
                if (!newSocialIds.has(existingSocial.id)) {
                    await deleteSocialLink(existingSocial.id, authUser.id);
                }
            }

            for (const social of socialLinks) {
                if (social.id && existingSocialIds.has(parseInt(social.id))) {
                    await updateSocialLink(parseInt(social.id), authUser.id, {
                        platform: social.platform,
                        url: social.url,
                        visible: social.visible,
                    });
                } else if (social.platform && social.url) {
                    await createSocialLink(authUser.id, {
                        platform: social.platform,
                        url: social.url,
                    });
                }
            }
        }

        const updatedProfile = await getFullUserProfileById(authUser.id);

        return NextResponse.json({
            id: updatedProfile?.user.id,
            username: updatedProfile?.user.username,
            displayName: updatedProfile?.user.displayName,
            bio: updatedProfile?.user.bio,
            theme: updatedProfile?.user.theme,
            showProfilePicture: updatedProfile?.user.showProfilePicture,
            profilePictureUrl: updatedProfile?.user.profilePictureUrl,
            links: updatedProfile?.links.map(l => ({
                id: l.id.toString(),
                title: l.title,
                url: l.url,
                visible: l.visible,
            })),
            socialLinks: updatedProfile?.socialLinks.map(s => ({
                id: s.id.toString(),
                platform: s.platform,
                url: s.url,
                visible: s.visible,
            })),
        });
    } catch (error) {
        console.error("Save user error:", error);
        return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 });
    }
}
