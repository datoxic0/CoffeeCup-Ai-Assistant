#!/bin/sh
# Vibe Coding Guardrail Pre-Commit Hook
# Ensures all code passes universal guardrails before commit

echo "🔍 Running vibe guardrails before commit..."

# Get list of staged files
STAGED_FILES=$(git diff --name-only --cached --diff-filter=ACMR | grep -E '\.(py|js|ts|jsx|tsx|html|htm|css|scss|sass|swift|java|c|cpp|cxx|c++|rb)$')

if [ -z "$STAGED_FILES" ]; then
 echo "⏭️ No applicable files to check. Skipping vibe guardrails."
  exit 0
fi

echo "📄 Files to check: $STAGED_FILES"

# Initialize exit code
EXIT_CODE=0

# Process each staged file
for file in $STAGED_FILES; do
  echo "🔍 Checking: $file"
  
  # Detect language from file extension
 case "$file" in
    *.py)
      echo "🐍 Python file detected"
      # Run Python-specific checks
      if command -v black >/dev/null 2>&1; then
        echo ".Formatting with black..."
        black --check "$file" || { echo "❌ Black check failed for $file"; EXIT_CODE=1; }
      else
        echo "⚠️  black not found, skipping"
      fi
      
      if command -v ruff >/dev/null 2>&1; then
        echo "  Linting with ruff..."
        ruff check "$file" || { echo "❌ Ruff check failed for $file"; EXIT_CODE=1; }
      else
        echo "⚠️  ruff not found, skipping"
      fi
      
      if command -v mypy >/dev/null 2>&1; then
        echo "  Type checking with mypy..."
        mypy "$file" || { echo "❌ MyPy check failed for $file"; EXIT_CODE=1; }
      else
        echo "⚠️  mypy not found, skipping"
      fi
      
      if command -v bandit >/dev/null 2>&1; then
        echo "  Security scanning with bandit..."
        bandit -r "$file" || { echo "❌ Bandit check failed for $file"; EXIT_CODE=1; }
      else
        echo "⚠️  bandit not found, skipping"
      fi
      ;;
    *.js|*.ts|*.jsx|*.tsx)
      echo "🟢 JavaScript/TypeScript file detected"
      # Run JS/TS-specific checks
      if command -v prettier >/dev/null 2>&1; then
        echo "  Formatting with prettier..."
        prettier --check "$file" || { echo "❌ Prettier check failed for $file"; EXIT_CODE=1; }
      else
        echo "⚠️  prettier not found, skipping"
      fi
      
      if command -v eslint >/dev/null 2>&1; then
        echo "  Linting with eslint..."
        eslint "$file" || { echo "❌ ESLint check failed for $file"; EXIT_CODE=1; }
      else
        echo "⚠️  eslint not found, skipping"
      fi
      
      if [[ "$file" == *.ts ]]; then
        if command -v tsc >/dev/null 2>&1; then
          echo "  Type checking with tsc..."
          tsc --noEmit "$file" || { echo "❌ TypeScript compiler check failed for $file"; EXIT_CODE=1; }
        else
          echo "⚠️  tsc not found, skipping"
        fi
      fi
      ;;
    *.html|*.htm)
      echo "🟠 HTML file detected"
      # Run HTML-specific checks
      if command -v prettier >/dev/null 2>&1; then
        echo "  Formatting with prettier..."
        prettier --check "$file" || { echo "❌ Prettier check failed for $file"; EXIT_CODE=1; }
      else
        echo "⚠️  prettier not found, skipping"
      fi
      
      if command -v htmlhint >/dev/null 2>&1; then
        echo "  Linting with htmlhint..."
        htmlhint "$file" || { echo "❌ HTMLHint check failed for $file"; EXIT_CODE=1; }
      else
        echo "⚠️  htmlhint not found, skipping"
      fi
      ;;
    *.css|*.scss|*.sass)
      echo "🟣 CSS file detected"
      # Run CSS-specific checks
      if command -v prettier >/dev/null 2>&1; then
        echo "  Formatting with prettier..."
        prettier --check "$file" || { echo "❌ Prettier check failed for $file"; EXIT_CODE=1; }
      else
        echo "⚠️  prettier not found, skipping"
      fi
      
      if command -v stylelint >/dev/null 2>&1; then
        echo "  Linting with stylelint..."
        stylelint "$file" || { echo "❌ Stylelint check failed for $file"; EXIT_CODE=1; }
      else
        echo "⚠️  stylelint not found, skipping"
      fi
      ;;
    *.swift)
      echo "🔵 Swift file detected"
      # Run Swift-specific checks
      if command -v swiftformat >/dev/null 2>&1; then
        echo "  Formatting with swiftformat..."
        swiftformat --lint "$file" || { echo "❌ SwiftFormat check failed for $file"; EXIT_CODE=1; }
      else
        echo "⚠️  swiftformat not found, skipping"
      fi
      
      if command -v swiftlint >/dev/null 2>&1; then
        echo "  Linting with swiftlint..."
        swiftlint "$file" || { echo "❌ SwiftLint check failed for $file"; EXIT_CODE=1; }
      else
        echo "⚠️  swiftlint not found, skipping"
      fi
      ;;
    *.java)
      echo "🟨 Java file detected"
      # Run Java-specific checks
      if command -v checkstyle >/dev/null 2>&1; then
        echo "  Linting with checkstyle..."
        checkstyle -c /google_checks.xml "$file" || { echo "❌ Checkstyle check failed for $file"; EXIT_CODE=1; }
      else
        echo "⚠️  checkstyle not found, skipping"
      fi
      ;;
    *.c|*.cpp|*.cxx|*.c++)
      echo "🟩 C/C++ file detected"
      # Run C/C++-specific checks
      if command -v clang-tidy >/dev/null 2>&1; then
        echo "  Static analysis with clang-tidy..."
        clang-tidy "$file" || { echo "❌ Clang-tidy check failed for $file"; EXIT_CODE=1; }
      else
        echo "⚠️  clang-tidy not found, skipping"
      fi
      ;;
    *.rb)
      echo "🔴 Ruby file detected"
      # Run Ruby-specific checks
      if command -v rubocop >/dev/null 2>&1; then
        echo "  Linting with rubocop..."
        rubocop "$file" || { echo "❌ RuboCop check failed for $file"; EXIT_CODE=1; }
      else
        echo "⚠️  rubocop not found, skipping"
      fi
      ;;
  esac
  
  echo ""
done

# Run project-wide tests if any files were checked
if [ $EXIT_CODE -eq 0 ]; then
  echo "🧪 Running project tests..."
  
  # Check for Python tests
 if [ -f "pytest.ini" ] || [ -f "setup.cfg" ] || [ -f "pyproject.toml" ] && find . -name "*test*.py" -o -name "test*.py" | grep -q .; then
    if command -v pytest >/dev/null 2>&1; then
      pytest || { echo "❌ Pytest failed"; EXIT_CODE=1; }
    else
      echo "⚠️ pytest not found, skipping"
    fi
 fi
  
  # Check for JS/TS tests
  if [ -f "package.json" ] && grep -q "test" package.json; then
    if command -v npm >/dev/null 2>&1; then
      npm test || { echo "❌ NPM tests failed"; EXIT_CODE=1; }
    else
      echo "⚠️  npm not found, skipping"
    fi
  fi
fi

if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ All vibe code guardrails passed. Safe to commit!"
  exit 0
else
  echo "🚨 Vibe guardrails failed. Please fix the issues before committing."
  exit 1
fi
