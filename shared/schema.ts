import { pgTable, text, serial, integer, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  personId: varchar("person_id", { length: 6 }).notNull().unique(),
  firstName: text("first_name").notNull(),
  age: integer("age").notNull(),
  location: text("location").notNull(),
  occupation: text("occupation").notNull(),
  education: text("education").notNull(),
  interests: text("interests").notNull(),
  bio: text("bio").notNull(),
  photoUrl: text("photo_url").notNull(),
});

export const insertProfileSchema = createInsertSchema(profiles).omit({ id: true });

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;
