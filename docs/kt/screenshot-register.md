# Screenshot Register

Last updated: 2026-06-01

## 1. Purpose

This file is the screenshot workbook for KT and handover. It lists the screens that should be captured from the latest working environment.

## 2. Current Status

As of 2026-06-01:

- the repository does not contain a maintained screenshot library
- authenticated feature screenshots were provided externally by the project team
- the application still depends on a reachable backend API and valid login credentials for any remaining capture

Because of that, this document now tracks both:

- screenshots already captured and shared
- screenshots still pending from UAT or production-like data

## 2.1 Screenshots Received

The following feature screenshots were provided on 2026-06-01 and have been mapped into the KT inventory:

- Login screen
- Dashboard
- Project list
- Private villages
- Private khata
- Private plots
- Private plot actions menu
- Private land cost / payment ready
- Government plot empty state
- Government plot list
- Government plot lease-case filter
- Forest project master
- Forest stages: Stage 0
- Forest stages: Stage I
- Forest master dashboard
- Government land cost / payment ready
- User management
- Import plots: empty state
- Import plots: uploaded documents list
- Logs
- Deleted records
- Private village project selector

## 3. Screenshot Naming Convention

Store screenshots under:

- `docs/kt/screenshots/`

Recommended file naming pattern:

- `01-login.png`
- `02-dashboard.png`
- `03-project-list.png`
- `04-private-village-list.png`

If environment-specific:

- `uat-01-login-2026-06-01.png`
- `uat-02-dashboard-2026-06-01.png`

## 4. Capture Guidelines

- Capture from the latest UAT or production-like environment.
- Use realistic sample data.
- Avoid exposing personal data or confidential land records unless approved.
- Capture desktop layout first, then mobile-only layouts only where behavior differs.
- Prefer full-page screenshots for overview pages.
- Capture modal dialogs separately when they represent distinct functionality.

## 5. Required Screenshot Inventory

| ID | Feature Area | Screen / Functionality | Route Pattern | Status |
| --- | --- | --- | --- | --- |
| 01 | Auth | Login | `/` | Captured on 2026-06-01 |
| 02 | Auth | Forgot Password | `/forgot-password` | Pending capture |
| 03 | Auth | Reset Password | `/reset-password/:token` | Pending capture |
| 04 | Dashboard | Main dashboard | `/dashboard` | Captured on 2026-06-01 |
| 05 | Project | Project list | `/projects` or `/:landType/projects` | Captured on 2026-06-01 |
| 06 | Project | Add/Edit project modal | `/projects` | Pending capture |
| 07 | Private Land | Private villages list | `/private-land/villages` | Captured on 2026-06-01 |
| 08 | Private Land | Private village add/edit modal | `/private-land/villages` | Pending capture |
| 09 | Private Land | Private khata list | `/private-land/khatas` | Captured on 2026-06-01 |
| 10 | Private Land | Private khata add/edit modal | `/private-land/khatas` | Pending capture |
| 11 | Private Land | Private khata document upload | `/private-land/khatas` | Pending capture |
| 12 | Private Land | Private khata map upload | `/private-land/khatas` | Pending capture |
| 13 | Private Land | Private plot list | `/private-land/plots` | Captured on 2026-06-01 |
| 14 | Private Land | Private plot form | `/private-land/plot-form` | Pending capture |
| 15 | Private Land | Compensation / land cost | `/private-land/land-cost` | Captured on 2026-06-01 |
| 16 | Private Land | Social survey | `/private-land/social-survey` | Pending capture |
| 17 | Government Land | Govt villages list | `/govt-land/government/villages` | Pending capture |
| 18 | Government Land | Govt khata list | `/govt-land/government/khatas` | Pending capture |
| 19 | Government Land | Govt khata upload/map modal | `/govt-land/government/khatas` | Pending capture |
| 20 | Government Land | Govt plot list | `/govt-land/government/plots` | Captured on 2026-06-01 |
| 21 | Government Land | Govt plot form / status flow | `/govt-land/government/plots` | Partially captured on 2026-06-01 |
| 22 | Government Land | Govt land cost | `/govt-land/government/land-cost` | Captured on 2026-06-01 |
| 23 | Forest Land | Project master | `/forest-land/project-master` | Captured on 2026-06-01 |
| 24 | Forest Land | EDS master data | `/forest-land/eds-master-data` | Pending capture |
| 25 | Forest Land | Stages tab | `/forest-land/stages` | Captured on 2026-06-01 |
| 26 | Forest Land | Level 0 form | `/forest-land/stages` | Captured on 2026-06-01 |
| 27 | Forest Land | Level 1 form | `/forest-land/stages` | Captured on 2026-06-01 |
| 28 | Forest Land | Level 2 form | `/forest-land/stages` | Pending capture |
| 29 | Forest Land | Level 3 form | `/forest-land/stages` | Pending capture |
| 30 | Forest Land | Land schedule | `/forest-land/land-schedule` | Pending capture |
| 31 | Forest Land | Master dashboard | `/forest-land/master-dashboard` | Captured on 2026-06-01 |
| 32 | Admin | User management | `/usersmanagement` | Captured on 2026-06-01 |
| 33 | Admin | Profile | `/profile` | Pending capture |
| 34 | Admin | Change password | `/changepassword` | Pending capture |
| 35 | Admin | Import plots | `/import` | Captured on 2026-06-01 |
| 36 | Admin | Logs | `/logs` | Captured on 2026-06-01 |
| 37 | Admin | Deleted records | `/deletedrecords` | Captured on 2026-06-01 |
| 38 | Reports | Khata summary | `/reports/khata-reports/khata-summary` | Pending capture |
| 39 | Reports | Khata document register | `/reports/khata-reports/khata-document` | Pending capture |
| 40 | Reports | Village land register | `/reports/village-reports/village-land-register` | Pending capture |
| 41 | Reports | Village document report | `/reports/village-reports/village-document-report` | Pending capture |
| 42 | Reports | Plot details | `/reports/plot-reports/plot-details` | Pending capture |
| 43 | Reports | Plot ownership history | `/reports/plot-reports/plot-owner-history` | Pending capture |
| 44 | Reports | Project summary | `/reports/project-reports/project-summary` | Pending capture |
| 45 | Reports | Project document register | `/reports/project-reports/project-document-register` | Pending capture |
| 46 | Reports | Total tenants | `/reports/project-reports/total-tenants` | Pending capture |
| 47 | Reports | KMZ availability | `/reports/maps-reports/kmz-availability` | Pending capture |
| 48 | Reports | Map summary report | `/reports/maps-reports/map-summary-report` | Pending capture |
| 49 | Reports | User activity | `/reports/user-reports/activity-log` | Pending capture |
| 50 | Reports | Audit trail | `/reports/user-reports/audit-trail` | Pending capture |
| 51 | Reports | Document upload report | `/reports/document-reports/document-upload-report` | Pending capture |
| 52 | Reports | Missing document report | `/reports/document-reports/missing-documents-report` | Pending capture |
| 53 | Payment | Ready to payment | `/payment/ready-to-payment` | Pending capture |

## 6. Recommended Capture Sequence

1. Login and dashboard
2. Project selection
3. Private land workflow
4. Government land workflow
5. Forest workflow
6. Admin screens
7. Reports
8. Payment screens

## 6.1 Remaining Priority Gaps

The highest-value screenshots still missing are:

- forgot password
- reset password
- add/edit modals for project, village, khata, and plot
- khata upload and map upload flows
- government village and khata screens
- forest Stage II and Post Clearance or Level 3 equivalents
- land schedule
- profile and change password
- reports suite
- ready-to-payment screen

## 7. Sign-off Checklist

Before marking the screenshot pack complete, confirm:

- each listed screen has a captured image
- filenames follow a consistent convention
- screenshots match the latest deployed build
- sensitive data is masked if needed
- KT documents reference the final screenshot location
