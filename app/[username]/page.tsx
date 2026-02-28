"use client"

import { useState, useEffect } from "react"
import { SOCIAL_PLATFORMS } from "@/types"
import { Instagram, Youtube, Twitter, Github, Linkedin, Facebook, Twitch, MessageCircle, Send, Mail, Globe } from "lucide-react"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"

const socialIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    instagram: Instagram,
    youtube: Youtube,
    twitter: Twitter,
    github: Github,
    linkedin: Linkedin,
    facebook: Facebook,
    twitch: Twitch,
    snapchat: MessageCircle,
    discord: Send,
    whatsapp: MessageCircle,
    email: Mail,
    website: Globe,
}

export default function PublicPage() {
    const params = useParams()
    const username = params?.username as string

    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (username) {
            fetch(`/api/username?username=${encodeURIComponent(username)}`)
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        setError(data.error)
                    }
                    setProfile(data)
                    setLoading(false)
                })
                .catch((err) => {
                    console.error("Error fetching profile:", err)
                    setError("Failed to load profile")
                    setLoading(false)
                })
        }
    }, [username])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    if (error || !profile || profile.error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                    <p className="text-gray-600">{error || "User not found"}</p>
                    <p className="text-sm text-gray-400 mt-2">Username: {username}</p>
                </div>
            </div>
        )
    }

    const user = profile
    // Default theme with black text for better readability
    const defaultTheme = {
        backgroundColor: "#ffffff",
        buttonColor: "#000000",
        buttonTextColor: "#ffffff",
        buttonRadius: "8px",
        fontFamily: "Inter, sans-serif",
        buttonStyle: "filled" as const,
        buttonSize: "medium" as const,
        textColor: "#000000",
    }
    const theme = user.theme || defaultTheme

    // Ensure textColor is always readable - default to black
    const textColor = theme.textColor === "#ffffff" || !theme.textColor ? "#000000" : theme.textColor

    // Generate keyframes for the floating animation
    const floatingKeyframes = `
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
    `

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8"
            style={{
                background: theme.backgroundColor,
                fontFamily: theme.fontFamily
            }}
        >
            <style>{floatingKeyframes}</style>

            {/* Profile Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-center mb-8 w-full max-w-md"
            >
                {/* Profile Picture */}
                {user.showProfilePicture && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden shadow-xl ring-4 ring-white/20"
                        style={{
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            animation: "float 3s ease-in-out infinite"
                        }}
                    >
                        {user.profilePictureUrl ? (
                            <img
                                src={user.profilePictureUrl}
                                alt={user.displayName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                                {user.displayName?.charAt(0).toUpperCase() || "U"}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Display Name */}
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl sm:text-3xl font-bold mb-2"
                    style={{ color: textColor }}
                >
                    {user.displayName || `@${user.username}`}
                </motion.h1>

                {/* Username */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm opacity-70"
                    style={{ color: textColor }}
                >
                    @{user.username}
                </motion.p>

                {/* Bio */}
                {user.bio && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-3 text-sm max-w-xs mx-auto opacity-80"
                        style={{ color: textColor }}
                    >
                        {user.bio}
                    </motion.p>
                )}
            </motion.div>

            {/* Social Links */}
            {user.socialLinks && user.socialLinks.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="flex justify-center gap-4 mb-8 flex-wrap"
                >
                    {user.socialLinks.map((social: any, index: number) => {
                        const IconComponent = socialIcons[social.platform] || Globe
                        const platformInfo = SOCIAL_PLATFORMS.find(p => p.platform === social.platform)
                        // Handle relative URLs - prepend https:// if needed
                        const getAbsoluteUrl = (url: string) => {
                            if (!url) return '#';
                            if (url.startsWith('http://') || url.startsWith('https://')) {
                                return url;
                            }
                            return 'https://' + url;
                        }

                        return (
                            <motion.a
                                key={social.id}
                                href={getAbsoluteUrl(social.url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 + index * 0.1 }}
                                whileHover={{ scale: 1.1, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg"
                                style={{ backgroundColor: platformInfo?.color || "#6366F1" }}
                            >
                                <IconComponent size={22} className="text-white" />
                            </motion.a>
                        )
                    })}
                </motion.div>
            )}

            {/* Links */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="w-full max-w-md space-y-4"
            >
                {user.links && user.links.map((link: any, index: number) => {
                    const buttonStyle = theme.buttonStyle === 'filled' ? {
                        background: theme.buttonColor,
                        color: theme.buttonTextColor,
                    } : theme.buttonStyle === 'outline' ? {
                        background: "transparent",
                        color: theme.buttonColor,
                        border: `2px solid ${theme.buttonColor}`,
                    } : {
                        background: `${theme.buttonColor}20`,
                        color: theme.buttonColor,
                    }

                    const sizeStyle = theme.buttonSize === 'small' ? {
                        padding: "10px 20px",
                        fontSize: "14px"
                    } : theme.buttonSize === 'large' ? {
                        padding: "18px 28px",
                        fontSize: "18px"
                    } : {
                        padding: "14px 24px",
                        fontSize: "16px"
                    }

                    // Handle relative URLs - prepend https:// if needed
                    const getLinkUrl = (url: string) => {
                        if (!url) return '#';
                        if (url.startsWith('http://') || url.startsWith('https://')) {
                            return url;
                        }
                        return 'https://' + url;
                    }

                    return (
                        <motion.a
                            key={link.id}
                            href={getLinkUrl(link.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 + index * 0.1 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                display: "block",
                                borderRadius: theme.buttonRadius,
                                textAlign: "center" as const,
                                fontWeight: 500,
                                textDecoration: "none",
                                transition: "all 0.2s ease",
                                ...buttonStyle,
                                ...sizeStyle
                            } as React.CSSProperties}
                        >
                            {link.title}
                        </motion.a>
                    )
                })}

                {(!user.links || user.links.length === 0) && (
                    <p className="text-center opacity-50" style={{ color: textColor }}>
                        No links yet
                    </p>
                )}
            </motion.div>

            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-12 text-center"
            >
                <p
                    className="text-xs opacity-40"
                    style={{ color: textColor }}
                >
                    Made with LinkTree
                </p>
            </motion.footer>
        </div>
    )
}
