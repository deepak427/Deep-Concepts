---
inclusion: fileMatch
fileMatchPattern: "**/{components,pages,app,styles}/**/*.{tsx,jsx,css,scss}"
---

# DeepConcepts UI Design System - Quantum Computing Theme

## Color Palette

### Quantum Theme Colors
```css
:root {
  /* Primary - Cyan (Quantum, Technology, Energy) */
  --cyan-50: #ecfeff;
  --cyan-100: #cffafe;
  --cyan-200: #a5f3fc;
  --cyan-300: #67e8f9;
  --cyan-400: #22d3ee;
  --cyan-500: #06b6d4;
  --cyan-600: #0891b2;
  --cyan-700: #0e7490;
  --cyan-800: #155e75;
  --cyan-900: #164e63;

  /* Accent - Purple (Mystery, Innovation, Quantum Entanglement) */
  --purple-50: #faf5ff;
  --purple-100: #f3e8ff;
  --purple-200: #e9d5ff;
  --purple-300: #d8b4fe;
  --purple-400: #c084fc;
  --purple-500: #a855f7;
  --purple-600: #9333ea;
  --purple-700: #7e22ce;
  --purple-800: #6b21a8;
  --purple-900: #581c87;

  /* Dark Slate (Background, Professional) */
  --slate-50: #f8fafc;
  --slate-100: #f1f5f9;
  --slate-200: #e2e8f0;
  --slate-300: #cbd5e1;
  --slate-400: #94a3b8;
  --slate-500: #64748b;
  --slate-600: #475569;
  --slate-700: #334155;
  --slate-800: #1e293b;
  --slate-900: #0f172a;
  --slate-950: #020617;
}
```

### Semantic Colors
```css
:root {
  /* Status Colors */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #06b6d4;

  /* Background Colors (Dark Theme) */
  --bg-primary: #020617;
  --bg-secondary: #0f172a;
  --bg-tertiary: #1e293b;
  --bg-elevated: #334155;

  /* Text Colors */
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  --text-muted: #64748b;

  /* Border Colors */
  --border-subtle: #1e293b;
  --border-default: #334155;
  --border-strong: #475569;

  /* Quantum Glow Effects */
  --glow-cyan: 0 0 20px rgba(6, 182, 212, 0.5);
  --glow-purple: 0 0 20px rgba(168, 85, 247, 0.5);
  --glow-gradient: 0 0 30px rgba(6, 182, 212, 0.3), 0 0 60px rgba(168, 85, 247, 0.2);
}
```

## Typography

### Font Families
```css
:root {
  /* Primary Font - Inter (Modern, Professional) */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                  'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  
  /* Heading Font - Poppins (Luxurious, Bold) */
  --font-heading: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
  
  /* Monospace Font - JetBrains Mono (Code) */
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace;
}
```

### Font Sizes (Fluid Typography)
```css
:root {
  /* Base: 16px */
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);      /* 12-14px */
  --text-sm: clamp(0.875rem, 0.825rem + 0.25vw, 1rem);       /* 14-16px */
  --text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);      /* 16-18px */
  --text-lg: clamp(1.125rem, 1.05rem + 0.375vw, 1.25rem);    /* 18-20px */
  --text-xl: clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem);        /* 20-24px */
  --text-2xl: clamp(1.5rem, 1.35rem + 0.75vw, 1.875rem);     /* 24-30px */
  --text-3xl: clamp(1.875rem, 1.65rem + 1.125vw, 2.25rem);   /* 30-36px */
  --text-4xl: clamp(2.25rem, 1.95rem + 1.5vw, 3rem);         /* 36-48px */
  --text-5xl: clamp(3rem, 2.55rem + 2.25vw, 3.75rem);        /* 48-60px */
}
```

### Font Weights
```css
:root {
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
}
```

### Line Heights
```css
:root {
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
}
```

## Spacing System

### Consistent Spacing Scale
```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
  --space-32: 8rem;     /* 128px */
}
```

## Border Radius

### Rounded Corners
```css
:root {
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.375rem;  /* 6px */
  --radius-lg: 0.5rem;    /* 8px */
  --radius-xl: 0.75rem;   /* 12px */
  --radius-2xl: 1rem;     /* 16px */
  --radius-3xl: 1.5rem;   /* 24px */
  --radius-full: 9999px;  /* Fully rounded */
}
```

## Component Patterns

### Button Styles
```css
/* Primary Button - Quantum Glow */
.btn-primary {
  background: linear-gradient(135deg, var(--cyan-600), var(--cyan-700));
  color: white;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--glow-cyan);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--glow-cyan), 0 10px 20px rgba(6, 182, 212, 0.3);
  background: linear-gradient(135deg, var(--cyan-500), var(--cyan-600));
}

/* Secondary Button - Subtle */
.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--bg-elevated);
  border-color: var(--cyan-500);
}
```

### Card Styles
```css
.card {
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  border: 1px solid var(--border-default);
  transition: all 0.3s ease;
}

.card:hover {
  border-color: var(--cyan-500);
  box-shadow: var(--glow-cyan);
  transform: translateY(-2px);
}

.card-quantum {
  background: linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary));
  border: 1px solid var(--cyan-500);
  box-shadow: var(--glow-gradient);
  position: relative;
  overflow: hidden;
}

.card-quantum::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.1), transparent);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  to { left: 100%; }
}
```

### Input Styles
```css
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 2px solid var(--border-light);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-family: var(--font-primary);
  color: var(--text-primary);
  background: var(--bg-primary);
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input::placeholder {
  color: var(--text-tertiary);
}
```

## Animations

### Smooth Transitions
```css
:root {
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
  --transition-slower: 500ms ease;
}

/* Fade In */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Slide In */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Scale In */
@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
```

## Responsive Design

### Breakpoints
```css
:root {
  --breakpoint-sm: 640px;   /* Mobile landscape */
  --breakpoint-md: 768px;   /* Tablet */
  --breakpoint-lg: 1024px;  /* Desktop */
  --breakpoint-xl: 1280px;  /* Large desktop */
  --breakpoint-2xl: 1536px; /* Extra large */
}

/* Usage */
@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }
}
```

### Container Widths
```css
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

@media (min-width: 640px) {
  .container { max-width: 640px; }
}

@media (min-width: 768px) {
  .container { max-width: 768px; }
}

@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}

@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}
```

## Best Practices

### 1. Use CSS Variables
```css
/* ✅ CORRECT */
.button {
  background: var(--primary-600);
  color: var(--text-inverse);
}

/* ❌ WRONG */
.button {
  background: #2563eb;
  color: #ffffff;
}
```

### 2. Consistent Spacing
```css
/* ✅ CORRECT */
.card {
  padding: var(--space-6);
  margin-bottom: var(--space-4);
}

/* ❌ WRONG */
.card {
  padding: 24px;
  margin-bottom: 15px;
}
```

### 3. Smooth Transitions
```css
/* ✅ CORRECT */
.button {
  transition: all var(--transition-base);
}

/* ❌ WRONG */
.button {
  /* No transition */
}
```

### 4. Accessible Colors
- Ensure contrast ratio of at least 4.5:1 for text
- Use semantic colors for status indicators
- Test with color blindness simulators

### 5. Mobile-First Design
```css
/* ✅ CORRECT - Mobile first */
.element {
  font-size: var(--text-base);
}

@media (min-width: 768px) {
  .element {
    font-size: var(--text-lg);
  }
}
```

## Import Fonts

### Google Fonts
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

### Or via CSS
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
```
