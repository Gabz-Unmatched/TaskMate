# TaskMate

A student task and assignment manager designed to help students organise academic work, track deadlines, and monitor completion progress.

## Vision Document

### Problem Statement
Students often manage assignments across different subjects and deadlines, making it difficult to track pending work and completion status in one place.

### Target Users
- University and college students
- Students managing multiple subjects and deadlines

### Vision Statement
To provide a simple, accessible workspace where students can organise assignments, prioritise academic tasks, and track progress.

### Key Features and Goals
- Add assignments with a title, subject, deadline, and priority
- View total, pending, and completed assignment counts
- Mark assignments as completed
- Edit and delete assignments
- Filter assignments by completion status
- Store assignment data in SQLite

### Success Metrics
- Users can create, edit, complete, and delete assignments successfully
- Assignment data persists after a page refresh
- The application runs locally through Docker Compose

### Assumptions and Constraints
- The initial version is intended for local development and demonstration
- The application uses a React frontend, Express backend, and SQLite database
- Authentication and multi-user support are outside the initial scope

## MoSCoW Prioritisation

| Priority | User Stories |
|---|---|
| Must Have | US01, US02, US04, US05, US06, US09, US11, US12 |
| Should Have | US03, US07, US08, US10, US13, US14, US15, US16, US18, US20, US22 |
| Could Have | US17, US19, US21, US23, US24, US25 |
| Won't Have in the Initial Version | Features deferred if time or scope is limited |

Refer to the GitHub Issues for the complete user stories and acceptance criteria.

## Repository Structure

```text
TaskMate/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── Dockerfile
│   ├── src/
│   └── package.json
├── .gitignore
├── docker-compose.yml
└── README.md
```

## Branching Strategy

TaskMate follows GitHub Flow:
1. Keep the main branch as the stable branch.
2. Create a feature branch for each new feature or development task.
3. Commit changes with descriptive messages.
4. Push the feature branch to GitHub.
5. Review and merge changes through a pull request.

Example branch: `feature/docker-setup`

## Local Development Tools

- Node.js and npm
- React and Vite
- Express.js
- SQLite with better-sqlite3
- Git and GitHub
- Docker Desktop and Docker Compose
- Visual Studio Code

## Quick Start – Local Development

### Prerequisites
Install Docker Desktop and ensure its Docker engine is running.

### Start the application

From the project root, run:

```bash
docker compose up --build
```

Open the application at [http://localhost:5173](http://localhost:5173).

The backend API is available at [http://127.0.0.1:5000/api/assignments](http://127.0.0.1:5000/api/assignments).

### Stop the application

Press `Ctrl + C` in the terminal, then run:

```bash
docker compose down
```

The SQLite database uses a Docker named volume to preserve assignment data across container recreation.

## Docker Setup and Testing

The application runs as two services:
- **Frontend:** React production build served by Nginx
- **Backend:** Node.js and Express API
- **Database:** SQLite, stored in a persistent Docker volume

Build and start the services with Docker Compose:

```bash
docker compose up --build
```

Verify the frontend, test the backend API, and confirm that assignment changes persist after refreshing the page.

## User Stories and Project Tracking

The 25 user stories are tracked as GitHub Issues and organised in the TaskMate Development project.

## Architecture

The architecture diagram will be included with the project submission.

## Future Improvements

- User authentication and individual student profiles
- Assignment reminders
- Improved responsive layouts
- Deployment to a cloud environment