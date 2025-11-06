# Insurance workflow automation software

**Project ID:** P04  
**Course:** UE23CS341A  
**Academic Year:** 2025  
**Semester:** 5th Sem  
**Campus:** RR  
**Branch:** AIML  
**Section:** B  
**Team:** Logicore

## 📋 Project Description

This app has insurance companies and users who want to get insurance as users. This should be able to 2/4 wheeler and personal healthcare ploicies.

This repository contains the source code and documentation for the Insurance workflow automation software project, developed as part of the UE23CS341A course at PES University.

## 🧑‍💻 Development Team (Logicore)

- [@Aritraghoshdastidar](https://github.com/Aritraghoshdastidar) - Scrum Master
- [@bshrikrishna](https://github.com/bshrikrishna) - Developer Team
- [@archi829](https://github.com/archi829) - Developer Team
- [@pes1ug23am077-aiml](https://github.com/pes1ug23am077-aiml) - Developer Team

## 👨‍🏫 Teaching Assistant

- [@Amrutha-PES](https://github.com/Amrutha-PES)
- [@VenomBlood1207](https://github.com/VenomBlood1207)

## 👨‍⚖️ Faculty Supervisor

- [@Arpitha035](https://github.com/Arpitha035)


## 🚀 Getting Started

### Prerequisites
- [List your prerequisites here]

### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/pestechnology/PESU_RR_AIML_B_P04_Insurance_workflow_automation_software_Logicore.git
   cd PESU_RR_AIML_B_P04_Insurance_workflow_automation_software_Logicore
   ```

2. Install dependencies
   ```bash
   # Add your installation commands here
   ```

3. Run the application
   ```bash
   # Add your run commands here
   ```

## 📁 Project Structure

```
PESU_RR_AIML_B_P04_Insurance_workflow_automation_software_Logicore/
├── src/                 # Source code
├── docs/               # Documentation
├── tests/              # Test files
├── .github/            # GitHub workflows and templates
├── README.md          # This file
└── ...
```

## 🛠️ Development Guidelines

### Branching Strategy
- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: Feature branches
- `bugfix/*`: Bug fix branches

### Commit Messages
Follow conventional commit format:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test-related changes

### Code Review Process
1. Create feature branch from `develop`
2. Make changes and commit
3. Create Pull Request to `develop`
4. Request review from team members
5. Merge after approval

## 📚 Documentation

- [API Documentation](docs/api.md)
- [User Guide](docs/user-guide.md)
- [Developer Guide](docs/developer-guide.md)

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📄 License

This project is developed for educational purposes as part of the PES University UE23CS341A curriculum.

---

**Course:** UE23CS341A  
**Institution:** PES University  
**Academic Year:** 2025  
**Semester:** 5th Sem


## CI/CD Pipeline

This project uses a 6-stage CI/CD pipeline implemented with GitHub Actions to ensure code quality and create a deployment artifact. The pipeline runs on every push to the `main` or `fix/correct-ci-workflow` branches.

### 1. Build
* **Job:** `build`
* **Action:** Installs all `npm` dependencies for both the backend (root) and the `insurance-frontend` using `npm ci`.

### 2. Test
* **Job:** `test`
* **Needs:** `build`
* **Action:** Runs the full test suite (`npm test`) for both backend and frontend.

### 3. Coverage
* **Job:** `coverage`
* **Needs:** `build`
* **Action:** Runs `npm test -- --coverage` for both backend and frontend.
* **Quality Gate:** This job will fail if the total test coverage (lines, statements, branches, functions) is **less than 75%** (this is configured in `jest.config.js` and `insurance-frontend/package.json` in the `fix/correct-ci-workflow` branch).
* **Artifact:** Uploads the `backend-coverage-report` and `frontend-coverage-report` artifacts.

### 4. Lint
* **Job:** `lint`
* **Needs:** `build`
* **Action:** Runs `npm run lint` for both backend and frontend to check for code style and syntax errors.
* **Artifact:** Uploads the `backend-lint-report` and `frontend-lint-report` artifacts.

### 5. Security Audit
* **Job:** `security`
* **Needs:** `build`
* **Action:** Runs `npm audit --json` for both backend and frontend to check for known security vulnerabilities in dependencies.
* **Artifact:** Uploads the `backend-security-report` and `frontend-security-report` artifacts.

### 6. Create Deployment Artifact
* **Job:** `create-artifact`
* **Needs:** `test`, `coverage`, `lint`, `security` (Runs only if all previous CI stages pass)
* **Action:** Downloads all generated reports (coverage, lint, security), zips them together with the entire source code (excluding `node_modules`), and uploads the final `deployment-artifact.zip`.
