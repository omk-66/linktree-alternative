import { User, PRESET_THEMES } from "@/types"

// In-memory database - in production this would be replaced with a real database
let user: User = {
    id: "1",
    username: "john",
    displayName: "John Doe",
    bio: "Digital creator & content strategist",
    theme: PRESET_THEMES[0].theme,
    links: [
        { id: "1", title: "Instagram", url: "https://instagram.com", visible: true },
        { id: "2", title: "YouTube", url: "https://youtube.com", visible: true },
        { id: "3", title: "My Website", url: "https://example.com", visible: true },
    ],
    socialLinks: [
        { id: "1", platform: "twitter", url: "https://twitter.com", visible: true },
        { id: "2", platform: "github", url: "https://github.com", visible: true },
        { id: "3", platform: "linkedin", url: "https://linkedin.com", visible: true },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
}

// Get the current user
export function getUser(): User {
    return user
}

// Get user by username (for public pages)
export function getUserByUsername(username: string): User | null {
    if (user.username.toLowerCase() === username.toLowerCase()) {
        return user
    }
    return null
}

// Save/update user
export function saveUser(newUser: User): User {
    user = {
        ...newUser,
        updatedAt: new Date().toISOString(),
    }
    return user
}

// Create a new user (for demo purposes)
export function createUser(username: string): User {
    const newUser: User = {
        id: Date.now().toString(),
        username,
        displayName: username.charAt(0).toUpperCase() + username.slice(1),
        bio: "",
        theme: PRESET_THEMES[0].theme,
        links: [],
        socialLinks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
    user = newUser
    return user
}

// Check if username is available
export function isUsernameAvailable(username: string): boolean {
    return user.username.toLowerCase() !== username.toLowerCase()
}

// Add a new link
export function addLink(link: { title: string; url: string }): User {
    const newLink = {
        id: Date.now().toString(),
        ...link,
        visible: true,
    }
    user = {
        ...user,
        links: [...user.links, newLink],
        updatedAt: new Date().toISOString(),
    }
    return user
}

// Remove a link
export function removeLink(linkId: string): User {
    user = {
        ...user,
        links: user.links.filter(l => l.id !== linkId),
        updatedAt: new Date().toISOString(),
    }
    return user
}

// Update link
export function updateLink(linkId: string, updates: Partial<{ title: string; url: string; visible: boolean }>): User {
    user = {
        ...user,
        links: user.links.map(l => l.id === linkId ? { ...l, ...updates } : l),
        updatedAt: new Date().toISOString(),
    }
    return user
}

// Add social link
export function addSocialLink(platform: string, url: string): User {
    const newSocialLink = {
        id: Date.now().toString(),
        platform: platform as any,
        url,
        visible: true,
    }
    user = {
        ...user,
        socialLinks: [...user.socialLinks, newSocialLink],
        updatedAt: new Date().toISOString(),
    }
    return user
}

// Remove social link
export function removeSocialLink(socialLinkId: string): User {
    user = {
        ...user,
        socialLinks: user.socialLinks.filter(s => s.id !== socialLinkId),
        updatedAt: new Date().toISOString(),
    }
    return user
}

// Update theme
export function updateTheme(themeUpdates: Partial<User["theme"]>): User {
    user = {
        ...user,
        theme: { ...user.theme, ...themeUpdates },
        updatedAt: new Date().toISOString(),
    }
    return user
}

// Apply preset theme
export function applyPresetTheme(presetIndex: number): User {
    if (presetIndex >= 0 && presetIndex < PRESET_THEMES.length) {
        user = {
            ...user,
            theme: { ...PRESET_THEMES[presetIndex].theme },
            updatedAt: new Date().toISOString(),
        }
    }
    return user
}
