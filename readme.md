


## Git workflow

### Assumptions

- The Hugo website is already online with v1.0 via GitHub (e.g., GitHub Pages or Vercel).
- Deployment is triggered by changes to a specific branch (usually main or master).
- You want to use feature branches or a development branch for v2.0 work.
- GitHub is used to sync work between machines.

### 🔧 Setup

#### Branching Strategy

Use a simple Git branching model:


main        → deployed version (v1.0)
dev         → staging/preview (optional, for internal previews)
feature/*   → work on new sections, layouts, or language versions



### 🔁 Iterative Workflow (v2.0)
Step 1: Create Development Branch
From your main machine:


git checkout main
git pull origin main
git checkout -b dev-v2.0

Use this branch as the base for all upcoming changes.

## 💡 Optional: Push to GitHub to access from another machine.


git push -u origin dev-v2.0
Step 2: Develop Features in Separate Branches
Create feature branches from dev-v2.0:


git checkout dev-v2.0
git checkout -b feature-new-section
Work locally, commit often:


git add .
git commit -m "Add new section layout"
git push origin feature-new-section
Once feature is done:


git checkout dev-v2.0
git merge feature-new-section
git push origin dev-v2.0
Step 3: Sync Across Computers
On your second machine:


git fetch origin
git checkout dev-v2.0
git pull
You can now continue development from where you left off.

## Step 4: Preview and Test
Use Hugo’s built-in server:


hugo server
Optionally, if you want a live preview online, deploy the dev-v2.0 branch to a staging environment (e.g., Netlify, Vercel) with previews enabled for pull requests.

Step 5: Tag & Merge for Release
Once you're happy with v2.0:


git checkout main
git pull origin main
git merge dev-v2.0
git tag -a v2.0 -m "Release v2.0"
git push origin main --tags
💡 This step triggers deployment if your deployment is tied to main.

## 📂 Optional Enhancements
Protect main branch on GitHub to avoid accidental deployment.

Add .github/workflows (CI/CD) to specify deploy-on-tag behavior, if not using GitHub Pages directly.

Use Hugo environments to configure dev vs. production.

## 🧠 Summary

Task	Branch
Live production (v1.0)	main
Work on next version (v2.0)	dev-v2.0
Specific new features	feature/*
Optional staging deployment	dev-v2.0
