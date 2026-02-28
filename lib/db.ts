import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { usersTable, linksTable, socialLinksTable, type User, type Link, type SocialLink } from '@/db/schema';
import { eq } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema: { usersTable, linksTable, socialLinksTable } });

let dbAvailable = true;

// Test database connection
async function testConnection(): Promise<boolean> {
    try {
        await db.select().from(usersTable).limit(1);
        dbAvailable = true;
        return true;
    } catch (error) {
        console.error("Database not available:", error);
        dbAvailable = false;
        return false;
    }
}

// Initialize connection test on import
testConnection();

// Fallback in-memory DB for when database is not available
let fallbackUser: User | null = null;
let fallbackLinks: Link[] = [];
let fallbackSocialLinks: SocialLink[] = [];
let nextFallbackId = 100;

function createFallbackUser(): User {
    return {
        id: 1,
        username: "demo",
        email: "demo@example.com",
        passwordHash: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.n1oX6P5x5.VYWy",
        displayName: "Demo User",
        bio: "Welcome to LinkTree!",
        showProfilePicture: true,
        profilePictureUrl: null,
        theme: {
            backgroundColor: "#000000",
            buttonColor: "#ffffff",
            buttonTextColor: "#000000",
            buttonRadius: "8px",
            fontFamily: "Inter, sans-serif",
            buttonStyle: "filled",
            buttonSize: "medium",
            textColor: "#ffffff",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

function getFallbackLinks(): Link[] {
    if (fallbackLinks.length === 0) {
        fallbackLinks = [
            { id: 1, userId: 1, title: "Instagram", url: "https://instagram.com", visible: true, sortOrder: 0, createdAt: new Date() },
            { id: 2, userId: 1, title: "YouTube", url: "https://youtube.com", visible: true, sortOrder: 1, createdAt: new Date() },
            { id: 3, userId: 1, title: "Twitter", url: "https://twitter.com", visible: true, sortOrder: 2, createdAt: new Date() },
        ];
    }
    return fallbackLinks;
}

function getFallbackSocialLinks(): SocialLink[] {
    if (fallbackSocialLinks.length === 0) {
        fallbackSocialLinks = [
            { id: 1, userId: 1, platform: "twitter", url: "https://twitter.com", visible: true, createdAt: new Date() },
            { id: 2, userId: 1, platform: "instagram", url: "https://instagram.com", visible: true, createdAt: new Date() },
        ];
    }
    return fallbackSocialLinks;
}

// User operations
export async function getUserById(id: number): Promise<User | undefined> {
    if (!dbAvailable) {
        await testConnection();
    }

    if (!dbAvailable) {
        if (!fallbackUser) fallbackUser = createFallbackUser();
        return id === fallbackUser.id ? fallbackUser : undefined;
    }

    try {
        const result = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
        return result[0];
    } catch (error) {
        console.error("Error getting user by id:", error);
        if (!fallbackUser) fallbackUser = createFallbackUser();
        return id === fallbackUser.id ? fallbackUser : undefined;
    }
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
    if (!dbAvailable) {
        await testConnection();
    }

    if (!dbAvailable) {
        if (!fallbackUser) fallbackUser = createFallbackUser();
        return fallbackUser.username.toLowerCase() === username.toLowerCase() ? fallbackUser : undefined;
    }

    try {
        const result = await db.select().from(usersTable).where(eq(usersTable.username, username.toLowerCase())).limit(1);
        return result[0];
    } catch (error) {
        console.error("Error getting user by username:", error);
        if (!fallbackUser) fallbackUser = createFallbackUser();
        return fallbackUser.username.toLowerCase() === username.toLowerCase() ? fallbackUser : undefined;
    }
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
    if (!dbAvailable) {
        await testConnection();
    }

    if (!dbAvailable) {
        return undefined;
    }

    try {
        const result = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase())).limit(1);
        return result[0];
    } catch (error) {
        console.error("Error getting user by email:", error);
        return undefined;
    }
}

export async function createUser(data: {
    username: string;
    email: string;
    passwordHash: string;
    displayName: string;
}): Promise<User> {
    if (!dbAvailable) {
        await testConnection();
    }

    if (!dbAvailable) {
        // Create fallback user
        fallbackUser = {
            id: 1,
            username: data.username.toLowerCase(),
            email: data.email.toLowerCase(),
            passwordHash: data.passwordHash,
            displayName: data.displayName,
            bio: "",
            showProfilePicture: true,
            profilePictureUrl: null,
            theme: {
                backgroundColor: "#000000",
                buttonColor: "#ffffff",
                buttonTextColor: "#000000",
                buttonRadius: "8px",
                fontFamily: "Inter, sans-serif",
                buttonStyle: "filled",
                buttonSize: "medium",
                textColor: "#ffffff",
            },
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        fallbackLinks = [];
        fallbackSocialLinks = [];
        return fallbackUser;
    }

    const result = await db.insert(usersTable).values({
        username: data.username.toLowerCase(),
        email: data.email.toLowerCase(),
        passwordHash: data.passwordHash,
        displayName: data.displayName,
    }).returning();
    return result[0];
}

export async function updateUser(id: number, data: Partial<{
    displayName: string;
    bio: string;
    showProfilePicture: boolean;
    profilePictureUrl: string;
    theme: User['theme'];
}>): Promise<User> {
    if (!dbAvailable) {
        await testConnection();
    }

    if (!dbAvailable) {
        if (!fallbackUser) fallbackUser = createFallbackUser();
        if (id === fallbackUser.id) {
            Object.assign(fallbackUser, data, { updatedAt: new Date() });
            return fallbackUser;
        }
        throw new Error("User not found");
    }

    const result = await db.update(usersTable)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(usersTable.id, id))
        .returning();
    return result[0];
}

// Link operations
export async function getLinksByUserId(userId: number): Promise<Link[]> {
    if (!dbAvailable) {
        await testConnection();
    }

    if (!dbAvailable) {
        return getFallbackLinks().filter(l => l.userId === userId);
    }

    try {
        return db.select().from(linksTable).where(eq(linksTable.userId, userId));
    } catch (error) {
        console.error("Error getting links:", error);
        return getFallbackLinks().filter(l => l.userId === userId);
    }
}

export async function createLink(userId: number, data: { title: string; url: string }): Promise<Link> {
    if (!dbAvailable) {
        await testConnection();
    }

    if (!dbAvailable) {
        const newLink: Link = {
            id: nextFallbackId++,
            userId,
            title: data.title,
            url: data.url,
            visible: true,
            sortOrder: getFallbackLinks().length,
            createdAt: new Date(),
        };
        fallbackLinks.push(newLink);
        return newLink;
    }

    const result = await db.insert(linksTable).values({
        userId,
        title: data.title,
        url: data.url,
        visible: true,
    }).returning();
    return result[0];
}

export async function updateLink(id: number, userId: number, data: Partial<{
    title: string;
    url: string;
    visible: boolean;
    sortOrder: number;
}>): Promise<Link> {
    if (!dbAvailable) {
        await testConnection();
    }

    if (!dbAvailable) {
        const link = getFallbackLinks().find(l => l.id === id);
        if (link) {
            Object.assign(link, data);
            return link;
        }
        throw new Error("Link not found");
    }

    const result = await db.update(linksTable)
        .set(data)
        .where(eq(linksTable.id, id))
        .returning();
    return result[0];
}

export async function deleteLink(id: number, userId: number): Promise<void> {
    if (!dbAvailable) {
        await testConnection();
        return;
    }

    await db.delete(linksTable).where(eq(linksTable.id, id));
}

// Social links operations
export async function getSocialLinksByUserId(userId: number): Promise<SocialLink[]> {
    if (!dbAvailable) {
        await testConnection();
    }

    if (!dbAvailable) {
        return getFallbackSocialLinks().filter(s => s.userId === userId);
    }

    try {
        return db.select().from(socialLinksTable).where(eq(socialLinksTable.userId, userId));
    } catch (error) {
        console.error("Error getting social links:", error);
        return getFallbackSocialLinks().filter(s => s.userId === userId);
    }
}

export async function createSocialLink(userId: number, data: { platform: string; url: string }): Promise<SocialLink> {
    if (!dbAvailable) {
        await testConnection();
    }

    if (!dbAvailable) {
        const newSocialLink: SocialLink = {
            id: nextFallbackId++,
            userId,
            platform: data.platform,
            url: data.url,
            visible: true,
            createdAt: new Date(),
        };
        fallbackSocialLinks.push(newSocialLink);
        return newSocialLink;
    }

    const result = await db.insert(socialLinksTable).values({
        userId,
        platform: data.platform,
        url: data.url,
        visible: true,
    }).returning();
    return result[0];
}

export async function updateSocialLink(id: number, userId: number, data: Partial<{
    platform: string;
    url: string;
    visible: boolean;
}>): Promise<SocialLink> {
    if (!dbAvailable) {
        await testConnection();
    }

    if (!dbAvailable) {
        const socialLink = getFallbackSocialLinks().find(s => s.id === id);
        if (socialLink) {
            Object.assign(socialLink, data);
            return socialLink;
        }
        throw new Error("Social link not found");
    }

    const result = await db.update(socialLinksTable)
        .set(data)
        .where(eq(socialLinksTable.id, id))
        .returning();
    return result[0];
}

export async function deleteSocialLink(id: number, userId: number): Promise<void> {
    if (!dbAvailable) {
        await testConnection();
        return;
    }

    await db.delete(socialLinksTable).where(eq(socialLinksTable.id, id));
}

// Full user profile with links
export interface FullUserProfile {
    user: User;
    links: Link[];
    socialLinks: SocialLink[];
}

export async function getFullUserProfile(username: string): Promise<FullUserProfile | null> {
    const user = await getUserByUsername(username);
    if (!user) return null;

    const links = await getLinksByUserId(user.id);
    const socialLinks = await getSocialLinksByUserId(user.id);

    return { user, links, socialLinks };
}

export async function getFullUserProfileById(userId: number): Promise<FullUserProfile | null> {
    const user = await getUserById(userId);
    if (!user) return null;

    const links = await getLinksByUserId(user.id);
    const socialLinks = await getSocialLinksByUserId(user.id);

    return { user, links, socialLinks };
}

export function isDatabaseAvailable(): boolean {
    return dbAvailable;
}
