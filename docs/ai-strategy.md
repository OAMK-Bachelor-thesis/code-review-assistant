# AI Prompt Strategy & Engineering
## AI-Enhanced Code Review Assistant

**Version:** 1.0  
**Last Updated:** November 2025  
**AI Model:** GPT-4 / GPT-3.5-Turbo  
**Framework:** OpenAI API

---

## **Table of Contents**

1. [Overview](#overview)
2. [Prompt Engineering Strategy](#prompt-engineering-strategy)
3. [Issue Categorization System](#issue-categorization-system)
4. [Prompt Templates](#prompt-templates)
5. [OpenAI API Configuration](#openai-api-configuration)
6. [Response Format](#response-format)
7. [Example Workflows](#example-workflows)
8. [Testing & Iteration](#testing--iteration)

---

## **Overview**

### **Goal**
Design prompts that guide OpenAI to analyze code snippets and provide:
- Accurate issue detection
- Actionable suggestions
- Clear categorization (Security, Performance, Best Practices, Style)
- Consistent response format

### **Key Principles**

1. **Clarity** - Explicit instructions about what we want
2. **Structure** - Consistent format for responses
3. **Context** - Provide language and context
4. **Examples** - Show desired output format
5. **Constraints** - Limit scope to relevant issues
6. **Consistency** - Always get structured JSON responses

---

## **Prompt Engineering Strategy**

### **Step 1: System Context**

Set the AI's role and context:

```
You are an expert code reviewer with deep knowledge of JavaScript, 
React, and Node.js. Your role is to analyze code snippets and provide 
professional, actionable feedback on code quality, security, and best practices.

Focus on:
1. Security vulnerabilities
2. Performance optimizations
3. Code quality improvements
4. Best practice recommendations

Be constructive and specific in your suggestions.
```

### **Step 2: Instruction Structure**

Clear, step-by-step instructions:

```
1. Analyze the provided code snippet
2. Identify ALL issues and areas for improvement
3. Categorize each issue by severity (HIGH, MEDIUM, LOW)
4. Provide specific line numbers where applicable
5. Suggest concrete fixes with code examples
6. Return your analysis in the specified JSON format
```

### **Step 3: Input Specification**

Define what we're analyzing:

```
Code Snippet:
- Language: JavaScript/React/Node.js
- Context: [Brief description of what the code does]
- Purpose: [What this code is meant to accomplish]
```

### **Step 4: Output Specification**

Exact format required:

```
Return a JSON object with this structure:
{
  "analysis": {
    "summary": "Brief overall assessment",
    "score": "0-100",
    "issues": [...]
  }
}
```

---

## **Issue Categorization System**

### **Severity Levels**

```
🔴 HIGH
- Security vulnerabilities
- Critical bugs
- Data loss risks
- System crashes
- Immediate action needed

🟡 MEDIUM
- Performance issues
- Code quality problems
- Best practice violations
- Maintenance concerns
- Should be addressed

🟢 LOW
- Style issues
- Minor improvements
- Code clarity
- Consistency suggestions
- Nice to have
```

### **Issue Categories**

```
1. SECURITY
   - SQL injection risks
   - XSS vulnerabilities
   - Password handling issues
   - Authentication/Authorization
   - Data exposure
   - Dependency vulnerabilities

2. PERFORMANCE
   - Inefficient algorithms
   - Memory leaks
   - Unnecessary re-renders (React)
   - Network calls in loops
   - Database query optimization
   - Caching opportunities

3. CODE_QUALITY
   - Duplicate code
   - Complex functions
   - Poor error handling
   - Missing validation
   - Type safety issues
   - Side effects

4. BEST_PRACTICES
   - Design patterns
   - Code organization
   - Documentation
   - Testing coverage
   - API design
   - Configuration management

5. STYLE
   - Naming conventions
   - Code formatting
   - Comments clarity
   - Consistency
   - Readability
```

---

## **Prompt Templates**

### **Template 1: Complete Code Review Prompt**

```
You are an expert code reviewer analyzing JavaScript/React code.

INSTRUCTIONS:
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
{code_here}

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
        "issue": "Password comparison is vulnerable to timing attacks",
        "suggestion": "Use bcrypt or crypto.timingSafeEqual for password comparison",
        "example": "const match = await bcrypt.compare(password, hashedPassword);"
      },
      {
        "severity": "MEDIUM",
        "category": "CODE_QUALITY",
        "line": 2,
        "issue": "No error handling in login function",
        "suggestion": "Add try-catch block to handle potential errors",
        "example": "try { ... } catch (error) { console.error(error); return null; }"
      }
    ],
    "positives": [
      "Clean function structure",
      "Good variable naming",
      "Appropriate use of async/await"
    ]
  }
}

Important: Return ONLY the JSON object, nothing else.
```

### **Template 2: Security-Focused Review**

```
Review this code SPECIFICALLY for security vulnerabilities:
- SQL/NoSQL injection
- XSS attacks
- Authentication bypass
- Data exposure
- Dependency vulnerabilities

Code:
{code_here}

Return JSON with security issues only.
```

### **Template 3: Performance Review**

```
Analyze this code for performance issues:
- Algorithmic complexity
- Unnecessary operations
- Memory leaks
- Network efficiency
- Database query optimization

Code:
{code_here}

Return JSON with performance suggestions.
```

---

## **OpenAI API Configuration**

### **Model Selection**

```
Primary: gpt-4 (Most accurate, more expensive)
Fallback: gpt-3.5-turbo (Faster, cheaper, good quality)

For production: gpt-4
For testing: gpt-3.5-turbo
```

### **API Parameters**

```javascript
{
  model: "gpt-4",           // or gpt-3.5-turbo
  temperature: 0.3,         // Lower = more consistent
  max_tokens: 2000,         // Enough for detailed response
  top_p: 0.9,              // Focused responses
  frequency_penalty: 0,     // No penalty
  presence_penalty: 0       // No penalty
}
```

### **Parameter Explanation**

```
temperature: 0.3
- Controls randomness/creativity
- 0 = deterministic (same input = same output)
- 1 = very random
- 0.3 = good balance for code review (consistent but not robotic)

max_tokens: 2000
- Maximum length of response
- 2000 is enough for detailed analysis
- Cost scales with tokens used

top_p: 0.9
- Nucleus sampling
- 0.9 = focus on most likely tokens
- Helps with consistency

frequency_penalty: 0
- Don't penalize repeated words
- Keep at 0 for technical content

presence_penalty: 0
- Don't penalize new topics
- Keep at 0 for technical content
```

---

## **Response Format**

### **JSON Structure**

```json
{
  "analysis": {
    "summary": "Overall assessment of the code",
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
```

### **Score Calculation**

```
100 = Perfect code (no issues)
90-99 = Excellent (minor suggestions)
80-89 = Good (few issues, easy fixes)
70-79 = Fair (some concerns, needs attention)
60-69 = Below average (multiple issues)
Below 60 = Poor (significant problems)

Calculate as: 100 - (HIGH_issues * 10) - (MEDIUM_issues * 5) - (LOW_issues * 2)
Max deduction: depends on issue count
```

### **Example Response**

```json
{
  "analysis": {
    "summary": "Code has good structure but critical security vulnerability in password handling. Needs immediate fix.",
    "score": 45,
    "issues": [
      {
        "severity": "HIGH",
        "category": "SECURITY",
        "line": 3,
        "issue": "Password stored in plaintext and compared unsafely",
        "suggestion": "Use bcrypt for hashing and comparison",
        "example": "const match = await bcrypt.compare(inputPassword, hashedPassword);"
      },
      {
        "severity": "MEDIUM",
        "category": "CODE_QUALITY",
        "line": 2,
        "issue": "No try-catch error handling",
        "suggestion": "Add error handling to catch database errors",
        "example": "try { const user = await db.find(...); } catch(e) { return null; }"
      }
    ],
    "positives": [
      "Clear function structure",
      "Good variable naming",
      "Appropriate use of async/await"
    ]
  }
}
```

---

## **Example Workflows**

### **Workflow 1: Complete Analysis**

```javascript
// User submits code
const codeSnippet = `
function login(email, password) {
  const user = db.find({ email });
  if (user && user.password === password) {
    return user;
  }
}
`;

// Build prompt
const prompt = `
You are an expert code reviewer...
[Full template from Template 1]

CODE SNIPPET:
${codeSnippet}
`;

// Call OpenAI
const response = await openai.createChatCompletion({
  model: "gpt-4",
  messages: [
    { role: "system", content: "You are an expert code reviewer..." },
    { role: "user", content: prompt }
  ],
  temperature: 0.3,
  max_tokens: 2000
});

// Parse response
const analysis = JSON.parse(response.choices[0].message.content);

// Store in database
await db.reviews.create({
  code_snippet: codeSnippet,
  ai_suggestions: analysis,
  score: analysis.score
});
```

### **Workflow 2: Multi-Step Analysis**

```
Step 1: Initial Review
- Get overall assessment
- Identify major issues

Step 2: Security Focus
- Deep dive into security issues
- Additional context

Step 3: Performance Analysis
- Optimize algorithms
- Improve efficiency

Step 4: Best Practices
- Design patterns
- Code organization

Combine all results into final report
```

---

## **Testing & Iteration**

### **Test Cases for Prompt**

```
Test 1: Security Vulnerability
Input: Password comparison without bcrypt
Expected: HIGH severity SECURITY issue

Test 2: Performance Issue
Input: Inefficient loop
Expected: MEDIUM severity PERFORMANCE issue

Test 3: Style Issue
Input: Poor variable naming
Expected: LOW severity STYLE issue

Test 4: Good Code
Input: Well-written function
Expected: High score (80+), minimal issues

Test 5: Complex Code
Input: Mixed good and bad practices
Expected: Balanced analysis
```

### **Validation Checklist**

- [ ] Response is valid JSON
- [ ] All required fields present
- [ ] Severity is HIGH/MEDIUM/LOW
- [ ] Category is valid
- [ ] Line numbers make sense
- [ ] Examples are correct code
- [ ] Score is 0-100
- [ ] Suggestions are actionable

### **Iteration Process**

1. Test prompt with sample code
2. Check response format
3. Verify accuracy of issues found
4. Adjust prompt if needed
5. Test again
6. Document findings
7. Deploy to production

---

## **Cost Estimation**

### **Per Request**

```
gpt-4:
- Small code (100 lines): ~200 tokens (~$0.006)
- Medium code (500 lines): ~800 tokens (~$0.024)
- Large code (1000 lines): ~1500 tokens (~$0.045)

gpt-3.5-turbo:
- Small code (100 lines): ~200 tokens (~$0.0003)
- Medium code (500 lines): ~800 tokens (~$0.0012)
- Large code (1000 lines): ~1500 tokens (~$0.0023)

For user study (15 developers, 5 reviews each = 75 reviews):
- gpt-4: ~$3-4 total
- gpt-3.5-turbo: ~$0.10 total
```

---

## **Prompt Optimization Tips**

1. **Be Specific** - Clear instructions > vague requests
2. **Provide Context** - What language? What is it for?
3. **Show Format** - Provide example of desired output
4. **Set Constraints** - Limit to relevant categories
5. **Use Examples** - Show good and bad examples
6. **Iterate** - Test and refine prompts
7. **Monitor** - Track accuracy and adjust

---

## **Production Considerations**

### **Error Handling**

```javascript
try {
  const response = await openai.createChatCompletion(...);
  const analysis = JSON.parse(response.choices[0].message.content);
  return analysis;
} catch (error) {
  if (error.response?.status === 429) {
    // Rate limited - retry later
  } else if (error.response?.status === 401) {
    // Invalid API key
  } else {
    // Other error - fallback to default response
    return { error: "Analysis unavailable" };
  }
}
```

### **Rate Limiting**

```
- Max 3,500 RPM (requests per minute) for gpt-4
- Max 90,000 TPM (tokens per minute) for gpt-4
- Implement queue for concurrent requests
- Cache results for identical code
```

### **Quality Assurance**

```
- Compare AI suggestions with manual review (sample)
- Track false positives and false negatives
- Improve prompts based on discrepancies
- Monitor accuracy metrics
- Get developer feedback
```

---

## **Future Improvements**

Planned enhancements:
- [ ] Fine-tune model with custom examples
- [ ] Multi-language support (Python, Java, Go, etc.)
- [ ] Context-aware analysis (framework detection)
- [ ] Comparative analysis (before/after)
- [ ] Integration with popular IDEs
- [ ] Real-time suggestions as you code
- [ ] Learning from user feedback
- [ ] Custom rule sets per organization

---

## **Resources**

- OpenAI API Docs: https://platform.openai.com/docs
- Prompt Engineering Guide: https://platform.openai.com/docs/guides/prompt-engineering
- Token Calculator: https://platform.openai.com/tokenizer
- Best Practices: https://help.openai.com/en/articles/6654000

---

**Created:** November 2025  
**Ready for:** Week 4 Backend Implementation

---
