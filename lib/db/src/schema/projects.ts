import { pgTable, serial, text, integer, boolean, timestamp, json, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  category: text("category").notNull(),
  year: integer("year").notNull(),
  projectDate: date("project_date"),
  technologies: json("technologies").$type<string[]>().notNull().default([]),
  githubUrl: text("github_url"),
  demoUrl: text("demo_url"),
  featured: boolean("featured").default(false).notNull(),
  color: text("color").default("#00d4ff"),
  icon: text("icon"),
  coverImage: text("cover_image"),
  coverImageBase64: text("cover_image_base64"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProjectSchema = createInsertSchema(projectsTable).omit({ id: true, createdAt: true });
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projectsTable.$inferSelect;