# Contributing to Football Squad Builder

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## How to Contribute

### Reporting Bugs
1. Check if the bug has already been reported
2. Open a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser/OS information

### Suggesting Features
1. Check existing feature requests
2. Open a new issue with:
   - Clear description of the feature
   - Use case and benefits
   - Possible implementation approach

### Code Contributions

#### Setup Development Environment
```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/football-squad-builder.git
cd football-squad-builder

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Add your Turso credentials

# Push database schema
npm run db:push

# Start development server
npm run dev
```

#### Making Changes
1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test thoroughly
4. Commit with clear messages: `git commit -m "Add: feature description"`
5. Push to your fork: `git push origin feature/your-feature-name`
6. Open a Pull Request

#### Code Standards
- Use TypeScript strictly
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed
- Test all changes locally

#### Commit Message Format
```
Type: Brief description

Detailed explanation if needed

Types: Add, Update, Fix, Remove, Refactor, Docs
```

### Documentation Contributions
- Fix typos or unclear explanations
- Add examples or clarifications
- Improve setup instructions
- Translate documentation

## Development Guidelines

### File Structure
- Components in `components/`
- API routes in `app/api/`
- Database schema in `db/`
- Utilities in `lib/`
- Documentation in root

### Testing
- Test all CRUD operations
- Test with minimum 11 players
- Test recommendations generation
- Test export functionality
- Test on mobile devices

### Pull Request Process
1. Update README.md if needed
2. Update relevant documentation
3. Ensure all tests pass
4. Request review from maintainers
5. Address review feedback
6. Merge after approval

## Code of Conduct

### Our Standards
- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the project
- Show empathy towards others

### Unacceptable Behavior
- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

## Questions?

Open a GitHub Discussion or contact maintainers.

Thank you for contributing! ⚽🚀
