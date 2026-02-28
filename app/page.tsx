"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { User, PRESET_THEMES, FONT_OPTIONS, SOCIAL_PLATFORMS, SocialPlatform } from "@/types"
import {
  User as UserIcon,
  Link as LinkIcon,
  Share2,
  Palette,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Save,
  Check,
  ExternalLink,
  Instagram,
  Youtube,
  Twitter,
  Github,
  Linkedin,
  Facebook,
  Twitch,
  MessageCircle,
  Send,
  Mail,
  Globe,
  GripVertical,
  Copy,
  CheckCircle,
  LogOut,
  Loader2
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type Tab = "profile" | "links" | "social" | "theme"

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

interface UserData {
  id: number
  username: string
  displayName: string
  bio: string
  theme: any
  showProfilePicture: boolean
  profilePictureUrl?: string
  links: { id: string; title: string; url: string; visible: boolean }[]
  socialLinks: { id: string; platform: string; url: string; visible: boolean }[]
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>("profile")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/user")
      if (res.ok) {
        const data = await res.json()
        setUser(data)
      } else {
        router.push("/login")
      }
    } catch (err) {
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
    } catch (err) {
      console.error("Logout failed:", err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <Loader2 size={48} className="text-blue-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const updateUser = (updates: Partial<UserData>) => {
    setUser({ ...user, ...updates })
  }

  const updateTheme = (key: string, value: any) => {
    setUser({
      ...user,
      theme: { ...user.theme, [key]: value }
    })
  }

  const addLink = () => {
    setUser({
      ...user,
      links: [
        ...user.links,
        { id: Date.now().toString(), title: "New Link", url: "https://", visible: true }
      ]
    })
  }

  const updateLink = (id: string, key: string, value: any) => {
    setUser({
      ...user,
      links: user.links.map(link =>
        link.id === id ? { ...link, [key]: value } : link
      )
    })
  }

  const removeLink = (id: string) => {
    setUser({
      ...user,
      links: user.links.filter(link => link.id !== id)
    })
  }

  const addSocialLink = (platform: SocialPlatform) => {
    if (!user.socialLinks.find(s => s.platform === platform)) {
      setUser({
        ...user,
        socialLinks: [
          ...user.socialLinks,
          { id: Date.now().toString(), platform, url: "https://", visible: true }
        ]
      })
    }
  }

  const updateSocialLink = (id: string, key: string, value: any) => {
    setUser({
      ...user,
      socialLinks: user.socialLinks.map(social =>
        social.id === id ? { ...social, [key]: value } : social
      )
    })
  }

  const removeSocialLink = (id: string) => {
    setUser({
      ...user,
      socialLinks: user.socialLinks.filter(s => s.id !== id)
    })
  }

  const applyPreset = (index: number) => {
    setUser({
      ...user,
      theme: { ...PRESET_THEMES[index].theme }
    })
  }

  const save = async () => {
    setSaving(true)
    try {
      await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error("Failed to save:", err)
    }
    setSaving(false)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/${user.username}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabs = [
    { id: "profile" as Tab, label: "Profile", icon: UserIcon },
    { id: "links" as Tab, label: "Links", icon: LinkIcon },
    { id: "social" as Tab, label: "Social", icon: Share2 },
    { id: "theme" as Tab, label: "Theme", icon: Palette },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            LinkTree
          </h1>
          <p className="text-sm text-gray-500 mt-1">Your all-in-one link page</p>
        </div>

        <nav className="flex-1 p-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${activeTab === tab.id
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={copyLink}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {copied ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <a
            href={`/${user.username}`}
            target="_blank"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ExternalLink size={18} />
            View Page
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Editor Panel */}
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h2>
                <p className="text-gray-500 mt-1">
                  {activeTab === "profile" && "Edit your profile information"}
                  {activeTab === "links" && "Manage your links"}
                  {activeTab === "social" && "Add your social media links"}
                  {activeTab === "theme" && "Customize your page appearance"}
                </p>
              </div>
              <button
                onClick={save}
                disabled={saving}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${saved
                    ? "bg-green-500 text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                {saving ? (
                  "Saving..."
                ) : saved ? (
                  <>
                    <Check size={18} />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <h3 className="font-semibold text-gray-900 mb-4">Basic Information</h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                          </label>
                          <div className="flex items-center">
                            <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500">
                              linktree.com/
                            </span>
                            <input
                              type="text"
                              value={user.username}
                              onChange={e => updateUser({ username: e.target.value })}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Display Name
                          </label>
                          <input
                            type="text"
                            value={user.displayName}
                            onChange={e => updateUser({ displayName: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bio
                          </label>
                          <textarea
                            value={user.bio}
                            onChange={e => updateUser({ bio: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder="Tell people about yourself..."
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <h3 className="font-semibold text-gray-900 mb-4">Profile Picture</h3>

                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                          {user.showProfilePicture && user.profilePictureUrl ? (
                            <img
                              src={user.profilePictureUrl}
                              alt={user.displayName}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            user.displayName.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={user.showProfilePicture}
                              onChange={e => updateUser({ showProfilePicture: e.target.checked })}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Show profile picture</span>
                          </label>
                          {user.showProfilePicture && (
                            <input
                              type="text"
                              placeholder="Image URL (e.g., https://example.com/photo.jpg)"
                              value={user.profilePictureUrl || ""}
                              onChange={e => updateUser({ profilePictureUrl: e.target.value })}
                              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Links Tab */}
                {activeTab === "links" && (
                  <div className="space-y-4">
                    {user.links.map((link, index) => (
                      <motion.div
                        key={link.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                      >
                        <div className="flex items-start gap-3">
                          <div className="cursor-grab text-gray-400 hover:text-gray-600 mt-2">
                            <GripVertical size={20} />
                          </div>
                          <div className="flex-1 space-y-3">
                            <input
                              type="text"
                              value={link.title}
                              onChange={e => updateLink(link.id, "title", e.target.value)}
                              placeholder="Link Title"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                            />
                            <input
                              type="url"
                              value={link.url}
                              onChange={e => updateLink(link.id, "url", e.target.value)}
                              placeholder="https://example.com"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateLink(link.id, "visible", !link.visible)}
                              className={`p-2 rounded-lg transition-colors ${link.visible ? "text-green-600 bg-green-50" : "text-gray-400 bg-gray-100"
                                }`}
                            >
                              {link.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                            <button
                              onClick={() => removeLink(link.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    <button
                      onClick={addLink}
                      className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={20} />
                      Add New Link
                    </button>
                  </div>
                )}

                {/* Social Tab */}
                {activeTab === "social" && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <h3 className="font-semibold text-gray-900 mb-4">Your Social Links</h3>

                      {user.socialLinks.length > 0 ? (
                        <div className="space-y-3">
                          {user.socialLinks.map(social => {
                            const IconComponent = socialIcons[social.platform] || Globe
                            const platformInfo = SOCIAL_PLATFORMS.find(p => p.platform === social.platform)

                            return (
                              <div key={social.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div
                                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                                  style={{ backgroundColor: platformInfo?.color || "#6366F1" }}
                                >
                                  <IconComponent size={18} />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-700">{platformInfo?.label}</p>
                                  <input
                                    type="url"
                                    value={social.url}
                                    onChange={e => updateSocialLink(social.id, "url", e.target.value)}
                                    placeholder="https://"
                                    className="w-full px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                                <button
                                  onClick={() => removeSocialLink(social.id)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">No social links added yet</p>
                      )}
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <h3 className="font-semibold text-gray-900 mb-4">Add Social Links</h3>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                        {SOCIAL_PLATFORMS.map(platform => {
                          const IconComponent = socialIcons[platform.platform] || Globe
                          const isAdded = user.socialLinks.some(s => s.platform === platform.platform)

                          return (
                            <button
                              key={platform.platform}
                              onClick={() => !isAdded && addSocialLink(platform.platform as SocialPlatform)}
                              disabled={isAdded}
                              className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-all ${isAdded
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-gray-50 hover:bg-gray-100 text-gray-700 hover:scale-105"
                                }`}
                            >
                              <IconComponent size={20} />
                              <span className="text-xs truncate w-full text-center">{platform.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Theme Tab */}
                {activeTab === "theme" && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <h3 className="font-semibold text-gray-900 mb-4">Preset Themes</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {PRESET_THEMES.map((preset, index) => (
                          <button
                            key={index}
                            onClick={() => applyPreset(index)}
                            className="p-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-colors text-left"
                          >
                            <div
                              className="h-16 rounded-lg mb-2 flex items-center justify-center"
                              style={{ background: preset.theme.backgroundColor }}
                            >
                              <div
                                className="w-20 h-6 rounded"
                                style={{ background: preset.theme.buttonColor }}
                              />
                            </div>
                            <p className="text-sm font-medium text-gray-700">{preset.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <h3 className="font-semibold text-gray-900 mb-4">Customize Theme</h3>

                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Background Color
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={user.theme.backgroundColor}
                                onChange={e => updateTheme("backgroundColor", e.target.value)}
                                className="w-12 h-12 rounded-lg cursor-pointer border-0"
                              />
                              <input
                                type="text"
                                value={user.theme.backgroundColor}
                                onChange={e => updateTheme("backgroundColor", e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Text Color
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={user.theme.textColor}
                                onChange={e => updateTheme("textColor", e.target.value)}
                                className="w-12 h-12 rounded-lg cursor-pointer border-0"
                              />
                              <input
                                type="text"
                                value={user.theme.textColor}
                                onChange={e => updateTheme("textColor", e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Button Color
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={user.theme.buttonColor}
                                onChange={e => updateTheme("buttonColor", e.target.value)}
                                className="w-12 h-12 rounded-lg cursor-pointer border-0"
                              />
                              <input
                                type="text"
                                value={user.theme.buttonColor}
                                onChange={e => updateTheme("buttonColor", e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Button Text Color
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={user.theme.buttonTextColor}
                                onChange={e => updateTheme("buttonTextColor", e.target.value)}
                                className="w-12 h-12 rounded-lg cursor-pointer border-0"
                              />
                              <input
                                type="text"
                                value={user.theme.buttonTextColor}
                                onChange={e => updateTheme("buttonTextColor", e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Button Border Radius: {user.theme.buttonRadius}
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={parseInt(user.theme.buttonRadius)}
                            onChange={e => updateTheme("buttonRadius", `${e.target.value}px`)}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Font Family
                          </label>
                          <select
                            value={user.theme.fontFamily}
                            onChange={e => updateTheme("fontFamily", e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {FONT_OPTIONS.map(font => (
                              <option key={font.name} value={font.value}>
                                {font.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Button Style
                            </label>
                            <div className="space-y-2">
                              {['filled', 'outline', 'soft'].map(style => (
                                <button
                                  key={style}
                                  onClick={() => updateTheme("buttonStyle", style)}
                                  className={`w-full px-3 py-2 rounded-lg text-sm capitalize ${user.theme.buttonStyle === style
                                      ? "bg-blue-50 text-blue-600 border-2 border-blue-500"
                                      : "bg-gray-50 text-gray-600 border-2 border-transparent"
                                    }`}
                                >
                                  {style}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Button Size
                            </label>
                            <div className="space-y-2">
                              {['small', 'medium', 'large'].map(size => (
                                <button
                                  key={size}
                                  onClick={() => updateTheme("buttonSize", size)}
                                  className={`w-full px-3 py-2 rounded-lg text-sm capitalize ${user.theme.buttonSize === size
                                      ? "bg-blue-50 text-blue-600 border-2 border-blue-500"
                                      : "bg-gray-50 text-gray-600 border-2 border-transparent"
                                    }`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="w-full lg:w-[400px] bg-gray-100 border-l border-gray-200 p-6 lg:p-8">
          <div className="sticky top-6">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Eye size={18} />
              Live Preview
            </h3>

            {/* Phone Preview */}
            <div className="mx-auto w-[280px] h-[580px] bg-white rounded-[40px] shadow-2xl overflow-hidden border-8 border-gray-800">
              {/* Phone Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-800 rounded-b-2xl z-10"></div>

              {/* Preview Content */}
              <div
                className="w-full h-full overflow-y-auto pt-12 pb-6 px-4"
                style={{
                  background: user.theme.backgroundColor,
                  fontFamily: user.theme.fontFamily
                }}
              >
                {/* Profile Section */}
                <div className="text-center mb-6">
                  {user.showProfilePicture ? (
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold mb-3 overflow-hidden">
                      {user.profilePictureUrl ? (
                        <img
                          src={user.profilePictureUrl}
                          alt={user.displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user.displayName.charAt(0).toUpperCase()
                      )}
                    </div>
                  ) : null}

                  <h2
                    className="text-xl font-bold"
                    style={{ color: user.theme.textColor }}
                  >
                    {user.displayName || "@" + user.username}
                  </h2>
                  {user.bio && (
                    <p
                      className="text-sm mt-1 opacity-80"
                      style={{ color: user.theme.textColor }}
                    >
                      {user.bio}
                    </p>
                  )}
                </div>

                {/* Social Links Row */}
                {user.socialLinks.filter(s => s.visible).length > 0 && (
                  <div className="flex justify-center gap-3 mb-6 flex-wrap">
                    {user.socialLinks.filter(s => s.visible).map(social => {
                      const IconComponent = socialIcons[social.platform] || Globe
                      const platformInfo = SOCIAL_PLATFORMS.find(p => p.platform === social.platform)

                      return (
                        <a
                          key={social.id}
                          href={social.url}
                          target="_blank"
                          className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                          style={{ backgroundColor: platformInfo?.color || "#6366F1" }}
                        >
                          <span className="text-white">
                            <IconComponent size={18} />
                          </span>
                        </a>
                      )
                    })}
                  </div>
                )}

                {/* Links */}
                <div className="space-y-3">
                  {user.links.filter(l => l.visible).map(link => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      style={{
                        display: "block",
                        ...(user.theme.buttonStyle === 'filled' ? {
                          background: user.theme.buttonColor,
                          color: user.theme.buttonTextColor,
                        } : user.theme.buttonStyle === 'outline' ? {
                          background: "transparent",
                          color: user.theme.buttonColor,
                          border: `2px solid ${user.theme.buttonColor}`,
                        } : {
                          background: `${user.theme.buttonColor}20`,
                          color: user.theme.buttonColor,
                        }),
                        borderRadius: user.theme.buttonRadius,
                        ...(user.theme.buttonSize === 'small' ? { padding: "8px 16px", fontSize: "14px" } :
                          user.theme.buttonSize === 'large' ? { padding: "16px 24px", fontSize: "18px" } :
                            { padding: "12px 20px", fontSize: "16px" })
                      } as React.CSSProperties}
                      className="text-center font-medium transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {link.title}
                    </a>
                  ))}
                </div>

                {/* Branding */}
                <div className="mt-8 text-center">
                  <p
                    className="text-xs opacity-50"
                    style={{ color: user.theme.textColor }}
                  >
                    Made with LinkTree
                  </p>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-gray-500 mt-4">
              This is how your page will look
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
