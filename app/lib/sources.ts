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
  // All use the calendars.illinois.edu system — fully scrapable.
  { id: 1,  category: "Central Calendars", name: "UIUC General Events Calendar",       url: "https://calendars.illinois.edu/list/7",    notes: "Main campus-wide event feed",           active: true },
  { id: 2,  category: "Central Calendars", name: "UIUC Academic Calendar",             url: "https://calendars.illinois.edu/list/5",    notes: "Academic dates and deadlines",          active: true },
  { id: 3,  category: "Central Calendars", name: "UIUC Advising & Placement Calendar", url: "https://calendars.illinois.edu/list/3",    notes: "Career fairs, internship events",        active: true },
  { id: 4,  category: "Central Calendars", name: "UIUC Student Affairs Calendar",      url: "https://calendars.illinois.edu/list/1771", notes: "Student life events",                   active: true },
  // id:5 removed — illinois.edu/calendar/list/7 is identical to calendars.illinois.edu/list/7 (id:1); keeping only the canonical URL to avoid duplicate events

  // ── Colleges & Schools ───────────────────────────────────────────────────
  { id: 6,  category: "Colleges & Schools", name: "Grainger College of Engineering",           url: "https://calendars.illinois.edu/list/2568",  notes: "All engineering college events – UIUC calendar",        active: true },
  { id: 8,  category: "Colleges & Schools", name: "Gies College of Business",                  url: "https://giesbusiness.illinois.edu/events",  notes: "Business school events",                               active: true },
  { id: 11, category: "Colleges & Schools", name: "College of Education",                      url: "https://education.illinois.edu/about/events", notes: "Education college events",                           active: true },
  // Updated to use embedded calendars.illinois.edu feeds (direct sites return 404):
  { id: 13, category: "Colleges & Schools", name: "College of Media",                          url: "https://calendars.illinois.edu/list/1102", notes: "Media college – via UIUC calendar",                     active: true },
  { id: 14, category: "Colleges & Schools", name: "School of Social Work",                     url: "https://calendars.illinois.edu/list/5064", notes: "Social Work – via UIUC calendar",                       active: true },
  { id: 15, category: "Colleges & Schools", name: "College of Veterinary Medicine",            url: "https://calendars.illinois.edu/list/705",  notes: "Vet Med – via UIUC calendar",                           active: true },
  { id: 18, category: "Colleges & Schools", name: "College of Applied Health Sciences",        url: "https://calendars.illinois.edu/list/1387", notes: "AHS – via UIUC calendar",                               active: true },
  // Inactive – JS-rendered or returning errors at time of last check:
  { id: 7,  category: "Colleges & Schools", name: "Grainger Student Engagement",               url: "https://students.grainger.illinois.edu/events",     notes: "INACTIVE: connection refused (private CampusGroups portal)", active: false },
  { id: 9,  category: "Colleges & Schools", name: "College of LAS",                            url: "https://calendars.illinois.edu/list/6324",          notes: "LAS events – via UIUC calendar",                         active: true },
  { id: 12, category: "Colleges & Schools", name: "College of Law",                            url: "https://law.illinois.edu/events",                    notes: "INACTIVE: URL returns 404",                              active: false },
  { id: 16, category: "Colleges & Schools", name: "ACES",                                      url: "https://aces.illinois.edu/news-events/events",       notes: "INACTIVE: events loaded via JavaScript",                 active: false },
  { id: 17, category: "Colleges & Schools", name: "School of Information Sciences",            url: "https://ischool.illinois.edu/news-events/events",    notes: "INACTIVE: no events in static HTML",                     active: false },

  // ── Arts & Performance ───────────────────────────────────────────────────
  { id: 10, category: "Arts & Performance", name: "College of Fine & Applied Arts",           url: "https://faa.illinois.edu/about/events",       notes: "FAA college events",                        active: true },
  { id: 19, category: "Arts & Performance", name: "Krannert Center for the Performing Arts", url: "https://krannertcenter.com/calendar",          notes: "Theatre, dance, music performances",        active: true },
  { id: 49, category: "Arts & Performance", name: "Illinois School of Music",                url: "https://music.illinois.edu/events/",           notes: "Performances: orchestras, bands, soloists", active: true },
  { id: 20, category: "Arts & Performance", name: "Krannert Art Museum",                     url: "https://kam.illinois.edu/exhibitions-events/events", notes: "INACTIVE: events loaded via JavaScript",  active: false },
  { id: 21, category: "Arts & Performance", name: "State Farm Center",                       url: "https://www.statefarmcenter.com/events",       notes: "INACTIVE: Angular app – requires JS",       active: false },
  { id: 22, category: "Arts & Performance", name: "Spurlock Museum",                         url: "https://spurlock.illinois.edu/programs/index.html", notes: "INACTIVE: URL returns 404",              active: false },

  // ── Libraries ────────────────────────────────────────────────────────────
  { id: 23, category: "Libraries", name: "University Library Events (LibCal)",  url: "https://uiuc.libcal.com/calendar/events",    notes: "INACTIVE: URL returns 404",                         active: false },
  { id: 24, category: "Libraries", name: "TLAS Library Events (LibCal)",        url: "https://uiuc.libcal.com/calendar/tlasevents", notes: "INACTIVE: events rendered by JavaScript",          active: false },
  { id: 25, category: "Libraries", name: "Grainger Engineering Library",        url: "https://library.illinois.edu/enx/events/",   notes: "INACTIVE: URL returns 404",                         active: false },

  // ── Research Centers & Labs ──────────────────────────────────────────────
  { id: 27, category: "Research Centers & Labs", name: "NCSA",                                   url: "https://calendars.illinois.edu/list/7097", notes: "NCSA events – via UIUC calendar",          active: true },
  { id: 29, category: "Research Centers & Labs", name: "Prairie Research Institute",             url: "https://calendars.illinois.edu/list/6191", notes: "Prairie Research – via UIUC calendar",     active: true },
  { id: 30, category: "Research Centers & Labs", name: "Center for Innovation in Teaching & Learning", url: "https://calendars.illinois.edu/list/8416", notes: "CITL events – via UIUC calendar",     active: true },
  { id: 26, category: "Research Centers & Labs", name: "Beckman Institute",                      url: "https://beckman.illinois.edu/visit/events-at-beckman", notes: "INACTIVE: Angular app – requires JS",  active: false },
  { id: 28, category: "Research Centers & Labs", name: "Illinois Informatics Institute",         url: "https://informatics.illinois.edu/events",              notes: "INACTIVE: Angular app – requires JS",  active: false },

  // ── Design & Innovation ──────────────────────────────────────────────────
  { id: 31, category: "Design & Innovation", name: "Siebel Center for Design",  url: "https://designcenter.illinois.edu/events",              notes: "INACTIVE: Angular app – requires JS",  active: false },
  { id: 32, category: "Design & Innovation", name: "EnterpriseWorks",           url: "https://researchpark.illinois.edu/enterpriseworks/events/", notes: "INACTIVE: server returns 403",        active: false },
  { id: 33, category: "Design & Innovation", name: "Illinois Research Park",    url: "https://researchpark.illinois.edu/events/",             notes: "INACTIVE: server returns 403",         active: false },

  // ── Campus Recreation & Wellness ─────────────────────────────────────────
  { id: 50, category: "Campus Recreation & Wellness", name: "University Housing – Events Calendar", url: "https://calendars.illinois.edu/list/8091", notes: "Housing events – UIUC calendar", active: true },
  { id: 36, category: "Campus Recreation & Wellness", name: "McKinley Health Center", url: "https://calendars.illinois.edu/list/2792", notes: "McKinley health events – via UIUC calendar", active: true },
  { id: 34, category: "Campus Recreation & Wellness", name: "Campus Recreation",    url: "https://calendars.illinois.edu/list/7489",  notes: "Campus rec events – via UIUC calendar",     active: true },
  { id: 35, category: "Campus Recreation & Wellness", name: "Active Illini Portal", url: "https://active.illinois.edu/",              notes: "INACTIVE: registration portal – no static events", active: false },

  // ── Student Life & Cultural Centers ──────────────────────────────────────
  { id: 37, category: "Student Life & Cultural Centers", name: "Illini Union",                               url: "https://calendars.illinois.edu/list/4063",                   notes: "Illini Union events – via UIUC calendar", active: true },
  { id: 38, category: "Student Life & Cultural Centers", name: "Asian American Cultural Center",             url: "https://asianamericanculturalcenter.illinois.edu/events",     notes: "INACTIVE: connection error",           active: false },
  { id: 39, category: "Student Life & Cultural Centers", name: "Bruce D. Nesbitt African American Cultural Center", url: "https://afroam.illinois.edu/events",               notes: "INACTIVE: connection error",           active: false },
  { id: 40, category: "Student Life & Cultural Centers", name: "La Casa Cultural Latina",                    url: "https://lacasa.illinois.edu/events",                          notes: "INACTIVE: no structured event listing", active: false },
  { id: 41, category: "Student Life & Cultural Centers", name: "Women's Resources Center",                   url: "https://wrc.illinois.edu/events",                             notes: "INACTIVE: Angular app – requires JS",  active: false },
  { id: 42, category: "Student Life & Cultural Centers", name: "Gender & Sexuality Resource Center",         url: "https://gsrc.illinois.edu/events",                            notes: "INACTIVE: Angular app – requires JS",  active: false },
  { id: 43, category: "Student Life & Cultural Centers", name: "International Student and Scholar Services", url: "https://isss.illinois.edu/events",                            notes: "INACTIVE: URL returns 404",            active: false },
  { id: 44, category: "Student Life & Cultural Centers", name: "Illinois Student Government",                url: "https://isg.illinois.edu/events",                             notes: "INACTIVE: Angular app – requires JS",  active: false },

  // ── Athletics ────────────────────────────────────────────────────────────
  { id: 46, category: "Athletics", name: "Big Ten Athletics Calendar",   url: "https://calendars.illinois.edu/list/6022", notes: "Big Ten affiliated events – UIUC calendar", active: true },
  { id: 45, category: "Athletics", name: "Fighting Illini Athletics",    url: "https://fightingillini.com/calendar",      notes: "INACTIVE: JavaScript-rendered (KnockoutJS)", active: false },
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
