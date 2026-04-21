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

  // ── Colleges & Schools (additional depts) ────────────────────────────────
  { id: 51, category: "Colleges & Schools", name: "ECE – Electrical & Computer Engineering", url: "https://calendars.illinois.edu/list/172",  notes: "ECE dept events – UIUC calendar",         active: true },
  { id: 52, category: "Colleges & Schools", name: "MechSE Master Calendar",                  url: "https://calendars.illinois.edu/list/3200", notes: "Mechanical Science & Engineering – UIUC calendar", active: true },
  { id: 53, category: "Colleges & Schools", name: "Aerospace Engineering Seminars",          url: "https://calendars.illinois.edu/list/3087", notes: "AE dept seminars – UIUC calendar",        active: true },
  { id: 54, category: "Colleges & Schools", name: "Department of Mathematics",               url: "https://calendars.illinois.edu/list/7421", notes: "Math dept master calendar – UIUC calendar", active: true },
  { id: 55, category: "Colleges & Schools", name: "Illinois School of Architecture",         url: "https://calendars.illinois.edu/list/7118", notes: "Architecture lectures & events – UIUC calendar", active: true },
  { id: 56, category: "Colleges & Schools", name: "Carle Illinois College of Medicine",      url: "https://calendars.illinois.edu/list/5988", notes: "Medical college events – UIUC calendar",  active: true },

  // ── Arts & Performance (additional venues) ───────────────────────────────
  { id: 57, category: "Arts & Performance", name: "Campus Performances (Aggregate)",         url: "https://calendars.illinois.edu/list/597",  notes: "Campus-wide performances aggregate – UIUC calendar", active: true },
  { id: 58, category: "Arts & Performance", name: "Foellinger Auditorium Events",            url: "https://calendars.illinois.edu/list/128",  notes: "Major lecture hall & concert venue – UIUC calendar", active: true },
  { id: 59, category: "Arts & Performance", name: "All Theater Events (Foellinger + Lincoln + Greg)", url: "https://calendars.illinois.edu/list/133", notes: "Aggregate of all campus theaters – UIUC calendar", active: true },

  // ── Research Centers & Labs (additional) ─────────────────────────────────
  { id: 60, category: "Research Centers & Labs", name: "Carl R. Woese Institute for Genomic Biology", url: "https://calendars.illinois.edu/list/1604", notes: "IGB events – UIUC calendar",             active: true },
  { id: 61, category: "Research Centers & Labs", name: "Cancer Center Events",               url: "https://calendars.illinois.edu/list/3802", notes: "Carle Illinois Cancer Center – UIUC calendar", active: true },
  { id: 62, category: "Research Centers & Labs", name: "SkAI Institute Events",              url: "https://calendars.illinois.edu/list/8221", notes: "AI/ML institute events – UIUC calendar",  active: true },
  { id: 63, category: "Research Centers & Labs", name: "iSEE Sustainability Calendar",       url: "https://calendars.illinois.edu/list/6831", notes: "Institute for Sustainability, Energy & Environment – UIUC calendar", active: true },

  // ── Design & Innovation (additional) ─────────────────────────────────────
  { id: 64, category: "Design & Innovation", name: "Illinois Entrepreneurship Master Calendar", url: "https://calendars.illinois.edu/list/6327", notes: "Entrepreneurship events – UIUC calendar", active: true },

  // ── Student Life & Cultural Centers (additional) ─────────────────────────
  { id: 65, category: "Student Life & Cultural Centers", name: "Cultural & International Events (Aggregate)", url: "https://calendars.illinois.edu/list/596",  notes: "Campus-wide cultural & international events – UIUC calendar", active: true },
  { id: 66, category: "Student Life & Cultural Centers", name: "MENA Cultural Center Events",                url: "https://calendars.illinois.edu/list/7612", notes: "Middle Eastern & North African Cultural Center – UIUC calendar", active: true },

  // ── Graduate & Academic Support ───────────────────────────────────────────
  { id: 67, category: "Graduate & Academic Support", name: "Graduate College Events",        url: "https://calendars.illinois.edu/list/3257", notes: "Events for graduate students & postdocs – UIUC calendar", active: true },
  { id: 68, category: "Graduate & Academic Support", name: "Campus Speakers Series",         url: "https://calendars.illinois.edu/list/598",  notes: "Campus-wide speakers & lectures – UIUC calendar", active: true },
  // ── Auto-added from active_calendars.txt ────────────────────────────────

  // ── Libraries ──
  { id: 69, category: "Libraries", name: "Library Calendar", url: "https://calendars.illinois.edu/list/47", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 70, category: "Research Centers & Labs", name: "Center for Global Studies", url: "https://calendars.illinois.edu/list/45", notes: "via UIUC calendar", active: true },

  // ── Campus Recreation & Wellness ──
  { id: 71, category: "Campus Recreation & Wellness", name: "University Housing", url: "https://calendars.illinois.edu/list/60", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 72, category: "Other UIUC Calendars", name: "MBA Club Room", url: "https://calendars.illinois.edu/list/97", notes: "via UIUC calendar", active: true },
  { id: 73, category: "Other UIUC Calendars", name: "Seminars of Interest", url: "https://calendars.illinois.edu/list/81", notes: "via UIUC calendar", active: true },
  { id: 74, category: "Other UIUC Calendars", name: "IEI and Campus Master", url: "https://calendars.illinois.edu/list/93", notes: "via UIUC calendar", active: true },

  // ── Campus Recreation & Wellness ──
  { id: 75, category: "Campus Recreation & Wellness", name: "McKinley Health Center", url: "https://calendars.illinois.edu/list/44", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 76, category: "Other UIUC Calendars", name: "UIUC All Campus Calendar", url: "https://calendars.illinois.edu/list/108", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 77, category: "Research Centers & Labs", name: "Beckman Institute Calendar (internal events only)", url: "https://calendars.illinois.edu/list/117", notes: "via UIUC calendar", active: true },
  { id: 78, category: "Research Centers & Labs", name: "Materials Research Laboratory", url: "https://calendars.illinois.edu/list/79", notes: "via UIUC calendar", active: true },

  // ── Arts & Performance ──
  { id: 79, category: "Arts & Performance", name: "Exhibits", url: "https://calendars.illinois.edu/list/62", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 80, category: "Other UIUC Calendars", name: "Medieval Studies", url: "https://calendars.illinois.edu/list/271", notes: "via UIUC calendar", active: true },
  { id: 81, category: "Other UIUC Calendars", name: "SLAVIC Calendar", url: "https://calendars.illinois.edu/list/210", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 82, category: "Colleges & Schools", name: "Department of Sociology", url: "https://calendars.illinois.edu/list/169", notes: "via UIUC calendar", active: true },
  { id: 83, category: "Colleges & Schools", name: "Chemical & Biomolecular Engineering - Seminars and Events", url: "https://calendars.illinois.edu/list/291", notes: "via UIUC calendar", active: true },
  { id: 84, category: "Colleges & Schools", name: "Chemistry - Physical Chemistry Seminars", url: "https://calendars.illinois.edu/list/458", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 85, category: "Student Life & Cultural Centers", name: "International Programs Calendar", url: "https://calendars.illinois.edu/list/556", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 86, category: "Colleges & Schools", name: "Chemistry - Analytical Chemistry Seminars", url: "https://calendars.illinois.edu/list/522", notes: "via UIUC calendar", active: true },
  { id: 87, category: "Colleges & Schools", name: "Chemistry - Chemical Biology Seminars", url: "https://calendars.illinois.edu/list/463", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 88, category: "Student Life & Cultural Centers", name: "Bruce D. Nesbitt African American Cultural Center", url: "https://calendars.illinois.edu/list/531", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 89, category: "Colleges & Schools", name: "Chemistry - Inorganic/Materials Chemistry Seminars", url: "https://calendars.illinois.edu/list/484", notes: "via UIUC calendar", active: true },

  // ── Graduate & Academic Support ──
  { id: 90, category: "Graduate & Academic Support", name: "Career Services Council", url: "https://calendars.illinois.edu/list/516", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 91, category: "Colleges & Schools", name: "Chemistry - Organic Chemistry Seminars", url: "https://calendars.illinois.edu/list/513", notes: "via UIUC calendar", active: true },
  { id: 92, category: "Colleges & Schools", name: "Business - PTMBA", url: "https://calendars.illinois.edu/list/438", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 93, category: "Other UIUC Calendars", name: "Holidays", url: "https://calendars.illinois.edu/list/468", notes: "via UIUC calendar", active: true },
  { id: 94, category: "Other UIUC Calendars", name: "Academic Dates", url: "https://calendars.illinois.edu/list/557", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 95, category: "Research Centers & Labs", name: "Information Trust Institute (ITI) Calendar", url: "https://calendars.illinois.edu/list/442", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 96, category: "Student Life & Cultural Centers", name: "Education Student Academic Affairs Office Complete Calendar", url: "https://calendars.illinois.edu/list/417", notes: "via UIUC calendar", active: true },

  // ── Campus Recreation & Wellness ──
  { id: 97, category: "Campus Recreation & Wellness", name: "McKinley Health Center - Health Education", url: "https://calendars.illinois.edu/list/363", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 98, category: "Other UIUC Calendars", name: "Listening opportunites on campus", url: "https://calendars.illinois.edu/list/461", notes: "via UIUC calendar", active: true },
  { id: 99, category: "Other UIUC Calendars", name: "Advising & Placement", url: "https://calendars.illinois.edu/list/594", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 100, category: "Student Life & Cultural Centers", name: "Gender & Women's Studies", url: "https://calendars.illinois.edu/list/603", notes: "via UIUC calendar", active: true },
  { id: 101, category: "Student Life & Cultural Centers", name: "ACDIS: Arms Control & Domestic and International Security", url: "https://calendars.illinois.edu/list/681", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 102, category: "Other UIUC Calendars", name: "MCB Event Calendar", url: "https://calendars.illinois.edu/list/601", notes: "via UIUC calendar", active: true },

  // ── Campus Recreation & Wellness ──
  { id: 103, category: "Campus Recreation & Wellness", name: "Recreation, Health & Wellness", url: "https://calendars.illinois.edu/list/637", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 104, category: "Other UIUC Calendars", name: "Astronomy Colloquium Speaker Calendar", url: "https://calendars.illinois.edu/list/650", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 105, category: "Student Life & Cultural Centers", name: "Russian, E. European & Eurasian Center: Speakers", url: "https://calendars.illinois.edu/list/698", notes: "via UIUC calendar", active: true },

  // ── Arts & Performance ──
  { id: 106, category: "Arts & Performance", name: "Spurlock Museum - Master (SM Only)", url: "https://calendars.illinois.edu/list/711", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 107, category: "Colleges & Schools", name: "Anthropology Department Calendar", url: "https://calendars.illinois.edu/list/704", notes: "via UIUC calendar", active: true },
  { id: 108, category: "Colleges & Schools", name: "Educational Psychology Calendar", url: "https://calendars.illinois.edu/list/616", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 109, category: "Student Life & Cultural Centers", name: "Office of the Dean of Students", url: "https://calendars.illinois.edu/list/628", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 110, category: "Other UIUC Calendars", name: "Astronomy Department Calendar", url: "https://calendars.illinois.edu/list/701", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 111, category: "Research Centers & Labs", name: "Center for Global Studies: Events", url: "https://calendars.illinois.edu/list/732", notes: "via UIUC calendar", active: true },
  { id: 112, category: "Research Centers & Labs", name: "Center for Latin American and Caribbean Studies (CLACS)", url: "https://calendars.illinois.edu/list/863", notes: "via UIUC calendar", active: true },

  // ── Campus Recreation & Wellness ──
  { id: 113, category: "Campus Recreation & Wellness", name: "Housing", url: "https://calendars.illinois.edu/list/783", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 114, category: "Colleges & Schools", name: "History Department Public Events", url: "https://calendars.illinois.edu/list/752", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 115, category: "Other UIUC Calendars", name: "INHS Events", url: "https://calendars.illinois.edu/list/844", notes: "via UIUC calendar", active: true },
  { id: 116, category: "Other UIUC Calendars", name: "Human & Community Development", url: "https://calendars.illinois.edu/list/798", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 117, category: "Student Life & Cultural Centers", name: "Center for the Study of Global Gender Equity", url: "https://calendars.illinois.edu/list/866", notes: "via UIUC calendar", active: true },
  { id: 118, category: "Student Life & Cultural Centers", name: "Office of Minority Student Affairs Calendar", url: "https://calendars.illinois.edu/list/754", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 119, category: "Other UIUC Calendars", name: "Unit One DEV", url: "https://calendars.illinois.edu/list/840", notes: "via UIUC calendar", active: true },
  { id: 120, category: "Other UIUC Calendars", name: "Army ROTC", url: "https://calendars.illinois.edu/list/826", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 121, category: "Student Life & Cultural Centers", name: "Center for South Asian and Middle Eastern Studies", url: "https://calendars.illinois.edu/list/779", notes: "via UIUC calendar", active: true },
  { id: 122, category: "Student Life & Cultural Centers", name: "Lesbian, Gay, Bisexual, & Transgender Ally Network", url: "https://calendars.illinois.edu/list/782", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 123, category: "Other UIUC Calendars", name: "Unit One", url: "https://calendars.illinois.edu/list/805", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 124, category: "Student Life & Cultural Centers", name: "Campus International Events", url: "https://calendars.illinois.edu/list/852", notes: "via UIUC calendar", active: true },
  { id: 125, category: "Student Life & Cultural Centers", name: "Center for East Asian & Pacific Studies", url: "https://calendars.illinois.edu/list/904", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 126, category: "Colleges & Schools", name: "Biochemistry Department", url: "https://calendars.illinois.edu/list/934", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 127, category: "Other UIUC Calendars", name: "Armenian Genocide Commemoration", url: "https://calendars.illinois.edu/list/892", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 128, category: "Colleges & Schools", name: "Engineering Seminar", url: "https://calendars.illinois.edu/list/901", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 129, category: "Other UIUC Calendars", name: "Turkish Minister's Visit", url: "https://calendars.illinois.edu/list/873", notes: "via UIUC calendar", active: true },
  { id: 130, category: "Other UIUC Calendars", name: "Neuroscience Program", url: "https://calendars.illinois.edu/list/964", notes: "via UIUC calendar", active: true },
  { id: 131, category: "Other UIUC Calendars", name: "Illinois Campus Calendar: Special Events event calendar", url: "https://calendars.illinois.edu/list/893", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 132, category: "Student Life & Cultural Centers", name: "Russian, E. European & Eurasian Center: Co-sponsored Events", url: "https://calendars.illinois.edu/list/875", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 133, category: "Other UIUC Calendars", name: "University Apartment Community Calendar", url: "https://calendars.illinois.edu/list/954", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 134, category: "Colleges & Schools", name: "Department of Linguistics Calendar", url: "https://calendars.illinois.edu/list/879", notes: "via UIUC calendar", active: true },
  { id: 135, category: "Colleges & Schools", name: "School of Social Work Calendar", url: "https://calendars.illinois.edu/list/935", notes: "via UIUC calendar", active: true },
  { id: 136, category: "Colleges & Schools", name: "Cell and Developmental Biology (CDB) Department", url: "https://calendars.illinois.edu/list/936", notes: "via UIUC calendar", active: true },
  { id: 137, category: "Colleges & Schools", name: "Business - All Events", url: "https://calendars.illinois.edu/list/891", notes: "via UIUC calendar", active: true },
  { id: 138, category: "Colleges & Schools", name: "GPO College of Engineering", url: "https://calendars.illinois.edu/list/953", notes: "via UIUC calendar", active: true },
  { id: 139, category: "Colleges & Schools", name: "Microbiology Department", url: "https://calendars.illinois.edu/list/937", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 140, category: "Other UIUC Calendars", name: "Molecular and Integrative Physiology (MIP) Department", url: "https://calendars.illinois.edu/list/938", notes: "via UIUC calendar", active: true },
  { id: 141, category: "Other UIUC Calendars", name: "Secretariat", url: "https://calendars.illinois.edu/list/949", notes: "via UIUC calendar", active: true },
  { id: 142, category: "Other UIUC Calendars", name: "College of Fine and Applied Arts", url: "https://calendars.illinois.edu/list/878", notes: "via UIUC calendar", active: true },
  { id: 143, category: "Other UIUC Calendars", name: "Academic", url: "https://calendars.illinois.edu/list/926", notes: "via UIUC calendar", active: true },
  { id: 144, category: "Other UIUC Calendars", name: "Maggie's Day Planner", url: "https://calendars.illinois.edu/list/958", notes: "via UIUC calendar", active: true },

  // ── Athletics ──
  { id: 145, category: "Athletics", name: "Dancing Illini", url: "https://calendars.illinois.edu/list/945", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 146, category: "Student Life & Cultural Centers", name: "Indonesian Students Club", url: "https://calendars.illinois.edu/list/874", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 147, category: "Other UIUC Calendars", name: "Provost's Test", url: "https://calendars.illinois.edu/list/903", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 148, category: "Student Life & Cultural Centers", name: "Cell and Developmental Biology (CDB) Student & Postdoc Seminars", url: "https://calendars.illinois.edu/list/975", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 149, category: "Other UIUC Calendars", name: "Molecular and Integrative Physiology (MIP) Department Seminar Series", url: "https://calendars.illinois.edu/list/971", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 150, category: "Colleges & Schools", name: "Biochemistry Department Graduate Seminars", url: "https://calendars.illinois.edu/list/984", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 151, category: "Other UIUC Calendars", name: "Siebel School Corporate", url: "https://calendars.illinois.edu/list/1002", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 152, category: "Colleges & Schools", name: "Cell and Developmental Biology (CDB) Departmental Seminars", url: "https://calendars.illinois.edu/list/974", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 153, category: "Research Centers & Labs", name: "Entrepreneurship Portal", url: "https://calendars.illinois.edu/list/1064", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 154, category: "Colleges & Schools", name: "MCB Seminars-School of Molecular and Cellular Biology Seminars", url: "https://calendars.illinois.edu/list/1006", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 155, category: "Other UIUC Calendars", name: "TEC Calendar", url: "https://calendars.illinois.edu/list/976", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 156, category: "Colleges & Schools", name: "Biochemistry Department Journal Club", url: "https://calendars.illinois.edu/list/991", notes: "via UIUC calendar", active: true },
  { id: 157, category: "Colleges & Schools", name: "Biochemistry Department Seminars", url: "https://calendars.illinois.edu/list/983", notes: "via UIUC calendar", active: true },

  // ── Graduate & Academic Support ──
  { id: 158, category: "Graduate & Academic Support", name: "MCB-MCB Undergraduate Program", url: "https://calendars.illinois.edu/list/973", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 159, category: "Colleges & Schools", name: "Business - Department of Business Administration", url: "https://calendars.illinois.edu/list/1103", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 160, category: "Other UIUC Calendars", name: "Siebel School Information Panels Calendar", url: "https://calendars.illinois.edu/list/1041", notes: "via UIUC calendar", active: true },
  { id: 161, category: "Other UIUC Calendars", name: "UI Ice Arena", url: "https://calendars.illinois.edu/list/980", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 162, category: "Student Life & Cultural Centers", name: "Asian American Cultural Center", url: "https://calendars.illinois.edu/list/1027", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 163, category: "Other UIUC Calendars", name: "May's Stuffs To Doos", url: "https://calendars.illinois.edu/list/1093", notes: "via UIUC calendar", active: true },
  { id: 164, category: "Other UIUC Calendars", name: "NPRE Events Calendar", url: "https://calendars.illinois.edu/list/990", notes: "via UIUC calendar", active: true },
  { id: 165, category: "Other UIUC Calendars", name: "Teaching and Learning with Technology (TLT)", url: "https://calendars.illinois.edu/list/1063", notes: "via UIUC calendar", active: true },
  { id: 166, category: "Other UIUC Calendars", name: "CITES Academic Technology Services", url: "https://calendars.illinois.edu/list/1062", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 167, category: "Student Life & Cultural Centers", name: "European Union Center Events", url: "https://calendars.illinois.edu/list/1169", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 168, category: "Research Centers & Labs", name: "Campus Political Activities courtesy of the Intercollegiate Studies Institute", url: "https://calendars.illinois.edu/list/1207", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 169, category: "Colleges & Schools", name: "Pathobiology Calendar", url: "https://calendars.illinois.edu/list/1134", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 170, category: "Other UIUC Calendars", name: "Americans for Informed Democracy", url: "https://calendars.illinois.edu/list/1105", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 171, category: "Colleges & Schools", name: "Business - Study Abroad Incoming", url: "https://calendars.illinois.edu/list/1163", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 172, category: "Other UIUC Calendars", name: "Nano Seminars", url: "https://calendars.illinois.edu/list/1165", notes: "via UIUC calendar", active: true },

  // ── Campus Recreation & Wellness ──
  { id: 173, category: "Campus Recreation & Wellness", name: "University Housing", url: "https://calendars.illinois.edu/list/1204", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 174, category: "Student Life & Cultural Centers", name: "Asian American Cultural Center - Campus and Community Calendar", url: "https://calendars.illinois.edu/list/1127", notes: "via UIUC calendar", active: true },
  { id: 175, category: "Student Life & Cultural Centers", name: "International Programs and Studies", url: "https://calendars.illinois.edu/list/1213", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 176, category: "Other UIUC Calendars", name: "Parents Programs Calendar", url: "https://calendars.illinois.edu/list/1137", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 177, category: "Colleges & Schools", name: "School of Molecular & Cellular Biology Calendar of Events", url: "https://calendars.illinois.edu/list/1233", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 178, category: "Other UIUC Calendars", name: "40 North", url: "https://calendars.illinois.edu/list/1209", notes: "via UIUC calendar", active: true },
  { id: 179, category: "Other UIUC Calendars", name: "Pompilia", url: "https://calendars.illinois.edu/list/1171", notes: "via UIUC calendar", active: true },
  { id: 180, category: "Other UIUC Calendars", name: "Armenian Association", url: "https://calendars.illinois.edu/list/1372", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 181, category: "Student Life & Cultural Centers", name: "ISSS Workshops", url: "https://calendars.illinois.edu/list/1329", notes: "via UIUC calendar", active: true },

  // ── Graduate & Academic Support ──
  { id: 182, category: "Graduate & Academic Support", name: "Study Abroad Deadlines & Info Sessions", url: "https://calendars.illinois.edu/list/1354", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 183, category: "Colleges & Schools", name: "Materials Science and Engineering Calendar", url: "https://calendars.illinois.edu/list/1374", notes: "via UIUC calendar", active: true },
  { id: 184, category: "Colleges & Schools", name: "Business - MS Finance", url: "https://calendars.illinois.edu/list/1390", notes: "via UIUC calendar", active: true },
  { id: 185, category: "Colleges & Schools", name: "Department of Chemistry Master Calendar", url: "https://calendars.illinois.edu/list/1381", notes: "via UIUC calendar", active: true },
  { id: 186, category: "Colleges & Schools", name: "UIUC Biophysics and Related Seminars", url: "https://calendars.illinois.edu/list/1297", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 187, category: "Other UIUC Calendars", name: "UIF Master Calendar", url: "https://calendars.illinois.edu/list/1383", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 188, category: "Colleges & Schools", name: "College of LAS Events", url: "https://calendars.illinois.edu/list/1249", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 189, category: "Research Centers & Labs", name: "NCSA Events &#8211; NCSA | National Center for Supercomputing Applications", url: "https://calendars.illinois.edu/list/1435", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 190, category: "Other UIUC Calendars", name: "A+D Faculty events", url: "https://calendars.illinois.edu/list/1449", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 191, category: "Colleges & Schools", name: "Department of Statistics Event Calendar", url: "https://calendars.illinois.edu/list/1439", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 192, category: "Other UIUC Calendars", name: "Calendario de Mauricio M. Perillo", url: "https://calendars.illinois.edu/list/1407", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 193, category: "Student Life & Cultural Centers", name: "A+D Student events", url: "https://calendars.illinois.edu/list/1447", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 194, category: "Other UIUC Calendars", name: "PS-Major Events", url: "https://calendars.illinois.edu/list/1404", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 195, category: "Student Life & Cultural Centers", name: "Multicultural Advocates Master Calendar", url: "https://calendars.illinois.edu/list/1452", notes: "via UIUC calendar", active: true },

  // ── Arts & Performance ──
  { id: 196, category: "Arts & Performance", name: "The School of Art and Design - Faculty Calendar", url: "https://calendars.illinois.edu/list/1450", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 197, category: "Research Centers & Labs", name: "Center for Innovation in Teaching & Learning", url: "https://calendars.illinois.edu/list/1432", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 198, category: "Student Life & Cultural Centers", name: "Native American House", url: "https://calendars.illinois.edu/list/1534", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 199, category: "Other UIUC Calendars", name: "American Indian Studies Program", url: "https://calendars.illinois.edu/list/1535", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 200, category: "Colleges & Schools", name: "Business-Study Abroad", url: "https://calendars.illinois.edu/list/1542", notes: "via UIUC calendar", active: true },
  { id: 201, category: "Colleges & Schools", name: "Veterinary Medicine Alumni & Advancement", url: "https://calendars.illinois.edu/list/1540", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 202, category: "Other UIUC Calendars", name: "American Indian Studies Program", url: "https://calendars.illinois.edu/list/1533", notes: "via UIUC calendar", active: true },

  // ── Libraries ──
  { id: 203, category: "Libraries", name: "Main Library Exhibits Calendar", url: "https://calendars.illinois.edu/list/1546", notes: "via UIUC calendar", active: true },

  // ── Arts & Performance ──
  { id: 204, category: "Arts & Performance", name: "SLAVIC Films and Conversation Tables", url: "https://calendars.illinois.edu/list/1578", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 205, category: "Colleges & Schools", name: "Geology at Illinois", url: "https://calendars.illinois.edu/list/1667", notes: "via UIUC calendar", active: true },

  // ── Athletics ──
  { id: 206, category: "Athletics", name: "HireIllini Career Fairs", url: "https://calendars.illinois.edu/list/1551", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 207, category: "Other UIUC Calendars", name: "Illinois Sustainable Technology Center Events", url: "https://calendars.illinois.edu/list/1643", notes: "via UIUC calendar", active: true },
  { id: 208, category: "Other UIUC Calendars", name: "University of Illinois Press Events Calendar", url: "https://calendars.illinois.edu/list/1710", notes: "via UIUC calendar", active: true },
  { id: 209, category: "Other UIUC Calendars", name: "All calendars", url: "https://calendars.illinois.edu/list/1595", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 210, category: "Colleges & Schools", name: "Political Science", url: "https://calendars.illinois.edu/list/1702", notes: "via UIUC calendar", active: true },

  // ── Campus Recreation & Wellness ──
  { id: 211, category: "Campus Recreation & Wellness", name: "College of Applied Health Sciences", url: "https://calendars.illinois.edu/list/1621", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 212, category: "Other UIUC Calendars", name: "CBSU", url: "https://calendars.illinois.edu/list/1656", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 213, category: "Student Life & Cultural Centers", name: "Business Student-to-Student", url: "https://calendars.illinois.edu/list/1723", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 214, category: "Other UIUC Calendars", name: "UIUC Events", url: "https://calendars.illinois.edu/list/1570", notes: "via UIUC calendar", active: true },
  { id: 215, category: "Other UIUC Calendars", name: "Ming's List", url: "https://calendars.illinois.edu/list/1569", notes: "via UIUC calendar", active: true },
  { id: 216, category: "Other UIUC Calendars", name: "Department of French", url: "https://calendars.illinois.edu/list/1808", notes: "via UIUC calendar", active: true },
  { id: 217, category: "Other UIUC Calendars", name: "Transportation Group", url: "https://calendars.illinois.edu/list/1761", notes: "via UIUC calendar", active: true },
  { id: 218, category: "Other UIUC Calendars", name: "Test Calendar 2", url: "https://calendars.illinois.edu/list/1861", notes: "via UIUC calendar", active: true },
  { id: 219, category: "Other UIUC Calendars", name: "Scholarships Office Master Calendar", url: "https://calendars.illinois.edu/list/1875", notes: "via UIUC calendar", active: true },
  { id: 220, category: "Other UIUC Calendars", name: "Test Calendar 1", url: "https://calendars.illinois.edu/list/1831", notes: "via UIUC calendar", active: true },

  // ── Graduate & Academic Support ──
  { id: 221, category: "Graduate & Academic Support", name: "Study Abroad Events & Deadlines", url: "https://calendars.illinois.edu/list/1880", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 222, category: "Other UIUC Calendars", name: "Scholarship Events and Deadlines", url: "https://calendars.illinois.edu/list/1826", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 223, category: "Colleges & Schools", name: "Physics - Mathematical and Theoretical Physics Seminar", url: "https://calendars.illinois.edu/list/1963", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 224, category: "Other UIUC Calendars", name: "IQUIST Seminar Series", url: "https://calendars.illinois.edu/list/1958", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 225, category: "Colleges & Schools", name: "Physics - Astrophysics, Relativity, and Cosmology Seminar", url: "https://calendars.illinois.edu/list/1962", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 226, category: "Research Centers & Labs", name: "Physics - The Anthony J Leggett Institute for Condensed Matter Theory Seminar", url: "https://calendars.illinois.edu/list/1954", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 227, category: "Other UIUC Calendars", name: "CWS Calendar", url: "https://calendars.illinois.edu/list/1996", notes: "via UIUC calendar", active: true },
  { id: 228, category: "Other UIUC Calendars", name: "Department of French and Italian (EVENTS)", url: "https://calendars.illinois.edu/list/1940", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 229, category: "Colleges & Schools", name: "Physics - Colloquium", url: "https://calendars.illinois.edu/list/1953", notes: "via UIUC calendar", active: true },
  { id: 230, category: "Colleges & Schools", name: "Physics - Biological Physics / iPoLS / STC-QCB Seminar", url: "https://calendars.illinois.edu/list/1961", notes: "via UIUC calendar", active: true },
  { id: 231, category: "Colleges & Schools", name: "Physics - Condensed Matter Seminar", url: "https://calendars.illinois.edu/list/1964", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 232, category: "Other UIUC Calendars", name: "Michelle's Schedule", url: "https://calendars.illinois.edu/list/1994", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 233, category: "Student Life & Cultural Centers", name: "European Union Center", url: "https://calendars.illinois.edu/list/1889", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 234, category: "Colleges & Schools", name: "Physics - CPLC Calendar", url: "https://calendars.illinois.edu/list/2004", notes: "via UIUC calendar", active: true },
  { id: 235, category: "Colleges & Schools", name: "Physics - Graduate Office Calendar", url: "https://calendars.illinois.edu/list/1965", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 236, category: "Research Centers & Labs", name: "Beckman Master Calendar Test", url: "https://calendars.illinois.edu/list/1887", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 237, category: "Colleges & Schools", name: "Department of Economics Calendar", url: "https://calendars.illinois.edu/list/1943", notes: "via UIUC calendar", active: true },

  // ── Campus Recreation & Wellness ──
  { id: 238, category: "Campus Recreation & Wellness", name: "Health/Wellness Calendar", url: "https://calendars.illinois.edu/list/2039", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 239, category: "Colleges & Schools", name: "Physics Main Calendar", url: "https://calendars.illinois.edu/list/1968", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 240, category: "Other UIUC Calendars", name: "College of LAS: For Faculty & Staff", url: "https://calendars.illinois.edu/list/1905", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 241, category: "Student Life & Cultural Centers", name: "College of LAS: For Students", url: "https://calendars.illinois.edu/list/1902", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 242, category: "Other UIUC Calendars", name: "Neuroscience Program Seminars", url: "https://calendars.illinois.edu/list/2069", notes: "via UIUC calendar", active: true },

  // ── Campus Recreation & Wellness ──
  { id: 243, category: "Campus Recreation & Wellness", name: "Campus Wellbeing Services - All Wellness Events", url: "https://calendars.illinois.edu/list/2074", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 244, category: "Colleges & Schools", name: "Physics - Astronomy Calendar", url: "https://calendars.illinois.edu/list/2054", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 245, category: "Research Centers & Labs", name: "IGB Kiosk", url: "https://calendars.illinois.edu/list/2059", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 246, category: "Other UIUC Calendars", name: "ICMT", url: "https://calendars.illinois.edu/list/2091", notes: "via UIUC calendar", active: true },
  { id: 247, category: "Other UIUC Calendars", name: "SLAVIC Web calendar", url: "https://calendars.illinois.edu/list/2057", notes: "via UIUC calendar", active: true },
  { id: 248, category: "Other UIUC Calendars", name: "amymastercal", url: "https://calendars.illinois.edu/list/2150", notes: "via UIUC calendar", active: true },
  { id: 249, category: "Other UIUC Calendars", name: "Seminars of Interest - School of Chemical Sciences for Digital Signage", url: "https://calendars.illinois.edu/list/2106", notes: "via UIUC calendar", active: true },

  // ── Libraries ──
  { id: 250, category: "Libraries", name: "Rare Book & Manuscript Library Events", url: "https://calendars.illinois.edu/list/2169", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 251, category: "Other UIUC Calendars", name: "Fall 08", url: "https://calendars.illinois.edu/list/2045", notes: "via UIUC calendar", active: true },
  { id: 252, category: "Other UIUC Calendars", name: "Events of Interest to Global Studies Majors", url: "https://calendars.illinois.edu/list/2112", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 253, category: "Colleges & Schools", name: "Chemistry - Public Events", url: "https://calendars.illinois.edu/list/2209", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 254, category: "Other UIUC Calendars", name: "CSL Decision and Control Group", url: "https://calendars.illinois.edu/list/2235", notes: "via UIUC calendar", active: true },
  { id: 255, category: "Other UIUC Calendars", name: "Technology Entrepreneur Center - Compele", url: "https://calendars.illinois.edu/list/2274", notes: "via UIUC calendar", active: true },
  { id: 256, category: "Other UIUC Calendars", name: "Parallel@Illinois Calendar", url: "https://calendars.illinois.edu/list/2238", notes: "via UIUC calendar", active: true },
  { id: 257, category: "Other UIUC Calendars", name: "Identify Illinois Master Calendar", url: "https://calendars.illinois.edu/list/2292", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 258, category: "Colleges & Schools", name: "Grainger Engineering: Special Events Calendar", url: "https://calendars.illinois.edu/list/2253", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 259, category: "Other UIUC Calendars", name: "throw master calendar", url: "https://calendars.illinois.edu/list/2279", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 260, category: "Research Centers & Labs", name: "Prairie Research Institute - All Events", url: "https://calendars.illinois.edu/list/2195", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 261, category: "Other UIUC Calendars", name: "CEE - Railroad", url: "https://calendars.illinois.edu/list/2277", notes: "via UIUC calendar", active: true },
  { id: 262, category: "Other UIUC Calendars", name: "CSL Master Calendar", url: "https://calendars.illinois.edu/list/2232", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 263, category: "Student Life & Cultural Centers", name: "STUDENT CALENDAR", url: "https://calendars.illinois.edu/list/2231", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 264, category: "Other UIUC Calendars", name: "E T Forum Events Calendar", url: "https://calendars.illinois.edu/list/2226", notes: "via UIUC calendar", active: true },
  { id: 265, category: "Other UIUC Calendars", name: "CSAMES", url: "https://calendars.illinois.edu/list/2366", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 266, category: "Student Life & Cultural Centers", name: "Women's Resources Center", url: "https://calendars.illinois.edu/list/2345", notes: "via UIUC calendar", active: true },
  { id: 267, category: "Student Life & Cultural Centers", name: "Gender & Sexuality Resource Center", url: "https://calendars.illinois.edu/list/2463", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 268, category: "Other UIUC Calendars", name: "ChoLLie", url: "https://calendars.illinois.edu/list/2467", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 269, category: "Colleges & Schools", name: "Department of Linguistics Events (NO LONGER IN USE)", url: "https://calendars.illinois.edu/list/2617", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 270, category: "Student Life & Cultural Centers", name: "Native American House", url: "https://calendars.illinois.edu/list/2570", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 271, category: "Other UIUC Calendars", name: "Astro", url: "https://calendars.illinois.edu/list/2607", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 272, category: "Colleges & Schools", name: "School of Social Work Event Calendar", url: "https://calendars.illinois.edu/list/2658", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 273, category: "Other UIUC Calendars", name: "Illinois ECE Calendar", url: "https://calendars.illinois.edu/list/2622", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 274, category: "Colleges & Schools", name: "Pre-Law Advising Services Calendar", url: "https://calendars.illinois.edu/list/2508", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 275, category: "Other UIUC Calendars", name: "TCC411", url: "https://calendars.illinois.edu/list/2567", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 276, category: "Student Life & Cultural Centers", name: "Asian American Studies", url: "https://calendars.illinois.edu/list/2613", notes: "via UIUC calendar", active: true },

  // ── Campus Recreation & Wellness ──
  { id: 277, category: "Campus Recreation & Wellness", name: "Campus Recreation - Master Calendar", url: "https://calendars.illinois.edu/list/2628", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 278, category: "Colleges & Schools", name: "Grainger College of Engineering, All Events", url: "https://calendars.illinois.edu/list/2568", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 279, category: "Other UIUC Calendars", name: "Siebel School Master Calendar", url: "https://calendars.illinois.edu/list/2654", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 280, category: "Colleges & Schools", name: "Physics - Departmental Events", url: "https://calendars.illinois.edu/list/2735", notes: "via UIUC calendar", active: true },
  { id: 281, category: "Colleges & Schools", name: "College of Media Events", url: "https://calendars.illinois.edu/list/2674", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 282, category: "Other UIUC Calendars", name: "Middle East Events", url: "https://calendars.illinois.edu/list/2678", notes: "via UIUC calendar", active: true },
  { id: 283, category: "Other UIUC Calendars", name: "School of Chemical Sciences Seminars of Interest - event calendar", url: "https://calendars.illinois.edu/list/2751", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 284, category: "Colleges & Schools", name: "Psychology Master Calendar", url: "https://calendars.illinois.edu/list/2667", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 285, category: "Student Life & Cultural Centers", name: "Center for African Studies Calendar", url: "https://calendars.illinois.edu/list/2719", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 286, category: "Other UIUC Calendars", name: "Slavic Events", url: "https://calendars.illinois.edu/list/2758", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 287, category: "Colleges & Schools", name: "Psychology General Calendar", url: "https://calendars.illinois.edu/list/2666", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 288, category: "Other UIUC Calendars", name: "REEEC Master Calendar", url: "https://calendars.illinois.edu/list/2750", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 289, category: "Colleges & Schools", name: "Civil and Environmental Engineering - Master Calendar", url: "https://calendars.illinois.edu/list/2677", notes: "via UIUC calendar", active: true },
  { id: 290, category: "Colleges & Schools", name: "College of Education Public Events (MASTER)", url: "https://calendars.illinois.edu/list/2771", notes: "via UIUC calendar", active: true },
  { id: 291, category: "Colleges & Schools", name: "College of Education Events", url: "https://calendars.illinois.edu/list/2772", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 292, category: "Other UIUC Calendars", name: "Vet Med Event Calendar", url: "https://calendars.illinois.edu/list/2770", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 293, category: "Student Life & Cultural Centers", name: "Asian American Cultural Center Events", url: "https://calendars.illinois.edu/list/2769", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 294, category: "Other UIUC Calendars", name: "Prof. P. A. Shapley", url: "https://calendars.illinois.edu/list/2728", notes: "via UIUC calendar", active: true },
  { id: 295, category: "Other UIUC Calendars", name: "NRES Events", url: "https://calendars.illinois.edu/list/2808", notes: "via UIUC calendar", active: true },
  { id: 296, category: "Other UIUC Calendars", name: "Campus General Request Event", url: "https://calendars.illinois.edu/list/2889", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 297, category: "Student Life & Cultural Centers", name: "Illinois International Events", url: "https://calendars.illinois.edu/list/2885", notes: "via UIUC calendar", active: true },
  { id: 298, category: "Student Life & Cultural Centers", name: "Russian, E. European & Eurasian Center: Receptions", url: "https://calendars.illinois.edu/list/2844", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 299, category: "Other UIUC Calendars", name: "MechSE Seminars", url: "https://calendars.illinois.edu/list/2791", notes: "via UIUC calendar", active: true },
  { id: 300, category: "Other UIUC Calendars", name: "Fine and Applied Arts: Admissions Events", url: "https://calendars.illinois.edu/list/2859", notes: "via UIUC calendar", active: true },

  // ── Arts & Performance ──
  { id: 301, category: "Arts & Performance", name: "Spurlock Museum - Event", url: "https://calendars.illinois.edu/list/2845", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 302, category: "Student Life & Cultural Centers", name: "Latina/Latino Studies Event Calendar", url: "https://calendars.illinois.edu/list/2856", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 303, category: "Other UIUC Calendars", name: "Modern Greek Studies", url: "https://calendars.illinois.edu/list/2952", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 304, category: "Colleges & Schools", name: "Chemistry - Alumni Events", url: "https://calendars.illinois.edu/list/2927", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 305, category: "Other UIUC Calendars", name: "Siebel School Events Calendar", url: "https://calendars.illinois.edu/list/2835", notes: "via UIUC calendar", active: true },
  { id: 306, category: "Other UIUC Calendars", name: "Brittany's Calendar", url: "https://calendars.illinois.edu/list/2923", notes: "via UIUC calendar", active: true },
  { id: 307, category: "Other UIUC Calendars", name: "Ice Arena Calendar", url: "https://calendars.illinois.edu/list/2924", notes: "via UIUC calendar", active: true },
  { id: 308, category: "Other UIUC Calendars", name: "VBB Calendar of Events", url: "https://calendars.illinois.edu/list/2812", notes: "via UIUC calendar", active: true },
  { id: 309, category: "Other UIUC Calendars", name: "09-10 UIUC", url: "https://calendars.illinois.edu/list/2935", notes: "via UIUC calendar", active: true },
  { id: 310, category: "Other UIUC Calendars", name: "Anna's Calendar", url: "https://calendars.illinois.edu/list/3059", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 311, category: "Student Life & Cultural Centers", name: "La Casa Cultural Latina", url: "https://calendars.illinois.edu/list/3114", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 312, category: "Other UIUC Calendars", name: "REEEC FB Calendar", url: "https://calendars.illinois.edu/list/3029", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 313, category: "Student Life & Cultural Centers", name: "ACES Office of International Programs", url: "https://calendars.illinois.edu/list/3052", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 314, category: "Other UIUC Calendars", name: "SCS - Major Named Lectures and Symposia", url: "https://calendars.illinois.edu/list/3054", notes: "via UIUC calendar", active: true },
  { id: 315, category: "Other UIUC Calendars", name: "Employee Relations and Human Resources", url: "https://calendars.illinois.edu/list/3017", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 316, category: "Student Life & Cultural Centers", name: "Asian American Studies", url: "https://calendars.illinois.edu/list/3094", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 317, category: "Other UIUC Calendars", name: "National Resource Centers", url: "https://calendars.illinois.edu/list/3058", notes: "via UIUC calendar", active: true },
  { id: 318, category: "Other UIUC Calendars", name: "UIUC", url: "https://calendars.illinois.edu/list/3079", notes: "via UIUC calendar", active: true },
  { id: 319, category: "Other UIUC Calendars", name: "HMNTL Master Calendar", url: "https://calendars.illinois.edu/list/3051", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 320, category: "Colleges & Schools", name: "Grainger College of Engineering Seminars & Speakers", url: "https://calendars.illinois.edu/list/2995", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 321, category: "Other UIUC Calendars", name: "Spanish and Portuguese Calendar", url: "https://calendars.illinois.edu/list/3142", notes: "via UIUC calendar", active: true },
  { id: 322, category: "Other UIUC Calendars", name: "NPRE Events", url: "https://calendars.illinois.edu/list/3162", notes: "via UIUC calendar", active: true },
  { id: 323, category: "Other UIUC Calendars", name: "Master Calendar of Events", url: "https://calendars.illinois.edu/list/3207", notes: "via UIUC calendar", active: true },
  { id: 324, category: "Other UIUC Calendars", name: "Hispanic Outreach Office, University of Illinois Extension Eventos en Espaol", url: "https://calendars.illinois.edu/list/3135", notes: "via UIUC calendar", active: true },
  { id: 325, category: "Other UIUC Calendars", name: "SLCL Master Calendar of Events (all SLCL unit calendars)", url: "https://calendars.illinois.edu/list/3186", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 326, category: "Colleges & Schools", name: "Engineering Seminars Test Calendar 2.10", url: "https://calendars.illinois.edu/list/3133", notes: "via UIUC calendar", active: true },

  // ── Graduate & Academic Support ──
  { id: 327, category: "Graduate & Academic Support", name: "Graduate College Thesis Deadlines", url: "https://calendars.illinois.edu/list/3259", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 328, category: "Other UIUC Calendars", name: "Ekkawit Ray Pongpet", url: "https://calendars.illinois.edu/list/3374", notes: "via UIUC calendar", active: true },
  { id: 329, category: "Other UIUC Calendars", name: "IT Excellence at Illinois: Calendar", url: "https://calendars.illinois.edu/list/3252", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 330, category: "Student Life & Cultural Centers", name: "Russian, E. European & Eurasian Center: Outreach", url: "https://calendars.illinois.edu/list/3289", notes: "via UIUC calendar", active: true },
  { id: 331, category: "Student Life & Cultural Centers", name: "Diversity & Social Justice Education", url: "https://calendars.illinois.edu/list/3322", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 332, category: "Colleges & Schools", name: "Financial Engineering, M.S.", url: "https://calendars.illinois.edu/list/3303", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 333, category: "Student Life & Cultural Centers", name: "Graduate Student Events", url: "https://calendars.illinois.edu/list/3367", notes: "via UIUC calendar", active: true },
  { id: 334, category: "Student Life & Cultural Centers", name: "Student Affairs & Campus Events", url: "https://calendars.illinois.edu/list/3371", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 335, category: "Other UIUC Calendars", name: "Illinois Network on Islam and Muslim Societies", url: "https://calendars.illinois.edu/list/3415", notes: "via UIUC calendar", active: true },
  { id: 336, category: "Other UIUC Calendars", name: "Medieval Studies", url: "https://calendars.illinois.edu/list/3530", notes: "via UIUC calendar", active: true },
  { id: 337, category: "Other UIUC Calendars", name: "CliMAS Colloquia", url: "https://calendars.illinois.edu/list/3491", notes: "via UIUC calendar", active: true },
  { id: 338, category: "Other UIUC Calendars", name: "DURP master", url: "https://calendars.illinois.edu/list/3590", notes: "via UIUC calendar", active: true },
  { id: 339, category: "Other UIUC Calendars", name: "OCE Calendar", url: "https://calendars.illinois.edu/list/3552", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 340, category: "Research Centers & Labs", name: "Entrepreneurship Calendar", url: "https://calendars.illinois.edu/list/3465", notes: "via UIUC calendar", active: true },

  // ── Libraries ──
  { id: 341, category: "Libraries", name: "Lit Lang Library", url: "https://calendars.illinois.edu/list/3580", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 342, category: "Research Centers & Labs", name: "Research Park Events", url: "https://calendars.illinois.edu/list/3462", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 343, category: "Colleges & Schools", name: '"FAA Online" Calendar', url: "https://calendars.illinois.edu/list/3479", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 344, category: "Research Centers & Labs", name: "Uni High Weekly Memo | University Laboratory High School", url: "https://calendars.illinois.edu/list/3467", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 345, category: "Other UIUC Calendars", name: "ILC Certificate", url: "https://calendars.illinois.edu/list/3706", notes: "via UIUC calendar", active: true },
  { id: 346, category: "Other UIUC Calendars", name: "ILC Leadership Labs", url: "https://calendars.illinois.edu/list/3671", notes: "via UIUC calendar", active: true },
  { id: 347, category: "Other UIUC Calendars", name: "ILC General Events", url: "https://calendars.illinois.edu/list/3708", notes: "via UIUC calendar", active: true },
  { id: 348, category: "Other UIUC Calendars", name: "ILC Master Calendar", url: "https://calendars.illinois.edu/list/3709", notes: "via UIUC calendar", active: true },
  { id: 349, category: "Other UIUC Calendars", name: "Department of the Classics", url: "https://calendars.illinois.edu/list/3724", notes: "via UIUC calendar", active: true },

  // ── Graduate & Academic Support ──
  { id: 350, category: "Graduate & Academic Support", name: "Graduate College Events", url: "https://calendars.illinois.edu/list/3695", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 351, category: "Other UIUC Calendars", name: "AHS Alumni Calendar", url: "https://calendars.illinois.edu/list/3641", notes: "via UIUC calendar", active: true },

  // ── Arts & Performance ──
  { id: 352, category: "Arts & Performance", name: "Housing Operational Calendar", url: "https://calendars.illinois.edu/list/3611", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 353, category: "Other UIUC Calendars", name: "xsede", url: "https://calendars.illinois.edu/list/3710", notes: "via UIUC calendar", active: true },
  { id: 354, category: "Other UIUC Calendars", name: "ISE Seminar Calendar", url: "https://calendars.illinois.edu/list/3605", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 355, category: "Colleges & Schools", name: "Bioengineering calendar", url: "https://calendars.illinois.edu/list/3721", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 356, category: "Other UIUC Calendars", name: "Visual Resources Center at the College of Fine and Applied Arts", url: "https://calendars.illinois.edu/list/3694", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 357, category: "Colleges & Schools", name: "Industrial & Enterprise Systems Engineering Calendar", url: "https://calendars.illinois.edu/list/3604", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 358, category: "Student Life & Cultural Centers", name: "International Student and Scholar Services", url: "https://calendars.illinois.edu/list/3715", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 359, category: "Other UIUC Calendars", name: "farmdoc daily Publication Schedule", url: "https://calendars.illinois.edu/list/3596", notes: "via UIUC calendar", active: true },
  { id: 360, category: "Other UIUC Calendars", name: "NAH Test", url: "https://calendars.illinois.edu/list/3881", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 361, category: "Research Centers & Labs", name: "Prairie Research Institute - Events", url: "https://calendars.illinois.edu/list/3732", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 362, category: "Other UIUC Calendars", name: "The Program in Translation & Interpreting Studies", url: "https://calendars.illinois.edu/list/3824", notes: "via UIUC calendar", active: true },
  { id: 363, category: "Other UIUC Calendars", name: "EALC Calendar of Events", url: "https://calendars.illinois.edu/list/3726", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 364, category: "Colleges & Schools", name: "IACAT Redesign", url: "https://calendars.illinois.edu/list/3831", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 365, category: "Other UIUC Calendars", name: "NAH Master Calendar", url: "https://calendars.illinois.edu/list/3880", notes: "via UIUC calendar", active: true },
  { id: 366, category: "Other UIUC Calendars", name: "Reservations 3427 ETMSW", url: "https://calendars.illinois.edu/list/3777", notes: "via UIUC calendar", active: true },
  { id: 367, category: "Other UIUC Calendars", name: "tim's calendar", url: "https://calendars.illinois.edu/list/3781", notes: "via UIUC calendar", active: true },
  { id: 368, category: "Other UIUC Calendars", name: "ROTC Tri-Service", url: "https://calendars.illinois.edu/list/3823", notes: "via UIUC calendar", active: true },
  { id: 369, category: "Other UIUC Calendars", name: "MechSE Master Calendar", url: "https://calendars.illinois.edu/list/3731", notes: "via UIUC calendar", active: true },
  { id: 370, category: "Other UIUC Calendars", name: "Reservations 3312 ETMSW", url: "https://calendars.illinois.edu/list/3778", notes: "via UIUC calendar", active: true },
  { id: 371, category: "Other UIUC Calendars", name: "Illinois", url: "https://calendars.illinois.edu/list/3832", notes: "via UIUC calendar", active: true },
  { id: 372, category: "Other UIUC Calendars", name: "VRC Snippet", url: "https://calendars.illinois.edu/list/3875", notes: "via UIUC calendar", active: true },
  { id: 373, category: "Other UIUC Calendars", name: "Morrill Hall Display Calendar", url: "https://calendars.illinois.edu/list/3740", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 374, category: "Colleges & Schools", name: "Room Reservations in the College of Education, all rooms", url: "https://calendars.illinois.edu/list/3750", notes: "via UIUC calendar", active: true },

  // ── Arts & Performance ──
  { id: 375, category: "Arts & Performance", name: "Michael Vila's calendar for event attendance planning.", url: "https://calendars.illinois.edu/list/3812", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 376, category: "Colleges & Schools", name: "Physics - Careers Seminar", url: "https://calendars.illinois.edu/list/4014", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 377, category: "Research Centers & Labs", name: "Cancer Center Master Calendar", url: "https://calendars.illinois.edu/list/3952", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 378, category: "Student Life & Cultural Centers", name: "Student Money Management Center Master Calendar", url: "https://calendars.illinois.edu/list/3985", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 379, category: "Other UIUC Calendars", name: "CEAPS Events Calendar", url: "https://calendars.illinois.edu/list/3931", notes: "via UIUC calendar", active: true },
  { id: 380, category: "Other UIUC Calendars", name: "Illinois ECE Seminars", url: "https://calendars.illinois.edu/list/3946", notes: "via UIUC calendar", active: true },
  { id: 381, category: "Other UIUC Calendars", name: "NPRE seminars", url: "https://calendars.illinois.edu/list/4035", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 382, category: "Colleges & Schools", name: "Chemistry - Chemical Biology & CBI Seminars", url: "https://calendars.illinois.edu/list/4084", notes: "via UIUC calendar", active: true },

  // ── Libraries ──
  { id: 383, category: "Libraries", name: "International and Area Studies Library", url: "https://calendars.illinois.edu/list/4082", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 384, category: "Other UIUC Calendars", name: "University of Illinois Press Events Master Calendar", url: "https://calendars.illinois.edu/list/4098", notes: "via UIUC calendar", active: true },
  { id: 385, category: "Other UIUC Calendars", name: "all", url: "https://calendars.illinois.edu/list/4124", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 386, category: "Colleges & Schools", name: "Geography & Geographic Information Science (GGIS)", url: "https://calendars.illinois.edu/list/4024", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 387, category: "Other UIUC Calendars", name: "PEEC Seminars", url: "https://calendars.illinois.edu/list/4109", notes: "via UIUC calendar", active: true },

  // ── Athletics ──
  { id: 388, category: "Athletics", name: "Illini Union Courtyard Cafe Events Calendar", url: "https://calendars.illinois.edu/list/4061", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 389, category: "Other UIUC Calendars", name: "Seminars", url: "https://calendars.illinois.edu/list/4080", notes: "via UIUC calendar", active: true },
  { id: 390, category: "Other UIUC Calendars", name: "INTLconnect.illinois.edu Calendar of Events", url: "https://calendars.illinois.edu/list/4083", notes: "via UIUC calendar", active: true },

  // ── Libraries ──
  { id: 391, category: "Libraries", name: "Library Calendar", url: "https://calendars.illinois.edu/list/4092", notes: "via UIUC calendar", active: true },

  // ── Athletics ──
  { id: 392, category: "Athletics", name: "Illini Sports Calendar", url: "https://calendars.illinois.edu/list/4116", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 393, category: "Research Centers & Labs", name: "Research Park Master Calendar", url: "https://calendars.illinois.edu/list/4095", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 394, category: "Other UIUC Calendars", name: "Bio Seminars", url: "https://calendars.illinois.edu/list/4118", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 395, category: "Colleges & Schools", name: "Geography & Geographic Information Science", url: "https://calendars.illinois.edu/list/4255", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 396, category: "Other UIUC Calendars", name: "Woochul-Calendar", url: "https://calendars.illinois.edu/list/4181", notes: "via UIUC calendar", active: true },
  { id: 397, category: "Other UIUC Calendars", name: "Master Calendar1", url: "https://calendars.illinois.edu/list/4146", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 398, category: "Colleges & Schools", name: "Urbana-Champaign Calendar", url: "https://calendars.illinois.edu/list/4129", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 399, category: "Other UIUC Calendars", name: "Registrar - Academic Records Unit", url: "https://calendars.illinois.edu/list/4180", notes: "via UIUC calendar", active: true },
  { id: 400, category: "Other UIUC Calendars", name: "ARTCA Fellowship Calendar", url: "https://calendars.illinois.edu/list/4225", notes: "via UIUC calendar", active: true },

  // ── Graduate & Academic Support ──
  { id: 401, category: "Graduate & Academic Support", name: "Registrar - Degree Cert & Study Abroad Unit", url: "https://calendars.illinois.edu/list/4178", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 402, category: "Other UIUC Calendars", name: "Office of the Registrar Master Calendar", url: "https://calendars.illinois.edu/list/4175", notes: "via UIUC calendar", active: true },
  { id: 403, category: "Other UIUC Calendars", name: "Go Global", url: "https://calendars.illinois.edu/list/4293", notes: "via UIUC calendar", active: true },
  { id: 404, category: "Other UIUC Calendars", name: "DRC Test Cal", url: "https://calendars.illinois.edu/list/4308", notes: "via UIUC calendar", active: true },
  { id: 405, category: "Other UIUC Calendars", name: "CSGGE Master Calendar", url: "https://calendars.illinois.edu/list/4279", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 406, category: "Student Life & Cultural Centers", name: "Gender Equity Council", url: "https://calendars.illinois.edu/list/4314", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 407, category: "Colleges & Schools", name: "Department of Aerospace Engineering Events", url: "https://calendars.illinois.edu/list/4342", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 408, category: "Other UIUC Calendars", name: "David's Calendar", url: "https://calendars.illinois.edu/list/4290", notes: "via UIUC calendar", active: true },
  { id: 409, category: "Other UIUC Calendars", name: "iFoundry Master Calendar", url: "https://calendars.illinois.edu/list/4286", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 410, category: "Colleges & Schools", name: "Engineering Online Events", url: "https://calendars.illinois.edu/list/4327", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 411, category: "Other UIUC Calendars", name: "WebStore Training 2012", url: "https://calendars.illinois.edu/list/4309", notes: "via UIUC calendar", active: true },
  { id: 412, category: "Other UIUC Calendars", name: "Psychological Services Center Master Calendar", url: "https://calendars.illinois.edu/list/4336", notes: "via UIUC calendar", active: true },
  { id: 413, category: "Other UIUC Calendars", name: "eDream partners", url: "https://calendars.illinois.edu/list/4317", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 414, category: "Colleges & Schools", name: "Engineering Online Master Calendar", url: "https://calendars.illinois.edu/list/4328", notes: "via UIUC calendar", active: true },
  { id: 415, category: "Colleges & Schools", name: "Department of Aerospace Engineering", url: "https://calendars.illinois.edu/list/4338", notes: "via UIUC calendar", active: true },
  { id: 416, category: "Colleges & Schools", name: "Engineering IT Calendar", url: "https://calendars.illinois.edu/list/4339", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 417, category: "Other UIUC Calendars", name: "Daryl testing", url: "https://calendars.illinois.edu/list/4284", notes: "via UIUC calendar", active: true },
  { id: 418, category: "Other UIUC Calendars", name: "ADSC Master Calendar", url: "https://calendars.illinois.edu/list/4442", notes: "via UIUC calendar", active: true },
  { id: 419, category: "Other UIUC Calendars", name: "SoM Academic Calendar", url: "https://calendars.illinois.edu/list/4478", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 420, category: "Research Centers & Labs", name: "Center for Biophysics and Quantitative Biology", url: "https://calendars.illinois.edu/list/4469", notes: "via UIUC calendar", active: true },

  // ── Libraries ──
  { id: 421, category: "Libraries", name: "IAS Library Suggests!", url: "https://calendars.illinois.edu/list/4406", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 422, category: "Colleges & Schools", name: "Morrill Engineering Program (MEP)", url: "https://calendars.illinois.edu/list/4543", notes: "via UIUC calendar", active: true },
  { id: 423, category: "Colleges & Schools", name: "Anthropology", url: "https://calendars.illinois.edu/list/4512", notes: "via UIUC calendar", active: true },
  { id: 424, category: "Colleges & Schools", name: "Computational Science and Engineering (CSE) Master Calendar", url: "https://calendars.illinois.edu/list/4511", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 425, category: "Research Centers & Labs", name: "Beckman Institute Calendar (Master)", url: "https://calendars.illinois.edu/list/4595", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 426, category: "Other UIUC Calendars", name: "Daehyuk's Seminars", url: "https://calendars.illinois.edu/list/4597", notes: "via UIUC calendar", active: true },
  { id: 427, category: "Other UIUC Calendars", name: "Ethnography of the University Initiative", url: "https://calendars.illinois.edu/list/4579", notes: "via UIUC calendar", active: true },
  { id: 428, category: "Other UIUC Calendars", name: "DH @ Illinois", url: "https://calendars.illinois.edu/list/4584", notes: "via UIUC calendar", active: true },
  { id: 429, category: "Other UIUC Calendars", name: "Astronomy Colloquium Speaker Calendar", url: "https://calendars.illinois.edu/list/4650", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 430, category: "Colleges & Schools", name: "Business - All Events", url: "https://calendars.illinois.edu/list/4673", notes: "via UIUC calendar", active: true },
  { id: 431, category: "Colleges & Schools", name: "Illinois ECE Saturday Engineering for Everyone", url: "https://calendars.illinois.edu/list/4798", notes: "via UIUC calendar", active: true },

  // ── Campus Recreation & Wellness ──
  { id: 432, category: "Campus Recreation & Wellness", name: "Financial Wellness for College Students Program- Master Calendar", url: "https://calendars.illinois.edu/list/4729", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 433, category: "Other UIUC Calendars", name: "HRI", url: "https://calendars.illinois.edu/list/4639", notes: "via UIUC calendar", active: true },
  { id: 434, category: "Other UIUC Calendars", name: "SMMC Online Events - All Campuses", url: "https://calendars.illinois.edu/list/4741", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 435, category: "Colleges & Schools", name: "Department of Philosophy Events", url: "https://calendars.illinois.edu/list/4705", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 436, category: "Other UIUC Calendars", name: "Chicago Events - Internal + External", url: "https://calendars.illinois.edu/list/4680", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 437, category: "Colleges & Schools", name: "Urbana campus events in the Chicago area", url: "https://calendars.illinois.edu/list/4756", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 438, category: "Other UIUC Calendars", name: "CREDIT Community Events", url: "https://calendars.illinois.edu/list/4698", notes: "via UIUC calendar", active: true },
  { id: 439, category: "Other UIUC Calendars", name: "Viola's 2013 Fall Calendar", url: "https://calendars.illinois.edu/list/4704", notes: "via UIUC calendar", active: true },

  // ── Campus Recreation & Wellness ──
  { id: 440, category: "Campus Recreation & Wellness", name: "Counseling Center Events", url: "https://calendars.illinois.edu/list/4662", notes: "via UIUC calendar", active: true },
  { id: 441, category: "Campus Recreation & Wellness", name: "Counseling Center", url: "https://calendars.illinois.edu/list/4661", notes: "via UIUC calendar", active: true },

  // ── Athletics ──
  { id: 442, category: "Athletics", name: "HireIllini", url: "https://calendars.illinois.edu/list/4813", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 443, category: "Research Centers & Labs", name: "Urbana Campus Research Calendar (OVCRI)", url: "https://calendars.illinois.edu/list/4757", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 444, category: "Other UIUC Calendars", name: "Campus Safety Commission Coordinating Calendar", url: "https://calendars.illinois.edu/list/4891", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 445, category: "Colleges & Schools", name: "College of Veterinary Medicine Internal Calendar", url: "https://calendars.illinois.edu/list/4814", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 446, category: "Other UIUC Calendars", name: "Facilties & Services Events", url: "https://calendars.illinois.edu/list/4900", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 447, category: "Research Centers & Labs", name: "Applied Micro Research Lunch", url: "https://calendars.illinois.edu/list/4843", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 448, category: "Colleges & Schools", name: "Department of Economics-Master Calendar", url: "https://calendars.illinois.edu/list/4862", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 449, category: "Other UIUC Calendars", name: "Master Calendar - Test", url: "https://calendars.illinois.edu/list/4888", notes: "via UIUC calendar", active: true },
  { id: 450, category: "Other UIUC Calendars", name: "BW Users at UoI", url: "https://calendars.illinois.edu/list/4863", notes: "via UIUC calendar", active: true },
  { id: 451, category: "Other UIUC Calendars", name: "Hemiao", url: "https://calendars.illinois.edu/list/4918", notes: "via UIUC calendar", active: true },
  { id: 452, category: "Other UIUC Calendars", name: "calendar", url: "https://calendars.illinois.edu/list/4951", notes: "via UIUC calendar", active: true },

  // ── Graduate & Academic Support ──
  { id: 453, category: "Graduate & Academic Support", name: "Campus Honors Program", url: "https://calendars.illinois.edu/list/4956", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 454, category: "Other UIUC Calendars", name: "TEC Master Calendar", url: "https://calendars.illinois.edu/list/4922", notes: "via UIUC calendar", active: true },
  { id: 455, category: "Other UIUC Calendars", name: "Classroom Technology Events", url: "https://calendars.illinois.edu/list/4964", notes: "via UIUC calendar", active: true },
  { id: 456, category: "Other UIUC Calendars", name: "CHP Events", url: "https://calendars.illinois.edu/list/4957", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 457, category: "Colleges & Schools", name: "College of Media Department of Advertising Events", url: "https://calendars.illinois.edu/list/4989", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 458, category: "Other UIUC Calendars", name: "HSC Events", url: "https://calendars.illinois.edu/list/4958", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 459, category: "Colleges & Schools", name: "Integrative Biology - Undergraduate Master", url: "https://calendars.illinois.edu/list/4948", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 460, category: "Student Life & Cultural Centers", name: "Welcome for Undergraduate Students", url: "https://calendars.illinois.edu/list/4971", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 461, category: "Other UIUC Calendars", name: "OVCR Working Groups Calendar", url: "https://calendars.illinois.edu/list/4980", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 462, category: "Student Life & Cultural Centers", name: "Office of Student Financial Aid", url: "https://calendars.illinois.edu/list/5003", notes: "via UIUC calendar", active: true },

  // ── Graduate & Academic Support ──
  { id: 463, category: "Graduate & Academic Support", name: "German - Undergraduate Advising", url: "https://calendars.illinois.edu/list/5060", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 464, category: "Other UIUC Calendars", name: "Financial Literacy Badges Program Calendar", url: "https://calendars.illinois.edu/list/5040", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 465, category: "Research Centers & Labs", name: "NCSA Research and Education &#8211; NCSA | National Center for Supercomputing Applications", url: "https://calendars.illinois.edu/list/5001", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 466, category: "Other UIUC Calendars", name: "Sample Master Calendar", url: "https://calendars.illinois.edu/list/5037", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 467, category: "Colleges & Schools", name: "Physics - High Energy Physics Seminar", url: "https://calendars.illinois.edu/list/5068", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 468, category: "Other UIUC Calendars", name: "Campus Humanities Calendar", url: "https://calendars.illinois.edu/list/5093", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 469, category: "Colleges & Schools", name: "Engineering Events", url: "https://calendars.illinois.edu/list/5090", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 470, category: "Other UIUC Calendars", name: "LCTL Master Calendar", url: "https://calendars.illinois.edu/list/5046", notes: "via UIUC calendar", active: true },

  // ── Graduate & Academic Support ──
  { id: 471, category: "Graduate & Academic Support", name: "Graduate Program Recruiting Events", url: "https://calendars.illinois.edu/list/5081", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 472, category: "Other UIUC Calendars", name: "Germanic Events", url: "https://calendars.illinois.edu/list/5155", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 473, category: "Research Centers & Labs", name: "Events sponsored by the Center for Language Instruction and Coordination", url: "https://calendars.illinois.edu/list/5249", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 474, category: "Other UIUC Calendars", name: "Arabic Studies Program Event Calendar", url: "https://calendars.illinois.edu/list/5129", notes: "via UIUC calendar", active: true },
  { id: 475, category: "Other UIUC Calendars", name: "IL Homepage – Test", url: "https://calendars.illinois.edu/list/5138", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 476, category: "Colleges & Schools", name: "Physics - Astrotheory", url: "https://calendars.illinois.edu/list/5229", notes: "via UIUC calendar", active: true },
  { id: 477, category: "Colleges & Schools", name: "Microbiology at Illinois", url: "https://calendars.illinois.edu/list/5214", notes: "via UIUC calendar", active: true },
  { id: 478, category: "Colleges & Schools", name: "Integrative Biology", url: "https://calendars.illinois.edu/list/5259", notes: "via UIUC calendar", active: true },
  { id: 479, category: "Colleges & Schools", name: "Chemical & Biomolecular Engineering - Events of Interest", url: "https://calendars.illinois.edu/list/5223", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 480, category: "Other UIUC Calendars", name: "Arabic Studies Program Master Calendar", url: "https://calendars.illinois.edu/list/5128", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 481, category: "Research Centers & Labs", name: "Office of Community College Research and Leadership", url: "https://calendars.illinois.edu/list/5334", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 482, category: "Colleges & Schools", name: "Evolution, Ecology, and Behavior - Events", url: "https://calendars.illinois.edu/list/5260", notes: "via UIUC calendar", active: true },
  { id: 483, category: "Colleges & Schools", name: "Entomology - Events", url: "https://calendars.illinois.edu/list/5261", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 484, category: "Other UIUC Calendars", name: "Test Events", url: "https://calendars.illinois.edu/list/5380", notes: "via UIUC calendar", active: true },
  { id: 485, category: "Other UIUC Calendars", name: "Online Illinois Events", url: "https://calendars.illinois.edu/list/5376", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 486, category: "Colleges & Schools", name: "Chemistry Community Outreach Events", url: "https://calendars.illinois.edu/list/5328", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 487, category: "Other UIUC Calendars", name: "Office of the CIO Master Calendar", url: "https://calendars.illinois.edu/list/5330", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 488, category: "Research Centers & Labs", name: "Lemann Center for Brazilian Studies", url: "https://calendars.illinois.edu/list/5285", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 489, category: "Other UIUC Calendars", name: "AITG Master Calendar", url: "https://calendars.illinois.edu/list/5323", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 490, category: "Colleges & Schools", name: "College of Media Events", url: "https://calendars.illinois.edu/list/5352", notes: "via UIUC calendar", active: true },
  { id: 491, category: "Colleges & Schools", name: "Plant Biology - Events", url: "https://calendars.illinois.edu/list/5262", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 492, category: "Other UIUC Calendars", name: "Online Illinois Calendar", url: "https://calendars.illinois.edu/list/5375", notes: "via UIUC calendar", active: true },
  { id: 493, category: "Other UIUC Calendars", name: "C.O.R.E. Master Calendar", url: "https://calendars.illinois.edu/list/5344", notes: "via UIUC calendar", active: true },
  { id: 494, category: "Other UIUC Calendars", name: "Calendar", url: "https://calendars.illinois.edu/list/5453", notes: "via UIUC calendar", active: true },
  { id: 495, category: "Other UIUC Calendars", name: "Resource Calendar Example", url: "https://calendars.illinois.edu/list/5458", notes: "via UIUC calendar", active: true },
  { id: 496, category: "Other UIUC Calendars", name: "Illinois ECE Distinguished Colloquium Series", url: "https://calendars.illinois.edu/list/5528", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 497, category: "Colleges & Schools", name: "Impact on Science Education", url: "https://calendars.illinois.edu/list/5447", notes: "via UIUC calendar", active: true },
  { id: 498, category: "Colleges & Schools", name: "Rhetoric Program", url: "https://calendars.illinois.edu/list/5411", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 499, category: "Other UIUC Calendars", name: "Writers Workshop General Events", url: "https://calendars.illinois.edu/list/5442", notes: "via UIUC calendar", active: true },
  { id: 500, category: "Other UIUC Calendars", name: "Illinois Human Resources Main Calendar", url: "https://calendars.illinois.edu/list/5515", notes: "via UIUC calendar", active: true },
  { id: 501, category: "Other UIUC Calendars", name: "UIC Perinatal Center Courses and Conferences", url: "https://calendars.illinois.edu/list/5460", notes: "via UIUC calendar", active: true },

  // ── Libraries ──
  { id: 502, category: "Libraries", name: "International and Area Studies Library - Campus Events", url: "https://calendars.illinois.edu/list/5510", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 503, category: "Other UIUC Calendars", name: "UIUC Workshop and Event Calendar", url: "https://calendars.illinois.edu/list/5471", notes: "via UIUC calendar", active: true },
  { id: 504, category: "Other UIUC Calendars", name: "ABCs of School Nutrition", url: "https://calendars.illinois.edu/list/5579", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 505, category: "Student Life & Cultural Centers", name: "Center for African Studies Events", url: "https://calendars.illinois.edu/list/5614", notes: "via UIUC calendar", active: true },

  // ── Campus Recreation & Wellness ──
  { id: 506, category: "Campus Recreation & Wellness", name: "Mayo Clinic & Illinois Alliance for Technology-Based Healthcare", url: "https://calendars.illinois.edu/list/5589", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 507, category: "Other UIUC Calendars", name: "CEE Seminars and Conferences", url: "https://calendars.illinois.edu/list/5578", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 508, category: "Colleges & Schools", name: "Water Resources Engineering and Science Seminars", url: "https://calendars.illinois.edu/list/5608", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 509, category: "Other UIUC Calendars", name: "Siebel School Speakers Calendar", url: "https://calendars.illinois.edu/list/5598", notes: "via UIUC calendar", active: true },
  { id: 510, category: "Other UIUC Calendars", name: "Illinois ECE Explorations", url: "https://calendars.illinois.edu/list/5529", notes: "via UIUC calendar", active: true },

  // ── Graduate & Academic Support ──
  { id: 511, category: "Graduate & Academic Support", name: "Siebel School Undergraduate Calendar", url: "https://calendars.illinois.edu/list/5599", notes: "via UIUC calendar", active: true },
  { id: 512, category: "Graduate & Academic Support", name: "Siebel School Graduate Calendar", url: "https://calendars.illinois.edu/list/5610", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 513, category: "Other UIUC Calendars", name: "RailTEC", url: "https://calendars.illinois.edu/list/5587", notes: "via UIUC calendar", active: true },
  { id: 514, category: "Other UIUC Calendars", name: "OBFS Test Calendar", url: "https://calendars.illinois.edu/list/5577", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 515, category: "Colleges & Schools", name: "Microbiology@Illinois", url: "https://calendars.illinois.edu/list/5543", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 516, category: "Other UIUC Calendars", name: "Social and Behavioral Sciences Master Calendar", url: "https://calendars.illinois.edu/list/5576", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 517, category: "Colleges & Schools", name: "Chemical & Biomolecular Engineering - Undergraduate Events of Interest", url: "https://calendars.illinois.edu/list/5571", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 518, category: "Student Life & Cultural Centers", name: "Illinois Student Government Events Calendar", url: "https://calendars.illinois.edu/list/5651", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 519, category: "Colleges & Schools", name: "College of Law - Alumni Calendar", url: "https://calendars.illinois.edu/list/5715", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 520, category: "Other UIUC Calendars", name: "Wounded Veterans Center Events Calendar", url: "https://calendars.illinois.edu/list/5710", notes: "via UIUC calendar", active: true },
  { id: 521, category: "Other UIUC Calendars", name: "Life of the Department", url: "https://calendars.illinois.edu/list/5747", notes: "via UIUC calendar", active: true },
  { id: 522, category: "Other UIUC Calendars", name: "Bookstore Calendar for November", url: "https://calendars.illinois.edu/list/5748", notes: "via UIUC calendar", active: true },

  // ── Graduate & Academic Support ──
  { id: 523, category: "Graduate & Academic Support", name: "Graduate College Thesis Master", url: "https://calendars.illinois.edu/list/5724", notes: "via UIUC calendar", active: true },
  { id: 524, category: "Graduate & Academic Support", name: "Siebel School Graduate Master Calendar", url: "https://calendars.illinois.edu/list/5670", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 525, category: "Other UIUC Calendars", name: "S51 Test Calendar", url: "https://calendars.illinois.edu/list/5706", notes: "via UIUC calendar", active: true },
  { id: 526, category: "Other UIUC Calendars", name: "Test Calendar", url: "https://calendars.illinois.edu/list/5677", notes: "via UIUC calendar", active: true },
  { id: 527, category: "Other UIUC Calendars", name: "Life of the Mind", url: "https://calendars.illinois.edu/list/5758", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 528, category: "Colleges & Schools", name: "College of Law - All Other Events Calendar", url: "https://calendars.illinois.edu/list/5756", notes: "via UIUC calendar", active: true },
  { id: 529, category: "Colleges & Schools", name: "Physics - String Theory", url: "https://calendars.illinois.edu/list/5705", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 530, category: "Other UIUC Calendars", name: "farmdoc Webinars Schedule", url: "https://calendars.illinois.edu/list/5691", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 531, category: "Colleges & Schools", name: "FAA Master Events Calendar", url: "https://calendars.illinois.edu/list/5763", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 532, category: "Other UIUC Calendars", name: "The Jeffries Center Events Calendar", url: "https://calendars.illinois.edu/list/5689", notes: "via UIUC calendar", active: true },
  { id: 533, category: "Other UIUC Calendars", name: "Events of the Week", url: "https://calendars.illinois.edu/list/5704", notes: "via UIUC calendar", active: true },

  // ── Graduate & Academic Support ──
  { id: 534, category: "Graduate & Academic Support", name: "Siebel School Undergraduate Master Calendar", url: "https://calendars.illinois.edu/list/5676", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 535, category: "Other UIUC Calendars", name: "Illinois Events", url: "https://calendars.illinois.edu/list/5749", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 536, category: "Colleges & Schools", name: "Economics Event & Workshop Calendar (UG/MSPE View)", url: "https://calendars.illinois.edu/list/5699", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 537, category: "Other UIUC Calendars", name: "BER", url: "https://calendars.illinois.edu/list/5768", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 538, category: "Research Centers & Labs", name: "Crop Sciences - Research Centers", url: "https://calendars.illinois.edu/list/5811", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 539, category: "Other UIUC Calendars", name: "University Ethics and Compliance Office Calendar", url: "https://calendars.illinois.edu/list/5803", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 540, category: "Colleges & Schools", name: "NetMath Calendar", url: "https://calendars.illinois.edu/list/5801", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 541, category: "Other UIUC Calendars", name: "Training test", url: "https://calendars.illinois.edu/list/5788", notes: "via UIUC calendar", active: true },
  { id: 542, category: "Other UIUC Calendars", name: "CPSC Calendar", url: "https://calendars.illinois.edu/list/5795", notes: "via UIUC calendar", active: true },
  { id: 543, category: "Other UIUC Calendars", name: "Technology Events", url: "https://calendars.illinois.edu/list/5847", notes: "via UIUC calendar", active: true },
  { id: 544, category: "Other UIUC Calendars", name: "Learn to Hunt - Workshops", url: "https://calendars.illinois.edu/list/5890", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 545, category: "Colleges & Schools", name: "ACES - Calendar of Technology Related Events", url: "https://calendars.illinois.edu/list/5844", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 546, category: "Other UIUC Calendars", name: "Employee Learning & Organizational Effectiveness", url: "https://calendars.illinois.edu/list/5912", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 547, category: "Colleges & Schools", name: "Illinois Mathematics Lab", url: "https://calendars.illinois.edu/list/5913", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 548, category: "Research Centers & Labs", name: "Other Sustainability Events", url: "https://calendars.illinois.edu/list/5872", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 549, category: "Colleges & Schools", name: "ACES - Master Calendar of Technology Events", url: "https://calendars.illinois.edu/list/5845", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 550, category: "Other UIUC Calendars", name: "Training Calendar", url: "https://calendars.illinois.edu/list/5956", notes: "via UIUC calendar", active: true },
  { id: 551, category: "Other UIUC Calendars", name: "Jewish Culture and Society", url: "https://calendars.illinois.edu/list/5925", notes: "via UIUC calendar", active: true },
  { id: 552, category: "Other UIUC Calendars", name: "las_saao_portal_content", url: "https://calendars.illinois.edu/list/5976", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 553, category: "Student Life & Cultural Centers", name: "EHHE Student Activities", url: "https://calendars.illinois.edu/list/5926", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 554, category: "Other UIUC Calendars", name: "UG Co-Director Duties", url: "https://calendars.illinois.edu/list/5960", notes: "via UIUC calendar", active: true },
  { id: 555, category: "Other UIUC Calendars", name: "SDG Dev Calendar", url: "https://calendars.illinois.edu/list/5951", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 556, category: "Colleges & Schools", name: "Physics - Biological Physics / iPoLS / STC-QCB Seminar", url: "https://calendars.illinois.edu/list/5949", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 557, category: "Other UIUC Calendars", name: "ITPF Calendar", url: "https://calendars.illinois.edu/list/5938", notes: "via UIUC calendar", active: true },
  { id: 558, category: "Other UIUC Calendars", name: "Volunteer Opportunities", url: "https://calendars.illinois.edu/list/5958", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 559, category: "Student Life & Cultural Centers", name: "International Safety and Security Events", url: "https://calendars.illinois.edu/list/6019", notes: "via UIUC calendar", active: true },

  // ── Athletics ──
  { id: 560, category: "Athletics", name: "myIllini LAS Content", url: "https://calendars.illinois.edu/list/6002", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 561, category: "Other UIUC Calendars", name: "ISE Corporate Visits", url: "https://calendars.illinois.edu/list/6025", notes: "via UIUC calendar", active: true },
  { id: 562, category: "Other UIUC Calendars", name: "Moms Weekend 2018 Events", url: "https://calendars.illinois.edu/list/6071", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 563, category: "Colleges & Schools", name: "MatSE Soft Materials Seminar Calendar", url: "https://calendars.illinois.edu/list/6096", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 564, category: "Other UIUC Calendars", name: "MatSE Colloquium Calendar", url: "https://calendars.illinois.edu/list/6094", notes: "via UIUC calendar", active: true },
  { id: 565, category: "Other UIUC Calendars", name: "MatSE Special Seminar Calendar", url: "https://calendars.illinois.edu/list/6095", notes: "via UIUC calendar", active: true },

  // ── Graduate & Academic Support ──
  { id: 566, category: "Graduate & Academic Support", name: "Reservations 3015 ETMSW, Dissertation Defense Room", url: "https://calendars.illinois.edu/list/6091", notes: "via UIUC calendar", active: true },

  // ── Libraries ──
  { id: 567, category: "Libraries", name: "Grainger Engineering Library Information Center", url: "https://calendars.illinois.edu/list/6084", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 568, category: "Other UIUC Calendars", name: "MRSEC Events", url: "https://calendars.illinois.edu/list/6093", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 569, category: "Colleges & Schools", name: "MatSE Hard Materials Seminar Calendar", url: "https://calendars.illinois.edu/list/6097", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 570, category: "Other UIUC Calendars", name: "Sponsored Programs Administration", url: "https://calendars.illinois.edu/list/6078", notes: "via UIUC calendar", active: true },
  { id: 571, category: "Other UIUC Calendars", name: "Test Calendar", url: "https://calendars.illinois.edu/list/6040", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 572, category: "Colleges & Schools", name: "LAS Global Studies Master Calendar", url: "https://calendars.illinois.edu/list/6062", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 573, category: "Research Centers & Labs", name: "Research Technology Master Calendar", url: "https://calendars.illinois.edu/list/6003", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 574, category: "Other UIUC Calendars", name: "Calendarsad", url: "https://calendars.illinois.edu/list/6104", notes: "via UIUC calendar", active: true },
  { id: 575, category: "Other UIUC Calendars", name: "Conferences and Symposiums (SEMINARS)", url: "https://calendars.illinois.edu/list/6142", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 576, category: "Colleges & Schools", name: "Economics Express Advising (UNDERGRAD)", url: "https://calendars.illinois.edu/list/6145", notes: "via UIUC calendar", active: true },
  { id: 577, category: "Colleges & Schools", name: "Macroeconomics (SEMINARS)", url: "https://calendars.illinois.edu/list/6138", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 578, category: "Other UIUC Calendars", name: "Illinois State Archaeological Survey Calendar", url: "https://calendars.illinois.edu/list/6121", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 579, category: "Research Centers & Labs", name: "Applied Micro Research Lunch (SEMINARS)", url: "https://calendars.illinois.edu/list/6143", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 580, category: "Colleges & Schools", name: "Economics Seminars (SEMINARS MASTER)", url: "https://calendars.illinois.edu/list/6144", notes: "via UIUC calendar", active: true },
  { id: 581, category: "Colleges & Schools", name: "Applied Microeconomics (SEMINARS)", url: "https://calendars.illinois.edu/list/6125", notes: "via UIUC calendar", active: true },
  { id: 582, category: "Colleges & Schools", name: "Microeconomics (SEMINARS)", url: "https://calendars.illinois.edu/list/6139", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 583, category: "Other UIUC Calendars", name: "Econometrics (SEMINARS)", url: "https://calendars.illinois.edu/list/6137", notes: "via UIUC calendar", active: true },
  { id: 584, category: "Other UIUC Calendars", name: "MRSEC Master Calendar", url: "https://calendars.illinois.edu/list/6155", notes: "via UIUC calendar", active: true },
  { id: 585, category: "Other UIUC Calendars", name: "MatSE Master Calendar for Seminars", url: "https://calendars.illinois.edu/list/6109", notes: "via UIUC calendar", active: true },
  { id: 586, category: "Other UIUC Calendars", name: "Calendar", url: "https://calendars.illinois.edu/list/6184", notes: "via UIUC calendar", active: true },
  { id: 587, category: "Other UIUC Calendars", name: "Calendar UIF", url: "https://calendars.illinois.edu/list/6200", notes: "via UIUC calendar", active: true },

  // ── Graduate & Academic Support ──
  { id: 588, category: "Graduate & Academic Support", name: "Econ Career Events", url: "https://calendars.illinois.edu/list/6214", notes: "via UIUC calendar", active: true },
  { id: 589, category: "Graduate & Academic Support", name: "Econ Career Express Advising Calendar", url: "https://calendars.illinois.edu/list/6215", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 590, category: "Other UIUC Calendars", name: "NRES Field Trip Calendar", url: "https://calendars.illinois.edu/list/6199", notes: "via UIUC calendar", active: true },
  { id: 591, category: "Other UIUC Calendars", name: "Dan's Test Calendar", url: "https://calendars.illinois.edu/list/6219", notes: "via UIUC calendar", active: true },
  { id: 592, category: "Other UIUC Calendars", name: "SourceLab", url: "https://calendars.illinois.edu/list/6174", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 593, category: "Research Centers & Labs", name: "Applied Research Master Calendar", url: "https://calendars.illinois.edu/list/6197", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 594, category: "Other UIUC Calendars", name: "Test - DCR | Illinois", url: "https://calendars.illinois.edu/list/6194", notes: "via UIUC calendar", active: true },
  { id: 595, category: "Other UIUC Calendars", name: "ISTC Calendar", url: "https://calendars.illinois.edu/list/6229", notes: "via UIUC calendar", active: true },
  { id: 596, category: "Other UIUC Calendars", name: "OUR - Symposium calendar", url: "https://calendars.illinois.edu/list/6178", notes: "via UIUC calendar", active: true },
  { id: 597, category: "Other UIUC Calendars", name: "OUR - Master Calendar", url: "https://calendars.illinois.edu/list/6175", notes: "via UIUC calendar", active: true },
  { id: 598, category: "Other UIUC Calendars", name: "Bike at Illinois Events", url: "https://calendars.illinois.edu/list/6242", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 599, category: "Colleges & Schools", name: "LAS 291 Fall 18 Assignment Due Dates", url: "https://calendars.illinois.edu/list/6277", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 600, category: "Other UIUC Calendars", name: "Neuroscience Program Events", url: "https://calendars.illinois.edu/list/6292", notes: "via UIUC calendar", active: true },
  { id: 601, category: "Other UIUC Calendars", name: "Society for Equity in Astronomy", url: "https://calendars.illinois.edu/list/6294", notes: "via UIUC calendar", active: true },
  { id: 602, category: "Other UIUC Calendars", name: "IPRH Master Calendar", url: "https://calendars.illinois.edu/list/6295", notes: "via UIUC calendar", active: true },
  { id: 603, category: "Other UIUC Calendars", name: "Homecoming", url: "https://calendars.illinois.edu/list/6241", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 604, category: "Colleges & Schools", name: "Anthropology Graduate Calendar", url: "https://calendars.illinois.edu/list/6238", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 605, category: "Other UIUC Calendars", name: "Calendar JP", url: "https://calendars.illinois.edu/list/6273", notes: "via UIUC calendar", active: true },
  { id: 606, category: "Other UIUC Calendars", name: "My Calendar", url: "https://calendars.illinois.edu/list/6250", notes: "via UIUC calendar", active: true },
  { id: 607, category: "Other UIUC Calendars", name: "Advith's Calendar", url: "https://calendars.illinois.edu/list/6261", notes: "via UIUC calendar", active: true },
  { id: 608, category: "Other UIUC Calendars", name: "ABE Events", url: "https://calendars.illinois.edu/list/6305", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 609, category: "Colleges & Schools", name: "LAS Success Workshops", url: "https://calendars.illinois.edu/list/6325", notes: "via UIUC calendar", active: true },
  { id: 610, category: "Colleges & Schools", name: "LAS Success Career Workshops", url: "https://calendars.illinois.edu/list/6317", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 611, category: "Other UIUC Calendars", name: "DPI Calendar", url: "https://calendars.illinois.edu/list/6316", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 612, category: "Colleges & Schools", name: "Carle Illinois College of Medicine General Events", url: "https://calendars.illinois.edu/list/6344", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 613, category: "Other UIUC Calendars", name: "Atmospheric Sciences Events-Master", url: "https://calendars.illinois.edu/list/6350", notes: "via UIUC calendar", active: true },
  { id: 614, category: "Other UIUC Calendars", name: "ACDIS Calendar", url: "https://calendars.illinois.edu/list/6330", notes: "via UIUC calendar", active: true },
  { id: 615, category: "Other UIUC Calendars", name: "Calendar", url: "https://calendars.illinois.edu/list/6346", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 616, category: "Colleges & Schools", name: "OCR Master Calendar - Select Centers + Engineering", url: "https://calendars.illinois.edu/list/6333", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 617, category: "Other UIUC Calendars", name: "TED Calendar", url: "https://calendars.illinois.edu/list/6355", notes: "via UIUC calendar", active: true },
  { id: 618, category: "Other UIUC Calendars", name: "Test Master Calendar (OCR)", url: "https://calendars.illinois.edu/list/6332", notes: "via UIUC calendar", active: true },
  { id: 619, category: "Other UIUC Calendars", name: "AITS Events", url: "https://calendars.illinois.edu/list/6393", notes: "via UIUC calendar", active: true },

  // ── Campus Recreation & Wellness ──
  { id: 620, category: "Campus Recreation & Wellness", name: "Health Maker Lab Calendar", url: "https://calendars.illinois.edu/list/6375", notes: "via UIUC calendar", active: true },

  // ── Arts & Performance ──
  { id: 621, category: "Arts & Performance", name: "Neuroscience of Dance Lab", url: "https://calendars.illinois.edu/list/6402", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 622, category: "Other UIUC Calendars", name: "IQUIST Master Calendar", url: "https://calendars.illinois.edu/list/6415", notes: "via UIUC calendar", active: true },
  { id: 623, category: "Other UIUC Calendars", name: "NRES Calendar", url: "https://calendars.illinois.edu/list/6413", notes: "via UIUC calendar", active: true },
  { id: 624, category: "Other UIUC Calendars", name: "ACE Calendar", url: "https://calendars.illinois.edu/list/6405", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 625, category: "Colleges & Schools", name: "Events | DEV ACES Master Calendar :: University of Illinois", url: "https://calendars.illinois.edu/list/6391", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 626, category: "Student Life & Cultural Centers", name: "ACES Office of International Programs", url: "https://calendars.illinois.edu/list/6383", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 627, category: "Other UIUC Calendars", name: "HDFS Calendar", url: "https://calendars.illinois.edu/list/6403", notes: "via UIUC calendar", active: true },
  { id: 628, category: "Other UIUC Calendars", name: "AITS Main Calendar", url: "https://calendars.illinois.edu/list/6392", notes: "via UIUC calendar", active: true },
  { id: 629, category: "Other UIUC Calendars", name: "DNS Calendar", url: "https://calendars.illinois.edu/list/6409", notes: "via UIUC calendar", active: true },
  { id: 630, category: "Other UIUC Calendars", name: "Newsletters | FSHN Calendar :: University of Illinois", url: "https://calendars.illinois.edu/list/6407", notes: "via UIUC calendar", active: true },
  { id: 631, category: "Other UIUC Calendars", name: "ABE Calendar", url: "https://calendars.illinois.edu/list/6410", notes: "via UIUC calendar", active: true },
  { id: 632, category: "Other UIUC Calendars", name: "ALEC Calendar", url: "https://calendars.illinois.edu/list/6412", notes: "via UIUC calendar", active: true },
  { id: 633, category: "Other UIUC Calendars", name: "ANSC Calendar", url: "https://calendars.illinois.edu/list/6411", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 634, category: "Colleges & Schools", name: "Gies Graduate Programs Admission Events", url: "https://calendars.illinois.edu/list/6430", notes: "via UIUC calendar", active: true },

  // ── Campus Recreation & Wellness ──
  { id: 635, category: "Campus Recreation & Wellness", name: "Summer 2019 Wellness Initiative", url: "https://calendars.illinois.edu/list/6445", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 636, category: "Colleges & Schools", name: "LAS Career Services", url: "https://calendars.illinois.edu/list/6435", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 637, category: "Other UIUC Calendars", name: "PRI Staff Events", url: "https://calendars.illinois.edu/list/6473", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 638, category: "Colleges & Schools", name: "Psychology Front Page", url: "https://calendars.illinois.edu/list/6421", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 639, category: "Other UIUC Calendars", name: "PRI Staff Training events", url: "https://calendars.illinois.edu/list/6474", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 640, category: "Colleges & Schools", name: "Entomology", url: "https://calendars.illinois.edu/list/6459", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 641, category: "Research Centers & Labs", name: "Illinois Global Institute", url: "https://calendars.illinois.edu/list/6457", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 642, category: "Other UIUC Calendars", name: "OCR Event Manager - Master Calendar", url: "https://calendars.illinois.edu/list/6467", notes: "via UIUC calendar", active: true },

  // ── Graduate & Academic Support ──
  { id: 643, category: "Graduate & Academic Support", name: "Calendar of Honors Opportunities Across Campus", url: "https://calendars.illinois.edu/list/6466", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 644, category: "Colleges & Schools", name: "Finance Events", url: "https://calendars.illinois.edu/list/6535", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 645, category: "Other UIUC Calendars", name: "COB Test Event Calendar", url: "https://calendars.illinois.edu/list/6530", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 646, category: "Colleges & Schools", name: "LAS Career Services Events", url: "https://calendars.illinois.edu/list/6499", notes: "via UIUC calendar", active: true },
  { id: 647, category: "Colleges & Schools", name: "English Department Master Calendar", url: "https://calendars.illinois.edu/list/6545", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 648, category: "Other UIUC Calendars", name: "PRI Staff Events (non-training)", url: "https://calendars.illinois.edu/list/6502", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 649, category: "Colleges & Schools", name: "High-Energy Theory Physics Master Calendar", url: "https://calendars.illinois.edu/list/6531", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 650, category: "Research Centers & Labs", name: "Illinois Global Institute Event", url: "https://calendars.illinois.edu/list/6549", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 651, category: "Other UIUC Calendars", name: "WIT Event Calendar", url: "https://calendars.illinois.edu/list/6498", notes: "via UIUC calendar", active: true },
  { id: 652, category: "Other UIUC Calendars", name: "Campuswide Microbial Systems Events", url: "https://calendars.illinois.edu/list/6548", notes: "via UIUC calendar", active: true },
  { id: 653, category: "Other UIUC Calendars", name: "PAPP Committee Schedule", url: "https://calendars.illinois.edu/list/6544", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 654, category: "Colleges & Schools", name: "Evolution, Ecology, and Behavior", url: "https://calendars.illinois.edu/list/6501", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 655, category: "Other UIUC Calendars", name: "Reservations 1013 ETMSW", url: "https://calendars.illinois.edu/list/6537", notes: "via UIUC calendar", active: true },
  { id: 656, category: "Other UIUC Calendars", name: "Master ALEC Calendar", url: "https://calendars.illinois.edu/list/6526", notes: "via UIUC calendar", active: true },

  // ── Campus Recreation & Wellness ──
  { id: 657, category: "Campus Recreation & Wellness", name: "Student Wellness Calendar", url: "https://calendars.illinois.edu/list/6543", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 658, category: "Other UIUC Calendars", name: "Illinois State Geological Survey Seminars", url: "https://calendars.illinois.edu/list/6560", notes: "via UIUC calendar", active: true },
  { id: 659, category: "Other UIUC Calendars", name: "HR Series Seminar Calendar", url: "https://calendars.illinois.edu/list/6571", notes: "via UIUC calendar", active: true },
  { id: 660, category: "Other UIUC Calendars", name: "Illinois State Water Survey events", url: "https://calendars.illinois.edu/list/6610", notes: "via UIUC calendar", active: true },
  { id: 661, category: "Other UIUC Calendars", name: "Illinois State Geological Survey Events (other)", url: "https://calendars.illinois.edu/list/6561", notes: "via UIUC calendar", active: true },
  { id: 662, category: "Other UIUC Calendars", name: "Illinois State Geological Survey-All Events", url: "https://calendars.illinois.edu/list/6562", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 663, category: "Colleges & Schools", name: "Physics - HEP-PH Master Calendar", url: "https://calendars.illinois.edu/list/6579", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 664, category: "Other UIUC Calendars", name: "Illinois ECE Alumni Events", url: "https://calendars.illinois.edu/list/6590", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 665, category: "Colleges & Schools", name: "Gies Internal (Master)", url: "https://calendars.illinois.edu/list/6581", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 666, category: "Other UIUC Calendars", name: "California Events", url: "https://calendars.illinois.edu/list/6608", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 667, category: "Research Centers & Labs", name: "Beckman and Campus Calendars", url: "https://calendars.illinois.edu/list/6577", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 668, category: "Other UIUC Calendars", name: "Jason's Calendar", url: "https://calendars.illinois.edu/list/6585", notes: "via UIUC calendar", active: true },
  { id: 669, category: "Other UIUC Calendars", name: "OB Grand Rounds Calendar", url: "https://calendars.illinois.edu/list/6555", notes: "via UIUC calendar", active: true },
  { id: 670, category: "Other UIUC Calendars", name: "CGS Master Calendar (New -- unlinked to website)", url: "https://calendars.illinois.edu/list/6595", notes: "via UIUC calendar", active: true },
  { id: 671, category: "Other UIUC Calendars", name: "MDF Test Calendar", url: "https://calendars.illinois.edu/list/6620", notes: "via UIUC calendar", active: true },
  { id: 672, category: "Other UIUC Calendars", name: "Sanjana Main", url: "https://calendars.illinois.edu/list/6557", notes: "via UIUC calendar", active: true },
  { id: 673, category: "Other UIUC Calendars", name: "FSA New Member Presentation and Shows", url: "https://calendars.illinois.edu/list/6665", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 674, category: "Colleges & Schools", name: "ACES Study Abroad", url: "https://calendars.illinois.edu/list/6666", notes: "via UIUC calendar", active: true },
  { id: 675, category: "Colleges & Schools", name: "Physics - Gravity Group Master Calendar", url: "https://calendars.illinois.edu/list/6656", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 676, category: "Student Life & Cultural Centers", name: "LAS International Programs Events", url: "https://calendars.illinois.edu/list/6634", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 677, category: "Other UIUC Calendars", name: "Cook County Master Naturalists Calendar", url: "https://calendars.illinois.edu/list/6696", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 678, category: "Research Centers & Labs", name: "IDEA Institute Event Calendar", url: "https://calendars.illinois.edu/list/6692", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 679, category: "Other UIUC Calendars", name: "Events | Master Visit Calendar - OAP :: University of Illinois", url: "https://calendars.illinois.edu/list/6641", notes: "via UIUC calendar", active: true },
  { id: 680, category: "Other UIUC Calendars", name: "Calendar", url: "https://calendars.illinois.edu/list/6649", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 681, category: "Research Centers & Labs", name: "IDEA Institute Master Calendar", url: "https://calendars.illinois.edu/list/6684", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 682, category: "Colleges & Schools", name: "Office of the Vice Chancellor for Access, Civil Rights & Community", url: "https://calendars.illinois.edu/list/6639", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 683, category: "Other UIUC Calendars", name: "F&S Training Calendar", url: "https://calendars.illinois.edu/list/6629", notes: "via UIUC calendar", active: true },
  { id: 684, category: "Other UIUC Calendars", name: "SCD Calendar of Calendars", url: "https://calendars.illinois.edu/list/6625", notes: "via UIUC calendar", active: true },
  { id: 685, category: "Other UIUC Calendars", name: "Huang513", url: "https://calendars.illinois.edu/list/6717", notes: "via UIUC calendar", active: true },

  // ── Campus Recreation & Wellness ──
  { id: 686, category: "Campus Recreation & Wellness", name: "Health Care Engineering Systems Center", url: "https://calendars.illinois.edu/list/6735", notes: "via UIUC calendar", active: true },
  { id: 687, category: "Campus Recreation & Wellness", name: "Department of Health Sciences Education & Pathology", url: "https://calendars.illinois.edu/list/6704", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 688, category: "Other UIUC Calendars", name: "We CU Events Calendar", url: "https://calendars.illinois.edu/list/6751", notes: "via UIUC calendar", active: true },
  { id: 689, category: "Other UIUC Calendars", name: "Widget Examples 1", url: "https://calendars.illinois.edu/list/6702", notes: "via UIUC calendar", active: true },
  { id: 690, category: "Other UIUC Calendars", name: "Illinois Water Resources Center Events", url: "https://calendars.illinois.edu/list/6700", notes: "via UIUC calendar", active: true },
  { id: 691, category: "Other UIUC Calendars", name: "IFPU Calendar", url: "https://calendars.illinois.edu/list/6714", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 692, category: "Research Centers & Labs", name: "Humanities Research Institute Calendar", url: "https://calendars.illinois.edu/list/6807", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 693, category: "Other UIUC Calendars", name: "REDCap Events", url: "https://calendars.illinois.edu/list/6780", notes: "via UIUC calendar", active: true },
  { id: 694, category: "Other UIUC Calendars", name: "Campus calendar", url: "https://calendars.illinois.edu/list/6821", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 695, category: "Research Centers & Labs", name: "HQAN Events", url: "https://calendars.illinois.edu/list/6822", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 696, category: "Other UIUC Calendars", name: "Illinois Remote Calendar", url: "https://calendars.illinois.edu/list/6781", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 697, category: "Student Life & Cultural Centers", name: "International Education", url: "https://calendars.illinois.edu/list/6783", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 698, category: "Colleges & Schools", name: "Physics - Condensed Matter Journal Club", url: "https://calendars.illinois.edu/list/6819", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 699, category: "Other UIUC Calendars", name: "Siebel School iCAN Calendar", url: "https://calendars.illinois.edu/list/6766", notes: "via UIUC calendar", active: true },

  // ── Arts & Performance ──
  { id: 700, category: "Arts & Performance", name: "Applied Technologies for Learning in the Arts & Sciences (ATLAS)", url: "https://calendars.illinois.edu/list/6791", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 701, category: "Student Life & Cultural Centers", name: "Illinois ECE Student Events Calendar", url: "https://calendars.illinois.edu/list/6805", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 702, category: "Colleges & Schools", name: "School of Information Sciences Undergrad MASTER CALENDAR", url: "https://calendars.illinois.edu/list/6793", notes: "via UIUC calendar", active: true },

  // ── Campus Recreation & Wellness ──
  { id: 703, category: "Campus Recreation & Wellness", name: "Dining Calendar", url: "https://calendars.illinois.edu/list/6894", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 704, category: "Colleges & Schools", name: "School of Social Work Continuing Education Events & Webinars Calendar", url: "https://calendars.illinois.edu/list/6825", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 705, category: "Research Centers & Labs", name: "Events &#8211; Center for AstroPhysical Surveys", url: "https://calendars.illinois.edu/list/6903", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 706, category: "Other UIUC Calendars", name: "ICASU Master Calendar", url: "https://calendars.illinois.edu/list/6860", notes: "via UIUC calendar", active: true },
  { id: 707, category: "Other UIUC Calendars", name: "Calendar", url: "https://calendars.illinois.edu/list/6855", notes: "via UIUC calendar", active: true },

  // ── Campus Recreation & Wellness ──
  { id: 708, category: "Campus Recreation & Wellness", name: "Campus Recreation Master Calendar", url: "https://calendars.illinois.edu/list/6876", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 709, category: "Other UIUC Calendars", name: "Campus Humanities Central Calendar", url: "https://calendars.illinois.edu/list/6850", notes: "via UIUC calendar", active: true },
  { id: 710, category: "Other UIUC Calendars", name: "Abbott Contractor Schedule", url: "https://calendars.illinois.edu/list/6835", notes: "via UIUC calendar", active: true },
  { id: 711, category: "Other UIUC Calendars", name: "Jean's Calendar", url: "https://calendars.illinois.edu/list/6893", notes: "via UIUC calendar", active: true },
  { id: 712, category: "Other UIUC Calendars", name: "Dr. Martin Luther King, Jr. Annual Celebration", url: "https://calendars.illinois.edu/list/6925", notes: "via UIUC calendar", active: true },
  { id: 713, category: "Other UIUC Calendars", name: "Transportation Seminar Master", url: "https://calendars.illinois.edu/list/6912", notes: "via UIUC calendar", active: true },
  { id: 714, category: "Other UIUC Calendars", name: "Transportation", url: "https://calendars.illinois.edu/list/6905", notes: "via UIUC calendar", active: true },
  { id: 715, category: "Other UIUC Calendars", name: "Kent Seminar Series", url: "https://calendars.illinois.edu/list/6932", notes: "via UIUC calendar", active: true },
  { id: 716, category: "Other UIUC Calendars", name: "Calendar", url: "https://calendars.illinois.edu/list/6927", notes: "via UIUC calendar", active: true },
  { id: 717, category: "Other UIUC Calendars", name: "RailTEC Master Calendar", url: "https://calendars.illinois.edu/list/6934", notes: "via UIUC calendar", active: true },
  { id: 718, category: "Other UIUC Calendars", name: "Transportation Event Master", url: "https://calendars.illinois.edu/list/6906", notes: "via UIUC calendar", active: true },
  { id: 719, category: "Other UIUC Calendars", name: "AE3 Calendar", url: "https://calendars.illinois.edu/list/6951", notes: "via UIUC calendar", active: true },
  { id: 720, category: "Other UIUC Calendars", name: "CPSC Seminars PMPB", url: "https://calendars.illinois.edu/list/6970", notes: "via UIUC calendar", active: true },
  { id: 721, category: "Other UIUC Calendars", name: "Child Care Resource Service Training Calendar", url: "https://calendars.illinois.edu/list/6978", notes: "via UIUC calendar", active: true },
  { id: 722, category: "Other UIUC Calendars", name: "CPSC Calendar", url: "https://calendars.illinois.edu/list/6969", notes: "via UIUC calendar", active: true },
  { id: 723, category: "Other UIUC Calendars", name: "Calendar___1", url: "https://calendars.illinois.edu/list/6990", notes: "via UIUC calendar", active: true },
  { id: 724, category: "Other UIUC Calendars", name: "Siebel School CARES Office Hours", url: "https://calendars.illinois.edu/list/7009", notes: "via UIUC calendar", active: true },
  { id: 725, category: "Other UIUC Calendars", name: "Campus Teaching & Learning Events", url: "https://calendars.illinois.edu/list/6965", notes: "via UIUC calendar", active: true },
  { id: 726, category: "Other UIUC Calendars", name: "Illinois Mobile App Master Calendar", url: "https://calendars.illinois.edu/list/6991", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 727, category: "Research Centers & Labs", name: "ETL Computer Lab Reservation- ETMSW 2027", url: "https://calendars.illinois.edu/list/7023", notes: "via UIUC calendar", active: true },
  { id: 728, category: "Research Centers & Labs", name: "NCSA Training and Seminars", url: "https://calendars.illinois.edu/list/7026", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 729, category: "Other UIUC Calendars", name: "Siebel School Colloquium Series", url: "https://calendars.illinois.edu/list/7047", notes: "via UIUC calendar", active: true },
  { id: 730, category: "Other UIUC Calendars", name: "Upcoming Events", url: "https://calendars.illinois.edu/list/7041", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 731, category: "Colleges & Schools", name: "NetMath Holidays Calendar", url: "https://calendars.illinois.edu/list/7037", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 732, category: "Other UIUC Calendars", name: "ICTW Events", url: "https://calendars.illinois.edu/list/7057", notes: "via UIUC calendar", active: true },
  { id: 733, category: "Other UIUC Calendars", name: "Siebel School Speaker Series Master Calendar", url: "https://calendars.illinois.edu/list/7046", notes: "via UIUC calendar", active: true },
  { id: 734, category: "Other UIUC Calendars", name: "CEE Master Calendar (Internal)", url: "https://calendars.illinois.edu/list/7050", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 735, category: "Research Centers & Labs", name: "Siebel School Undergraduate Research", url: "https://calendars.illinois.edu/list/7029", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 736, category: "Other UIUC Calendars", name: "Reservations 3252 ETMSW", url: "https://calendars.illinois.edu/list/7031", notes: "via UIUC calendar", active: true },
  { id: 737, category: "Other UIUC Calendars", name: "Calendar", url: "https://calendars.illinois.edu/list/7072", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 738, category: "Colleges & Schools", name: "Illinois School of Architecture Lecture Series", url: "https://calendars.illinois.edu/list/7113", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 739, category: "Other UIUC Calendars", name: "NRES Seminars", url: "https://calendars.illinois.edu/list/7076", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 740, category: "Colleges & Schools", name: "General Events - Department of Mathematics", url: "https://calendars.illinois.edu/list/7079", notes: "via UIUC calendar", active: true },

  // ── Graduate & Academic Support ──
  { id: 741, category: "Graduate & Academic Support", name: "Siebel School Postdoc Events", url: "https://calendars.illinois.edu/list/7123", notes: "via UIUC calendar", active: true },

  // ── Arts & Performance ──
  { id: 742, category: "Arts & Performance", name: "Spurlock Museum Master Calendar", url: "https://calendars.illinois.edu/list/7087", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 743, category: "Other UIUC Calendars", name: "Test Calendar (Main)", url: "https://calendars.illinois.edu/list/7098", notes: "via UIUC calendar", active: true },
  { id: 744, category: "Other UIUC Calendars", name: "HR Subcommittee", url: "https://calendars.illinois.edu/list/7152", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 745, category: "Student Life & Cultural Centers", name: "iDegrees Student Activity Calendar", url: "https://calendars.illinois.edu/list/7139", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 746, category: "Colleges & Schools", name: "Data management & Analytics (DMA) Subcommittee", url: "https://calendars.illinois.edu/list/7155", notes: "via UIUC calendar", active: true },
  { id: 747, category: "Colleges & Schools", name: "Illinois School of Architecture Events", url: "https://calendars.illinois.edu/list/7127", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 748, category: "Student Life & Cultural Centers", name: "Student Subcommittee", url: "https://calendars.illinois.edu/list/7148", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 749, category: "Other UIUC Calendars", name: "ESGC Main/Master Calendar", url: "https://calendars.illinois.edu/list/7149", notes: "via UIUC calendar", active: true },
  { id: 750, category: "Other UIUC Calendars", name: "UI Enterprise Systems Governance Committee", url: "https://calendars.illinois.edu/list/7153", notes: "via UIUC calendar", active: true },

  // ── Graduate & Academic Support ──
  { id: 751, category: "Graduate & Academic Support", name: "Events of Interest to School of MCB undergraduates", url: "https://calendars.illinois.edu/list/7163", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 752, category: "Other UIUC Calendars", name: "Cross-Functional Subcommittee", url: "https://calendars.illinois.edu/list/7154", notes: "via UIUC calendar", active: true },
  { id: 753, category: "Other UIUC Calendars", name: "ABE COE Committee Highlighted Events", url: "https://calendars.illinois.edu/list/7180", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 754, category: "Colleges & Schools", name: "ACES Seminars", url: "https://calendars.illinois.edu/list/7146", notes: "via UIUC calendar", active: true },
  { id: 755, category: "Colleges & Schools", name: "Finance (FSC) Subcommittee", url: "https://calendars.illinois.edu/list/7156", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 756, category: "Other UIUC Calendars", name: "CC Master Calendar", url: "https://calendars.illinois.edu/list/7157", notes: "via UIUC calendar", active: true },

  // ── Graduate & Academic Support ──
  { id: 757, category: "Graduate & Academic Support", name: "Campuswide Study Abroad Events", url: "https://calendars.illinois.edu/list/7181", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 758, category: "Other UIUC Calendars", name: "Creative Writing Upcoming Events", url: "https://calendars.illinois.edu/list/7210", notes: "via UIUC calendar", active: true },
  { id: 759, category: "Other UIUC Calendars", name: "SCD - Programs & Events", url: "https://calendars.illinois.edu/list/7223", notes: "via UIUC calendar", active: true },
  { id: 760, category: "Other UIUC Calendars", name: "SCD - Shop & Labs", url: "https://calendars.illinois.edu/list/7224", notes: "via UIUC calendar", active: true },
  { id: 761, category: "Other UIUC Calendars", name: "SLCL Event Calendar", url: "https://calendars.illinois.edu/list/7213", notes: "via UIUC calendar", active: true },
  { id: 762, category: "Other UIUC Calendars", name: "Early Learning Events in Illinois", url: "https://calendars.illinois.edu/list/7201", notes: "via UIUC calendar", active: true },
  { id: 763, category: "Other UIUC Calendars", name: "IUIN Ecosystem Events", url: "https://calendars.illinois.edu/list/7235", notes: "via UIUC calendar", active: true },
  { id: 764, category: "Other UIUC Calendars", name: "University Primary School", url: "https://calendars.illinois.edu/list/7187", notes: "via UIUC calendar", active: true },
  { id: 765, category: "Other UIUC Calendars", name: "Access Point, All Events", url: "https://calendars.illinois.edu/list/7222", notes: "via UIUC calendar", active: true },
  { id: 766, category: "Other UIUC Calendars", name: "*Master Calendar", url: "https://calendars.illinois.edu/list/7234", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 767, category: "Research Centers & Labs", name: "Undergraduate Research Master Calendar", url: "https://calendars.illinois.edu/list/7239", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 768, category: "Other UIUC Calendars", name: "*Master Calendar", url: "https://calendars.illinois.edu/list/7266", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 769, category: "Colleges & Schools", name: "Chemical & Biomolecular Engineering - Internal Events", url: "https://calendars.illinois.edu/list/7246", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 770, category: "Other UIUC Calendars", name: "University High School Master Calendar", url: "https://calendars.illinois.edu/list/7274", notes: "via UIUC calendar", active: true },
  { id: 771, category: "Other UIUC Calendars", name: "Microreactor Project Calendar", url: "https://calendars.illinois.edu/list/7301", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 772, category: "Colleges & Schools", name: "Physics - Nuclear Physics Seminar", url: "https://calendars.illinois.edu/list/7296", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 773, category: "Other UIUC Calendars", name: "Informatics Mater Calendar", url: "https://calendars.illinois.edu/list/7320", notes: "via UIUC calendar", active: true },
  { id: 774, category: "Other UIUC Calendars", name: "Important Academic & Holiday Dates", url: "https://calendars.illinois.edu/list/7341", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 775, category: "Colleges & Schools", name: "World Language Teacher Education Program", url: "https://calendars.illinois.edu/list/7356", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 776, category: "Other UIUC Calendars", name: "SCD- Workshops and Seminars", url: "https://calendars.illinois.edu/list/7408", notes: "via UIUC calendar", active: true },
  { id: 777, category: "Other UIUC Calendars", name: "FAST Center of Illinois Calendar", url: "https://calendars.illinois.edu/list/7367", notes: "via UIUC calendar", active: true },
  { id: 778, category: "Other UIUC Calendars", name: "Mind in Vitro: an NSF Expedition In Computing", url: "https://calendars.illinois.edu/list/7378", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 779, category: "Student Life & Cultural Centers", name: "Chemistry Diversity, Equity, and Inclusion Events", url: "https://calendars.illinois.edu/list/7401", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 780, category: "Colleges & Schools", name: "ATLAS Internship Master Calendar", url: "https://calendars.illinois.edu/list/7360", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 781, category: "Other UIUC Calendars", name: "CPSC Seminars", url: "https://calendars.illinois.edu/list/7418", notes: "via UIUC calendar", active: true },
  { id: 782, category: "Other UIUC Calendars", name: "Sexual Assault Awareness Month (SAAM) Calendar", url: "https://calendars.illinois.edu/list/7364", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 783, category: "Colleges & Schools", name: "Mathematics Seminar Series: Topology", url: "https://calendars.illinois.edu/list/7417", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 784, category: "Other UIUC Calendars", name: "Digital Sign Events - Turner Hall", url: "https://calendars.illinois.edu/list/7428", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 785, category: "Colleges & Schools", name: "Mathematics Seminar Series: Harmonic Analysis and Differential Equations (HADES)", url: "https://calendars.illinois.edu/list/7454", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 786, category: "Other UIUC Calendars", name: "Office for Access & Equity event calendar", url: "https://calendars.illinois.edu/list/7444", notes: "via UIUC calendar", active: true },
  { id: 787, category: "Other UIUC Calendars", name: "Lemann Center Events", url: "https://calendars.illinois.edu/list/7460", notes: "via UIUC calendar", active: true },
  { id: 788, category: "Other UIUC Calendars", name: "AITS Appscertify Calendar", url: "https://calendars.illinois.edu/list/7456", notes: "via UIUC calendar", active: true },

  // ── Campus Recreation & Wellness ──
  { id: 789, category: "Campus Recreation & Wellness", name: "Family & Graduate Housing - Event Calendar (Apartments)", url: "https://calendars.illinois.edu/list/7439", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 790, category: "Other UIUC Calendars", name: "Test calendar", url: "https://calendars.illinois.edu/list/7491", notes: "via UIUC calendar", active: true },
  { id: 791, category: "Other UIUC Calendars", name: "CPSC Defenses", url: "https://calendars.illinois.edu/list/7537", notes: "via UIUC calendar", active: true },
  { id: 792, category: "Other UIUC Calendars", name: "REMAT Event Calendar", url: "https://calendars.illinois.edu/list/7545", notes: "via UIUC calendar", active: true },
  { id: 793, category: "Other UIUC Calendars", name: "MCB Internal Master Calendar", url: "https://calendars.illinois.edu/list/7509", notes: "via UIUC calendar", active: true },

  // ── Campus Recreation & Wellness ──
  { id: 794, category: "Campus Recreation & Wellness", name: "University Housing Important Dates", url: "https://calendars.illinois.edu/list/7523", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 795, category: "Other UIUC Calendars", name: "Teaching, Learning, and Academic Support", url: "https://calendars.illinois.edu/list/7565", notes: "via UIUC calendar", active: true },

  // ── Graduate & Academic Support ──
  { id: 796, category: "Graduate & Academic Support", name: "WRC Career Development", url: "https://calendars.illinois.edu/list/7614", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 797, category: "Colleges & Schools", name: "Survivor Strategies", url: "https://calendars.illinois.edu/list/7615", notes: "via UIUC calendar", active: true },
  { id: 798, category: "Colleges & Schools", name: "Pre-Law Master Calendar", url: "https://calendars.illinois.edu/list/7557", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 799, category: "Student Life & Cultural Centers", name: "Women's Resources Center", url: "https://calendars.illinois.edu/list/7566", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 800, category: "Colleges & Schools", name: "College of Dentistry Internal Calendar", url: "https://calendars.illinois.edu/list/7563", notes: "via UIUC calendar", active: true },
  { id: 801, category: "Colleges & Schools", name: "College of Dentistry - Internal Event Calendar", url: "https://calendars.illinois.edu/list/7588", notes: "via UIUC calendar", active: true },

  // ── Athletics ──
  { id: 802, category: "Athletics", name: "Illini Union Staff Training & Development", url: "https://calendars.illinois.edu/list/7594", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 803, category: "Research Centers & Labs", name: "Research Seminars @ Illinois", url: "https://calendars.illinois.edu/list/7604", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 804, category: "Other UIUC Calendars", name: "Ecojustice Series 2026", url: "https://calendars.illinois.edu/list/7616", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 805, category: "Colleges & Schools", name: "Mathematics Seminar Series: Combinatorics", url: "https://calendars.illinois.edu/list/7638", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 806, category: "Other UIUC Calendars", name: "LER Seminar Series", url: "https://calendars.illinois.edu/list/7617", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 807, category: "Colleges & Schools", name: "Mathematics Seminar Series: Probability", url: "https://calendars.illinois.edu/list/7643", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 808, category: "Other UIUC Calendars", name: "ARC Gym 1 Court Availability", url: "https://calendars.illinois.edu/list/7635", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 809, category: "Colleges & Schools", name: "Mathematics Seminar Series: Groups, Geometry, and Topology", url: "https://calendars.illinois.edu/list/7676", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 810, category: "Student Life & Cultural Centers", name: "A-WIS (Academic Women in STEAM) Calendar", url: "https://calendars.illinois.edu/list/7651", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 811, category: "Other UIUC Calendars", name: "OAE Workforce Equity event calendar", url: "https://calendars.illinois.edu/list/7663", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 812, category: "Colleges & Schools", name: "Mathematics Seminar Series: Algebraic Geometry", url: "https://calendars.illinois.edu/list/7671", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 813, category: "Other UIUC Calendars", name: "Employee Learning & Organizational Effectiveness", url: "https://calendars.illinois.edu/list/7675", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 814, category: "Research Centers & Labs", name: "Illinois Institute for Rehabilitation and Employment Research", url: "https://calendars.illinois.edu/list/7619", notes: "via UIUC calendar", active: true },
  { id: 815, category: "Research Centers & Labs", name: "Mathematics Seminar Series: Quantum Working Group", url: "https://calendars.illinois.edu/list/7652", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 816, category: "Other UIUC Calendars", name: "SWTCIE Illinois Events", url: "https://calendars.illinois.edu/list/7620", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 817, category: "Student Life & Cultural Centers", name: "Chemical & Biomolecular Engineering - Cultural and Community Events Master calendar", url: "https://calendars.illinois.edu/list/7677", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 818, category: "Colleges & Schools", name: "Grainger Engineering in Chicago Calendar", url: "https://calendars.illinois.edu/list/7705", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 819, category: "Other UIUC Calendars", name: "ACE Seminars", url: "https://calendars.illinois.edu/list/7687", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 820, category: "Colleges & Schools", name: "Carle Illinois College of Medicine OFAD Professional Development Events", url: "https://calendars.illinois.edu/list/7692", notes: "via UIUC calendar", active: true },
  { id: 821, category: "Colleges & Schools", name: "Mathematical Biology Calendar", url: "https://calendars.illinois.edu/list/7724", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 822, category: "Other UIUC Calendars", name: "Civic Life Master Calendar", url: "https://calendars.illinois.edu/list/7702", notes: "via UIUC calendar", active: true },
  { id: 823, category: "Other UIUC Calendars", name: "Phys Test Master calendar", url: "https://calendars.illinois.edu/list/7684", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 824, category: "Colleges & Schools", name: "Mathematics Seminar Series: Algebra, Geometry, and Combinatorics", url: "https://calendars.illinois.edu/list/7695", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 825, category: "Other UIUC Calendars", name: "Department of Communication Calendar", url: "https://calendars.illinois.edu/list/7698", notes: "via UIUC calendar", active: true },
  { id: 826, category: "Other UIUC Calendars", name: "CSEC Event Calendar", url: "https://calendars.illinois.edu/list/7700", notes: "via UIUC calendar", active: true },
  { id: 827, category: "Other UIUC Calendars", name: "QCB master calendar", url: "https://calendars.illinois.edu/list/7721", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 828, category: "Colleges & Schools", name: "PRI Media Calendar", url: "https://calendars.illinois.edu/list/7718", notes: "via UIUC calendar", active: true },
  { id: 829, category: "Colleges & Schools", name: "Engineering IT - Instructional Events", url: "https://calendars.illinois.edu/list/7741", notes: "via UIUC calendar", active: true },

  // ── Campus Recreation & Wellness ──
  { id: 830, category: "Campus Recreation & Wellness", name: "Housing Events", url: "https://calendars.illinois.edu/list/7746", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 831, category: "Other UIUC Calendars", name: "ILC Weekly Workshop Series", url: "https://calendars.illinois.edu/list/7763", notes: "via UIUC calendar", active: true },
  { id: 832, category: "Other UIUC Calendars", name: "CLIMB Events", url: "https://calendars.illinois.edu/list/7728", notes: "via UIUC calendar", active: true },
  { id: 833, category: "Other UIUC Calendars", name: "Lunch on Us", url: "https://calendars.illinois.edu/list/7751", notes: "via UIUC calendar", active: true },
  { id: 834, category: "Other UIUC Calendars", name: "IMMERSE Master Calendar", url: "https://calendars.illinois.edu/list/7777", notes: "via UIUC calendar", active: true },
  { id: 835, category: "Other UIUC Calendars", name: "QCB Event Calendar", url: "https://calendars.illinois.edu/list/7769", notes: "via UIUC calendar", active: true },
  { id: 836, category: "Other UIUC Calendars", name: "CLIMB Calendar", url: "https://calendars.illinois.edu/list/7727", notes: "via UIUC calendar", active: true },
  { id: 837, category: "Other UIUC Calendars", name: "IMMERSE Events", url: "https://calendars.illinois.edu/list/7778", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 838, category: "Research Centers & Labs", name: "Center for Digital Agriculture", url: "https://calendars.illinois.edu/list/7725", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 839, category: "Other UIUC Calendars", name: "Seminars of Interest", url: "https://calendars.illinois.edu/list/7738", notes: "via UIUC calendar", active: true },
  { id: 840, category: "Other UIUC Calendars", name: "Test AI Events Search", url: "https://calendars.illinois.edu/list/7744", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 841, category: "Colleges & Schools", name: "Mathematics Seminar Series: Analysis", url: "https://calendars.illinois.edu/list/7802", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 842, category: "Research Centers & Labs", name: "Institute of Communications Research (ICR) Events, College of Media", url: "https://calendars.illinois.edu/list/7804", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 843, category: "Student Life & Cultural Centers", name: "Women in Engineering", url: "https://calendars.illinois.edu/list/7823", notes: "via UIUC calendar", active: true },
  { id: 844, category: "Student Life & Cultural Centers", name: "Women in Engineering", url: "https://calendars.illinois.edu/list/7822", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 845, category: "Other UIUC Calendars", name: "UIUC PDH Events for Educators", url: "https://calendars.illinois.edu/list/7799", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 846, category: "Colleges & Schools", name: "ACES Alumni Association", url: "https://calendars.illinois.edu/list/7832", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 847, category: "Other UIUC Calendars", name: "Calendar", url: "https://calendars.illinois.edu/list/7820", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 848, category: "Student Life & Cultural Centers", name: "Native American House", url: "https://calendars.illinois.edu/list/7827", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 849, category: "Colleges & Schools", name: "Developing Equity-Minded Engineering Practitioners Center (DEEP)", url: "https://calendars.illinois.edu/list/7872", notes: "via UIUC calendar", active: true },

  // ── Campus Recreation & Wellness ──
  { id: 850, category: "Campus Recreation & Wellness", name: "Counseling Center Master", url: "https://calendars.illinois.edu/list/7864", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 851, category: "Other UIUC Calendars", name: "UIF Master Calendar", url: "https://calendars.illinois.edu/list/7882", notes: "via UIUC calendar", active: true },
  { id: 852, category: "Other UIUC Calendars", name: "Food For The Soul", url: "https://calendars.illinois.edu/list/7932", notes: "via UIUC calendar", active: true },
  { id: 853, category: "Other UIUC Calendars", name: "NURail CoE Calendar", url: "https://calendars.illinois.edu/list/7899", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 854, category: "Student Life & Cultural Centers", name: "First Generation Student Initiatives FGSI Calendar", url: "https://calendars.illinois.edu/list/7917", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 855, category: "Other UIUC Calendars", name: "UIF L&D", url: "https://calendars.illinois.edu/list/7889", notes: "via UIUC calendar", active: true },
  { id: 856, category: "Other UIUC Calendars", name: "PEEC", url: "https://calendars.illinois.edu/list/7893", notes: "via UIUC calendar", active: true },

  // ── Campus Recreation & Wellness ──
  { id: 857, category: "Campus Recreation & Wellness", name: "Master of Health Administration Program Events", url: "https://calendars.illinois.edu/list/7922", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 858, category: "Other UIUC Calendars", name: "IU Board Master Calendar", url: "https://calendars.illinois.edu/list/7935", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 859, category: "Colleges & Schools", name: "ACES ODEI", url: "https://calendars.illinois.edu/list/7907", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 860, category: "Other UIUC Calendars", name: "IU Board Meeting Calendar", url: "https://calendars.illinois.edu/list/7936", notes: "via UIUC calendar", active: true },
  { id: 861, category: "Other UIUC Calendars", name: "IU Board Events", url: "https://calendars.illinois.edu/list/7937", notes: "via UIUC calendar", active: true },
  { id: 862, category: "Other UIUC Calendars", name: "NURail CoE Master Calendar", url: "https://calendars.illinois.edu/list/7898", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 863, category: "Colleges & Schools", name: "Plant Biology", url: "https://calendars.illinois.edu/list/7894", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 864, category: "Research Centers & Labs", name: "IBM-Illinois Discovery Accelerator Institute", url: "https://calendars.illinois.edu/list/7949", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 865, category: "Colleges & Schools", name: "LAS Inclusive Excellence", url: "https://calendars.illinois.edu/list/7963", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 866, category: "Other UIUC Calendars", name: "Chez Veterans Center", url: "https://calendars.illinois.edu/list/7986", notes: "via UIUC calendar", active: true },

  // ── Campus Recreation & Wellness ──
  { id: 867, category: "Campus Recreation & Wellness", name: "Master of Public Health Program Events", url: "https://calendars.illinois.edu/list/7939", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 868, category: "Colleges & Schools", name: "Bioengineering Master Calendar", url: "https://calendars.illinois.edu/list/7955", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 869, category: "Other UIUC Calendars", name: "Chicago Tech Insider", url: "https://calendars.illinois.edu/list/7948", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 870, category: "Student Life & Cultural Centers", name: "Bruce D. Nesbitt African American Cultural Center", url: "https://calendars.illinois.edu/list/7997", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 871, category: "Colleges & Schools", name: "English Department Internal Events", url: "https://calendars.illinois.edu/list/7989", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 872, category: "Other UIUC Calendars", name: "South Asia General Events", url: "https://calendars.illinois.edu/list/8000", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 873, category: "Research Centers & Labs", name: "Frank Center for Leadership and Innovation in Media Events, College of Media", url: "https://calendars.illinois.edu/list/7987", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 874, category: "Other UIUC Calendars", name: "Jewish Studies Calendar", url: "https://calendars.illinois.edu/list/8006", notes: "via UIUC calendar", active: true },
  { id: 875, category: "Other UIUC Calendars", name: "HMNTL Seminar Series", url: "https://calendars.illinois.edu/list/8027", notes: "via UIUC calendar", active: true },
  { id: 876, category: "Other UIUC Calendars", name: "Illinois ADVANCE (I-ADVANCE) Program", url: "https://calendars.illinois.edu/list/8021", notes: "via UIUC calendar", active: true },
  { id: 877, category: "Other UIUC Calendars", name: "WLTE Master Calendar", url: "https://calendars.illinois.edu/list/8017", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 878, category: "Research Centers & Labs", name: "EngageNCSA Lightning Talks", url: "https://calendars.illinois.edu/list/8034", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 879, category: "Other UIUC Calendars", name: "Traveling Science Center Events", url: "https://calendars.illinois.edu/list/8051", notes: "via UIUC calendar", active: true },
  { id: 880, category: "Other UIUC Calendars", name: "CITL Master Calendar (test)", url: "https://calendars.illinois.edu/list/8066", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 881, category: "Colleges & Schools", name: "History internal events", url: "https://calendars.illinois.edu/list/8094", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 882, category: "Other UIUC Calendars", name: "Test WBS Calendar", url: "https://calendars.illinois.edu/list/8096", notes: "via UIUC calendar", active: true },

  // ── Arts & Performance ──
  { id: 883, category: "Arts & Performance", name: "College of Media Department of Media & Cinema Studies Events", url: "https://calendars.illinois.edu/list/8114", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 884, category: "Other UIUC Calendars", name: "CLC-Table Reservations", url: "https://calendars.illinois.edu/list/8110", notes: "via UIUC calendar", active: true },
  { id: 885, category: "Other UIUC Calendars", name: "Illinois Forum on Human Flourishing in a Digital Age event calendar", url: "https://calendars.illinois.edu/list/8093", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 886, category: "Colleges & Schools", name: "History Department Master Calendar", url: "https://calendars.illinois.edu/list/8095", notes: "via UIUC calendar", active: true },
  { id: 887, category: "Colleges & Schools", name: "Philosophy Master Calendar", url: "https://calendars.illinois.edu/list/8092", notes: "via UIUC calendar", active: true },

  // ── Campus Recreation & Wellness ──
  { id: 888, category: "Campus Recreation & Wellness", name: "Campus Wellness Events", url: "https://calendars.illinois.edu/list/8099", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 889, category: "Other UIUC Calendars", name: "Cultivating Care Garden", url: "https://calendars.illinois.edu/list/8129", notes: "via UIUC calendar", active: true },
  { id: 890, category: "Other UIUC Calendars", name: "DRI Calendar", url: "https://calendars.illinois.edu/list/8120", notes: "via UIUC calendar", active: true },
  { id: 891, category: "Other UIUC Calendars", name: "*Master Calendar MG Unit 26", url: "https://calendars.illinois.edu/list/8132", notes: "via UIUC calendar", active: true },
  { id: 892, category: "Other UIUC Calendars", name: "Global Relations Calendar", url: "https://calendars.illinois.edu/list/8121", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 893, category: "Colleges & Schools", name: "Webinars and In Person Education: MG MN Unit 26", url: "https://calendars.illinois.edu/list/8137", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 894, category: "Other UIUC Calendars", name: "IMMERSE Seminar Series", url: "https://calendars.illinois.edu/list/8172", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 895, category: "Colleges & Schools", name: "Mathematics Seminar Series: Geometric Analysis", url: "https://calendars.illinois.edu/list/8151", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 896, category: "Other UIUC Calendars", name: "Speakers Workshop Calendar", url: "https://calendars.illinois.edu/list/8162", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 897, category: "Research Centers & Labs", name: "NCSA Quantum Calendar", url: "https://calendars.illinois.edu/list/8118", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 898, category: "Other UIUC Calendars", name: "Birding with Lily and Indigo 2026", url: "https://calendars.illinois.edu/list/8175", notes: "via UIUC calendar", active: true },
  { id: 899, category: "Other UIUC Calendars", name: "*Master Calendar MN Unit 26", url: "https://calendars.illinois.edu/list/8123", notes: "via UIUC calendar", active: true },
  { id: 900, category: "Other UIUC Calendars", name: "Calendar With Every Event Type", url: "https://calendars.illinois.edu/list/8168", notes: "via UIUC calendar", active: true },
  { id: 901, category: "Other UIUC Calendars", name: "ASRM Seminar Series", url: "https://calendars.illinois.edu/list/8212", notes: "via UIUC calendar", active: true },
  { id: 902, category: "Other UIUC Calendars", name: "CPSC Social Committee", url: "https://calendars.illinois.edu/list/8216", notes: "via UIUC calendar", active: true },

  // ── Arts & Performance ──
  { id: 903, category: "Arts & Performance", name: "Office for Arts Integration - Master Calendar", url: "https://calendars.illinois.edu/list/8187", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 904, category: "Other UIUC Calendars", name: "ASRM Event Calendar", url: "https://calendars.illinois.edu/list/8217", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 905, category: "Research Centers & Labs", name: "SkAI Institute Master Calendar", url: "https://calendars.illinois.edu/list/8222", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 906, category: "Other UIUC Calendars", name: "UIUCnewsbot", url: "https://calendars.illinois.edu/list/8177", notes: "via UIUC calendar", active: true },
  { id: 907, category: "Other UIUC Calendars", name: "SSIB Master Event Calendar", url: "https://calendars.illinois.edu/list/8197", notes: "via UIUC calendar", active: true },
  { id: 908, category: "Other UIUC Calendars", name: "Illinois Pathways to Partnerships Project Events", url: "https://calendars.illinois.edu/list/8253", notes: "via UIUC calendar", active: true },
  { id: 909, category: "Other UIUC Calendars", name: "Calendar", url: "https://calendars.illinois.edu/list/8270", notes: "via UIUC calendar", active: true },
  { id: 910, category: "Other UIUC Calendars", name: "Calendar", url: "https://calendars.illinois.edu/list/8228", notes: "via UIUC calendar", active: true },
  { id: 911, category: "Other UIUC Calendars", name: "MGMN Volunteer Opportunities Unit 26", url: "https://calendars.illinois.edu/list/8286", notes: "via UIUC calendar", active: true },
  { id: 912, category: "Other UIUC Calendars", name: "GPTS", url: "https://calendars.illinois.edu/list/8276", notes: "via UIUC calendar", active: true },
  { id: 913, category: "Other UIUC Calendars", name: "IIRER Staff Meetings", url: "https://calendars.illinois.edu/list/8289", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 914, category: "Research Centers & Labs", name: "Strategic Innovation", url: "https://calendars.illinois.edu/list/8263", notes: "via UIUC calendar", active: true },
  { id: 915, category: "Research Centers & Labs", name: "IIRER Staff Meetings/Holidays + Institute-Wide Events", url: "https://calendars.illinois.edu/list/8292", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 916, category: "Other UIUC Calendars", name: "Sexual Violence Prevention Events", url: "https://calendars.illinois.edu/list/8315", notes: "via UIUC calendar", active: true },
  { id: 917, category: "Other UIUC Calendars", name: "IIRER Events", url: "https://calendars.illinois.edu/list/8311", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 918, category: "Colleges & Schools", name: "Playful By Design Calendar", url: "https://calendars.illinois.edu/list/8319", notes: "via UIUC calendar", active: true },
  { id: 919, category: "Colleges & Schools", name: "Game Studies and Design", url: "https://calendars.illinois.edu/list/8317", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 920, category: "Other UIUC Calendars", name: "2025-26 Academic Calendar", url: "https://calendars.illinois.edu/list/8299", notes: "via UIUC calendar", active: true },
  { id: 921, category: "Other UIUC Calendars", name: "Vet Med Food Truck", url: "https://calendars.illinois.edu/list/8322", notes: "via UIUC calendar", active: true },

  // ── Libraries ──
  { id: 922, category: "Libraries", name: "Grainger Engineering Library Information Center Calendar", url: "https://calendars.illinois.edu/list/8326", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 923, category: "Student Life & Cultural Centers", name: "ASA DVM Student Calendar", url: "https://calendars.illinois.edu/list/8314", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 924, category: "Other UIUC Calendars", name: "Vet Med Clinical Rotations Block Calendar", url: "https://calendars.illinois.edu/list/8298", notes: "via UIUC calendar", active: true },
  { id: 925, category: "Other UIUC Calendars", name: "All Advancement Calendar", url: "https://calendars.illinois.edu/list/8324", notes: "via UIUC calendar", active: true },
  { id: 926, category: "Other UIUC Calendars", name: "Calendar", url: "https://calendars.illinois.edu/list/8332", notes: "via UIUC calendar", active: true },

  // ── Campus Recreation & Wellness ──
  { id: 927, category: "Campus Recreation & Wellness", name: "College of Applied Health Sciences (AHS) Calendar", url: "https://calendars.illinois.edu/list/8303", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 928, category: "Other UIUC Calendars", name: "SpaceMaRS Calendar", url: "https://calendars.illinois.edu/list/8347", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 929, category: "Student Life & Cultural Centers", name: "IMMERSE Graduate Student Council", url: "https://calendars.illinois.edu/list/8365", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 930, category: "Colleges & Schools", name: "Mathematics Social Events", url: "https://calendars.illinois.edu/list/8345", notes: "via UIUC calendar", active: true },

  // ── Graduate & Academic Support ──
  { id: 931, category: "Graduate & Academic Support", name: "Undergraduate Calendar", url: "https://calendars.illinois.edu/list/8341", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 932, category: "Other UIUC Calendars", name: "ODSR events", url: "https://calendars.illinois.edu/list/8385", notes: "via UIUC calendar", active: true },
  { id: 933, category: "Other UIUC Calendars", name: "Division of Exploratory Studies", url: "https://calendars.illinois.edu/list/8356", notes: "via UIUC calendar", active: true },
  { id: 934, category: "Other UIUC Calendars", name: "Persian Events Calender", url: "https://calendars.illinois.edu/list/8362", notes: "via UIUC calendar", active: true },
  { id: 935, category: "Other UIUC Calendars", name: "Persian Events Calender", url: "https://calendars.illinois.edu/list/8361", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 936, category: "Research Centers & Labs", name: "NCSA Events Calendar", url: "https://calendars.illinois.edu/list/8390", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 937, category: "Other UIUC Calendars", name: "Unit Homecoming Calendar 2026", url: "https://calendars.illinois.edu/list/8396", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 938, category: "Colleges & Schools", name: "LAS Educational Excellence", url: "https://calendars.illinois.edu/list/8405", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 939, category: "Other UIUC Calendars", name: "Exploratory Studies On-Site Partners", url: "https://calendars.illinois.edu/list/8400", notes: "via UIUC calendar", active: true },
  { id: 940, category: "Other UIUC Calendars", name: "BSSD Events", url: "https://calendars.illinois.edu/list/8408", notes: "via UIUC calendar", active: true },
  { id: 941, category: "Other UIUC Calendars", name: "Faculty Development at CITL", url: "https://calendars.illinois.edu/list/8428", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 942, category: "Colleges & Schools", name: "Carle Illinois College of Medicine - Mini Medical School", url: "https://calendars.illinois.edu/list/8420", notes: "via UIUC calendar", active: true },

  // ── Student Life & Cultural Centers ──
  { id: 943, category: "Student Life & Cultural Centers", name: "Asian American Heritage Month", url: "https://calendars.illinois.edu/list/8399", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 944, category: "Other UIUC Calendars", name: "Reflect. Grow. Go.", url: "https://calendars.illinois.edu/list/8429", notes: "via UIUC calendar", active: true },
  { id: 945, category: "Other UIUC Calendars", name: "ADA Coordinator Office Events", url: "https://calendars.illinois.edu/list/8455", notes: "via UIUC calendar", active: true },

  // ── Campus Recreation & Wellness ──
  { id: 946, category: "Campus Recreation & Wellness", name: "Wellness Hut Events", url: "https://calendars.illinois.edu/list/8468", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 947, category: "Other UIUC Calendars", name: "The Group Chat", url: "https://calendars.illinois.edu/list/8441", notes: "via UIUC calendar", active: true },
  { id: 948, category: "Other UIUC Calendars", name: "EXP Advising in Weston", url: "https://calendars.illinois.edu/list/8444", notes: "via UIUC calendar", active: true },
  { id: 949, category: "Other UIUC Calendars", name: "Outdoor Center Fields Availability", url: "https://calendars.illinois.edu/list/8459", notes: "via UIUC calendar", active: true },

  // ── Research Centers & Labs ──
  { id: 950, category: "Research Centers & Labs", name: "Fab Lab Event Calendar", url: "https://calendars.illinois.edu/list/8470", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 951, category: "Other UIUC Calendars", name: "Digital Sign Events - Plant Sciences", url: "https://calendars.illinois.edu/list/8463", notes: "via UIUC calendar", active: true },
  { id: 952, category: "Other UIUC Calendars", name: "Complex Fields Availability", url: "https://calendars.illinois.edu/list/8458", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 953, category: "Colleges & Schools", name: "Department of Mathematics: Graduate Seminar Series", url: "https://calendars.illinois.edu/list/8445", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 954, category: "Other UIUC Calendars", name: "Digital Sign Events - ERML", url: "https://calendars.illinois.edu/list/8465", notes: "via UIUC calendar", active: true },

  // ── Colleges & Schools ──
  { id: 955, category: "Colleges & Schools", name: "Engineering IT Calendar", url: "https://calendars.illinois.edu/list/8460", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 956, category: "Other UIUC Calendars", name: "Data Science Events", url: "https://calendars.illinois.edu/list/8494", notes: "via UIUC calendar", active: true },
  { id: 957, category: "Other UIUC Calendars", name: "4 - Wednesday, September 30", url: "https://calendars.illinois.edu/list/8508", notes: "via UIUC calendar", active: true },
  { id: 958, category: "Other UIUC Calendars", name: "1 - Sunday, September 27", url: "https://calendars.illinois.edu/list/8505", notes: "via UIUC calendar", active: true },

  // ── Campus Recreation & Wellness ──
  { id: 959, category: "Campus Recreation & Wellness", name: "Mental Health First Aid at Illinois", url: "https://calendars.illinois.edu/list/8484", notes: "via UIUC calendar", active: true },

  // ── Other UIUC Calendars ──
  { id: 960, category: "Other UIUC Calendars", name: "Greek Homecoming Calendar", url: "https://calendars.illinois.edu/list/8503", notes: "via UIUC calendar", active: true },
  { id: 961, category: "Other UIUC Calendars", name: "3 - Tuesday, September 29", url: "https://calendars.illinois.edu/list/8507", notes: "via UIUC calendar", active: true },
  { id: 962, category: "Other UIUC Calendars", name: "All Teacher Training Events", url: "https://calendars.illinois.edu/list/8483", notes: "via UIUC calendar", active: true },
  { id: 963, category: "Other UIUC Calendars", name: "Homecoming Featured Events", url: "https://calendars.illinois.edu/list/8502", notes: "via UIUC calendar", active: true },
  { id: 964, category: "Other UIUC Calendars", name: "8 - Multi-day events", url: "https://calendars.illinois.edu/list/8511", notes: "via UIUC calendar", active: true },
  { id: 965, category: "Other UIUC Calendars", name: "6 - Friday, October 2", url: "https://calendars.illinois.edu/list/8509", notes: "via UIUC calendar", active: true },
  { id: 966, category: "Other UIUC Calendars", name: "7 - Saturday, October 3 (Game Day)", url: "https://calendars.illinois.edu/list/8510", notes: "via UIUC calendar", active: true },
  { id: 967, category: "Other UIUC Calendars", name: "DPI Teacher Training Other Events", url: "https://calendars.illinois.edu/list/8504", notes: "via UIUC calendar", active: true },
  { id: 968, category: "Other UIUC Calendars", name: "2 - Monday, September 28", url: "https://calendars.illinois.edu/list/8506", notes: "via UIUC calendar", active: true },
  { id: 969, category: "Other UIUC Calendars", name: "DPI Teacher Training Public Events", url: "https://calendars.illinois.edu/list/8482", notes: "via UIUC calendar", active: true },
  { id: 970, category: "Other UIUC Calendars", name: "Reflect. Grow. Go.", url: "https://calendars.illinois.edu/list/8493", notes: "via UIUC calendar", active: true },
  { id: 971, category: "Other UIUC Calendars", name: "All Homecoming Events", url: "https://calendars.illinois.edu/list/8501", notes: "via UIUC calendar", active: true },
  { id: 972, category: "Other UIUC Calendars", name: "CITL Internal Workshop Calendar", url: "https://calendars.illinois.edu/list/8488", notes: "via UIUC calendar", active: true },

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
  "Graduate & Academic Support":     "bg-cyan-100 text-cyan-800",
  "Other UIUC Calendars":            "bg-gray-100 text-gray-800",
};
