# Refactoring and Code Quality

## Objective

Refactor every source file to keep the code maintainable, readable, and correct. Specifically:

Do not let any single file grow beyond a safe limit (target new max: 900 lines). If a file exceeds 600 lines in the current state, plan a refactor that splits responsibilities into smaller modules, while ensuring the runtime behavior remains identical.
Skip the node_modules folder in all operations (e.g., analyses, refactors, and patch generation) unless explicitly required by a specific dependency change.
Produce corrected, working code with high quality: readability, proper typing, tests, and minimal bugs.
Ensure changes are safe to merge with minimal risk; provide diffs, tests, and step-by-step migration guidance.
Scope
All languages/environments present in the repository (e.g., JavaScript/TypeScript, Python, Java, etc.).
Any file approaching or exceeding 600 lines should be targeted for modularization.
Refactor should preserve public APIs and runtime behavior unless you explicitly intend to change them.
Constraints
Exclude: node_modules/ from all file traversals by default.
Split strategy: When a file is too long, identify cohesive sections (classes, functions, utilities, or concerns) and extract into new modules with clear interfaces.
Naming: Use consistent, descriptive names for new modules and exports.
Docs: Update or add inline comments and README/docs to reflect the new structure.
Tests: Add or update tests to cover refactored modules; ensure test suite passes locally.
Performance: Avoid introducing significant performance regressions; maintain or improve efficiency where possible.
CSS/Assets: Do not touch assets, unless necessary for a related change.
Input/Output Rules
Input: Do not modify user intent. Preserve functionality and behavior.
Output:
Provide a concise summary of changes and the rationale.
Include a patch/diff illustrating the refactor at file-level and at function-level where relevant.
Include migration notes for developers/users.
Provide a minimal, reproducible test snippet or commands to run tests.
Acceptance Criteria
No file exceeds 900 lines after refactor (target split around 600–700 lines to be safe; 900 is the hard cap).
All existing features behave identically (GC/APIs/tests pass).
Code is organized into logical modules with clear boundaries.
Tests cover at least the most critical paths affected by the refactor.
The repository excludes node_modules/ from scans and operations unless a dependency update necessitates it.
Suggested Refactor Plan (Adaptive)
Audit Long Files

Identify files with > 600 lines.
List cohesive sections: classes, utilities, data access, business logic, etc.
Module Extraction

Create new modules/files for extracted concerns.
Move related functions/classes to new modules.
Update imports/exports to maintain API compatibility.
Interface Stabilization

If public interfaces are impacted, provide adapter/wacers or backward-compatible shims.
Defer breaking changes to a minor/major version bump with migration notes.
Tests and Validation

Run test suite; fix broken tests due to refactor.
Add tests for newly created modules if coverage is lacking.
Documentation

Update READMEs and inline docs to reflect the new structure.
Add a changelog entry for the refactor.
Performance & Quality

Run linters/formatters.
Check for dead code removal and duplication reduction.
Example Patch Outline
diff
diff --git a/src/longModule.js b/src/moduleA/longModule.js
index 12345..67890 100644
--- a/src/longModule.js
+++ b/src/moduleA/longModule.js
@@ -1,200 +1,150 @@

- // original long content...

+ // refactored: moved related utilities into moduleA/exports.js
+ export function primaryFeature(...) { ... }
+ export function helperA(...) { ... }

diff --git a/src/longModule.js b/src/moduleB/longModule.js
new file mode 100644

+ // extracted functionality
+ export function extractedUtility(...) { ... }
Migration Notes
If you’re integrating into an existing project, ensure CI/CD pipelines run the full test suite after the changes.
Update any import paths to reflect new module locations.
If public API changes, provide a compatibility layer or update versioning as appropriate.
Quick Checklist
 Identify files > 600 lines.
 Create new modules for extracted concerns.
 Update imports and exports.
 Run tests; fix breakages.
 Update documentation and migration notes.
 Ensure node_modules is excluded from traversal.
