import { pgTable, text, serial, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  age: integer("age").notNull(),
  location: text("location").notNull(),
  occupation: text("occupation").notNull(),
  education: text("education").notNull(),
  interests: text("interests").notNull(),
  bio: text("bio").notNull(),
  mainPhotoUrl: text("main_photo_url"),
  bioPhotoUrl: text("bio_photo_url"),
  matchmakerPhotoUrl: text("matchmaker_photo_url"),
  images: jsonb("images").$type<Record<number, string>>(),
});

export const templateThemes = pgTable("template_themes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  backgroundImages: jsonb("background_images").$type<{
    slide1: string;
    slide2: string;
    slide3: string;
  }>().notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const slideElements = pgTable("slide_elements", {
  id: serial("id").primaryKey(),
  themeId: integer("theme_id").notNull(),
  slideNumber: integer("slide_number").notNull(), 
  elementType: text("element_type").notNull(), 
  position: jsonb("position").$type<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>().notNull(),
  properties: jsonb("properties").$type<{
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    padding?: string;
    borderRadius?: string;
    isPlaceholder?: boolean;
    name?: string;
    label?: string;
  }>().notNull(),
  content: text("content"), 
});

export const insertProfileSchema = createInsertSchema(profiles).omit({ 
  id: true 
});

export const insertThemeSchema = createInsertSchema(templateThemes).omit({
  id: true
});

export const insertSlideElementSchema = createInsertSchema(slideElements).omit({
  id: true
});

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;

export type InsertTheme = z.infer<typeof insertThemeSchema>;
export type Theme = typeof templateThemes.$inferSelect;

export type InsertSlideElement = z.infer<typeof insertSlideElementSchema>;
export type SlideElement = typeof slideElements.$inferSelect;