// Mock data for the Shared Discovery design experiment.
// Everything here is fictional: people, circles, videos and numbers are illustrative.

export type TopicId =
  | "ancient" | "architecture" | "nuclear" | "ai" | "philosophy" | "ocean" | "computing" | "urban"
  | "math" | "collective" | "psychology" | "energy" | "nature" | "craft" | "science";

export type Topic = { id: TopicId; label: string; pal: [string, string, string] };

export const TOPICS: Topic[] = [
  { id: "ancient", label: "Ancient civilizations", pal: ["#2b1a0e", "#b5702a", "#f3c26b"] },
  { id: "architecture", label: "Architecture", pal: ["#1c1714", "#8a4b2d", "#e8b98a"] },
  { id: "nuclear", label: "Nuclear energy", pal: ["#06201f", "#0d5f5a", "#5ff0d4"] },
  { id: "ai", label: "Artificial intelligence", pal: ["#0c0f2b", "#2b2f86", "#8fa2ff"] },
  { id: "philosophy", label: "Philosophy", pal: ["#17141f", "#4a3f66", "#d3c4f0"] },
  { id: "ocean", label: "Ocean life", pal: ["#02101f", "#0a3a63", "#5cc8ff"] },
  { id: "computing", label: "History of computing", pal: ["#15130f", "#5b4a24", "#f2c14e"] },
  { id: "urban", label: "Urban planning", pal: ["#0e1620", "#2f4a66", "#9cc4e8"] },
  { id: "math", label: "Mathematics of nature", pal: ["#0b1a12", "#1f5a3a", "#9af2b8"] },
  { id: "collective", label: "Collective intelligence", pal: ["#1d130c", "#6b4224", "#e0a45e"] },
  { id: "psychology", label: "Psychology", pal: ["#1f0e1b", "#6d2a5a", "#f29ad4"] },
  { id: "energy", label: "Energy systems", pal: ["#1a1807", "#5c5a12", "#f0e84a"] },
  { id: "nature", label: "Nature and biology", pal: ["#0a1a0c", "#2a5e22", "#b6f08a"] },
  { id: "craft", label: "Craft and culture", pal: ["#0d0d10", "#26262e", "#d9dde6"] },
  { id: "science", label: "History of science", pal: ["#0a1020", "#243a66", "#ffd98a"] },
];
export const topicLabel = (id: TopicId) => TOPICS.find((t) => t.id === id)!.label;

// How naturally one subject leads into another (0 to 1). Used to keep surprises plausible.
const ADJ: [TopicId, TopicId, number][] = [
  ["ai", "computing", 0.9], ["ai", "philosophy", 0.6], ["ai", "collective", 0.7], ["ai", "nuclear", 0.5],
  ["ai", "energy", 0.5], ["ai", "psychology", 0.5], ["computing", "math", 0.6], ["computing", "science", 0.5],
  ["computing", "ancient", 0.4], ["computing", "craft", 0.4], ["architecture", "urban", 0.9], ["architecture", "ancient", 0.7],
  ["architecture", "math", 0.6], ["architecture", "science", 0.5], ["architecture", "craft", 0.5], ["urban", "collective", 0.5],
  ["urban", "energy", 0.5], ["urban", "math", 0.4], ["nuclear", "energy", 0.9], ["nuclear", "science", 0.7],
  ["philosophy", "psychology", 0.8], ["philosophy", "science", 0.6], ["philosophy", "ancient", 0.5],
  ["psychology", "collective", 0.5], ["ocean", "nature", 0.9], ["ocean", "collective", 0.4], ["ocean", "science", 0.4],
  ["nature", "math", 0.6], ["nature", "collective", 0.7], ["craft", "ancient", 0.5], ["craft", "math", 0.5],
  ["science", "ancient", 0.5], ["science", "math", 0.6], ["energy", "science", 0.4], ["energy", "nature", 0.3],
];
export const adjacency = (a: TopicId, b: TopicId) =>
  a === b ? 1 : ADJ.find(([x, y]) => (x === a && y === b) || (x === b && y === a))?.[2] ?? 0;

export type Person = {
  id: string; name: string; tagline: string; hue: number;
  interests: Partial<Record<TopicId, number>>;
};

export const PEOPLE: Person[] = [
  { id: "alex", name: "Alex", tagline: "AI, product design, technology", hue: 218,
    interests: { ai: 0.95, computing: 0.8, architecture: 0.35, nuclear: 0.3, philosophy: 0.25, urban: 0.12 } },
  { id: "sam", name: "Sam", tagline: "Architecture, cities, history", hue: 28,
    interests: { urban: 0.9, architecture: 0.9, ancient: 0.7, math: 0.45, craft: 0.3, nature: 0.15 } },
  { id: "jordan", name: "Jordan", tagline: "Psychology, philosophy", hue: 300,
    interests: { philosophy: 0.9, psychology: 0.85, nature: 0.5, science: 0.3, ocean: 0.25 } },
  { id: "maya", name: "Maya", tagline: "Physics, energy, engineering", hue: 170,
    interests: { nuclear: 0.9, energy: 0.85, science: 0.55, computing: 0.3, architecture: 0.25 } },
  { id: "taylor", name: "Taylor", tagline: "Nature, biology, culture", hue: 100,
    interests: { nature: 0.9, ocean: 0.8, craft: 0.7, ancient: 0.25, collective: 0.25 } },
];
export const person = (id: string) => PEOPLE.find((p) => p.id === id)!;

export type Circle = { id: string; name: string; members: string[]; blurb: string; recent: Partial<Record<TopicId, number>> };
export const CIRCLES: Circle[] = [
  { id: "rabbit-hole", name: "The Rabbit Hole", members: ["alex", "sam", "jordan", "maya", "taylor"],
    blurb: "Five friends who keep sending each other down tangents.",
    recent: { architecture: 0.8, ancient: 0.7, nuclear: 0.7, ai: 0.6, nature: 0.4 } },
  { id: "sunday", name: "Sunday Curiosity", members: ["alex", "sam", "jordan"],
    blurb: "Three people, one slow weekend thread.", recent: { philosophy: 0.7, urban: 0.6, ancient: 0.5 } },
  { id: "lab-lunch", name: "Lab Lunch", members: ["alex", "maya", "taylor"],
    blurb: "Lunchtime questions that never quite finish.", recent: { energy: 0.7, nature: 0.6, nuclear: 0.5 } },
];
export const circle = (id: string) => CIRCLES.find((c) => c.id === id)!;

export type Video = { id: string; title: string; topics: [TopicId, TopicId?]; minutes: number; kind: string; blurb: string };
export const VIDEOS: Video[] = [
  { id: "egypt-world", title: "How Ancient Egyptians Understood the World", topics: ["ancient", "science"], minutes: 18, kind: "Documentary", blurb: "Calendars, star charts and a picture of the cosmos built around the river." },
  { id: "renaissance-domes", title: "The Engineering Genius of Renaissance Domes", topics: ["architecture", "science"], minutes: 22, kind: "Documentary", blurb: "How builders raised enormous domes with ropes, geometry and patience." },
  { id: "microreactors-ai", title: "Could Nuclear Microreactors Power AI Data Centers?", topics: ["nuclear", "ai"], minutes: 14, kind: "Explainer", blurb: "What small modular reactors could change about the power behind computing." },
  { id: "cities-develop", title: "Why Cities Develop the Way They Do", topics: ["urban", "architecture"], minutes: 19, kind: "Documentary", blurb: "Rivers, rules and accidents: the forces that shape a street plan." },
  { id: "math-patterns", title: "The Mathematics of Natural Patterns", topics: ["math", "nature"], minutes: 16, kind: "Explainer", blurb: "Spirals, branches and stripes, and the simple rules behind them." },
  { id: "early-computers", title: "How Early Computers Changed Human Thought", topics: ["computing", "philosophy"], minutes: 24, kind: "Essay", blurb: "What it meant to hand calculation, and then memory, to a machine." },
  { id: "deep-ocean", title: "Strange Intelligence in the Deep Ocean", topics: ["ocean", "collective"], minutes: 17, kind: "Documentary", blurb: "Animals that solve problems in total darkness, without brains like ours." },
  { id: "ants", title: "How Ant Colonies Organize Complex Societies", topics: ["collective", "nature"], minutes: 15, kind: "Explainer", blurb: "No leader, no plan, and still a working city of millions." },
  { id: "library-ideas", title: "The Library That Tried to Hold Every Idea", topics: ["ancient", "computing"], minutes: 21, kind: "Documentary", blurb: "An old attempt at a complete archive, and what it teaches about search." },
  { id: "cathedrals", title: "Building Cathedrals Without Blueprints", topics: ["architecture", "craft"], minutes: 26, kind: "Documentary", blurb: "Generations of masons and one idea that outlived all of them." },
  { id: "future-selves", title: "What Do We Owe Our Future Selves?", topics: ["philosophy", "psychology"], minutes: 13, kind: "Essay", blurb: "A short tour through the puzzle of personal identity over time." },
  { id: "llm-tour", title: "Inside a Language Model, in Plain English", topics: ["ai", "computing"], minutes: 28, kind: "Lecture", blurb: "Tokens, attention and training, explained without the jargon." },
  { id: "grid-cities", title: "Grid Cities and the Ideas Behind Them", topics: ["urban", "math"], minutes: 18, kind: "Explainer", blurb: "Why so many planners reached for the same simple pattern." },
  { id: "small-reactors", title: "The Quiet Revolution in Small Reactors", topics: ["nuclear", "energy"], minutes: 20, kind: "Documentary", blurb: "Factory-built reactors and the engineering trade-offs of going small." },
  { id: "grid-balance", title: "How the Power Grid Balances Itself", topics: ["energy", "computing"], minutes: 17, kind: "Explainer", blurb: "Second-by-second coordination between supply, demand and software." },
  { id: "memory-rebuilt", title: "Why Memory Is Rebuilt Every Time", topics: ["psychology", "science"], minutes: 15, kind: "Explainer", blurb: "Remembering is closer to reconstructing than replaying." },
  { id: "coral-cities", title: "Coral Reefs as Cities Under the Sea", topics: ["ocean", "urban"], minutes: 19, kind: "Documentary", blurb: "Neighborhoods, traffic and trade on a living structure." },
  { id: "computing-stars", title: "The People Who Computed the Stars", topics: ["computing", "science"], minutes: 23, kind: "Documentary", blurb: "Before electronic computers, careful people did the math by hand." },
  { id: "tree-rings", title: "Tree Rings and Ancient Weather", topics: ["nature", "ancient"], minutes: 14, kind: "Explainer", blurb: "How a cross-section of wood becomes a calendar of old storms." },
  { id: "honeycombs", title: "Why Patterns Repeat, From Honeycombs to Hurricanes", topics: ["math", "nature"], minutes: 21, kind: "Lecture", blurb: "A walk through shapes that nature keeps choosing." },
  { id: "inlay", title: "The Slow Craft of Inlaying Metal", topics: ["craft", "architecture"], minutes: 12, kind: "Documentary", blurb: "Engraving, inlay and polish, one pattern at a time." },
  { id: "textile-data", title: "Woven Patterns as an Early Kind of Data", topics: ["craft", "computing"], minutes: 16, kind: "Essay", blurb: "Looms, punched cards and the long road to programmable machines." },
  { id: "science-changed", title: "When Science Changed Its Mind", topics: ["science", "philosophy"], minutes: 25, kind: "Essay", blurb: "Four moments when the accepted answer turned out to be wrong." },
  { id: "thought-experiments", title: "A Short History of Thought Experiments", topics: ["philosophy", "science"], minutes: 18, kind: "Lecture", blurb: "Elevators, trains and demons: ideas tested without a laboratory." },
  { id: "fungal", title: "A Field Guide to Fungal Networks", topics: ["nature", "collective"], minutes: 17, kind: "Documentary", blurb: "Underground threads that connect trees, and what flows through them." },
  { id: "streets", title: "Streets That Move People", topics: ["urban", "energy"], minutes: 15, kind: "Explainer", blurb: "How the shape of a street decides how people and energy move." },
  { id: "roman-concrete", title: "Roman Concrete and Why It Lasts", topics: ["architecture", "ancient"], minutes: 14, kind: "Explainer", blurb: "A material recipe that outlived the empire that used it." },
  { id: "geothermal", title: "Geothermal Basics: Heat From Below", topics: ["energy", "nature"], minutes: 16, kind: "Explainer", blurb: "Tapping the planet's own heat, and where it works best." },
  { id: "curious-machines", title: "Can Machines Be Curious?", topics: ["ai", "philosophy"], minutes: 21, kind: "Essay", blurb: "What it would mean for software to want to know something." },
  { id: "fission", title: "Atoms for Beginners: How Fission Works", topics: ["nuclear", "science"], minutes: 19, kind: "Explainer", blurb: "A patient, visual introduction to chain reactions." },
  { id: "swarms", title: "Bees, Swarms and Simple Rules", topics: ["collective", "math"], minutes: 13, kind: "Explainer", blurb: "How groups decide where to live without anyone in charge." },
  { id: "deep-clocks", title: "The Deep Sea's Slow Clocks", topics: ["ocean", "science"], minutes: 18, kind: "Documentary", blurb: "Animals and sediments that keep time on scales we rarely notice." },
];
export const video = (id: string) => VIDEOS.find((v) => v.id === id)!;
