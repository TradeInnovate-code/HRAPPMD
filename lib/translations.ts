export const translations = {
  en: {
    // Navigation
    nav: {
      dashboard: 'Dashboard',
      audit: 'Audit',
      jobDescriptions: 'Job Descriptions',
      raci: 'RACI',
      library: 'Library',
      results: 'Results',
      settings: 'Settings',
    },
    // Page titles
    titles: {
      dashboard: 'Dashboard',
      audit: 'Organizational Audit',
      jobDescriptions: 'Job Descriptions',
      raci: 'RACI',
      library: 'Document Library',
      results: 'Results',
      settings: 'Settings',
      hri: 'HRI',
    },
    // Top nav
    topNav: {
      toggleDarkMode: 'Toggle dark mode',
      toggleLanguage: 'Toggle language',
      admin: 'Admin',
      logout: 'Logout',
    },
    // Sidebar
    sidebar: {
      collapse: 'Collapse',
    },
    // Audit page
    audit: {
      title: 'Organizational Audit',
      description: "Assess your organization's HR maturity across 5 key domains.",
      startNewAudit: 'Start New Audit',
      noAudits: 'No audits yet',
      noAuditsDescription:
        "Run your first organizational audit to discover your HR maturity score and get actionable recommendations.",
      startYourFirstAudit: 'Start Your First Audit',
    },
  },
  ro: {
    // Navigation
    nav: {
      dashboard: 'Panou de Control',
      audit: 'Audit',
      jobDescriptions: 'Descrieri de Funcții',
      raci: 'RACI',
      library: 'Bibliotecă Documente',
      results: 'Rezultate',
      settings: 'Setări',
    },
    // Page titles
    titles: {
      dashboard: 'Panou de Control',
      audit: 'Audit Organizațional',
      jobDescriptions: 'Descrieri de Funcții',
      raci: 'RACI',
      library: 'Bibliotecă Documente',
      results: 'Rezultate',
      settings: 'Setări',
      hri: 'HRI',
    },
    // Top nav
    topNav: {
      toggleDarkMode: 'Comutați modul întunecat',
      toggleLanguage: 'Comutați limba',
      admin: 'Administrator',
      logout: 'Deconectare',
    },
    // Sidebar
    sidebar: {
      collapse: 'Restrângeți',
    },
    // Audit page
    audit: {
      title: 'Audit Organizațional',
      description: 'Evaluați maturitatea HR a organizației dvs. pe 5 domenii cheie.',
      startNewAudit: 'Inițiați Audit Nou',
      noAudits: 'Niciun audit încă',
      noAuditsDescription:
        'Executați primul audit organizațional pentru a descoperi scorul de maturitate HR și recomandări acționabile.',
      startYourFirstAudit: 'Inițiați Primul Audit',
    },
  },
};

export type Language = 'en' | 'ro';
export type TranslationKey = keyof typeof translations.en;
