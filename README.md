# LeetCode Clone - Coding Practice Platform

## About

This project is a LeetCode-inspired coding practice web application featuring:

- User authentication with JWT
- Problem solving with test case execution
- User leaderboard, points, and XP system
- Multiplayer mode (**coming soon**)
- Real-time chat and lobby UI (implemented, but game play under development)
- Built with Next.js (frontend), Go and Elixir (backend)

## Features

- Solve coding problems with live test case validation
- View problem stats and personal progress
- Chat and lobby system for multiplayer setup
- Scalable backend architecture using Phoenix Channels, GenServer, and dynamic supervisors
- JWT authentication with rate limiting middleware

## Tech Stack

| Frontend               | Backend                     |
|------------------------|-----------------------------|
| Next.js (React/TSX)    | Go (API, JWT middleware)    |
|                        | Elixir (Phoenix channels, GenServer) |

## Status

🚧 Multiplayer gameplay is currently under development and marked as **Coming Soon**.

## Getting Started

### Prerequisites

- Node.js (v16+)
- Go (v1.18+)
- Elixir (v1.14+)
- PostgreSQL or other DB (if applicable)

### Installation

1. Clone the repo:

```
git clone https://github.com/yourusername/leetcode-clone.git
cd leetcode-clone
```
Install frontend dependencies:

```
cd frontend
npm install
```
Setup backend services and databases as per /backend/README.md (or specify here if you want).

Run the frontend:

```
npm run dev
Start backend servers (Go and Elixir):
```

# Run the backend
```
cd backend/cmd
go run main.go
```

Notes
The multiplayer routes (/multiplayer, /lobby, /roomID) are currently disabled and hidden.

Backend architecture uses Phoenix Channels, GenServer, and Registry for real-time features.

JWT middleware uses some AI-assisted rate limiting logic.

# Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.

# License
MIT License
