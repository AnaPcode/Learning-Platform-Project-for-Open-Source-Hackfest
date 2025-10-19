# Open Source Learning

**Learn about open source through AI-powered personalized lessons**

## 🔗 Links

- **[Live Platform](https://anapcode.github.io/Learning-Platform-Project-for-Open-Source-Hackfest/)** - Start learning now!
- **[Demo Video](https://youtu.be/GynRLcVCwz8)**

---

## 📖 About This Project

Open Source Learning is an interactive web-based platform that teaches beginners about open source and how to make their first open source contribution. Using Google's Gemini AI, it personalizes lessons based on your interests and skill level, then guides you through submitting a real Pull Request to GitHub.

## ✨ Features

- **👥 Beginner-Friendly**: No prior open source experience needed
- **⏱️ Self-Paced Learning**: Complete modules at your own speed with progress tracking
- **💾 Progress Persistence**: Pick up right where you left off (saved in browser localStorage - note: clearing cache or switching browsers will reset progress)
- **Personalized Learning**: AI adapts content based on your tech interests and skill level
- **Live GitHub Integration**: Discover real projects and issues with beginner-friendly labels
- **Interactive Quizzes**: Validate your knowledge before progressing to the next module
- **Real Contributions**: Submit an actual Pull Request as part of course completion
- **Collapsible Sidebar**: Clean, modern UI with progress visualization

---

## 🎓 Course Modules

The platform guides you through 4 comprehensive modules:

### Module 0: Home / Setup
Get your free API keys.

### Module 1: Understanding Open Source
Learn what open source is, why it matters, and discover popular projects in your field of interest.

### Module 2: Finding Your First Issue
Discover how to identify beginner-friendly contribution opportunities and evaluate project quality.

### Module 3: Making Your First Contribution
Step-by-step guide through the Git workflow: fork, clone, branch, commit, push, and how to create a Pull Request.

### Module 4: Join the Community
Submit your completion PR and learn next steps for continuing your open source journey.

**Total Duration:** 60-90 minutes

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **AI**: Google Gemini API (gemini-2.5-flash model)
- **Data**: GitHub REST API
- **Storage**: localStorage (client-side persistence)
- **Hosting**: GitHub Pages

**No frameworks, no build tools** - pure web fundamentals for accessibility and contribution ease!

---

## 🚀 How It Works

1. **Setup**: Enter your free Gemini API key and GitHub token
2. **Personalize**: Select your interests and skill level
3. **Learn**: Work through 4 interactive modules at your own pace
4. **Contribute**: Submit a real Pull Request using your GitHub account
5. **Celebrate**: Join the open source community with your first contribution!

### User Journey Flow

```
Home (API Setup) → Module 1 (Learn Basics) → Module 2 (Find Issues) →
Module 3 (Git Workflow) → Module 4 (Submit PR) → Success! 🎉
```

---

## 💻 Installation & Local Development

```bash
# Clone the repository
git clone https://github.com/AnaPcode/Learning-Platform-Project-for-Open-Source-Hackfest.git

# Navigate to the project
cd Learning-Platform-Project-for-Open-Source-Hackfest

# Open in your browser
# Simply open index.html in any modern web browser
# No build step or dependencies needed!
```

---

## 🏗️ Architecture Overview

### Client-Side Only Architecture
- **Zero backend**: All logic runs in the browser
- **localStorage database**: No server-side database needed
- **User-provided API keys**: No secret management burden

### Core Components

| Component | Responsibility | Location |
|-----------|---------------|----------|
| **Progress Manager** | State persistence & restoration | [script.js:54-144](script.js#L54-L144) |
| **Navigation Controller** | Module routing & progression | [script.js:156-250](script.js#L156-L250) |
| **Content Generator** | AI prompt orchestration | [script.js:374-620](script.js#L374-L620) |
| **Discovery Service** | GitHub project/issue search | [github-api.js:46-399](github-api.js#L46-L399) |
| **PR Automation Engine** | End-to-end PR workflow | [script.js:688-866](script.js#L688-L866) |
| **Quiz Validator** | Answer checking & unlocking | [script.js:632-662](script.js#L632-L662) |

### Key Features

- **Progressive Disclosure**: Modules unlock as you progress
- **Fallback Resilience**: Static data when APIs are unavailable
- **Multi-Session Support**: Resume learning anytime
- **6-Step PR Automation**: Fork → Wait → Check → Read → Commit → PR

---

## 🛠️ Development

This project was developed with the assistance of **Claude Code**, an AI pair programming tool from Anthropic. AI was used as a development assistant for:
- Code implementation and debugging
- Documentation generation
- Architecture design decisions
- UI/UX improvements

The combination of human creativity and AI assistance demonstrates modern development practices and rapid prototyping capabilities.

---

## 🤝 Contributing

We welcome contributions! Whether you're fixing bugs, improving documentation, or adding new features, your help makes open source more accessible to everyone.

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📜 Code of Conduct

We are committed to providing a welcoming and inclusive experience for everyone. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🗺️ Roadmap

### Current Features ✅
- 4-module curriculum (60-90 min completion time)
- Gemini AI personalization
- Live GitHub project/issue discovery
- Automated PR submission
- Progress tracking with localStorage
- Collapsible sidebar navigation

### Future Enhancements 🔮
- User accounts and authentication
- Advanced modules (rebasing, code review, etc.)
- Achievement badges and gamification
- Community features (mentor matching, forums)
- Mobile app version
- Multiple language support
- Integrated video tutorials
- Real-time collaboration features

---

## 💡 Use Cases

Perfect for:
- **Complete beginners** wanting to learn open source fundamentals
- **Students** building their GitHub portfolios
- **Career switchers** entering tech through open source
- **Experienced developers** new to open source contribution
- **Educators** teaching collaborative development

---

## 📊 Success Metrics

After completing this platform, users will:
- ✅ Understand core open source concepts
- ✅ Know how to find beginner-friendly issues
- ✅ Execute the complete Git workflow
- ✅ Have a real PR on their GitHub profile
- ✅ Feel confident contributing to open source projects

---

## 🙏 Acknowledgments

Built with:
- **Google Gemini API** for AI-powered personalization
- **GitHub REST API** for live project data and PR automation
- Inspiration from **First Timers Only** and **Good First Issue**

Special thanks to all contributors who make open source accessible!

---


## 🌟 Support

If you find this project helpful:
- ⭐ Star this repository
- 🐛 Report bugs via [GitHub Issues](https://github.com/AnaPcode/Learning-Platform-Project-for-Open-Source-Hackfest/issues)
- 💬 Share your feedback
- 🤝 Contribute improvements
