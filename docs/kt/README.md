# LIMS Frontend KT Pack

Last updated: 2026-06-01

This folder contains the knowledge-transfer documentation for the `lims_fe` frontend application.

## Contents

1. [Installation & Deployment Guide](./installation-deployment-guide.md)
2. [Source Code Documentation](./source-code-documentation.md)
3. [Screenshot Register](./screenshot-register.md)

## Application Summary

LIMS is a React + Vite frontend for land information management. The current frontend supports:

- Authentication: login, forgot password, reset password, change password, session timeout.
- Dashboard: summary cards, charts, recent activity, total area metrics.
- Project management: create, edit, delete, filter, and select projects.
- Private land workflows: villages, khatas, plots, land cost, social survey.
- Government land workflows: villages, khatas, plots, land cost.
- Forest land workflows: project master, stages, land schedule, EDS master data, master dashboard.
- Administration: user management, logs, deleted records, import plots.
- Reporting: khata, village, plot, project, map, user, and document reports.

## KT Notes

- The app is hosted as a static SPA and is currently configured for Firebase Hosting.
- API communication is backend-driven and depends on a valid authenticated session.
- The current codebase uses both raw `fetch` calls and the shared `apiClient`.
- A substantial set of latest screenshots was provided on 2026-06-01 for login, dashboard, projects, private land, government plot, forest workflows, user management, import plots, logs, and deleted records.
- Remaining screenshot gaps are tracked in [screenshot-register.md](./screenshot-register.md).
