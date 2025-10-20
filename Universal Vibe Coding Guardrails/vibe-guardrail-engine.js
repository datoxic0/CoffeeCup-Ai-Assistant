/**
 * Universal Vibe Coding Guardrail Engine
 * Implements the "Write Better Code Loop" for AI-assisted development
 */

class VibeGuardrailEngine {
  constructor(configPath = './vibe.config.json') {
    this.config = this.loadConfig(configPath);
    this.currentLanguage = null;
    this.maxRetries = this.config.universal.maxRetries || 5;
  }

  loadConfig(configPath) {
    try {
      const fs = require('fs');
      const path = require('path');
      const configContent = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(configContent);
    } catch (error) {
      console.error(`Failed to load config from ${configPath}:`, error.message);
      // Return default config if file doesn't exist
      return {
        "universal": {
          "qualityPolicy": "zeroWarningsZeroErrors",
          "onFail": "regenerateAndRetry",
          "maxRetries": 5,
          "preventCommitOnError": true,
          "enforceTests": true,
          "reportTools": ["SonarQube", "CodeQL", "gitleaks"]
        },
        "languages": {
          "python": {
            "formatter": ["black"],
            "linters": ["ruff", "pylance"],
            "imports": ["isort"],
            "typeCheckers": ["mypy"],
            "security": ["bandit"],
            "tests": ["pytest"]
          },
          "javascript": {
            "formatter": ["prettier"],
            "linters": ["eslint"],
            "typeCheckers": ["tsc"],
            "preCommit": ["husky"],
            "tests": ["jest"]
          },
          "htmlCss": {
            "formatter": ["prettier"],
            "linters": ["stylelint", "htmlhint"],
            "accessibility": ["axe-core"]
          }
        }
      };
    }
  }

  detectLanguage(filePath) {
    const extension = filePath.split('.').pop().toLowerCase();
    const languageMap = {
      'py': 'python',
      'js': 'javascript', 
      'ts': 'javascript',
      'jsx': 'javascript',
      'tsx': 'javascript',
      'html': 'htmlCss',
      'htm': 'htmlCss',
      'css': 'htmlCss',
      'scss': 'htmlCss',
      'sass': 'htmlCss',
      'swift': 'swift',
      'java': 'java',
      'cpp': 'cpp',
      'cxx': 'cpp',
      'c++': 'cpp',
      'rb': 'ruby'
    };
    
    this.currentLanguage = languageMap[extension] || null;
    return this.currentLanguage;
  }

  async runToolchain(filePath, content = null) {
    if (!this.currentLanguage) {
      throw new Error('Language not detected. Call detectLanguage first.');
    }

    const languageConfig = this.config.languages[this.currentLanguage];
    if (!languageConfig) {
      throw new Error(`No config found for language: ${this.currentLanguage}`);
    }

    const results = {
      passed: true,
      errors: [],
      toolResults: {}
    };

    // Run formatters
    if (languageConfig.formatter) {
      for (const formatter of languageConfig.formatter) {
        try {
          const formatterResult = await this.runFormatter(formatter, filePath, content);
          results.toolResults[formatter] = formatterResult;
          if (!formatterResult.success) {
            results.passed = false;
            results.errors.push(...formatterResult.errors);
          }
        } catch (error) {
          results.passed = false;
          results.errors.push(`Formatter ${formatter} failed: ${error.message}`);
        }
      }
    }

    // Run linters
    if (languageConfig.linters) {
      for (const linter of languageConfig.linters) {
        try {
          const linterResult = await this.runLinter(linter, filePath);
          results.toolResults[linter] = linterResult;
          if (!linterResult.success) {
            results.passed = false;
            results.errors.push(...linterResult.errors);
          }
        } catch (error) {
          results.passed = false;
          results.errors.push(`Linter ${linter} failed: ${error.message}`);
        }
      }
    }

    // Run type checkers
    if (languageConfig.typeCheckers) {
      for (const typeChecker of languageConfig.typeCheckers) {
        try {
          const typeResult = await this.runTypeChecker(typeChecker, filePath);
          results.toolResults[typeChecker] = typeResult;
          if (!typeResult.success) {
            results.passed = false;
            results.errors.push(...typeResult.errors);
          }
        } catch (error) {
          results.passed = false;
          results.errors.push(`Type checker ${typeChecker} failed: ${error.message}`);
        }
      }
    }

    // Run security scans
    if (languageConfig.security) {
      for (const securityTool of languageConfig.security) {
        try {
          const securityResult = await this.runSecurityScan(securityTool, filePath);
          results.toolResults[securityTool] = securityResult;
          if (!securityResult.success) {
            results.passed = false;
            results.errors.push(...securityResult.errors);
          }
        } catch (error) {
          results.passed = false;
          results.errors.push(`Security tool ${securityTool} failed: ${error.message}`);
        }
      }
    }

    // Run tests
    if (languageConfig.tests) {
      for (const testRunner of languageConfig.tests) {
        try {
          const testResult = await this.runTests(testRunner, filePath);
          results.toolResults[testRunner] = testResult;
          if (!testResult.success) {
            results.passed = false;
            results.errors.push(...testResult.errors);
          }
        } catch (error) {
          results.passed = false;
          results.errors.push(`Test runner ${testRunner} failed: ${error.message}`);
        }
      }
    }

    return results;
  }

  async runFormatter(formatter, filePath, content) {
    // Implementation would depend on the specific formatter
    // This is a placeholder implementation
    const exec = require('child_process').execSync;
    
    try {
      let command = '';
      switch(formatter) {
        case 'black':
          command = `black --check "${filePath}"`;
          break;
        case 'prettier':
          command = `prettier --check "${filePath}"`;
          break;
        case 'swiftformat':
          command = `swiftformat --lint "${filePath}"`;
          break;
        default:
          return { success: true, errors: [] }; // Skip unknown formatters
      }
      
      exec(command);
      return { success: true, errors: [] };
    } catch (error) {
      return { success: false, errors: [error.stdout || error.message] };
    }
  }

 async runLinter(linter, filePath) {
    const exec = require('child_process').execSync;
    
    try {
      let command = '';
      switch(linter) {
        case 'ruff':
          command = `ruff check "${filePath}"`;
          break;
        case 'eslint':
          command = `eslint "${filePath}"`;
          break;
        case 'swiftlint':
          command = `swiftlint "${filePath}"`;
          break;
        case 'checkstyle':
          command = `checkstyle -c /google_checks.xml "${filePath}"`;
          break;
        case 'clang-tidy':
          command = `clang-tidy "${filePath}"`;
          break;
        case 'rubocop':
          command = `rubocop "${filePath}"`;
          break;
        case 'stylelint':
          command = `stylelint "${filePath}"`;
          break;
        case 'htmlhint':
          command = `htmlhint "${filePath}"`;
          break;
        default:
          return { success: true, errors: [] }; // Skip unknown linters
      }
      
      exec(command);
      return { success: true, errors: [] };
    } catch (error) {
      return { success: false, errors: [error.stdout || error.message] };
    }
  }

  async runTypeChecker(typeChecker, filePath) {
    const exec = require('child_process').execSync;
    
    try {
      let command = '';
      switch(typeChecker) {
        case 'tsc':
          command = `tsc --noEmit "${filePath}"`;
          break;
        case 'mypy':
          command = `mypy "${filePath}"`;
          break;
        case 'pylance':
          // Pylance typically runs in the editor context, so we'll use mypy as a proxy
          command = `mypy "${filePath}"`;
          break;
        default:
          return { success: true, errors: [] }; // Skip unknown type checkers
      }
      
      exec(command);
      return { success: true, errors: [] };
    } catch (error) {
      return { success: false, errors: [error.stdout || error.message] };
    }
  }

 async runSecurityScan(securityTool, filePath) {
    const exec = require('child_process').execSync;
    
    try {
      let command = '';
      switch(securityTool) {
        case 'bandit':
          command = `bandit -r "${filePath}"`;
          break;
        case 'gitleaks':
          command = `gitleaks detect --source "${filePath}" --verbose`;
          break;
        default:
          return { success: true, errors: [] }; // Skip unknown security tools
      }
      
      exec(command);
      return { success: true, errors: [] };
    } catch (error) {
      return { success: false, errors: [error.stdout || error.message] };
    }
  }

  async runTests(testRunner, filePath) {
    // For test running, we need to determine the test file/directory
    // This is a simplified implementation
    const exec = require('child_process').execSync;
    
    try {
      let command = '';
      switch(testRunner) {
        case 'pytest':
          command = 'pytest';
          break;
        case 'jest':
          command = 'npm test';
          break;
        case 'xctest':
          command = 'xcodebuild test';
          break;
        case 'junit5':
          command = 'mvn test';
          break;
        case 'rspec':
          command = 'rspec';
          break;
        default:
          return { success: true, errors: [] }; // Skip unknown test runners
      }
      
      exec(command);
      return { success: true, errors: [] };
    } catch (error) {
      return { success: false, errors: [error.stdout || error.message] };
    }
  }

 async vibeCodeLoop(filePath, generateCodeFunction) {
    let retryCount = 0;
    let lastErrors = [];
    
    while (retryCount < this.maxRetries) {
      try {
        // Detect language from file path
        this.detectLanguage(filePath);
        
        // Run all checks
        const results = await this.runToolchain(filePath);
        
        if (results.passed) {
          console.log(`✅ All vibe guardrails passed for ${filePath}`);
          return { success: true, errors: [], retryCount };
        } else {
          console.log(`❌ Vibe guardrails failed for ${filePath}`);
          console.log(`Errors:`, results.errors);
          
          lastErrors = results.errors;
          
          // If on last retry, return with errors
          if (retryCount >= this.maxRetries - 1) {
            return { success: false, errors: lastErrors, retryCount: retryCount + 1 };
          }
          
          // Generate new code based on errors
          console.log(`🔄 Retrying... (${retryCount + 1}/${this.maxRetries})`);
          await generateCodeFunction(results.errors);
          
          retryCount++;
        }
      } catch (error) {
        console.error(`Error in vibe code loop:`, error);
        return { success: false, errors: [error.message], retryCount: retryCount + 1 };
      }
    }
    
    return { success: false, errors: lastErrors, retryCount };
  }

  async commitWithMessage(filePath, featureDescription) {
    const exec = require('child_process').execSync;
    
    try {
      // Check if all guardrails pass before committing
      this.detectLanguage(filePath);
      const results = await this.runToolchain(filePath);
      
      if (results.passed) {
        // Add file to git
        exec(`git add "${filePath}"`);
        
        // Commit with standardized message
        const commitMessage = `✨ Vibe-coded: ${featureDescription} — validated and passing all guardrails`;
        exec(`git commit -m "${commitMessage}"`);
        
        console.log(`✅ Committed: ${commitMessage}`);
        return true;
      } else {
        console.error(`❌ Cannot commit: Guardrails failed for ${filePath}`);
        console.error(`Errors:`, results.errors);
        return false;
      }
    } catch (error) {
      console.error(`Git operation failed:`, error.message);
      return false;
    }
  }
}

// Export for use in other modules
module.exports = VibeGuardrailEngine;

// Example usage:
/*
const engine = new VibeGuardrailEngine();
const result = await engine.vibeCodeLoop('./example.py', async (errors) => {
  // AI function to regenerate code based on errors
 console.log('Regenerating code based on errors:', errors);
});
*/
