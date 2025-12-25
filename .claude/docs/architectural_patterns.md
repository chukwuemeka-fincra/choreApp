# Architectural Patterns

## State Management

### Context + Custom Hooks Pattern
The app uses a single `AppContext` that composes multiple domain-specific hooks:
- `src/context/AppContext.tsx:38-97` - Provider composes `useChores`, `useTeamMembers`, `useHistory`
- Each hook manages its own localStorage persistence and exposes CRUD operations
- Context provides a unified API consumed via `useApp()` hook (`src/context/AppContext.tsx:99-105`)

### localStorage Persistence
All data persists via `useLocalStorage` hook (`src/hooks/useLocalStorage.ts:5-64`):
- Generic hook wrapping `useState` with localStorage sync
- Handles cross-tab synchronization via `storage` event listener
- Keys defined in `src/utils/constants.ts:2-7`

## Component Architecture

### Barrel Exports
Each component folder uses `index.ts` for public exports:
- `src/components/common/index.ts` - Shared UI components
- `src/components/chores/index.ts`, `team/index.ts`, etc.

### Component-Colocated Styles
CSS files live alongside their components:
- `ComponentName.tsx` paired with `ComponentName.css`
- BEM-style class naming: `.modal`, `.modal--large`, `.modal-header`

### Props-Down Pattern
Parent components pass handlers down; children never modify state directly:
- `src/App.tsx:42-86` - All handlers passed as props to view components
- View components (CalendarView, ChoreList, etc.) receive data + callbacks

## Data Flow

### Form Data vs Entity Types
Separate types for form input and stored entities:
- `ChoreFormData` (input) vs `Chore` (stored) - `src/types/index.ts:48-57` vs `src/types/index.ts:8-22`
- Hooks transform FormData into full entities with generated fields (id, timestamps)

### Recurring Chores Pattern
Chores support recurrence via instance generation:
- `src/utils/recurrence.ts:21-70` - Generates calendar instances within date range
- Completions tracked per-date in `chore.completions: Record<string, boolean>`

## UI Patterns

### Modal-Based Forms
Forms render inside `Modal` component for create/edit operations:
- `src/components/common/Modal.tsx:14-65` - Handles backdrop, escape key, focus trap
- Used by `ChoreForm`, `TeamMemberForm`

### Controlled Inputs
All form inputs are controlled React components:
- `src/components/common/Input.tsx`, `Select.tsx` - Wrap native elements
- State managed in parent form components

## Constants & Configuration

### Typed Constants
Constants use `as const` for type inference:
- `src/utils/constants.ts:9-15` - `RECURRENCE_TYPES`
- `src/utils/constants.ts:44-49` - `CALENDAR_VIEWS`
- Derived types via `typeof CONST[keyof typeof CONST]`

### ID Generation
Prefixed IDs with timestamp + random suffix:
- `src/utils/constants.ts:52-54` - `generateId('chore')` produces `chore_1703123456789_abc123def`
