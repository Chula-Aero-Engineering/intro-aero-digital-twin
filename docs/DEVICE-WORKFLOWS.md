# Laptop and iPad Workflows

Every student edits the same three kinds of student-owned files. The device changes the editor, not the engineering process.

## First-time course setup

1. Open `https://github.com/Chula-Aero-Engineering/intro-aero-digital-twin`.
2. Select **Fork** and create the fork under your personal GitHub account.
3. Work only in your fork. Do not create a repository from a template: a fork retains the connection needed to receive instructor updates.

## Laptop or desktop

1. Clone your fork and open it in VS Code or another editor.
2. Run `npm ci` once.
3. Add the three files returned by ChatGPT.
4. Run `npm test` and `npm run dev`.
5. Open the printed local URL, verify the feature, then commit and push.

## iPad or browser-only computer: Codespaces

1. Open the student repository on GitHub in Safari or Chrome.
2. Select **Code → Codespaces → Create codespace on main**.
3. Wait for the browser editor to finish setup. Dependencies install automatically.
4. Add the same three files returned by ChatGPT.
5. Open the terminal and run `npm test`, then `npm run dev`.
6. Open the automatically forwarded **Aircraft digital twin** port.
7. Verify the feature, then commit and push from the Source Control panel.

Use iPad split view for ChatGPT and Codespaces if helpful. Stop the Codespace after class so it does not consume additional usage.

## Browser-only fallback: github.dev plus Pages

Press `.` while viewing the repository on GitHub, or replace `github.com` with `github.dev`. This editor can change, commit, and push files but cannot run Node or the development server. After a push to `main`, GitHub Actions runs the tests and build, then publishes the verified app through GitHub Pages.

The student must enable **Settings → Pages → Source: GitHub Actions** once in their fork. The repository name is detected during the build, so student repositories do not need a custom Vite path.

## Receiving an instructor update

Commit your student work before syncing.

On GitHub, open your fork and select **Sync fork → Update branch**. Then pull the updated `main` branch in your local clone or Codespace. Laptop users may instead add the course repository as `upstream` once and merge its updates:

```bash
git remote add upstream https://github.com/Chula-Aero-Engineering/intro-aero-digital-twin.git
git fetch upstream
git merge upstream/main
```

Instructor updates are constrained to core-owned paths. Student physics, feature definitions, tests, and specifications remain in separate protected paths, so normal updates should not overwrite them.

## What is common to every device

```text
complete one FEATURE-SPEC.md
        ↓
ordinary ChatGPT returns three files
        ↓
student adds those three files
        ↓
tests + application verify the model
        ↓
commit and push the growing aircraft
```

GitHub Classroom was retired on August 28, 2026. A public organization-owned upstream repository plus personal student forks, Codespaces, Actions, and Pages provides the intended semester-long workflow without disposable weekly repositories.
