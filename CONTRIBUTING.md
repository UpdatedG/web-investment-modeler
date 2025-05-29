
# Contributing to r/6nuliai Investment Calculator

Thank you for your interest in contributing to the r/6nuliai Investment Calculator! This document provides guidelines and information for contributors.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:
- Be respectful and inclusive
- Focus on constructive feedback
- Help create a welcoming environment for all contributors

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear description** of the problem
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (browser, OS, etc.)

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- **Clear description** of the proposed feature
- **Use case** and why it would be valuable
- **Possible implementation** approach if you have ideas

### Pull Requests

1. **Fork** the repository
2. **Create a branch** from `main` for your feature/fix
3. **Make your changes** following our coding standards
4. **Test thoroughly** to ensure nothing breaks
5. **Update documentation** if needed
6. **Submit a pull request** with a clear description

### Development Setup

1. Clone your fork:
   ```bash
   git clone https://github.com/your-username/web-investment-modeler.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Coding Standards

### TypeScript
- Use TypeScript for all new code
- Provide proper type definitions
- Avoid `any` types when possible

### React Components
- Use functional components with hooks
- Follow the existing component structure
- Create separate files for each component
- Use proper prop types and interfaces

### Styling
- Use Tailwind CSS for styling
- Follow existing design patterns
- Ensure responsive design
- Use shadcn/ui components when possible

### File Organization
- Keep components small and focused
- Separate business logic from UI components
- Use descriptive file and variable names
- Follow the existing folder structure

### Localization
- Maintain both Lithuanian and English versions
- Create `-en.tsx` versions for English components
- Ensure translations are accurate and consistent

## Calculation Logic

When modifying calculation logic:

- **Maintain accuracy** of financial calculations
- **Add tests** for new calculation methods
- **Document formulas** and data sources
- **Consider edge cases** (zero values, negative numbers, etc.)
- **Preserve backward compatibility** when possible

## Testing

While we don't have automated tests yet, please:

- **Test manually** across different scenarios
- **Verify calculations** with sample data
- **Check both language versions**
- **Test on different screen sizes**
- **Validate in multiple browsers**

## Documentation

- Update README.md for significant changes
- Add comments for complex calculation logic
- Document new props and interfaces
- Update contributing guidelines if needed

## Financial Data and Accuracy

- Use reputable data sources for market information
- Document data sources and assumptions
- Include appropriate disclaimers
- Maintain educational focus of the tool

## Review Process

1. All pull requests require review
2. Focus on code quality, accuracy, and user experience
3. Maintain consistency with existing codebase
4. Ensure proper testing has been done

## Questions?

If you have questions about contributing:
- Open an issue for discussion
- Contact the maintainers
- Check existing documentation

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes for significant contributions
- Special mentions for major features

Thank you for helping improve the r/6nuliai Investment Calculator!
