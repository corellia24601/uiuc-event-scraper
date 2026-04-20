export interface Source {
  id: number;
  category: string;
  name: string;
  url: string;
  notes: string;
  active: boolean;
}

// active: true  → scraper will fetch this source on every run
// active: false → source is listed but skipped (JS-rendered, dead URL, or blocked)

export const initialSources: Source[] = [

  // ── Central Calendars ────────────────────────────────────────────────────
  { id: 1,  category: "Central Calendars", name: "UIUC General Events Calendar",       url: "https://calendars.illinois.edu/list/7",    notes: "Main campus-wide event feed",           active: true },
  { id: 2,  category: "Central Calendars", name: "UIUC Academic Calendar",             url: "https://calendars.illinois.edu/list/5",    notes: "Academic dates and deadlines",          active: true },
  { id: 3,  category: "Central Calendars", name: "UIUC Advising & Placement Calendar", url: "https://calendars.illinois.edu/list/3",    notes: "Career fairs, internship events",        active: true },
  { id: 4,  category: "Central Calendars", name: "UIUC Student Affairs Calendar",      url: "https://calendars.illinois.edu/list/1771", notes: "Student life events",                   active: true },

  // ── Colleges & Schools ───────────────────────────────────────────────────
  { id: 7,  category: "Colleges & Schools", name: "Grainger College of Engineering",           url: "https://grainger.illinois.edu/calendars/all",    notes: "Engineering events – direct Grainger calendar",         active: true },
  { id: 8,  category: "Colleges & Schools", name: "Gies College of Business",                  url: "https://giesbusiness.illinois.edu/events",       notes: "Business school events",                               active: true },
  { id: 11, category: "Colleges & Schools", name: "College of Education",                      url: "https://education.illinois.edu/about/events",    notes: "Education college events",                             active: true },
  { id: 12, category: "Colleges & Schools", name: "College of Law",                            url: "https://calendars.illinois.edu/list/5714",       notes: "Law school events – via UIUC calendar",                active: true },
  { id: 13, category: "Colleges & Schools", name: "College of Media",                          url: "https://calendars.illinois.edu/list/1102",       notes: "Media college – via UIUC calendar",                    active: true },
  { id: 14, category: "Colleges & Schools", name: "School of Social Work",                     url: "https://calendars.illinois.edu/list/5064",       notes: "Social Work – via UIUC calendar",                      active: true },
  { id: 15, category: "Colleges & Schools", name: "College of Veterinary Medicine",            url: "https://calendars.illinois.edu/list/705",        notes: "Vet Med – via UIUC calendar",                          active: true },
  { id: 16, category: "Colleges & Schools", name: "ACES",                                      url: "https://calendars.illinois.edu/list/5784",       notes: "ACES events – via embedded UIUC calendar",             active: true },
  { id: 17, category: "Colleges & Schools", name: "School of Information Sciences",            url: "https://ischool.illinois.edu/news-events/events/", notes: "iSchool events – scraper fetches 12 months automatically", active: true },
  { id: 18, category: "Colleges & Schools", name: "College of Applied Health Sciences",        url: "https://calendars.illinois.edu/list/1387",       notes: "AHS – via UIUC calendar",                              active: true },
  { id: 9,  category: "Colleges & Schools", name: "College of LAS",                            url: "https://calendars.illinois.edu/list/6324",       notes: "LAS events – via UIUC calendar",                       active: true },
  { id: 28, category: "Colleges & Schools", name: "Illinois Informatics Institute",            url: "https://calendars.illinois.edu/list/8316",       notes: "Informatics events – via embedded UIUC calendar",      active: true },

  // ── Arts & Performance ───────────────────────────────────────────────────
  { id: 10, category: "Arts & Performance", name: "College of Fine & Applied Arts",           url: "https://faa.illinois.edu/about/events",                   notes: "FAA college events",                        active: true },
  { id: 19, category: "Arts & Performance", name: "Krannert Center for the Performing Arts", url: "https://krannertcenter.com/calendar",                      notes: "Theatre, dance, music performances",        active: true },
  { id: 49, category: "Arts & Performance", name: "Illinois School of Music",                url: "https://music.illinois.edu/events/",                       notes: "Performances: orchestras, bands, soloists", active: true },
  { id: 20, category: "Arts & Performance", name: "Krannert Art Museum",                     url: "https://kam.illinois.edu/exhibitions-events/events",       notes: "Browser-rendered Drupal views list",        active: true },
  { id: 21, category: "Arts & Performance", name: "State Farm Center",                       url: "https://www.statefarmcenter.com/events/all",               notes: "Major venue events – static HTML",          active: true },
  { id: 22, category: "Arts & Performance", name: "Spurlock Museum",                         url: "https://www.spurlock.illinois.edu/events/",               notes: "Museum programs and exhibitions",            active: true },

  // ── Libraries ────────────────────────────────────────────────────────────
  { id: 24, category: "Libraries", name: "TLAS Library Events (LibCal)", url: "https://libcal.library.illinois.edu/ical_subscribe.php?src=p&cid=15637", notes: "TLAS library events – iCal feed", active: true },

  // ── Research Centers & Labs ──────────────────────────────────────────────
  { id: 26, category: "Research Centers & Labs", name: "Beckman Institute",                      url: "https://beckman.illinois.edu/visit/events-at-beckman",     notes: "Browser-rendered Angular app",             active: true },
  { id: 27, category: "Research Centers & Labs", name: "NCSA",                                   url: "https://calendars.illinois.edu/list/7097",                  notes: "NCSA events – via UIUC calendar",          active: true },
  { id: 29, category: "Research Centers & Labs", name: "Prairie Research Institute",             url: "https://calendars.illinois.edu/list/6191",                  notes: "Prairie Research – via UIUC calendar",     active: true },
  { id: 30, category: "Research Centers & Labs", name: "Center for Innovation in Teaching & Learning", url: "https://calendars.illinois.edu/list/8416",           notes: "CITL events – via UIUC calendar",          active: true },

  // ── Design & Innovation ──────────────────────────────────────────────────
  { id: 31, category: "Design & Innovation", name: "Siebel Center for Design",  url: "https://calendars.illinois.edu/list/7059", notes: "Siebel events – via embedded UIUC calendar", active: true },
  { id: 33, category: "Design & Innovation", name: "Illinois Research Park",    url: "https://calendars.illinois.edu/list/5115", notes: "IRP events – via UIUC calendar",             active: true },

  // ── Campus Recreation & Wellness ─────────────────────────────────────────
  { id: 34, category: "Campus Recreation & Wellness", name: "Campus Recreation",                    url: "https://calendars.illinois.edu/list/7489",  notes: "Campus rec events – via UIUC calendar",     active: true },
  { id: 36, category: "Campus Recreation & Wellness", name: "McKinley Health Center",               url: "https://calendars.illinois.edu/list/2792",  notes: "McKinley health events – via UIUC calendar", active: true },
  { id: 50, category: "Campus Recreation & Wellness", name: "University Housing – Events Calendar", url: "https://calendars.illinois.edu/list/8091",  notes: "Housing events – UIUC calendar",             active: true },
  { id: 35, category: "Campus Recreation & Wellness", name: "Active Illini Portal",                 url: "https://active.illinois.edu/",              notes: "INACTIVE: registration portal – no static events", active: false },

  // ── Student Life & Cultural Centers ──────────────────────────────────────
  { id: 37, category: "Student Life & Cultural Centers", name: "Illini Union",                               url: "https://calendars.illinois.edu/list/4063", notes: "Illini Union events – via UIUC calendar",  active: true },
  { id: 43, category: "Student Life & Cultural Centers", name: "International Student and Scholar Services", url: "https://calendars.illinois.edu/list/4193", notes: "ISSS events – via UIUC calendar",           active: true },

  // ── Athletics ────────────────────────────────────────────────────────────
  { id: 45, category: "Athletics", name: "Fighting Illini Athletics",  url: "https://fightingillini.com/calendar.ashx/calendar.rss?sport_id=0&_=cmo6n3svw000235bepskusih0", notes: "All sports – Sidearm RSS feed", active: true },
  { id: 46, category: "Athletics", name: "Big Ten Athletics Calendar", url: "https://calendars.illinois.edu/list/6022",                                                       notes: "Big Ten affiliated events – UIUC calendar", active: true },
];

export const CATEGORIES = [...new Set(initialSources.map(s => s.category))];
export const COLORS: Record<string, string> = {
  "Central Calendars":               "bg-blue-100 text-blue-800",
  "Colleges & Schools":              "bg-purple-100 text-purple-800",
  "Arts & Performance":              "bg-pink-100 text-pink-800",
  "Libraries":                       "bg-yellow-100 text-yellow-800",
  "Research Centers & Labs":         "bg-green-100 text-green-800",
  "Design & Innovation":             "bg-orange-100 text-orange-800",
  "Campus Recreation & Wellness":    "bg-teal-100 text-teal-800",
  "Student Life & Cultural Centers": "bg-red-100 text-red-800",
  "Athletics":                       "bg-indigo-100 text-indigo-800",
};
