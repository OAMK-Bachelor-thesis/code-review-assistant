// Prompt templates for code analysis

const systemPrompt = `You are an expert code reviewer with deep knowledge of JavaScript, 
React, and Node.js. Your role is to analyze code snippets and provide professional, 
actionable feedback on code quality, security, and best practices.

Focus on:
1. Security vulnerabilities
2. Performance optimizations
3. Code quality improvements
4. Best practice recommendations

Be constructive and specific in your suggestions.`;

const basePrompt = `INSTRUCTIONS:
1. Analyze the code snippet below
2. Identify security vulnerabilities, performance issues, code quality problems
3. For each issue, provide:
   - Severity (HIGH/MEDIUM/LOW)
   - Category (SECURITY/PERFORMANCE/CODE_QUALITY/BEST_PRACTICES/STYLE)
   - Line number(s)
   - Specific issue description
   - Actionable suggestion
   - Code example of the fix

4. Return ONLY valid JSON (no markdown, no extra text)

CODE SNIPPET:
{code}

RESPONSE FORMAT (MUST BE VALID JSON):
{
  "analysis": {
    "summary": "1-2 sentence overall assessment",
    "score": 75,
    "issues": [
      {
        "severity": "HIGH",
        "category": "SECURITY",
        "line": 3,
        "issue": "Description of the problem",
        "suggestion": "What to do instead",
        "example": "const fixed = await bcrypt.compare(...);"
      }
    ],
    "positives": [
      "What the code does well",
      "Good practices observed"
    ]
  }
}

Important: Return ONLY the JSON object, nothing else.`;

const securityPrompt = `Review this code SPECIFICALLY for security vulnerabilities:
- SQL/NoSQL injection
- XSS attacks
- Authentication bypass
- Data exposure
- Dependency vulnerabilities

Code:
{code}

Return JSON with security issues only in this format:
{
  "analysis": {
    "summary": "Security assessment",
    "security_issues": [
      {
        "severity": "HIGH",
        "issue": "description",
        "suggestion": "fix",
        "line": number
      }
    ]
  }
}`;

const performancePrompt = `Analyze this code for performance issues:
- Algorithmic complexity
- Unnecessary operations
- Memory leaks
- Network efficiency
- Database query optimization

Code:
{code}

Return JSON with performance suggestions.`;

// Build complete prompt for analysis
function buildAnalysisPrompt(code) {
  return basePrompt.replace('{code}', code);
}

function buildSecurityPrompt(code) {
  return securityPrompt.replace('{code}', code);
}

function buildPerformancePrompt(code) {
  return performancePrompt.replace('{code}', code);
}

module.exports = {
  systemPrompt,
  basePrompt,
  securityPrompt,
  performancePrompt,
  buildAnalysisPrompt,
  buildSecurityPrompt,
  buildPerformancePrompt,
};
