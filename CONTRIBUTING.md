# Contributing to expo-drawing

Thank you for your interest in contributing to expo-drawing! This document provides guidelines and instructions for contributing to the project.

## 🗺️ Development Roadmap

For a comprehensive guide on the module's architecture and implementation details, please see the [Implementation Guide](.vscode/docs/guide.md).

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)

## Code of Conduct

This project adheres to a code of conduct that fosters an open and welcoming environment. By participating, you are expected to uphold this standard.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Xcode 14+ (for iOS development)
- Android Studio (for Android development)
- CocoaPods (for iOS dependencies)

### Setting Up the Development Environment

1. **Fork and clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/expo-drawing.git
cd expo-drawing
```

2. **Install dependencies**

```bash
npm install
```

3. **Build the module**

```bash
npm run build
```

4. **Run the example app**

iOS:
```bash
cd example
npm install
npx expo prebuild
npx expo run:ios
```

Android:
```bash
cd example
npm install
npx expo prebuild
npx expo run:android
```

## Development Workflow

### Making Changes

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our [coding standards](#coding-standards)

3. Test your changes thoroughly on both iOS and Android

4. Commit your changes with clear, descriptive messages:
   ```bash
   git commit -m "feat: add stroke pressure sensitivity"
   ```

### Commit Message Convention

We follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

## Project Structure

```
expo-drawing/
├── ios/                    # iOS native code (Swift)
│   ├── ExpoDrawingModule.swift
│   └── ExpoDrawingView.swift
├── android/                # Android native code (Kotlin)
│   └── src/main/java/expo/modules/drawing/
│       ├── ExpoDrawingModule.kt
│       └── ExpoDrawingView.kt
├── src/                    # TypeScript/JavaScript code
│   ├── ExpoDrawing.types.ts
│   ├── ExpoDrawingView.tsx
│   └── index.ts
├── example/                # Example app for testing
└── .vscode/docs/          # Implementation documentation
```

## Platform-Specific Development

### iOS Development (PencilKit)

- Native code is in `ios/` directory
- Uses Swift and PencilKit framework
- Test on both simulator and physical devices (especially with Apple Pencil)
- Follow Apple's PencilKit best practices

Key files:
- `ExpoDrawingView.swift` - Main view implementation with PKCanvasView
- `ExpoDrawingModule.swift` - Module definition with props and methods

### Android Development (Ink API)

- Native code is in `android/src/main/java/expo/modules/drawing/`
- Uses Kotlin and Android Ink API (Jetpack)
- Test on both emulator and physical devices (especially with stylus)
- Follow Android Ink API best practices

Key files:
- `ExpoDrawingView.kt` - Main view with InProgressStrokesView
- `ExpoDrawingModule.kt` - Module definition with props and methods

### TypeScript Development

- Source code in `src/` directory
- Type definitions must be comprehensive
- Maintain cross-platform API consistency

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Testing Guidelines

- Write tests for all new features
- Maintain minimum 80% code coverage
- Test on both iOS and Android platforms
- Include edge cases and error scenarios
- Mock native modules appropriately

### Manual Testing

1. Test in the example app on both platforms
2. Verify all props work correctly
3. Test all imperative methods via ref
4. Verify events fire appropriately
5. Test with both finger and stylus input
6. Check memory usage and performance

## Pull Request Process

1. **Before submitting:**
   - Ensure all tests pass: `npm test`
   - Lint your code: `npm run lint`
   - Build successfully: `npm run build`
   - Test on both iOS and Android
   - Update documentation if needed

2. **Submitting the PR:**
   - Use the PR template
   - Link to related issues
   - Provide clear description of changes
   - Include screenshots/videos if UI changes
   - Mark the PR as draft if work in progress

3. **Review process:**
   - Address reviewer feedback promptly
   - Keep PR focused and atomic
   - Maintain clean commit history
   - Ensure CI passes

4. **After approval:**
   - Squash commits if requested
   - Ensure branch is up to date with main

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Provide comprehensive type definitions
- Use meaningful variable names
- Document complex logic with comments
- Follow ESLint configuration

### Swift

- Follow Swift style guide
- Use meaningful variable/function names
- Add documentation comments for public APIs
- Handle errors appropriately
- Use modern Swift features

### Kotlin

- Follow Kotlin coding conventions
- Use meaningful variable/function names
- Add KDoc comments for public APIs
- Handle nullability properly
- Use modern Kotlin features

### General

- Write self-documenting code
- Keep functions small and focused
- Avoid code duplication
- Comment "why" not "what"
- Maintain consistent formatting

## Documentation

When adding new features:

1. Update TypeScript type definitions
2. Add JSDoc/KDoc/Swift doc comments
3. Update README.md if API changes
4. Add examples to example app
5. Update CHANGELOG.md

## Questions?

- Check existing [issues](https://github.com/stewartmoreland/expo-drawing/issues)
- Read the [implementation guide](.vscode/docs/guide.md)
- Start a [discussion](https://github.com/stewartmoreland/expo-drawing/discussions)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to expo-drawing! 🎨✨

