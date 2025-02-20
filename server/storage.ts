import { profiles, type Profile, type InsertProfile } from "@shared/schema";

export interface IStorage {
  getProfileByPersonId(personId: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(personId: string, profile: Partial<InsertProfile>): Promise<Profile>;
}

export class MemStorage implements IStorage {
  private profiles: Map<string, Profile>;
  private currentId: number;

  constructor() {
    this.profiles = new Map();
    this.currentId = 1;
  }

  async getProfileByPersonId(personId: string): Promise<Profile | undefined> {
    return Array.from(this.profiles.values()).find(
      (profile) => profile.personId === personId
    );
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = this.currentId++;
    const profile: Profile = { ...insertProfile, id };
    this.profiles.set(insertProfile.personId, profile);
    return profile;
  }

  async updateProfile(personId: string, updates: Partial<InsertProfile>): Promise<Profile> {
    const existing = await this.getProfileByPersonId(personId);
    if (!existing) {
      throw new Error("Profile not found");
    }

    const updated = { ...existing, ...updates };
    this.profiles.set(personId, updated);
    return updated;
  }
}

export const storage = new MemStorage();
