export interface Source {
  id: number;
  category: string;
  name: string;
  url: string;
  notes: string;
  active: boolean;
}

export const initialSources: Source[] = [
  // Central Calendars
  { id: 1, category: "Central Calendars", name: "UIUC General Events Calendar", url: "https://calendars.illinois.edu/list/7", notes: "Main campus-wide event feed", active: true },
  { id: 2, category: "Central Calendars", name: "UIUC Academic Calendar", url: "https://calendars.illinois.edu/list/5", notes: "Academic dates and deadlines", active: true },
  { id: 3, category: "Central Calendars", name: "UIUC Advising & Placement Calendar", url: "https://calendars.illinois.edu/list/3", notes: "Career fairs, internship events", active: true },
  { id: 4, category: "Central Calendars", name: "UIUC Student Affairs Calendar", url: "https://calendars.illinois.edu/list/1771", notes: "Student life events", active: true },
  { id: 5, category: "Central Calendars", name: "Illinois Events (Main)", url: "https://illinois.edu/calendar/list/7", notes: "Top-level university event listing", active: true },

  // Colleges & Schools
  { id: 6, category: "Colleges & Schools", name: "Grainger College of Engineering – Events", url: "https://calendars.illinois.edu/list/2568", notes: "All engineering college events", active: true },
  { id: 7, category: "Colleges & Schools", name: "Grainger Student Engagement", url: "https://students.grainger.illinois.edu/events", notes: "CampusGroups-powered student events", active: true },
  { id: 8, category: "Colleges & Schools", name: "Gies College of Business – Events", url: "https://giesbusiness.illinois.edu/events", notes: "Business school events", active: true },
  { id: 9, category: "Colleges & Schools", name: "College of LAS – Events", url: "https://las.illinois.edu/news-events/events", notes: "Liberal Arts & Sciences events", active: true },
  { id: 10, category: "Colleges & Schools", name: "College of Fine & Applied Arts – Events", url: "https://faa.illinois.edu/events", notes: "Art, architecture, music, theatre, dance", active: true },
  { id: 11, category: "Colleges & Schools", name: "College of Education – Events", url: "https://education.illinois.edu/about/events", notes: "", active: true },
  { id: 12, category: "Colleges & Schools", name: "College of Law – Events", url: "https://law.illinois.edu/events", notes: "", active: true },
  { id: 13, category: "Colleges & Schools", name: "College of Media – Events", url: "https://media.illinois.edu/events", notes: "", active: true },
  { id: 14, category: "Colleges & Schools", name: "School of Social Work – Events", url: "https://socialwork.illinois.edu/about/events", notes: "", active: true },
  { id: 15, category: "Colleges & Schools", name: "College of Veterinary Medicine – Events", url: "https://vetmed.illinois.edu/about/events", notes: "", active: true },
  { id: 16, category: "Colleges & Schools", name: "College of Agricultural, Consumer & Environmental Sciences", url: "https://aces.illinois.edu/news-events/events", notes: "", active: true },
  { id: 17, category: "Colleges & Schools", name: "School of Information Sciences – Events", url: "https://ischool.illinois.edu/news-events/events", notes: "", active: true },
  { id: 18, category: "Colleges & Schools", name: "College of Applied Health Sciences – Events", url: "https://ahs.illinois.edu/events", notes: "", active: true },

  // Arts & Performance
  { id: 19, category: "Arts & Performance", name: "Krannert Center for the Performing Arts", url: "https://krannertcenter.com/calendar", notes: "Concerts, theatre, dance, opera", active: true },
  { id: 49, category: "Arts & Performance", name: "Illinois School of Music – Events", url: "https://music.illinois.edu/events/", notes: "Performances: bands, orchestras, choirs, chamber, guest artists", active: true },
  { id: 20, category: "Arts & Performance", name: "Krannert Art Museum", url: "https://kam.illinois.edu/events", notes: "Art exhibitions and public programs", active: true },
  { id: 21, category: "Arts & Performance", name: "State Farm Center", url: "https://www.statefarmcenter.com/events", notes: "Major concerts, sports, shows", active: true },
  { id: 22, category: "Arts & Performance", name: "Spurlock Museum – Events", url: "https://spurlock.illinois.edu/programs/index.html", notes: "Cultural events and exhibitions", active: true },

  // Libraries
  { id: 23, category: "Libraries", name: "University Library Events (LibCal)", url: "https://uiuc.libcal.com/calendar/events", notes: "All library events and workshops", active: true },
  { id: 24, category: "Libraries", name: "TLAS Library Events", url: "https://uiuc.libcal.com/calendar/tlasevents", notes: "Teaching & Learning programs", active: true },
  { id: 25, category: "Libraries", name: "Grainger Engineering Library", url: "https://library.illinois.edu/enx/events/", notes: "Engineering library events", active: true },

  // Research Centers & Labs
  { id: 26, category: "Research Centers & Labs", name: "Beckman Institute – Events", url: "https://beckman.illinois.edu/visit/events-at-beckman", notes: "Interdisciplinary research events", active: true },
  { id: 27, category: "Research Centers & Labs", name: "NCSA – Events", url: "https://events.ncsa.uiuc.edu/", notes: "Supercomputing, HPC workshops", active: true },
  { id: 28, category: "Research Centers & Labs", name: "Illinois Informatics Institute – Events", url: "https://informatics.illinois.edu/events", notes: "", active: true },
  { id: 29, category: "Research Centers & Labs", name: "Prairie Research Institute – Events", url: "https://prairie.illinois.edu/events/", notes: "Environmental and natural history", active: true },
  { id: 30, category: "Research Centers & Labs", name: "Center for Innovation in Teaching & Learning", url: "https://citl.illinois.edu/citl-101/events", notes: "Faculty/teaching workshops", active: true },

  // Design & Innovation
  { id: 31, category: "Design & Innovation", name: "Siebel Center for Design – Events", url: "https://designcenter.illinois.edu/events", notes: "Design thinking workshops & talks", active: true },
  { id: 32, category: "Design & Innovation", name: "EnterpriseWorks – Events", url: "https://researchpark.illinois.edu/enterpriseworks/events/", notes: "Startup & entrepreneurship events", active: true },
  { id: 33, category: "Design & Innovation", name: "Illinois Research Park – Events", url: "https://researchpark.illinois.edu/events/", notes: "Tech & corporate partner events", active: true },

  // Campus Recreation & Wellness
  { id: 34, category: "Campus Recreation & Wellness", name: "Campus Recreation – Activities", url: "https://campusrec.illinois.edu/activities", notes: "Intramurals, group fitness, aquatics", active: true },
  { id: 35, category: "Campus Recreation & Wellness", name: "Active Illini Portal", url: "https://active.illinois.edu/", notes: "Registration portal for rec programs", active: true },
  { id: 36, category: "Campus Recreation & Wellness", name: "McKinley Health Center – Events", url: "https://mckinley.illinois.edu/events", notes: "Health and wellness programming", active: true },

  { id: 50, category: "Campus Recreation & Wellness", name: "University Housing – Events Calendar", url: "https://calendars.illinois.edu/list/8091", notes: "Events in SDRP, ISR, dorms, and Housing-run programs", active: true },

  // Student Life & Cultural Centers
  { id: 37, category: "Student Life & Cultural Centers", name: "Illini Union – Events", url: "https://illiiniunion.illinois.edu/events", notes: "Union-hosted events and programs", active: true },
  { id: 38, category: "Student Life & Cultural Centers", name: "Asian American Cultural Center", url: "https://asianamericanculturalcenter.illinois.edu/events", notes: "", active: true },
  { id: 39, category: "Student Life & Cultural Centers", name: "Bruce D. Nesbitt African American Cultural Center", url: "https://afroam.illinois.edu/events", notes: "", active: true },
  { id: 40, category: "Student Life & Cultural Centers", name: "La Casa Cultural Latina", url: "https://lacasa.illinois.edu/events", notes: "", active: true },
  { id: 41, category: "Student Life & Cultural Centers", name: "Women's Resources Center", url: "https://wrc.illinois.edu/events", notes: "", active: true },
  { id: 42, category: "Student Life & Cultural Centers", name: "Gender & Sexuality Resource Center", url: "https://gsrc.illinois.edu/events", notes: "", active: true },
  { id: 43, category: "Student Life & Cultural Centers", name: "International Student and Scholar Services", url: "https://isss.illinois.edu/events", notes: "", active: true },
  { id: 44, category: "Student Life & Cultural Centers", name: "Illinois Student Government", url: "https://isg.illinois.edu/events", notes: "", active: true },

  // Athletics
  { id: 45, category: "Athletics", name: "Fighting Illini Athletics – Events", url: "https://fightingillini.com/calendar", notes: "All varsity sports schedules", active: true },
  { id: 46, category: "Athletics", name: "Big Ten Athletics Calendar", url: "https://calendars.illinois.edu/list/6022", notes: "Big Ten affiliated events", active: true },
];

export const CATEGORIES = [...new Set(initialSources.map(s => s.category))];
export const COLORS: Record<string, string> = {
  "Central Calendars": "bg-blue-100 text-blue-800",
  "Colleges & Schools": "bg-purple-100 text-purple-800",
  "Arts & Performance": "bg-pink-100 text-pink-800",
  "Libraries": "bg-yellow-100 text-yellow-800",
  "Research Centers & Labs": "bg-green-100 text-green-800",
  "Design & Innovation": "bg-orange-100 text-orange-800",
  "Campus Recreation & Wellness": "bg-teal-100 text-teal-800",
  "Student Life & Cultural Centers": "bg-red-100 text-red-800",
  "Athletics": "bg-indigo-100 text-indigo-800",
};