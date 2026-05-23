# AI Wellness Intelligence Platform

A cross-platform AI-powered wellness, activity tracking, and goal management system built with TypeScript (Web) and powered by Google Gemini Flash API, with a built-in mock fallback mode for reliability.

---

## Overview

This project is an embedded AI intelligence engine for a web application. It analyzes user activity inside the app, detects behavioral patterns, identifies missing actions, and generates personalized insights, goals, and weekly reports.

All outputs are structured for direct use in a modern frontend dashboard.

---

## Core Features

- In-app activity tracking
- Daily behavior pattern analysis
- Missing activity detection
- AI-generated recommendations
- Weekly personalized reports
- Goal management (weekly / monthly / yearly)
- Non-clinical wellness assessment system
- Notification generation logic
- Optional wearable/BLE integration (abstracted)
- Automatic mock data fallback mode

---

## AI System

- Primary Model: Google Gemini Flash API
- Fallback Mode: Fully simulated mock intelligence system
- Always returns structured, frontend-ready data
- Designed for real-time UI rendering

---

## Tech Stack

- TypeScript
- React / Next.js
- Google Gemini Flash API
- Zustand / React Query
- Recharts / Chart.js (visualization)
- Node.js (API layer)

---

## UI / Design System

- Modern dashboard layout
- Glassmorphism UI components
- Minimal aesthetic design
- Responsive (desktop + mobile)
- Smooth animations and transitions
- Card-based analytics system

---

## System Behavior

The AI engine:
- Tracks user interactions inside the application
- Detects behavioral patterns and trends
- Identifies missing or incomplete activities
- Generates personalized suggestions and actions
- Creates weekly summaries and insights
- Produces notification events for frontend scheduling

---

## Safety

This system does not provide medical or psychological diagnoses.  
It only produces behavioral and wellness-related insights based on user activity patterns.

---

## Goal

To build an intelligent, adaptive wellness companion that helps users understand and improve their daily behavior using AI-driven insights, structured analytics, and personalized recommendations.

---<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/552de85a-b4e0-41f7-91de-4adc8c7a5614

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
