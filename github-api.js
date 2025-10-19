/*
    ═══════════════════════════════════════════════════════════════
    GITHUB API - Live Data Fetching
    ═══════════════════════════════════════════════════════════════

    This file contains functions to fetch LIVE data from GitHub's API.

    KEY CONCEPTS:

    1. ASYNC/AWAIT:
       - async = function that does something that takes time (like API calls)
       - await = "wait for this to finish before continuing"
       - Think of it like ordering food: you "await" for your order to be ready

    2. FETCH API:
       - Built-in browser function to make HTTP requests
       - Like asking a website for information
       - Returns a Promise (a "I'll get back to you with the answer")

    3. HTTP HEADERS:
       - Extra information sent with requests
       - Authorization header = proves you have permission (your token)
       - Accept header = tells GitHub what format you want the data in

    4. ERROR HANDLING:
       - try { } = "try to do this"
       - catch (error) { } = "if something goes wrong, do this instead"
       - Essential for network requests that might fail!
*/


/*
    ═══════════════════════════════════════════════════════════════
    SEARCH REPOSITORIES BY TOPIC
    ═══════════════════════════════════════════════════════════════

    This function searches GitHub for popular repositories based on a topic.

    PARAMETERS:
    - topic: The interest area (e.g., "game-development", "web-development")
    - token: The user's GitHub token (for authentication)

    RETURNS:
    - Array of repository objects with: name, description, stars, url
*/
async function searchGitHubRepos(topic, token) {
    try {
        // Map user-friendly topics to GitHub search terms
        const topicMap = {
            'game-development': 'game OR gamedev OR godot OR unity',
            'web-development': 'web OR javascript OR react OR vue',
            'data-science': 'data-science OR machine-learning OR python',
            'mobile-apps': 'mobile OR android OR ios OR react-native',
            'devops': 'devops OR kubernetes OR docker OR ci-cd',
            'exploring': 'beginner OR first-timers-only OR good-first-issue'
        };

        // Get the search query for this topic
        const searchQuery = topicMap[topic] || 'good-first-issue';

        /*
            GITHUB SEARCH API ENDPOINT:
            https://api.github.com/search/repositories

            QUERY PARAMETERS:
            q = search query
            sort = how to sort results (stars = most popular first)
            order = desc (descending - highest to lowest)
            per_page = how many results to return
        */
        const url = `https://api.github.com/search/repositories?q=${searchQuery}+good-first-issues:>5&sort=stars&order=desc&per_page=5`;

        /*
            FETCH REQUEST:
            - method: GET = "get me data" (default, so we don't need to specify)
            - headers: Extra information about the request
        */
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,  // Your GitHub token
                'Accept': 'application/vnd.github.v3+json'  // Tell GitHub we want JSON format
            }
        });

        /*
            CHECK IF REQUEST SUCCEEDED:
            response.ok = true if status code is 200-299
            If not ok, throw an error
        */
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        // Convert response to JSON (JavaScript object)
        const data = await response.json();

        /*
            PROCESS THE DATA:
            GitHub returns: { items: [...] }
            Each item is a repository with tons of info
            We only want: name, description, stars, url
        */
        return data.items.map(repo => ({
            name: repo.name,
            fullName: repo.full_name,  // owner/repo-name
            description: repo.description || 'No description available',
            stars: repo.stargazers_count,
            url: repo.html_url,
            language: repo.language || 'Multiple'
        }));

    } catch (error) {
        console.error('Error fetching repositories:', error);

        // Return fallback data if API fails
        return getFallbackRepos(topic);
    }
}


/*
    ═══════════════════════════════════════════════════════════════
    SEARCH "GOOD FIRST ISSUES"
    ═══════════════════════════════════════════════════════════════

    This function searches for beginner-friendly issues based on:
    - User's interest area
    - User's skill level

    PARAMETERS:
    - interest: Their chosen field
    - skillLevel: Their coding experience
    - token: GitHub token

    RETURNS:
    - Array of issue objects
*/
async function searchGoodFirstIssues(interest, skillLevel, token) {
    try {
        // Build search query based on skill level
        let labelQuery = 'good-first-issue';

        if (skillLevel === 'total-beginner') {
            labelQuery = 'good-first-issue OR beginner OR documentation';
        } else if (skillLevel === 'experienced') {
            labelQuery = 'good-first-issue OR help-wanted';
        }

        // Map interest to topic keywords for better searching
        const topicMap = {
            'game-development': 'game OR gamedev OR unity OR godot',
            'web-development': 'javascript OR typescript OR react OR vue OR web',
            'data-science': 'python OR data OR ml OR ai',
            'mobile-apps': 'android OR ios OR mobile OR react-native',
            'devops': 'docker OR kubernetes OR devops OR ci-cd',
            'exploring': 'beginner OR starter'
        };

        const topic = topicMap[interest] || 'beginner';

        /*
            GITHUB ISSUES SEARCH:
            - label: Filter by issue labels (varies by skill level)
            - state:open = Only show open (unsolved) issues
            - topic keywords in title/body to match interest area
        */
        const url = `https://api.github.com/search/issues?q=label:${labelQuery.replace(/ OR /g, ',label:')}+state:open+(${topic})&sort=created&order=desc&per_page=5`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();

        // Process and return issue data
        return data.items.map(issue => ({
            title: issue.title,
            repo: issue.repository_url.split('/').slice(-2).join('/'),  // Extract owner/repo
            url: issue.html_url,
            labels: issue.labels.map(label => label.name),
            createdAt: new Date(issue.created_at).toLocaleDateString()
        }));

    } catch (error) {
        console.error('Error fetching issues:', error);
        return getFallbackIssues(interest);
    }
}


/*
    ═══════════════════════════════════════════════════════════════
    FALLBACK DATA
    ═══════════════════════════════════════════════════════════════

    If the GitHub API fails (rate limit, network error, etc.),
    we return pre-loaded example data so the app still works.

    This is called "graceful degradation" - the app degrades gracefully
    instead of completely breaking.
*/

function getFallbackRepos(topic) {
    const fallbackData = {
        'game-development': [
            {
                name: 'godot',
                fullName: 'godotengine/godot',
                description: 'Free and open source 2D and 3D game engine',
                stars: 75000,
                url: 'https://github.com/godotengine/godot',
                language: 'C++'
            },
            {
                name: 'bevy',
                fullName: 'bevyengine/bevy',
                description: 'A refreshingly simple data-driven game engine built in Rust',
                stars: 28000,
                url: 'https://github.com/bevyengine/bevy',
                language: 'Rust'
            },
            {
                name: 'phaser',
                fullName: 'photonstorm/phaser',
                description: 'Desktop and Mobile HTML5 game framework',
                stars: 35000,
                url: 'https://github.com/photonstorm/phaser',
                language: 'JavaScript'
            }
        ],
        'web-development': [
            {
                name: 'react',
                fullName: 'facebook/react',
                description: 'A JavaScript library for building user interfaces',
                stars: 220000,
                url: 'https://github.com/facebook/react',
                language: 'JavaScript'
            },
            {
                name: 'vue',
                fullName: 'vuejs/vue',
                description: 'Progressive JavaScript Framework',
                stars: 205000,
                url: 'https://github.com/vuejs/vue',
                language: 'JavaScript'
            },
            {
                name: 'tailwindcss',
                fullName: 'tailwindlabs/tailwindcss',
                description: 'A utility-first CSS framework',
                stars: 75000,
                url: 'https://github.com/tailwindlabs/tailwindcss',
                language: 'CSS'
            }
        ],
        'data-science': [
            {
                name: 'tensorflow',
                fullName: 'tensorflow/tensorflow',
                description: 'An Open Source Machine Learning Framework',
                stars: 180000,
                url: 'https://github.com/tensorflow/tensorflow',
                language: 'Python'
            },
            {
                name: 'scikit-learn',
                fullName: 'scikit-learn/scikit-learn',
                description: 'Machine learning in Python',
                stars: 57000,
                url: 'https://github.com/scikit-learn/scikit-learn',
                language: 'Python'
            },
            {
                name: 'pandas',
                fullName: 'pandas-dev/pandas',
                description: 'Flexible and powerful data analysis tool',
                stars: 40000,
                url: 'https://github.com/pandas-dev/pandas',
                language: 'Python'
            }
        ],
        'mobile-apps': [
            {
                name: 'react-native',
                fullName: 'facebook/react-native',
                description: 'A framework for building native apps with React',
                stars: 115000,
                url: 'https://github.com/facebook/react-native',
                language: 'JavaScript'
            },
            {
                name: 'flutter',
                fullName: 'flutter/flutter',
                description: 'Google\'s mobile UI framework',
                stars: 160000,
                url: 'https://github.com/flutter/flutter',
                language: 'Dart'
            },
            {
                name: 'ionic-framework',
                fullName: 'ionic-team/ionic-framework',
                description: 'A powerful cross-platform UI toolkit',
                stars: 50000,
                url: 'https://github.com/ionic-team/ionic-framework',
                language: 'TypeScript'
            }
        ],
        'devops': [
            {
                name: 'kubernetes',
                fullName: 'kubernetes/kubernetes',
                description: 'Container orchestration system',
                stars: 105000,
                url: 'https://github.com/kubernetes/kubernetes',
                language: 'Go'
            },
            {
                name: 'docker',
                fullName: 'moby/moby',
                description: 'Open source containerization platform',
                stars: 67000,
                url: 'https://github.com/moby/moby',
                language: 'Go'
            },
            {
                name: 'ansible',
                fullName: 'ansible/ansible',
                description: 'IT automation platform',
                stars: 60000,
                url: 'https://github.com/ansible/ansible',
                language: 'Python'
            }
        ],
        'exploring': [
            {
                name: 'first-contributions',
                fullName: 'firstcontributions/first-contributions',
                description: 'Help beginners make their first contribution',
                stars: 40000,
                url: 'https://github.com/firstcontributions/first-contributions',
                language: 'Multiple'
            },
            {
                name: 'awesome-for-beginners',
                fullName: 'MunGell/awesome-for-beginners',
                description: 'List of projects with good first issues',
                stars: 60000,
                url: 'https://github.com/MunGell/awesome-for-beginners',
                language: 'Multiple'
            },
            {
                name: 'public-apis',
                fullName: 'public-apis/public-apis',
                description: 'A collective list of free APIs',
                stars: 280000,
                url: 'https://github.com/public-apis/public-apis',
                language: 'Python'
            }
        ]
    };

    return fallbackData[topic] || fallbackData['exploring'];
}


function getFallbackIssues(interest) {
    // Sample issues for fallback
    return [
        {
            title: 'Update documentation for installation steps',
            repo: 'example/awesome-project',
            url: 'https://github.com/example/awesome-project/issues/123',
            labels: ['good first issue', 'documentation'],
            createdAt: new Date().toLocaleDateString()
        },
        {
            title: 'Fix typo in README',
            repo: 'example/cool-library',
            url: 'https://github.com/example/cool-library/issues/456',
            labels: ['good first issue'],
            createdAt: new Date().toLocaleDateString()
        },
        {
            title: 'Add example for beginners',
            repo: 'example/learning-resource',
            url: 'https://github.com/example/learning-resource/issues/789',
            labels: ['good first issue', 'help wanted'],
            createdAt: new Date().toLocaleDateString()
        }
    ];
}


/*
    ═══════════════════════════════════════════════════════════════
    DISPLAY HELPER FUNCTIONS
    ═══════════════════════════════════════════════════════════════

    These functions take the data from GitHub and create HTML to display it.
*/

function displayRepos(repos, containerId) {
    const container = document.getElementById(containerId);

    if (!repos || repos.length === 0) {
        container.innerHTML = '<p>No repositories found. Try a different interest area!</p>';
        return;
    }

    // Build HTML for each repository
    let html = '';
    repos.forEach(repo => {
        html += `
            <div class="github-item">
                <h4>${repo.name}</h4>
                <p>${repo.description}</p>
                <p>
                    <span class="stars">⭐ ${repo.stars.toLocaleString()}</span>
                    <span style="margin-left: 16px; color: #6B7280;">Language: ${repo.language}</span>
                </p>
                <a href="${repo.url}" target="_blank">View on GitHub</a>
            </div>
        `;
    });

    container.innerHTML = html;
}


function displayIssues(issues, containerId) {
    const container = document.getElementById(containerId);

    if (!issues || issues.length === 0) {
        container.innerHTML = '<p>No issues found. Try searching on GitHub directly!</p>';
        return;
    }

    let html = '';
    issues.forEach(issue => {
        html += `
            <div class="github-item">
                <h4>${issue.title}</h4>
                <p style="color: #6B7280; font-size: 13px;">Repository: ${issue.repo}</p>
                <p style="font-size: 13px;">
                    ${issue.labels.map(label => `<span style="background: #EFF6FF; padding: 4px 8px; border-radius: 4px; margin-right: 4px;">${label}</span>`).join('')}
                </p>
                <p style="color: #9CA3AF; font-size: 12px;">Created: ${issue.createdAt}</p>
                <a href="${issue.url}" target="_blank">View Issue</a>
            </div>
        `;
    });

    container.innerHTML = html;
}


/*
    ═══════════════════════════════════════════════════════════════
    WHAT HAPPENS NEXT?
    ═══════════════════════════════════════════════════════════════

    These functions are called from script.js when:
    1. User selects their interest in Module 1
    2. User selects their skill level in Module 2

    script.js will:
    - Call searchGitHubRepos(interest, token)
    - Get back an array of repositories
    - Call displayRepos(repos, 'projects-list-1')
    - The repos appear on the page!
*/
