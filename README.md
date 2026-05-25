# Task Manager
![CI](https://github.com/OchirovAleks/task-manager/actions/workflows/ci.yml/badge.svg)
![E2E](https://github.com/OchirovAleks/task-manager/actions/workflows/e2e.yml/badge.svg)

## Live Demo

Frontend: https://task-manager-gamma-five-66.vercel.app/  
API: https://task-manager-api-1216.onrender.com/health

Full-stack project and task management application built with **React, Express, Prisma, and PostgreSQL**.

This project started as a simple CRUD MVP and gradually evolved into a more production-like full-stack application.

---

## Quick Summary

Task Manager is a full-stack project and task management application with a React frontend, Express API, PostgreSQL database, backend JWT authentication, integration tests, E2E tests, CI, and cloud deployment.

Highlights:

- REST API with Express
- PostgreSQL + Prisma data model
- Integration tests with Jest + Supertest
- End-to-End testing (Playwright)
- Modular React architecture (hooks + API layer)
- JWT authentication and protected API routes
- User-specific project and task ownership

---

## 📚 Table of Contents

- [Live Demo](#live-demo)
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Deployment](#deployment)
- [Architecture](#architecture)
- [API Overview](#api-overview)
- [Data Model](#data-model)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Development Notes](#development-notes)
- [Engineering Decisions](#engineering-decisions)
- [Local Development](#local-development)
- [Future Improvements](#future-improvements)
- [Status](#status)

---

# Overview

Task Manager allows users to create projects and manage tasks within those projects through a clean REST API and a lightweight frontend UI. The application is fully deployed and accessible online, demonstrating a realistic cloud deployment setup.

The project focuses on engineering practices rather than UI complexity.

### Key ideas demonstrated

- Full-stack CRUD application
- Relational database design
- Modular backend architecture
- Integration testing with a real database
- React state management with custom hooks

---

# Features

## Current

- Create, list, update and delete projects
- Create tasks inside a project
- List all tasks for a selected project
- Update and delete tasks
- Cascade delete (removing a project deletes its tasks)
- Inline editing for projects and tasks
- Keyboard shortcuts for editing
- PostgreSQL database with Prisma ORM
- Integration tests using Jest and Supertest
- End-to-end tests using Playwright for full user workflows
- Centralized error handling
- JWT authentication backend with register/login API routes
- Protected API routes using auth middleware
- User-based data isolation for projects and tasks
- Frontend login/register flow
- Persistent authentication using localStorage
- Logout functionality
- Authenticated UI state


## Planned

- Optional support for unassigned tasks (`projectId = null`)

---

# Tech Stack

## Frontend

- React
- Vite
- Custom Hooks
- Fetch API
- CSS

## Backend

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- REST API
- JWT authentication
- bcrypt password hashing

## Testing

- Jest
- Supertest
- Database-backed integration tests

---

# Deployment

The application is deployed using a cloud-based architecture:

Frontend: **Vercel**  
Backend API: **Render Web Service**  
Database: **Render PostgreSQL**

Environment variables are used to configure the frontend API endpoint:

VITE_API_URL

Backend services communicate with the database using Render's internal network.

Database schema is managed with **Prisma migrations** and automatically applied during deployment.
The deployed application is used as the target environment for end-to-end tests.

---

# System Architecture

Vercel (React Frontend)
        │
        ▼
Render Web Service (Express API)
        │
        ▼
Render PostgreSQL

---

# Architecture

## Frontend

The frontend is organized by responsibility:

components/   → UI components  
hooks/        → stateful logic  
api/          → HTTP communication layer  

### Principles

- Separation of concerns
- API logic isolated from UI
- Custom hooks for projects and tasks
- Simple but scalable structure

## Backend

The backend uses Express route modules and Prisma for persistence.

### Main ideas

- REST-style API
- Dependency injection through `createApp(prisma)`
- Relational data modeled in PostgreSQL
- Database-level cascade deletion
- Integration tests against a dedicated test database
- JWT-based authentication
- Auth middleware for protected routes
- User ownership checks for projects and tasks

[↑ Back to top](#task-manager)
---

# API Overview
Project and task routes require an Authorization header:
Authorization: Bearer <token>

## Auth

POST /auth/register  
POST /auth/login  

## Projects

GET    /projects  
POST   /projects  
PATCH  /projects/:id  
DELETE /projects/:id  

## Project Tasks

GET  /projects/:projectId/tasks  
POST /projects/:projectId/tasks  

## Tasks

PATCH  /tasks/:id  
DELETE /tasks/:id  

---

# Data Model

## User

id  
email  
passwordHash  
createdAt  

## Project

id  
name  
userId  

## Task

id  
title  
projectId  
userId  

---

# Testing

The project includes multiple layers of testing:

- **Integration tests (backend)** using Jest and Supertest
- **End-to-end tests (frontend + backend)** using Playwright
- **CI validation** for API tests and frontend build

### Integration Tests

Backend tests run against a dedicated PostgreSQL test database and reset tables between runs to ensure deterministic results.

### End-to-End Tests

Playwright tests simulate real user workflows:

- create project
- create tasks
- delete project (with cascade delete)

E2E tests run against the deployed application (Vercel + Render).

Due to reliance on external services (cold starts, shared database), E2E tests are executed via a **manual CI workflow** to ensure stability.

### CI Pipeline

CI runs on every push and pull request:

- API tests (Jest + Supertest)
- frontend production build

E2E tests are available as a separate workflow in GitHub Actions.

[↑ Back to top](#task-manager)
---

# Project Structure

apps/  
&nbsp;&nbsp;api/  
&nbsp;&nbsp;&nbsp;&nbsp;src/  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;routes/  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;prisma.js  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;app.js  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;index.js  
&nbsp;&nbsp;&nbsp;&nbsp;prisma/  
&nbsp;&nbsp;&nbsp;&nbsp;test/  

&nbsp;&nbsp;web/  
&nbsp;&nbsp;&nbsp;&nbsp;src/  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;components/  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;hooks/  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;api/  

---

# Development Notes

This project started as a small CRUD MVP and was gradually refactored to introduce a more modular architecture.

The backend originally used an in-memory store and was later migrated to PostgreSQL with Prisma to make the API closer to real production setups.

---

# Engineering Decisions

## Dependency Injection

The Express app is created with:

createApp(prisma)

This allows:

- easier testing
- separate test database
- clear separation between infrastructure and application logic

## Database-backed integration tests

Instead of mocking the database, tests run against a real PostgreSQL test database.

### Benefits

- Prisma queries are tested in real conditions
- cascade rules are validated
- API behavior matches production

## Nested project-task routes

Tasks are created through:

POST /projects/:projectId/tasks

This makes ownership explicit and simplifies validation logic.

## Cascade deletion

The Prisma schema uses:

onDelete: Cascade

When a project is deleted, its tasks are automatically removed by the database.

## Authentication and Authorization

The backend uses JWT-based authentication. Passwords are hashed before being stored in the database.

Protected routes require a Bearer token. The auth middleware verifies the token and attaches the authenticated user id to the request.

Project and task queries are scoped by `userId`, ensuring users can only access their own data.

[↑ Back to top](#task-manager)
---

# Local Development

## Backend

cd apps/api  
npm install  
npm run dev  

## Frontend

cd apps/web  
npm install  
npm run dev  

## Run tests

cd apps/api  
npm test  

## Environment Variables

Backend `.env`:

DATABASE_URL=your_postgresql_connection_string  
JWT_SECRET=your_jwt_secret  

Frontend `.env` (optional for local development):

VITE_API_URL=https://your-production-api-url

Local development uses the Vite proxy configuration to forward `/api` requests to the local backend server.

---

# Future Improvements

Planned improvements:

- screenshots / demo GIF
- task filtering and sorting
- Docker setup
- AI-assisted task generation and prioritization

---

# Status

This project is actively being polished and improved.
