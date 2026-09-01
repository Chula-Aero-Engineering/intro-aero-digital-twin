# Laptop and iPad Workflows

Every student edits the same three kinds of student-owned files. The device changes the editor, not the engineering process.

## Laptop or desktop

1. Clone the student repository and open it in VS Code or another editor.
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

The instructor must enable **Settings → Pages → Source: GitHub Actions** once in each repository or template-derived repository. The repository name is detected during the build, so student repositories do not need a custom Vite path.

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

GitHub Classroom was retired on August 28, 2026. A course organization plus a template repository, one repository per student, Codespaces, Actions, and Pages provides the intended semester-long workflow without disposable weekly repositories.
