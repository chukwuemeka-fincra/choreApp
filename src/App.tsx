import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { CalendarView } from './components/calendar';
import { ChoreList } from './components/chores';
import { TeamList } from './components/team';
import { HistoryList } from './components/history';
import './App.css';

const TABS = {
  CALENDAR: 'calendar',
  CHORES: 'chores',
  TEAM: 'team',
  HISTORY: 'history',
} as const;

type TabKey = typeof TABS[keyof typeof TABS];

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabKey>(TABS.CALENDAR);

  const {
    chores,
    addChore,
    updateChore,
    deleteChore,
    completeChore,
    isChoreCompleted,
    getChoreCountForMember,
    activeMembers,
    memberOptions,
    addMember,
    updateMember,
    removeMember,
    getMemberById,
    history,
    clearHistory,
  } = useApp();

  const renderContent = () => {
    switch (activeTab) {
      case TABS.CALENDAR:
        return (
          <CalendarView
            chores={chores}
            members={activeMembers}
            memberOptions={memberOptions}
            onAddChore={addChore}
            onUpdateChore={updateChore}
            onDeleteChore={deleteChore}
            onCompleteChore={completeChore}
            isChoreCompleted={isChoreCompleted}
            getMemberById={getMemberById}
          />
        );
      case TABS.CHORES:
        return (
          <ChoreList
            chores={chores}
            members={activeMembers}
            memberOptions={memberOptions}
            onAddChore={addChore}
            onUpdateChore={updateChore}
            onDeleteChore={deleteChore}
            onCompleteChore={completeChore}
            isChoreCompleted={isChoreCompleted}
            getMemberById={getMemberById}
          />
        );
      case TABS.TEAM:
        return (
          <TeamList
            members={activeMembers}
            onAddMember={addMember}
            onUpdateMember={updateMember}
            onRemoveMember={removeMember}
            getChoreCountForMember={getChoreCountForMember}
          />
        );
      case TABS.HISTORY:
        return (
          <HistoryList
            history={history}
            memberOptions={memberOptions}
            onClearHistory={clearHistory}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Office Chores</h1>
        <nav className="app-nav">
          <button
            className={`nav-tab ${activeTab === TABS.CALENDAR ? 'nav-tab--active' : ''}`}
            onClick={() => setActiveTab(TABS.CALENDAR)}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <line x1="9" y1="2" x2="9" y2="6" />
              <line x1="15" y1="2" x2="15" y2="6" />
            </svg>
            <span>Calendar</span>
          </button>
          <button
            className={`nav-tab ${activeTab === TABS.CHORES ? 'nav-tab--active' : ''}`}
            onClick={() => setActiveTab(TABS.CHORES)}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
            <span>Chores</span>
          </button>
          <button
            className={`nav-tab ${activeTab === TABS.TEAM ? 'nav-tab--active' : ''}`}
            onClick={() => setActiveTab(TABS.TEAM)}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="7" r="4" />
              <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
              <circle cx="19" cy="7" r="3" />
              <path d="M21 21v-2a3 3 0 00-3-3h-1" />
            </svg>
            <span>Team</span>
          </button>
          <button
            className={`nav-tab ${activeTab === TABS.HISTORY ? 'nav-tab--active' : ''}`}
            onClick={() => setActiveTab(TABS.HISTORY)}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
            <span>History</span>
          </button>
        </nav>
      </header>
      <main className="app-main">{renderContent()}</main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
