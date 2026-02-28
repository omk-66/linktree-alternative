// Link Types
export type LinkItem = {
    id: string
    title: string
    url: string
    icon?: string // Optional icon name
    visible: boolean // Show/hide link
}

// Social Media Platform Types
export type SocialPlatform =
    | 'twitter'
    | 'instagram'
    | 'youtube'
    | 'tiktok'
    | 'linkedin'
    | 'github'
    | 'facebook'
    | 'twitch'
    | 'snapchat'
    | 'discord'
    | 'whatsapp'
    | 'email'
    | 'website'

export type SocialLink = {
    id: string
    platform: SocialPlatform
    url: string
    visible: boolean
}

// Theme Configuration
export type Theme = {
    backgroundColor: string
    backgroundImage?: string // Gradient or image URL
    buttonColor: string
    buttonTextColor: string
    buttonRadius: string
    fontFamily: string
    buttonStyle: 'filled' | 'outline' | 'soft' // Button style variants
    buttonSize: 'small' | 'medium' | 'large'
    textColor: string
    showProfilePicture: boolean
    profilePictureUrl?: string
}

// User Profile
export type User = {
    id: string
    username: string
    displayName: string
    bio: string
    theme: Theme
    links: LinkItem[]
    socialLinks: SocialLink[]
    createdAt: string
    updatedAt: string
}

// Predefined Themes
export type PresetTheme = {
    name: string
    theme: Theme
}

export const PRESET_THEMES: PresetTheme[] = [
    {
        name: 'Classic Black',
        theme: {
            backgroundColor: '#000000',
            buttonColor: '#ffffff',
            buttonTextColor: '#000000',
            buttonRadius: '8px',
            fontFamily: 'Inter',
            buttonStyle: 'filled',
            buttonSize: 'medium',
            textColor: '#ffffff',
            showProfilePicture: true,
        }
    },
    {
        name: 'Ocean Blue',
        theme: {
            backgroundColor: '#0f172a',
            buttonColor: '#3b82f6',
            buttonTextColor: '#ffffff',
            buttonRadius: '12px',
            fontFamily: 'Inter',
            buttonStyle: 'filled',
            buttonSize: 'medium',
            textColor: '#ffffff',
            showProfilePicture: true,
        }
    },
    {
        name: 'Sunset Glow',
        theme: {
            backgroundColor: '#fef3c7',
            buttonColor: '#f97316',
            buttonTextColor: '#ffffff',
            buttonRadius: '24px',
            fontFamily: 'Poppins',
            buttonStyle: 'filled',
            buttonSize: 'large',
            textColor: '#1f2937',
            showProfilePicture: true,
        }
    },
    {
        name: 'Forest Green',
        theme: {
            backgroundColor: '#14532d',
            buttonColor: '#22c55e',
            buttonTextColor: '#ffffff',
            buttonRadius: '8px',
            fontFamily: 'Inter',
            buttonStyle: 'filled',
            buttonSize: 'medium',
            textColor: '#ffffff',
            showProfilePicture: true,
        }
    },
    {
        name: 'Rose Pink',
        theme: {
            backgroundColor: '#fce7f3',
            buttonColor: '#ec4899',
            buttonTextColor: '#ffffff',
            buttonRadius: '16px',
            fontFamily: 'Poppins',
            buttonStyle: 'soft',
            buttonSize: 'medium',
            textColor: '#831843',
            showProfilePicture: true,
        }
    },
    {
        name: 'Minimal White',
        theme: {
            backgroundColor: '#ffffff',
            buttonColor: '#f3f4f6',
            buttonTextColor: '#1f2937',
            buttonRadius: '4px',
            fontFamily: 'Inter',
            buttonStyle: 'outline',
            buttonSize: 'medium',
            textColor: '#1f2937',
            showProfilePicture: true,
        }
    },
]

// Font Options
export const FONT_OPTIONS = [
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Poppins', value: 'Poppins, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Open Sans', value: 'Open Sans, sans-serif' },
    { name: 'Lato', value: 'Lato, sans-serif' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif' },
    { name: 'Raleway', value: 'Raleway, sans-serif' },
    { name: 'Nunito', value: 'Nunito, sans-serif' },
]

// Social Platform Icons (using lucide-react names)
export const SOCIAL_PLATFORMS: { platform: SocialPlatform; label: string; color: string }[] = [
    { platform: 'twitter', label: 'Twitter / X', color: '#000000' },
    { platform: 'instagram', label: 'Instagram', color: '#E4405F' },
    { platform: 'youtube', label: 'YouTube', color: '#FF0000' },
    { platform: 'tiktok', label: 'TikTok', color: '#000000' },
    { platform: 'linkedin', label: 'LinkedIn', color: '#0A66C2' },
    { platform: 'github', label: 'GitHub', color: '#333333' },
    { platform: 'facebook', label: 'Facebook', color: '#1877F2' },
    { platform: 'twitch', label: 'Twitch', color: '#9146FF' },
    { platform: 'snapchat', label: 'Snapchat', color: '#FFFC00' },
    { platform: 'discord', label: 'Discord', color: '#5865F2' },
    { platform: 'whatsapp', label: 'WhatsApp', color: '#25D366' },
    { platform: 'email', label: 'Email', color: '#EA4335' },
    { platform: 'website', label: 'Website', color: '#6366F1' },
]
