import { profiles, type Profile, type InsertProfile } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getProfileByPersonId(personId: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(personId: string, profile: Partial<InsertProfile>): Promise<Profile>;
}

export class DatabaseStorage implements IStorage {
  async getProfileByPersonId(personId: string): Promise<Profile | undefined> {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.personId, personId));
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
    personId: string,
    updates: Partial<InsertProfile>
  ): Promise<Profile> {
    const [profile] = await db
      .update(profiles)
      .set(updates)
      .where(eq(profiles.personId, personId))
      .returning();

    if (!profile) {
      throw new Error("Profile not found");
    }

    return profile;
  }
}

export const storage = new DatabaseStorage();