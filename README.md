# SkillBridge AI — Smart Skill-Gap Analyzer & Career Roadmap

A runnable full-stack student prototype. The frontend is responsive and includes three themes, career skill self-assessment, skill-gap analysis, a four-week learning roadmap, project ideas, learning links, task completion, saved profiles, and JSON export. The Express backend provides a REST API and persists profiles in `data/db.json`.

## Requirements
- Node.js 18 or newer (Node 20+ recommended)
- Internet connection only for the optional Google Fonts stylesheet; the app itself runs locally without a cloud account.

## Run on Windows
1. Extract this ZIP to a folder.
2. Install Node.js from https://nodejs.org/ if it is not already installed.
3. Open the extracted `SkillBridge_AI_Full_Stack` folder.
4. Click the address bar in File Explorer, type `cmd`, and press Enter.
5. Run these commands:

   ```bat
   npm install
   npm start
   ```

6. Open http://localhost:3000 in your browser. Keep the terminal window open while using the site.

## Run on macOS/Linux
Open a terminal in the extracted folder and run `npm install` then `npm start`. Open http://localhost:3000.

## API endpoints
- `GET /api/health` — server and optional AI-key status
- `GET /api/roles` — career roles, skills, projects, learning links
- `POST /api/assess` — create and save a self-assessment + roadmap
- `GET /api/profiles` — list saved profile summaries
- `GET /api/profiles/:id` — read a saved profile
- `PATCH /api/profiles/:id/tasks/:taskId` — update a roadmap task
- `DELETE /api/profiles/:id` — delete a saved profile

Example assessment request:

```json
{
  "name": "Student",
  "role": "Java Developer",
  "studyHours": 5,
  "skills": {"Java basics": 2, "OOP": 1, "Data structures": 2, "SQL": 0, "Git": 1, "Spring Boot": 0}
}
```

## Important scope and limitations
- **This is a working local prototype, not a deployed public website.** `localhost` is accessible on the computer running the server. A public permalink requires deployment to a hosting provider and a domain/hosting setup.
- Roadmaps currently use transparent built-in rules and templates. **A live AI model is not connected.** The `.env.example` file shows where an API key could be configured in a future integration. Never put a private API key in `public/` or commit it to GitHub. Do not assume an API key exists just because the field is documented.
- Data is stored in a local JSON file. There is no authentication, authorization, cloud database, backup, or production-grade privacy/security. Do not enter sensitive personal data. Do not expose this prototype publicly with real student records.
- The provided demo video is a narrated concept walkthrough, not a screen recording of a deployed site.

## Troubleshooting
- `npm` is not recognized: install Node.js, close and reopen the terminal, then retry.
- Port 3000 is already in use: create a `.env` file with `PORT=3001` (copy `.env.example` first), restart, and open http://localhost:3001.
- Reset demo data: stop the server and replace the contents of `data/db.json` with `{"profiles":[]}`.
