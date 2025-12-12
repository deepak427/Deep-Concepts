# Kiro Configuration

This folder contains AI assistant configuration for the DeepConcepts Quantum Computing project.

## Steering Files

Steering files provide context and guidelines to the AI assistant:

- **project-standards.md** - Project overview, tech stack, code style
- **typescript-standards.md** - TypeScript best practices
- **minimal-code-principle.md** - Write less, achieve more
- **readme-maintenance.md** - Guidelines for keeping README updated
- **ui-design-system.md** - Quantum-themed color palette and design tokens
- **ui-component-library.md** - React component patterns
- **ui-ux-best-practices.md** - General UI/UX principles
- **ui-responsive-design.md** - Mobile-first responsive design
- **ui-animation-guidelines.md** - Animation best practices
- **ui-accessibility.md** - WCAG 2.1 AA compliance guidelines

## Hooks

Hooks trigger AI actions automatically or manually:

- **on-save-validate.json** - Check TypeScript errors on save (manual)
- **update-readme.json** - Update README based on project state (manual)

## Usage

Steering files are automatically included based on:
- `inclusion: always` - Always included
- `inclusion: fileMatch` - Included when matching files are in context
- `inclusion: manual` - Included when referenced with `#filename`

Hooks can be:
- Triggered automatically on events (save, message, etc.)
- Run manually from the Kiro UI
- Enabled/disabled as needed
