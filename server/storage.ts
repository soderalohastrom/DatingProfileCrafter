import { 
  profiles, templateThemes, slideElements,
  type Profile, type InsertProfile,
  type Theme, type InsertTheme,
  type SlideElement, type InsertSlideElement 
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Profile Management
  getAllProfiles(): Promise<Profile[]>;
  getProfile(id: number): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: number, profile: Partial<InsertProfile>): Promise<Profile>;

  // Template Management
  getAllThemes(): Promise<Theme[]>;
  getTheme(id: number): Promise<Theme | undefined>;
  createTheme(theme: InsertTheme): Promise<Theme>;
  updateTheme(id: number, theme: Partial<InsertTheme>): Promise<Theme>;

  // Slide Element Management
  getSlideElements(themeId: number, slideNumber: number): Promise<SlideElement[]>;
  createSlideElement(element: InsertSlideElement): Promise<SlideElement>;
  updateSlideElement(id: number, element: Partial<InsertSlideElement>): Promise<SlideElement>;
  deleteSlideElement(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Profile Management
  async getAllProfiles(): Promise<Profile[]> {
    return await db.select().from(profiles);
  }

  async getProfile(id: number): Promise<Profile | undefined> {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, id));
    return profile;
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const [profile] = await db
      .insert(profiles)
      .values(insertProfile)
      .returning();
    return profile;
  }

  async updateProfile(
    id: number,
    updates: Partial<InsertProfile>
  ): Promise<Profile> {
    const [profile] = await db
      .update(profiles)
      .set(updates)
      .where(eq(profiles.id, id))
      .returning();

    if (!profile) {
      throw new Error("Profile not found");
    }

    return profile;
  }

  // Template Management
  async getAllThemes(): Promise<Theme[]> {
    return await db.select().from(templateThemes);
  }

  async getTheme(id: number): Promise<Theme | undefined> {
    const [theme] = await db
      .select()
      .from(templateThemes)
      .where(eq(templateThemes.id, id));
    return theme;
  }

  async createTheme(theme: InsertTheme): Promise<Theme> {
    const [newTheme] = await db
      .insert(templateThemes)
      .values(theme)
      .returning();
    return newTheme;
  }

  async updateTheme(
    id: number,
    updates: Partial<InsertTheme>
  ): Promise<Theme> {
    const [theme] = await db
      .update(templateThemes)
      .set(updates)
      .where(eq(templateThemes.id, id))
      .returning();

    if (!theme) {
      throw new Error("Theme not found");
    }

    return theme;
  }

  // Slide Element Management
  async getSlideElements(themeId: number, slideNumber: number): Promise<SlideElement[]> {
    return await db
      .select()
      .from(slideElements)
      .where(eq(slideElements.themeId, themeId))
      .where(eq(slideElements.slideNumber, slideNumber));
  }

  async createSlideElement(element: InsertSlideElement): Promise<SlideElement> {
    const [newElement] = await db
      .insert(slideElements)
      .values(element)
      .returning();
    return newElement;
  }

  async updateSlideElement(
    id: number,
    updates: Partial<InsertSlideElement>
  ): Promise<SlideElement> {
    const [element] = await db
      .update(slideElements)
      .set(updates)
      .where(eq(slideElements.id, id))
      .returning();

    if (!element) {
      throw new Error("Slide element not found");
    }

    return element;
  }

  async deleteSlideElement(id: number): Promise<void> {
    await db
      .delete(slideElements)
      .where(eq(slideElements.id, id));
  }
}

export const storage = new DatabaseStorage();