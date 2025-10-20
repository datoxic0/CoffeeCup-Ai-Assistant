# Universal Vibe Coding Guardrail Manifest

## Overview

The Universal Vibe Coding Guardrail System is a comprehensive framework designed to ensure that all AI-assisted code generation meets professional-grade quality standards. This system implements a "zero-error loop" that automatically validates, formats, lints, type-checks, and tests code before it's committed to version control.

## Core Philosophy

> "AI can now write code like a senior engineer — every line checked, formatted, typed, tested, and secured before it ever runs. Zero-error, production-ready, universally."

The system transforms vibe coding from "playful prototyping" into a production-level engineering discipline, ensuring AI code lives up to human professional standards.

## Components

### 1. Universal Configuration (`vibe.config.json`)

The central configuration file that defines toolchains for different programming languages:

- **Python**: `black`, `ruff`, `pylance`, `mypy`, `isort`, `bandit`, `pytest`
- **JavaScript/TypeScript**: `prettier`, `eslint`, `tsc`, `husky`, `jest`
- **HTML/CSS**: `prettier`, `stylelint`, `htmlhint`, `axe-core`
- **Swift**: `swiftformat`, `swiftlint`, `clang`, `danger`, `xctest`
- **Java**: `checkstyle`, `spotbugs`, `sonarqube`, `junit5`
- **C/C++**: `clang-tidy`, `cppcheck`, `codechecker`, `googletest`
- **Ruby**: `rubocop`, `standardrb`, `rspec`

### 2. Workflow Engine (`vibe-guardrail-engine.js`)

Implements the "Write Better Code Loop":

1. **Language Detection** → read file extension → load correct section of vibe.config.json
2. **Run Formatters** (keep code style consistent)
3. **Run Linters + Static Analyzers** (catch bugs, unused vars, security flaws)
4. **Run Type Checkers** (optional but enforced where available)
5. **Run Tests**:
   - If tests exist → execute
   - If not → AI must generate unit tests first
6. **Run Security Scans** (e.g., bandit, CodeQL, gitleaks)
7. **If Failures Detected**:
   - AI parses errors
   - AI rewrites/fixes
   - Loop back to step 2
8. **Continue until ✅**
9. **If Green** → Commit to Git with message: `"✨ Vibe-coded: {feature} — validated and passing all guardrails"`

### 3. Git Hooks (`pre-commit-hook.sh`)

Pre-commit hook that enforces checks locally before code can be committed:

- Detects file types and applies appropriate toolchain
- Runs all configured checks for each file
- Prevents commit if any check fails
- Runs project-wide tests before allowing commit

### 4. CI/CD Integration (`github-actions-vibe-guardrails.yml`)

GitHub Actions workflow that:

- Runs checks in multiple environments (Python, JavaScript, Java, C++)
- Performs security scanning with CodeQL and Gitleaks
- Generates quality reports
- Blocks PR merges if failures remain

## Implementation

### Quick Start

1. Place `vibe.config.json` in your project root
2. Install required tools for your language stack
3. Add the pre-commit hook to your `.git/hooks/pre-commit`
4. Configure your CI/CD with the provided workflow

### AI Integration

When using AI for code generation, implement the following meta-prompt:

> "After generating any code, run the toolchain defined in vibe.config.json for that language. Re-analyze error or warning messages. Rewrite the code to fully pass. Repeat until 0 errors, 0 warnings remain. Only then present the code as final."

This ensures AI acts as: coder → QA → code reviewer → DevOps gatekeeper.

## Benefits

### For Individuals

- Never see half-baked AI slop code again
- Consistent, professional-quality output
- Automatic compliance with best practices

### For Teams

- PRs are clean, consistent, and safe to merge
- Reduced code review burden
- Standardized development practices

### For Enterprises

- Compliance (security scanning, license checks, zero-leakage)
- Audit trails for code quality
- Reduced technical debt

### For AI Agents

- Feedback loop → less hallucination, more production value
- Self-healing behavior through error correction
- Consistent performance across different models

## Supported Languages & Toolchains

### Python

- **Formatter**: Black (opinionated code formatter)
- **Linter**: Ruff (fast Python linter)
- **Type Checker**: MyPy, Pylance
- **Import Sorter**: isort
- **Security Scanner**: Bandit
- **Test Framework**: pytest

### JavaScript/TypeScript

- **Formatter**: Prettier
- **Linter**: ESLint
- **Type Checker**: TypeScript Compiler
- **Pre-commit**: Husky
- **Test Framework**: Jest

### HTML/CSS

- **Formatter**: Prettier
- **Linters**: Stylelint, HTMLHint
- **Accessibility**: axe-core

### Swift

- **Formatter**: SwiftFormat
- **Linter**: SwiftLint
- **Static Analysis**: Clang, Danger
- **Test Framework**: XCTest

### Java

- **Linter**: Checkstyle
- **Bug Detector**: SpotBugs
- **Static Analysis**: SonarQube
- **Test Framework**: JUnit5

### C/C++

- **Linter**: Clang-Tidy
- **Static Analysis**: Cppcheck, CodeChecker
- **Build Checks**: CMake-lint
- **Test Framework**: GoogleTest

### Ruby

- **Linter**: RuboCop
- **Formatter**: StandardRB
- **Test Framework**: RSpec

## Enterprise Features

- **Zero-Tolerance Mode**: PR merge blocked if any warning remains
- **Auto-rollback safeguards**: Failed attempts revert back to last green build
- **Language-detection pipeline**: System automatically recognizes file type
- **Pluggable Checkers**: Users can configure extra rules (security, compliance)
- **SonarQube Integration**: Team-wide quality metrics

## Quality Policy

The system enforces a "zeroWarningsZeroErrors" policy with the following principles:

- No warnings
- No formatting drift
- No type errors
- No security leaks
- Fully tested, production-ready code

## Conclusion

The Universal Vibe Coding Guardrail Manifest makes every AI-assisted session as reliable as professional engineering work. It's the foundational operating system of vibe coding: config-driven guardrails → auto-enforced by AI → zero-error loop.

> "Better code isn't just written — it's vibe-coded, validated, and shipped with confidence."
