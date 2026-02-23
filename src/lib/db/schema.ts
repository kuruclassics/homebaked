import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const clients = sqliteTable('clients', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  company: text('company'),
  notes: text('notes'),
  status: text('status', { enum: ['active', 'inactive', 'lead'] }).default('active').notNull(),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
});

export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  clientId: integer('client_id').references(() => clients.id, { onDelete: 'set null' }),
  type: text('type', { enum: ['client_project', 'public_product'] }).default('client_project').notNull(),
  stage: text('stage', { enum: ['lead', 'proposal', 'active', 'paused', 'completed', 'maintenance'] }).default('lead').notNull(),
  githubRepoUrl: text('github_repo_url'),
  hourlyRate: real('hourly_rate'),
  fixedPrice: real('fixed_price'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
});

export const timeEntries = sqliteTable('time_entries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  date: text('date').notNull(),
  hours: real('hours').notNull(),
  source: text('source', { enum: ['git_auto', 'manual', 'claude_session'] }).default('manual').notNull(),
  commitHash: text('commit_hash'),
  sessionId: text('session_id'),
  notes: text('notes'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
});

export const financialEntries = sqliteTable('financial_entries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  type: text('type', { enum: ['invoice', 'payment'] }).notNull(),
  amount: real('amount').notNull(),
  date: text('date').notNull(),
  reference: text('reference'),
  status: text('status', { enum: ['pending', 'paid', 'overdue'] }).default('pending').notNull(),
  notes: text('notes'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
});

// Relations
export const clientsRelations = relations(clients, ({ many }) => ({
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  client: one(clients, { fields: [projects.clientId], references: [clients.id] }),
  timeEntries: many(timeEntries),
  financialEntries: many(financialEntries),
}));

export const timeEntriesRelations = relations(timeEntries, ({ one }) => ({
  project: one(projects, { fields: [timeEntries.projectId], references: [projects.id] }),
}));

export const financialEntriesRelations = relations(financialEntries, ({ one }) => ({
  project: one(projects, { fields: [financialEntries.projectId], references: [projects.id] }),
}));
