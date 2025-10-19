/*
    ═══════════════════════════════════════════════════════════════
    OPEN SOURCE LEARNING PLATFORM - Main JavaScript
    ═══════════════════════════════════════════════════════════════

    This is the "brain" of your application!

    WHAT THIS FILE DOES:
    1. Saves/loads user progress to localStorage
    2. Shows/hides modules based on progress
    3. Handles all button clicks and form submissions
    4. Calls Gemini AI API for personalized content
    5. Validates quiz answers
    6. Submits Pull Requests via GitHub API

    KEY CONCEPTS YOU'LL LEARN:

    1. EVENT LISTENERS:
       - "Listen" for user actions (clicks, typing, etc.)
       - When action happens, run a function
       - Like a doorbell: when button is pressed (event), bell rings (function runs)

    2. localStorage:
       - Browser's built-in storage (like a tiny database)
       - Saves data even when you close the browser
       - Perfect for saving progress!

    3. ASYNC/AWAIT:
       - Used for operations that take time (API calls)
       - "async" = this function does something slow
       - "await" = wait for this to finish before continuing

    4. DOM MANIPULATION:
       - DOM = Document Object Model (the HTML structure)
       - JavaScript can change HTML elements, text, styles
       - document.getElementById() = find an element
       - element.style.display = 'block' = show it
*/


/*
    ═══════════════════════════════════════════════════════════════
    SECTION 1: GLOBAL STATE
    ═══════════════════════════════════════════════════════════════

    These variables store the current state of the application.
    Think of them as the app's "memory"
*/

// User's progress through modules (1-4)
let currentModule = 0;  // 0 = home/setup, 1 = module 1, etc.

// User's answers and preferences
let userProgress = {
    // API Keys
    geminiApiKey: '',
    githubToken: '',

    // Module 1 personalization
    interest: '',           // e.g., "game-development"

    // Module 2 personalization
    skillLevel: '',         // e.g., "some-experience"

    // Module 3 personalization
    gitExperience: '',      // e.g., "used-a-little"

    // Which modules are completed
    completedModules: [],   // Array like [1, 2] means modules 1 and 2 are done

    // Current module number
    currentModule: 0
};


/*
    ═══════════════════════════════════════════════════════════════
    SECTION 2: localStorage FUNCTIONS
    ═══════════════════════════════════════════════════════════════

    localStorage is like a tiny database in your browser.

    HOW IT WORKS:
    - localStorage.setItem('key', 'value') = Save data
    - localStorage.getItem('key') = Get data back
    - Data must be a STRING (we use JSON.stringify to convert objects)

    WHY WE NEED IT:
    Without localStorage, if you refresh the page, all progress is LOST!
    With localStorage, progress persists even if you close the browser.
*/

// Save current progress to localStorage
function saveProgress() {
    try {
        // Convert JavaScript object to JSON string
        // JSON.stringify turns {name: "Jane"} into '{"name":"Jane"}'
        const progressString = JSON.stringify(userProgress);

        // Save to localStorage under the key "osLearningProgress"
        localStorage.setItem('osLearningProgress', progressString);

        console.log('✅ Progress saved!', userProgress);
    } catch (error) {
        console.error('❌ Error saving progress:', error);
    }
}

// Load saved progress from localStorage
function loadProgress() {
    try {
        // Get the saved string from localStorage
        const saved = localStorage.getItem('osLearningProgress');

        // If nothing saved yet, return (use default userProgress object)
        if (!saved) {
            console.log('No saved progress found. Starting fresh!');
            return;
        }

        // Convert JSON string back to JavaScript object
        // JSON.parse turns '{"name":"Jane"}' into {name: "Jane"}
        const loaded = JSON.parse(saved);

        // Update our global userProgress object
        userProgress = loaded;

        // Update the current module number
        currentModule = userProgress.currentModule || 0;

        console.log('✅ Progress loaded!', userProgress);

        // If they had API keys saved, fill them in
        if (userProgress.geminiApiKey) {
            document.getElementById('gemini-api-key').value = userProgress.geminiApiKey;
        }
        if (userProgress.githubToken) {
            document.getElementById('github-token').value = userProgress.githubToken;
        }

    } catch (error) {
        console.error('❌ Error loading progress:', error);
    }
}


/*
    ═══════════════════════════════════════════════════════════════
    SECTION 3: MODULE NAVIGATION
    ═══════════════════════════════════════════════════════════════

    These functions show/hide modules and update the sidebar.
*/

// Show a specific section (home, module-1, module-2, etc.)
function showSection(sectionId) {
    // Hide ALL sections first
    const allSections = document.querySelectorAll('.module-section, #home-setup');
    allSections.forEach(section => {
        section.style.display = 'none';
    });

    // Show ONLY the requested section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';

        // Scroll to top of page when switching modules
        window.scrollTo(0, 0);
    }

    // Update sidebar to show which module is active
    updateSidebar();
}

// Update the sidebar progress tracker
function updateSidebar() {
    // Get all sidebar items
    const sidebarItems = document.querySelectorAll('#module-list li');

    sidebarItems.forEach((item, index) => {
        // Remove all status classes
        item.classList.remove('active', 'completed', 'locked');

        // Get the icon span inside this item
        const icon = item.querySelector('.icon');

        if (index === 0) {
            // Home section
            if (currentModule === 0) {
                item.classList.add('active');
                icon.textContent = '🏠';
            } else {
                item.classList.add('completed');
                icon.textContent = '✅';
            }
        } else {
            // Module sections (index 1-4 = modules 1-4)
            const moduleNumber = index;

            if (currentModule === moduleNumber) {
                // Current module
                item.classList.add('active');
                icon.textContent = '🔄';
            } else if (userProgress.completedModules.includes(moduleNumber)) {
                // Completed module
                item.classList.add('completed');
                icon.textContent = '✅';
            } else if (currentModule >= moduleNumber - 1) {
                // Next available module (unlocked but not started)
                item.classList.add('locked');
                icon.textContent = '🔓';
            } else {
                // Still locked
                item.classList.add('locked');
                icon.textContent = '🔒';
            }
        }
    });

    // Update progress indicator in header
    if (currentModule > 0) {
        document.getElementById('current-module-number').textContent = currentModule;
    }
}

// Navigate to a specific module
function goToModule(moduleNumber) {
    currentModule = moduleNumber;
    userProgress.currentModule = moduleNumber;

    if (moduleNumber === 0) {
        showSection('home-setup');
    } else {
        showSection(`module-${moduleNumber}`);
    }

    saveProgress();
}

// Mark current module as complete and move to next
function completeModule(moduleNumber) {
    // Add to completed modules if not already there
    if (!userProgress.completedModules.includes(moduleNumber)) {
        userProgress.completedModules.push(moduleNumber);
    }

    // Move to next module
    goToModule(moduleNumber + 1);
}


/*
    ═══════════════════════════════════════════════════════════════
    SECTION 4: SETUP PAGE (API KEYS)
    ═══════════════════════════════════════════════════════════════

    This handles the initial setup where users enter their API keys.
*/

// Check if both API keys are entered
function checkSetupComplete() {
    const geminiKey = document.getElementById('gemini-api-key').value.trim();
    const githubToken = document.getElementById('github-token').value.trim();
    const startButton = document.getElementById('start-learning-btn');
    const statusText = document.getElementById('setup-status');

    // Both keys must be filled in
    if (geminiKey && githubToken) {
        startButton.disabled = false;
        statusText.textContent = '✅ Ready to start!';
        statusText.style.color = '#059669';  // Green
    } else {
        startButton.disabled = true;

        if (!geminiKey && !githubToken) {
            statusText.textContent = 'Please enter both API keys above';
        } else if (!geminiKey) {
            statusText.textContent = 'Please enter your Gemini API key';
        } else {
            statusText.textContent = 'Please enter your GitHub token';
        }

        statusText.style.color = '#6B7280';  // Gray
    }
}

// Save API keys and start learning
function startLearning() {
    const geminiKey = document.getElementById('gemini-api-key').value.trim();
    const githubToken = document.getElementById('github-token').value.trim();

    if (!geminiKey || !githubToken) {
        alert('Please enter both API keys!');
        return;
    }

    // Save to userProgress
    userProgress.geminiApiKey = geminiKey;
    userProgress.githubToken = githubToken;

    // Move to Module 1
    completeModule(0);  // Complete setup, go to module 1

    console.log('🚀 Starting learning journey!');
}


/*
    ═══════════════════════════════════════════════════════════════
    SECTION 5: GEMINI API INTEGRATION
    ═══════════════════════════════════════════════════════════════

    This calls Google's Gemini AI to generate personalized content.

    HOW IT WORKS:
    1. We create a text prompt based on user's selection
    2. Send it to Gemini API
    3. Gemini sends back AI-generated text
    4. We display it on the page
*/

// Call Gemini API with a prompt
async function callGeminiAPI(prompt) {
    const apiKey = userProgress.geminiApiKey;

    if (!apiKey) {
        throw new Error('No Gemini API key found');
    }

    try {
        // Gemini API endpoint (using gemini-2.5-flash - latest stable model, fast and free!)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        // Make the API request
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();

        // Extract the text from Gemini's response
        return data.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw error;
    }
}


/*
    ═══════════════════════════════════════════════════════════════
    SECTION 6: MODULE-SPECIFIC FUNCTIONS
    ═══════════════════════════════════════════════════════════════
*/

// ─────────────────────────────────────────────────────────────────
// MODULE 1: Understanding Open Source
// ─────────────────────────────────────────────────────────────────

async function generateModule1Content() {
    const select = document.getElementById('interest-select');
    const interest = select.value;

    if (!interest) {
        alert('Please select an interest area first!');
        return;
    }

    // Save their choice
    userProgress.interest = interest;
    saveProgress();

    // Show AI content section and display loading message
    const aiSection = document.getElementById('ai-content-1');
    const aiResponse = document.getElementById('ai-response-1');
    aiSection.style.display = 'block';
    aiResponse.innerHTML = '<p class="loading">✨ Generating your personalized content...</p>';

    // Create personalized prompt for Gemini
    const prompt = `You're teaching open source to someone interested in ${interest}.

Explain what open source is in an engaging way. Include:
1. A clear definition
2. Why it matters in the ${interest} field
3. 2-3 specific examples of popular open source projects in ${interest}
4. Career benefits for someone in ${interest}

Keep it conversational and encouraging, 300-400 words. Use paragraphs, not bullet points.`;

    try {
        // Call Gemini API
        const content = await callGeminiAPI(prompt);

        // Display the AI response
        aiResponse.innerHTML = `<div style="white-space: pre-wrap;">${content}</div>`;

        // Also show GitHub projects
        showGitHubProjects();

    } catch (error) {
        aiResponse.innerHTML = `
            <p style="color: #DC2626;">❌ Error generating content. Please check your API key and try again.</p>
            <p style="font-size: 14px; color: #6B7280;">Error: ${error.message}</p>
        `;
    }
}

// Show GitHub projects for user's interest
async function showGitHubProjects() {
    const githubSection = document.getElementById('github-data-1');
    const projectsList = document.getElementById('projects-list-1');

    githubSection.style.display = 'block';
    projectsList.innerHTML = '<p class="loading">Loading projects...</p>';

    try {
        // Call function from github-api.js
        const repos = await searchGitHubRepos(userProgress.interest, userProgress.githubToken);

        // Display the repositories
        displayRepos(repos, 'projects-list-1');

    } catch (error) {
        projectsList.innerHTML = '<p style="color: #DC2626;">Error loading projects. Using fallback data.</p>';
        // Fallback data will be used automatically by searchGitHubRepos
    }
}


// ─────────────────────────────────────────────────────────────────
// MODULE 2: Finding Your First Issue
// ─────────────────────────────────────────────────────────────────

async function generateModule2Content() {
    const select = document.getElementById('skill-select');
    const skillLevel = select.value;

    if (!skillLevel) {
        alert('Please select your skill level first!');
        return;
    }

    // Save their choice
    userProgress.skillLevel = skillLevel;
    saveProgress();

    // Show AI content section
    const aiSection = document.getElementById('ai-content-2');
    const aiResponse = document.getElementById('ai-response-2');
    aiSection.style.display = 'block';
    aiResponse.innerHTML = '<p class="loading">✨ Generating advice for your skill level...</p>';

    // Create personalized prompt
    const prompt = `A ${skillLevel} developer interested in ${userProgress.interest} is looking for their first open source issue.

Explain what makes a good first issue for someone at their level. Include:
- What to look for in an issue description
- Red flags to avoid
- 3-4 example issue types that would be appropriate for their skill level
- How to evaluate if an issue is too difficult

Keep it practical and encouraging. 250-300 words.`;

    try {
        const content = await callGeminiAPI(prompt);
        aiResponse.innerHTML = `<div style="white-space: pre-wrap;">${content}</div>`;

        // Show actual good first issues
        showGoodFirstIssues();

    } catch (error) {
        aiResponse.innerHTML = `
            <p style="color: #DC2626;">❌ Error generating content. Please check your API key and try again.</p>
            <p style="font-size: 14px; color: #6B7280;">Error: ${error.message}</p>
        `;
    }
}

// Show actual "good first issues" from GitHub
async function showGoodFirstIssues() {
    const githubSection = document.getElementById('github-data-2');
    const issuesList = document.getElementById('issues-list-2');

    githubSection.style.display = 'block';
    issuesList.innerHTML = '<p class="loading">Searching for good first issues...</p>';

    try {
        // Call function from github-api.js
        const issues = await searchGoodFirstIssues(
            userProgress.interest,
            userProgress.skillLevel,
            userProgress.githubToken
        );

        // Display the issues
        displayIssues(issues, 'issues-list-2');

    } catch (error) {
        issuesList.innerHTML = '<p style="color: #DC2626;">Error loading issues. Using fallback examples.</p>';
    }
}


// ─────────────────────────────────────────────────────────────────
// MODULE 3: Making Your Contribution
// ─────────────────────────────────────────────────────────────────

async function generateModule3Content() {
    const select = document.getElementById('git-select');
    const gitExperience = select.value;

    if (!gitExperience) {
        alert('Please select your Git experience level!');
        return;
    }

    // Save their choice
    userProgress.gitExperience = gitExperience;
    saveProgress();

    // Show AI content section
    const aiSection = document.getElementById('ai-content-3');
    const aiResponse = document.getElementById('ai-response-3');
    aiSection.style.display = 'block';
    aiResponse.innerHTML = '<p class="loading">✨ Creating your Git workflow guide...</p>';

    // Create personalized prompt
    let detailLevel = '';
    if (gitExperience === 'never-used') {
        detailLevel = 'Use very simple language and explain each term (fork, clone, commit, etc.)';
    } else if (gitExperience === 'used-a-little') {
        detailLevel = 'Provide clear commands with brief explanations';
    } else {
        detailLevel = 'Keep it concise with key commands and best practices';
    }

    const prompt = `Teach a ${gitExperience} student the Git workflow for contributing to open source.

Cover these steps:
1. Fork and clone a repository
2. Create a new branch
3. Make changes
4. Commit with a good message
5. Push and create a Pull Request

${detailLevel}

Include actual command examples. 300-350 words.`;

    try {
        const content = await callGeminiAPI(prompt);
        aiResponse.innerHTML = `<div style="white-space: pre-wrap;">${content}</div>`;

    } catch (error) {
        aiResponse.innerHTML = `
            <p style="color: #DC2626;">❌ Error generating content. Please check your API key and try again.</p>
            <p style="font-size: 14px; color: #6B7280;">Error: ${error.message}</p>
        `;
    }
}


// ─────────────────────────────────────────────────────────────────
// MODULE 4: Join the Community
// ─────────────────────────────────────────────────────────────────

async function generateModule4NextSteps() {
    const button = document.getElementById('generate-next-steps-btn');
    const aiResponse = document.getElementById('ai-response-4');

    button.disabled = true;
    button.textContent = 'Generating...';

    aiResponse.style.display = 'block';
    aiResponse.innerHTML = '<p class="loading">✨ Creating your personalized roadmap...</p>';

    // Create personalized prompt based on all their previous answers
    const prompt = `Create a personalized next steps guide for someone who:
- Is interested in ${userProgress.interest}
- Has ${userProgress.skillLevel} skill level
- Has ${userProgress.gitExperience} Git experience
- Just learned the basics of open source contribution

Provide:
1. Recommended projects to contribute to (specific names if possible)
2. Skills to learn next for ${userProgress.interest}
3. Communities to join
4. Resources for continued learning

Be encouraging and specific. 300-350 words.`;

    try {
        const content = await callGeminiAPI(prompt);
        aiResponse.innerHTML = `<div style="white-space: pre-wrap;">${content}</div>`;

        button.textContent = '✅ Roadmap Generated!';

    } catch (error) {
        aiResponse.innerHTML = `
            <p style="color: #DC2626;">❌ Error generating roadmap.</p>
            <p style="font-size: 14px; color: #6B7280;">Error: ${error.message}</p>
        `;
        button.disabled = false;
        button.textContent = 'Try Again';
    }
}


/*
    ═══════════════════════════════════════════════════════════════
    SECTION 7: QUIZ VALIDATION
    ═══════════════════════════════════════════════════════════════

    Each module has a quiz. User must answer correctly to proceed.
*/

// Check quiz answer
function checkQuiz(moduleNumber, correctAnswer) {
    // Get selected answer
    const selected = document.querySelector(`input[name="quiz-${moduleNumber}"]:checked`);

    if (!selected) {
        alert('Please select an answer!');
        return;
    }

    const userAnswer = selected.value;
    const feedback = document.getElementById(`quiz-feedback-${moduleNumber}`);
    const nextButton = document.getElementById(`next-module-${moduleNumber}`);

    if (userAnswer === correctAnswer) {
        // Correct!
        feedback.textContent = '✅ Correct! You can now proceed to the next module.';
        feedback.className = 'quiz-feedback correct';
        feedback.style.display = 'block';

        // Enable next button
        nextButton.disabled = false;
    } else {
        // Wrong
        feedback.textContent = '❌ Not quite. Try again!';
        feedback.className = 'quiz-feedback incorrect';
        feedback.style.display = 'block';

        // Keep next button disabled
        nextButton.disabled = true;
    }
}


/*
    ═══════════════════════════════════════════════════════════════
    SECTION 8: PR SUBMISSION (THE BIG MOMENT!)
    ═══════════════════════════════════════════════════════════════

    This is where students submit their first REAL Pull Request!
*/

// Helper function to sleep/wait
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Update status message during PR submission
function updatePRStatus(message) {
    const statusDiv = document.getElementById('pr-status');
    const statusText = document.getElementById('status-text');

    statusDiv.style.display = 'block';
    statusText.textContent = message;
}

// Submit the actual Pull Request!
async function submitPullRequest() {
    // Get form values
    const name = document.getElementById('student-name').value.trim();
    const githubUsername = document.getElementById('github-username').value.trim();
    const token = document.getElementById('github-token').value.trim();

    // Validate inputs
    if (!name || !githubUsername || !token) {
        alert('Please fill in all fields!');
        return;
    }

    // Disable submit button
    const submitButton = document.getElementById('submit-pr-btn');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    // YOUR repository info
    const YOUR_USERNAME = 'AnaPcode';
    const YOUR_REPO = 'Learning-Platform-Project-for-Open-Source-Hackfest';

    try {
        // Step 1: Fork the repository
        updatePRStatus('🔄 Step 1/6: Forking repository...');

        const forkResponse = await fetch(`https://api.github.com/repos/${YOUR_USERNAME}/${YOUR_REPO}/forks`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        // 409 = fork already exists, that's okay!
        if (!forkResponse.ok && forkResponse.status !== 409) {
            throw new Error('Failed to fork repository');
        }

        // Step 2: Wait for fork to complete
        updatePRStatus('⏳ Step 2/6: Waiting for fork to complete...');
        await sleep(5000);  // Wait 5 seconds

        // Step 3: Get current CONTRIBUTORS.md file
        updatePRStatus('📖 Step 3/6: Reading CONTRIBUTORS.md...');

        const fileResponse = await fetch(
            `https://api.github.com/repos/${githubUsername}/${YOUR_REPO}/contents/CONTRIBUTORS.md`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );

        if (!fileResponse.ok) {
            throw new Error('Could not read CONTRIBUTORS.md file');
        }

        const fileData = await fileResponse.json();

        // Step 4: Add student's name
        updatePRStatus('✏️ Step 4/6: Adding your name to the file...');

        // Decode base64 content
        const currentContent = atob(fileData.content);

        // Check if this user already exists in the file
        if (currentContent.includes(`@${githubUsername}`)) {
            throw new Error(`You've already completed this course! Your name is already in CONTRIBUTORS.md. Check out the file to see your entry! 🎉`);
        }

        // Create new entry
        const newEntry = `- [@${githubUsername}](https://github.com/${githubUsername}) - ${name} - ${new Date().toLocaleDateString()}`;
        const updatedContent = currentContent.trim() + '\n' + newEntry + '\n';

        // Step 5: Commit the change
        updatePRStatus('💾 Step 5/6: Committing changes...');

        const commitResponse = await fetch(
            `https://api.github.com/repos/${githubUsername}/${YOUR_REPO}/contents/CONTRIBUTORS.md`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `Add ${name} to contributors`,
                    content: btoa(updatedContent),  // Encode to base64
                    sha: fileData.sha
                })
            }
        );

        if (!commitResponse.ok) {
            throw new Error('Failed to commit changes');
        }

        // Step 6: Create Pull Request
        updatePRStatus('🚀 Step 6/6: Creating Pull Request...');

        const prResponse = await fetch(
            `https://api.github.com/repos/${YOUR_USERNAME}/${YOUR_REPO}/pulls`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: `Add ${name} to contributors`,
                    head: `${githubUsername}:main`,
                    base: 'main',
                    body: `## 🎉 Course Completion!\n\n**Name:** ${name}\n**GitHub:** @${githubUsername}\n\nI completed the Open Source Learning Platform course and learned how to contribute to open source projects!`
                })
            }
        );

        if (!prResponse.ok) {
            const errorData = await prResponse.json();
            throw new Error(errorData.message || 'Failed to create Pull Request');
        }

        const prData = await prResponse.json();

        // SUCCESS! 🎉
        showSuccessMessage(name, prData.html_url);

    } catch (error) {
        console.error('Error submitting PR:', error);

        // Show error message
        document.getElementById('pr-status').style.display = 'none';
        alert(`❌ Error: ${error.message}\n\nPlease check:\n• Your GitHub token has "public_repo" permission\n• Your token hasn't expired\n• Your GitHub username is correct\n• You have internet connection`);

        // Re-enable button
        submitButton.disabled = false;
        submitButton.textContent = '🚀 Submit My First PR!';
    }
}

// Show success celebration!
function showSuccessMessage(name, prUrl) {
    const completionArea = document.getElementById('completion-area');

    completionArea.innerHTML = `
        <div class="success-message">
            <h1>🎉 YOU DID IT, ${name.toUpperCase()}!</h1>
            <h2>You just submitted your first Pull Request!</h2>

            <div class="pr-link">
                <p><strong>View your PR:</strong></p>
                <a href="${prUrl}" target="_blank">${prUrl}</a>
            </div>

            <div class="what-happened">
                <h3>What You Just Did:</h3>
                <ul>
                    <li>✅ Forked a repository to your GitHub account</li>
                    <li>✅ Made changes to a file (CONTRIBUTORS.md)</li>
                    <li>✅ Committed your changes with a message</li>
                    <li>✅ Submitted a Pull Request</li>
                    <li>✅ This now appears on YOUR GitHub profile!</li>
                </ul>
            </div>

            <div class="next-steps">
                <h3>What's Next?</h3>
                <ul>
                    <li>Check back on your PR - it might get merged!</li>
                    <li>Find a project you're interested in</li>
                    <li>Look for "good first issue" labels</li>
                    <li>Use the same process you just learned!</li>
                    <li>Welcome to the open source community! 🚀</li>
                </ul>
            </div>
        </div>
    `;

    // Hide status and form
    document.getElementById('pr-status').style.display = 'none';
    document.querySelector('.pr-submission-form').style.display = 'none';
}


/*
    ═══════════════════════════════════════════════════════════════
    SECTION 9: EVENT LISTENERS
    ═══════════════════════════════════════════════════════════════

    This is where we "wire up" all the buttons and inputs.
    We tell JavaScript: "When this button is clicked, run this function"
*/

// This runs when the page finishes loading
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Open Source Learning Platform initialized!');

    // Load saved progress
    loadProgress();

    // Show the appropriate section based on saved progress
    if (currentModule === 0) {
        showSection('home-setup');
    } else {
        showSection(`module-${currentModule}`);
    }

    // ─────────────────────────────────────────────────────────────
    // SETUP PAGE EVENT LISTENERS
    // ─────────────────────────────────────────────────────────────

    // Listen for API key input changes
    document.getElementById('gemini-api-key').addEventListener('input', checkSetupComplete);
    document.getElementById('github-token').addEventListener('input', checkSetupComplete);

    // Start learning button
    document.getElementById('start-learning-btn').addEventListener('click', startLearning);


    // ─────────────────────────────────────────────────────────────
    // MODULE 1 EVENT LISTENERS
    // ─────────────────────────────────────────────────────────────

    // Enable button when interest is selected
    document.getElementById('interest-select').addEventListener('change', function() {
        document.getElementById('generate-personalized-btn').disabled = !this.value;
    });

    // Generate personalized content
    document.getElementById('generate-personalized-btn').addEventListener('click', generateModule1Content);

    // Quiz
    document.getElementById('check-quiz-1').addEventListener('click', function() {
        checkQuiz(1, 'b');  // Correct answer is 'b'
    });

    // Next module button
    document.getElementById('next-module-1').addEventListener('click', function() {
        completeModule(1);
    });


    // ─────────────────────────────────────────────────────────────
    // MODULE 2 EVENT LISTENERS
    // ─────────────────────────────────────────────────────────────

    // Enable button when skill level is selected
    document.getElementById('skill-select').addEventListener('change', function() {
        document.getElementById('generate-skill-advice-btn').disabled = !this.value;
    });

    // Generate skill-based advice
    document.getElementById('generate-skill-advice-btn').addEventListener('click', generateModule2Content);

    // Quiz
    document.getElementById('check-quiz-2').addEventListener('click', function() {
        checkQuiz(2, 'b');  // Correct answer is 'b'
    });

    // Navigation buttons
    document.getElementById('prev-module-2').addEventListener('click', function() {
        goToModule(1);
    });

    document.getElementById('next-module-2').addEventListener('click', function() {
        completeModule(2);
    });


    // ─────────────────────────────────────────────────────────────
    // MODULE 3 EVENT LISTENERS
    // ─────────────────────────────────────────────────────────────

    // Enable button when Git experience is selected
    document.getElementById('git-select').addEventListener('change', function() {
        document.getElementById('generate-git-help-btn').disabled = !this.value;
    });

    // Generate Git workflow guide
    document.getElementById('generate-git-help-btn').addEventListener('click', generateModule3Content);

    // Quiz
    document.getElementById('check-quiz-3').addEventListener('click', function() {
        checkQuiz(3, 'b');  // Correct answer is 'b'
    });

    // Navigation buttons
    document.getElementById('prev-module-3').addEventListener('click', function() {
        goToModule(2);
    });

    document.getElementById('next-module-3').addEventListener('click', function() {
        completeModule(3);
    });


    // ─────────────────────────────────────────────────────────────
    // MODULE 4 EVENT LISTENERS
    // ─────────────────────────────────────────────────────────────

    // Generate next steps
    document.getElementById('generate-next-steps-btn').addEventListener('click', generateModule4NextSteps);

    // PR Submission
    document.getElementById('submit-pr-btn').addEventListener('click', submitPullRequest);


    // ─────────────────────────────────────────────────────────────
    // SIDEBAR NAVIGATION
    // ─────────────────────────────────────────────────────────────

    // Make sidebar items clickable
    document.querySelectorAll('#module-list li').forEach((item, index) => {
        item.addEventListener('click', function() {
            // Don't allow clicking locked modules
            if (this.classList.contains('locked')) {
                alert('Complete the previous module first!');
                return;
            }

            // Navigate to that module
            goToModule(index);
        });
    });
});


/*
    ═══════════════════════════════════════════════════════════════
    CONGRATULATIONS! 🎉
    ═══════════════════════════════════════════════════════════════

    You now have a complete, working Open Source Learning Platform!

    WHAT YOU'VE LEARNED:
    1. localStorage - saving user data
    2. Event listeners - responding to user actions
    3. API calls - fetching data from Gemini and GitHub
    4. DOM manipulation - changing what's on the page
    5. Async/await - handling slow operations
    6. Error handling - gracefully managing failures

    NEXT STEPS:
    1. Update YOUR_USERNAME and YOUR_REPO in the submitPullRequest function
    2. Create a CONTRIBUTORS.md file in your repository
    3. Test with your own GitHub account
    4. Deploy to GitHub Pages
    5. Share with the world!

    You're ready to teach others about open source! 🚀
*/
