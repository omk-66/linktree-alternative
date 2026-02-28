import { integer, pgTable, varchar, text, timestamp, boolean, serial, jsonb } from "drizzle-orm/pg-core";

// Users table with authentication
export const usersTable = pgTable("users", {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 50 }).notNull().unique(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    displayName: varchar("display_name", { length: 100 }).notNull().default(""),
    bio: text("bio").default(""),

    // Profile picture
    showProfilePicture: boolean("show_profile_picture").default(true),
    profilePictureUrl: text("profile_picture_url"),

    // Theme settings stored as JSON
    theme: jsonb("theme").$type<{
        backgroundColor: string
        backgroundImage?: string
        buttonColor: string
        buttonTextColor: string
        buttonRadius: string
        fontFamily: string
        buttonStyle: 'filled' | 'outline' | 'soft'
        buttonSize: 'small' | 'medium' | 'large'
        textColor: string
    }>().default({
        backgroundColor: "#000000",
        buttonColor: "#ffffff",
        buttonTextColor: "#000000",
        buttonRadius: "8px",
        fontFamily: "Inter, sans-serif",
        buttonStyle: "filled",
        buttonSize: "medium",
        textColor: "#ffffff",
    }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Links table
export const linksTable = pgTable("links", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 200 }).notNull(),
    url: text("url").notNull(),
    visible: boolean("visible").default(true),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Social links table
export const socialLinksTable = pgTable("social_links", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    platform: varchar("platform", { length: 50 }).notNull(),
    url: text("url").notNull(),
    visible: boolean("visible").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Type exports
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
export type Link = typeof linksTable.$inferSelect;
export type NewLink = typeof linksTable.$inferInsert;
export type SocialLink = typeof socialLinksTable.$inferSelect;
export type NewSocialLink = typeof socialLinksTable.$inferInsert;
