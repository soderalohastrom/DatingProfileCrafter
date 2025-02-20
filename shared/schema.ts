import { pgTable, text, serial, integer, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  personId: varchar("person_id", { length: 6 }).notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  age: integer("age").notNull(),
  location: text("location").notNull(),
  city: text("city"),
  state: text("state"),
  occupation: text("occupation").notNull(),
  education: text("education").notNull(),
  interests: text("interests").notNull(),
  bio: text("bio").notNull(),
  eyeColor: text("eye_color"),
  hairColor: text("hair_color"),
  ethnicity: text("ethnicity"),
  relationshipHistory: text("relationship_history"),
  haveChildren: text("have_children"),
  wantChildren: text("want_children"),
  religion: text("religion"),
  photoUrl: text("photo_url").notNull(),
  dateCreated: timestamp("date_created").defaultNow(),
});

export const insertProfileSchema = createInsertSchema(profiles).omit({ 
  id: true,
  dateCreated: true 
});

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;