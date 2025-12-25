# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Office Chores is a React-based chore management application built with TypeScript, Vite, and React Big Calendar. The app allows users to manage recurring chores, team members, and track completion history. All data is stored locally in the browser using localStorage.

## Development Commands

### Start Development Server
```bash
npm run dev
```
Starts Vite dev server with hot module replacement (HMR) at http://localhost:5173

### Build for Production
```bash
npm run build
```
Creates optimized production build in `dist/` directory

### Lint Code
```bash
npm run lint
```
Runs ESLint on all files. The project uses flat ESLint config with React hooks rules.

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing

## Architecture

### State Management
The application uses a centralized state management pattern via Context API:
- **AppContext** (`src/context/AppContext.tsx`) - Root context that combines all hooks and provides unified API
- **Custom Hooks** pattern - Each data domain (chores, team members, history) has its own hook that manages state via localStorage
- **No external state management** - Uses React's built-in useState and Context API only

### Data Flow
1. Custom hooks (`useChores`, `useTeamMembers`, `useHistory`) wrap `useLocalStorage` hook
2. All state changes are automatically persisted to localStorage
3. Cross-tab synchronization is handled by the `useLocalStorage` hook via storage events
4. AppContext composes these hooks and provides derived functionality (e.g., completing a chore also adds history entry)

### Component Organization
```
src/
├── components/
│   ├── calendar/      # Calendar view using react-big-calendar
│   ├── chores/        # Chore management (list, form, card)
│   ├── team/          # Team member management
│   ├── history/       # Completion history
│   └── common/        # Reusable UI components (Button, Modal, Input, etc.)
├── context/           # AppContext - central state provider
├── hooks/             # Custom hooks for data management
│   ├── useChores.ts
│   ├── useTeamMembers.ts
│   ├── useHistory.ts
│   └── useLocalStorage.ts
├── types/             # TypeScript type definitions
├── utils/
│   ├── constants.ts   # App-wide constants, colors, storage keys
│   ├── dateUtils.ts   # Date formatting and manipulation
│   └── recurrence.ts  # Recurring chore logic using date-fns
└── App.tsx            # Main app with tab navigation
```

### Key Design Patterns

**1. Recurrence System**
- Chores can be non-recurring (single due date) or recurring (daily/weekly/monthly with intervals)
- Non-recurring chores are displayed on their `endDate` (due date)
- Recurring chores generate multiple instances from `startDate` to `endDate` using the `generateRecurringInstances` function
- Completions for recurring chores are tracked per-date in a `completions` object keyed by date string
- Non-recurring chores use a simple `isCompleted` boolean

**2. localStorage Pattern**
- All data persists to localStorage with prefixed keys: `choreApp_chores`, `choreApp_members`, `choreApp_history`
- The `useLocalStorage` hook provides a useState-like API with automatic persistence and cross-tab sync
- Each hook returns `[value, setValue, removeValue]` tuple

**3. Soft Delete for Team Members**
- Team members are never hard-deleted (to preserve data integrity for assigned chores)
- Instead, they're marked `isActive: false`
- Active members are filtered via `activeMembers` computed property

### TypeScript Configuration
- Path alias `@/*` maps to `src/*` (configured in tsconfig.json)
- Strict mode enabled with additional checks for unused locals/parameters
- Uses React 19's JSX transform (`"jsx": "react-jsx"`)

### Date Handling
- Uses `date-fns` library for all date operations
- Dates stored as ISO strings (`yyyy-MM-dd` format)
- Timestamps stored as ISO 8601 strings
- Recurrence logic in `utils/recurrence.ts` handles instance generation

### Calendar Integration
- Uses `react-big-calendar` with date-fns localizer
- Events are generated dynamically from chores + recurrence patterns
- Supports month/week/day/agenda views
- Event colors come from assignee color or chore color
- Completed events shown grayed out with strikethrough

## Common Patterns

### Adding New Features
1. Define types in `src/types/index.ts`
2. Create hook if managing new data domain (follow `useChores` pattern)
3. Add to AppContext if exposing to multiple components
4. Create UI components in appropriate `components/` subdirectory
5. Use existing common components (Button, Modal, Input, Select, etc.)

### Working with Chores
- Always check if chore is recurring before marking complete (`chore.recurrence && chore.recurrence.type !== 'none'`)
- Use `isChoreCompleted(chore, date)` to check completion status (handles both recurring and non-recurring)
- When completing a chore, pass the specific date for recurring chores

### ID Generation
- Use `generateId(prefix)` from `utils/constants.ts`
- Prefixes: `'chore'`, `'member'`, `'history'`
- Format: `{prefix}_{timestamp}_{random}`

## Color System
- **Team member colors**: 10 predefined colors in `MEMBER_COLORS` array
- **Chore colors**: 6 colors in `CHORE_COLORS` array
- Colors are automatically assigned round-robin when creating new items
- Used for visual distinction in calendar and lists
