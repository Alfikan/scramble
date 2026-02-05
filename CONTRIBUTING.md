# Contributing to Scramble

Thank you for your interest in contributing to Scramble! This document provides guidelines and information for contributors.

## 🎯 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Git
- Basic knowledge of React, JavaScript, and Firebase

### Setup Development Environment

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/scramble.git
   cd scramble
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm start
   ```

## 🏗️ Development Workflow

### Branch Naming Convention
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/update-description` - Documentation updates
- `refactor/component-name` - Code refactoring
- `test/test-description` - Adding tests

### Commit Message Convention
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

feat: add AI quiz generation
fix: resolve authentication bug
docs: update README installation steps
style: format code with prettier
refactor: restructure component hierarchy
test: add unit tests for Button component
chore: update dependencies
```

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm test
   npm run lint
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Create a Pull Request**
   - Use a clear, descriptive title
   - Provide detailed description of changes
   - Link related issues
   - Add screenshots for UI changes

## 📝 Code Style Guidelines

### JavaScript/React
- Use functional components with hooks
- Use arrow functions for component definitions
- Destructure props and state
- Use meaningful variable and function names
- Keep components small and focused
- Use TypeScript when possible

### CSS/Styling
- Use Tailwind CSS utility classes
- Follow the design system colors and spacing
- Use CSS custom properties for theme values
- Ensure responsive design (mobile-first)
- Maintain accessibility standards

### File Organization
```
src/
├── components/
│   ├── common/          # Reusable components
│   ├── auth/           # Authentication components
│   └── [feature]/      # Feature-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── contexts/           # React contexts
├── services/           # API and external services
├── utils/              # Helper functions
└── styles/             # Global styles
```

## 🧪 Testing Guidelines

### Unit Tests
- Write tests for all utility functions
- Test component behavior, not implementation
- Use React Testing Library for component tests
- Aim for >70% code coverage

### Integration Tests
- Test user workflows
- Test API integrations
- Test authentication flows

### E2E Tests
- Test critical user journeys
- Test across different browsers
- Test responsive behavior

## 🎨 Design Guidelines

### UI/UX Principles
- Follow the established design system
- Ensure accessibility (WCAG AA compliance)
- Design for mobile-first
- Use consistent spacing and typography
- Provide clear feedback for user actions

### Component Design
- Create reusable, composable components
- Use consistent prop naming
- Provide default props where appropriate
- Document component APIs

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the bug
3. **Expected behavior** vs actual behavior
4. **Screenshots** or videos if applicable
5. **Environment details** (browser, OS, device)
6. **Console errors** if any

Use the bug report template when creating issues.

## 💡 Feature Requests

When requesting features:

1. **Describe the problem** you're trying to solve
2. **Explain your proposed solution**
3. **Consider alternative solutions**
4. **Provide mockups** or examples if helpful
5. **Explain the impact** on users

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for functions and components
- Document complex algorithms or business logic
- Keep README files up to date
- Document API endpoints and data structures

### User Documentation
- Update user guides for new features
- Create tutorials for complex workflows
- Maintain FAQ and troubleshooting guides

## 🔒 Security Guidelines

- Never commit sensitive information (API keys, passwords)
- Use environment variables for configuration
- Validate all user inputs
- Follow security best practices for authentication
- Report security vulnerabilities privately

## 🚀 Release Process

### Version Numbering
We follow [Semantic Versioning](https://semver.org/):
- `MAJOR.MINOR.PATCH`
- Major: Breaking changes
- Minor: New features (backward compatible)
- Patch: Bug fixes (backward compatible)

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Version number bumped
- [ ] Changelog updated
- [ ] Security review completed
- [ ] Performance testing done

## 🤝 Code of Conduct

### Our Standards
- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences
- Show empathy towards other community members

### Unacceptable Behavior
- Harassment or discrimination
- Trolling or insulting comments
- Personal attacks
- Publishing private information
- Spam or off-topic content

## 📞 Getting Help

- **Discord**: Join our [Discord community](https://discord.gg/scramble)
- **GitHub Issues**: For bug reports and feature requests
- **Email**: Contact maintainers at dev@scramble.app
- **Documentation**: Check our [docs site](https://docs.scramble.app)

## 🏆 Recognition

Contributors will be recognized in:
- README contributors section
- Release notes
- Annual contributor highlights
- Special badges and swag for significant contributions

## 📄 License

By contributing to Scramble, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Scramble! Together, we're building the future of collaborative learning. 🎓✨