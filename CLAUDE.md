# ChoreApp

Office chore management app with calendar view, team assignments, and recurring task support.

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build**: Vite 7
- **Calendar**: react-big-calendar
- **Dates**: date-fns
- **Storage**: localStorage (no backend)
- **Linting**: ESLint 9

## Commands

```bash
npm run dev      # Start dev server (Vite)
npm run build    # Production build
npm run lint     # ESLint check
npm run preview  # Preview production build
```

## Project Structure

```
src/
├── components/          # UI components by domain
│   ├── calendar/        # CalendarView (react-big-calendar wrapper)
│   ├── chores/          # ChoreList, ChoreCard, ChoreForm
│   ├── common/          # Reusable UI: Button, Input, Modal, Select
│   ├── history/         # Completion history view
│   └── team/            # Team member management
├── context/
│   └── AppContext.tsx   # Root context composing all hooks
├── hooks/               # Custom hooks
│   ├── useChores.ts     # Chore CRUD + completion tracking
│   ├── useTeamMembers.ts
│   ├── useHistory.ts
│   └── useLocalStorage.ts  # Generic localStorage hook
├── types/
│   └── index.ts         # All TypeScript interfaces
├── utils/
│   ├── constants.ts     # Storage keys, colors, ID generation
│   ├── dateUtils.ts     # Date formatting helpers
│   └── recurrence.ts    # Recurring chore instance generation
├── styles/
│   └── variables.css    # CSS custom properties
├── App.tsx              # Main app with tab navigation
└── main.tsx             # Entry point
```

## Key Files

| Purpose | Location |
|---------|----------|
| Data models | `src/types/index.ts` |
| App state & hooks composition | `src/context/AppContext.tsx` |
| Recurrence logic | `src/utils/recurrence.ts` |
| Constants & config | `src/utils/constants.ts` |

## Data Models

- **Chore**: Task with dates, recurrence, assignee, completion tracking
- **TeamMember**: User with name, email, color, avatar
- **HistoryEntry**: Completed chore record

All data stored in localStorage under keys prefixed with `choreApp_`.

## Adding Features or fixing bugs
When you add new features or fix bugs, create a new branch first, then work on the branch for the rest of the session.

### New Component
1. Create `ComponentName.tsx` + `ComponentName.css` in appropriate folder
2. Export from folder's `index.ts`
3. Use components from `components/common/` for UI primitives

### New Data Entity
1. Add interface to `src/types/index.ts`
2. Create `useEntityName.ts` hook using `useLocalStorage`
3. Add to `AppContext` if needed app-wide

### New Hook
1. Follow pattern in `src/hooks/useChores.ts`
2. Use `useLocalStorage` for persistence
3. Return object with state + memoized callbacks

## Additional Documentation

Check these files for detailed patterns:

- `.claude/docs/architectural_patterns.md` - State management, component architecture, data flow patterns
