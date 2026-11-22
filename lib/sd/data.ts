// Data for the Shared Discovery design experiment.
// The people and circles are fictional. The videos are real, publicly available YouTube videos:
// titles and channel names come from YouTube's oEmbed endpoint and the thumbnails from YouTube's
// own image host (i.ytimg.com), linked back to the video. Nothing here is endorsed by, or affiliated
// with, YouTube or the creators. Durations are not included because the official Data API needs a key.

export type TopicId =
  | "ancient" | "architecture" | "nuclear" | "ai" | "physics" | "psychology" | "philosophy" | "ocean"
  | "computing" | "urban" | "math" | "space";

export type Topic = { id: TopicId; label: string };

export const TOPICS: Topic[] = [
  { id: "ancient", label: "Ancient civilizations" },
  { id: "architecture", label: "Architecture" },
  { id: "nuclear", label: "Nuclear energy" },
  { id: "ai", label: "Artificial intelligence" },
  { id: "physics", label: "Physics" },
  { id: "psychology", label: "Psychology" },
  { id: "philosophy", label: "Philosophy" },
  { id: "ocean", label: "Ocean life" },
  { id: "computing", label: "History of computing" },
  { id: "urban", label: "Urban design" },
  { id: "math", label: "Mathematics" },
  { id: "space", label: "Space exploration" },
];
export const topicLabel = (id: TopicId) => TOPICS.find((t) => t.id === id)!.label;

// How naturally one subject leads into another (0 to 1). Used to keep surprises plausible.
const ADJ: [TopicId, TopicId, number][] = [
  ["ai", "computing", 0.9], ["ai", "math", 0.6], ["ai", "philosophy", 0.6], ["ai", "psychology", 0.5], ["ai", "nuclear", 0.4], ["ai", "physics", 0.3],
  ["computing", "math", 0.6], ["computing", "space", 0.4], ["computing", "physics", 0.3], ["computing", "ancient", 0.3],
  ["architecture", "urban", 0.9], ["architecture", "ancient", 0.7], ["architecture", "math", 0.5], ["architecture", "physics", 0.3],
  ["urban", "psychology", 0.3], ["urban", "ancient", 0.4],
  ["nuclear", "physics", 0.9], ["nuclear", "space", 0.4],
  ["physics", "space", 0.9], ["physics", "math", 0.7], ["physics", "philosophy", 0.5],
  ["space", "math", 0.4], ["space", "ocean", 0.4], ["space", "ancient", 0.4],
  ["philosophy", "psychology", 0.8], ["philosophy", "ancient", 0.5], ["philosophy", "math", 0.4],
  ["ocean", "physics", 0.3], ["ocean", "psychology", 0.3], ["ancient", "math", 0.4],
];
export const adjacency = (a: TopicId, b: TopicId) =>
  a === b ? 1 : ADJ.find(([x, y]) => (x === a && y === b) || (x === b && y === a))?.[2] ?? 0;

export type Person = {
  id: string; name: string; tagline: string; hue: number;
  interests: Partial<Record<TopicId, number>>;
};

export const PEOPLE: Person[] = [
  { id: "alex", name: "Alex", tagline: "AI, computing, mathematics", hue: 218,
    interests: { ai: 0.95, computing: 0.8, math: 0.45, space: 0.3, philosophy: 0.25, urban: 0.12 } },
  { id: "sam", name: "Sam", tagline: "Architecture, cities, ancient history", hue: 28,
    interests: { urban: 0.9, architecture: 0.9, ancient: 0.7, math: 0.4, philosophy: 0.2 } },
  { id: "jordan", name: "Jordan", tagline: "Psychology, philosophy", hue: 300,
    interests: { philosophy: 0.9, psychology: 0.85, physics: 0.3, ocean: 0.25 } },
  { id: "maya", name: "Maya", tagline: "Physics, nuclear energy, space", hue: 170,
    interests: { nuclear: 0.9, physics: 0.85, space: 0.55, computing: 0.3, architecture: 0.25 } },
  { id: "taylor", name: "Taylor", tagline: "Ocean life, space, deep history", hue: 100,
    interests: { ocean: 0.9, space: 0.5, ancient: 0.4, psychology: 0.3, math: 0.25 } },
];
export const person = (id: string) => PEOPLE.find((p) => p.id === id)!;

export type Circle = { id: string; name: string; members: string[]; blurb: string; recent: Partial<Record<TopicId, number>> };
export const CIRCLES: Circle[] = [
  { id: "rabbit-hole", name: "The Rabbit Hole", members: ["alex", "sam", "jordan", "maya", "taylor"],
    blurb: "Five friends who keep sending each other down tangents.",
    recent: { architecture: 0.8, ancient: 0.7, nuclear: 0.7, ai: 0.6, space: 0.5 } },
  { id: "sunday", name: "Sunday Curiosity", members: ["alex", "sam", "jordan"],
    blurb: "Three people, one slow weekend thread.", recent: { philosophy: 0.7, urban: 0.6, ancient: 0.5 } },
  { id: "lab-lunch", name: "Lab Lunch", members: ["alex", "maya", "taylor"],
    blurb: "Lunchtime questions that never quite finish.", recent: { physics: 0.7, ocean: 0.6, nuclear: 0.5 } },
];
export const circle = (id: string) => CIRCLES.find((c) => c.id === id)!;

// A real YouTube video. `id` is the YouTube video id (youtube.com/watch?v=<id>).
export type Video = { id: string; title: string; channel: string; topics: [TopicId, TopicId?] };
export const VIDEOS: Video[] = [
  { id: "gFP-7Z9HLww", title: "Decoding the Great Pyramid | Full Documentary | NOVA | PBS", channel: "NOVA PBS Official", topics: ["ancient", "architecture"] },
  { id: "Z8dZSySRX_g", title: "Why was the Rosetta Stone so important? - Franziska Naether", channel: "TED-Ed", topics: ["ancient"] },
  { id: "sNcVB1VnNXU", title: "Pyramids of Egypt: How They Were Built & the Gold They Hid (4500 Years)", channel: "Deep Facts Official", topics: ["ancient", "architecture"] },
  { id: "_IOPlGPQPuM", title: "How an Amateur Built the World's Biggest Dome", channel: "National Geographic", topics: ["architecture"] },
  { id: "DvUIP06mcxg", title: "Santa Maria del Fiore - The Unbuildable Dome", channel: "WikiArquitectura", topics: ["architecture"] },
  { id: "QD3fJphus-o", title: "How Was the World's Biggest Dome Built? - Florence Cathedral", channel: "Manuel Bravo", topics: ["architecture"] },
  { id: "Xd8muMF6uVc", title: "Microreactors—Nuclear Power in a Small, Modular Package", channel: "American Nuclear Society", topics: ["nuclear"] },
  { id: "nz-2F7yd4_M", title: "Nuclear Microreactors with Science Educator and Influencer Kyle Hill", channel: "Idaho National Laboratory", topics: ["nuclear"] },
  { id: "uIIcEDzYsA4", title: "World's Only GLASS Nuclear Reactor!", channel: "Kyle Hill", topics: ["nuclear", "physics"] },
  { id: "aircAruvnKk", title: "But what is a neural network? | Deep learning chapter 1", channel: "3Blue1Brown", topics: ["ai", "math"] },
  { id: "wjZofJX0v4M", title: "Transformers, the tech behind LLMs | Deep Learning Chapter 5", channel: "3Blue1Brown", topics: ["ai", "computing"] },
  { id: "Ilg3gGewQ5U", title: "Backpropagation, intuitively | Deep Learning Chapter 3", channel: "3Blue1Brown", topics: ["ai", "math"] },
  { id: "DxL2HoqLbyA", title: "The Most Misunderstood Concept in Physics", channel: "Veritasium", topics: ["physics"] },
  { id: "lcjdwSY2AzM", title: "The Biggest Misconception in Physics", channel: "Veritasium", topics: ["physics", "space"] },
  { id: "jyQwgBAaBag", title: "Risking My Life To Settle A Physics Debate", channel: "Veritasium", topics: ["physics"] },
  { id: "yOgAbKJGrTA", title: "How memories form and how we lose them - Catharine Young", channel: "TED-Ed", topics: ["psychology"] },
  { id: "2W85Dwxx218", title: "Why do we dream? - Amy Adkins", channel: "TED-Ed", topics: ["psychology"] },
  { id: "vNyZmSg92HI", title: "Forgetting is a part of memory | Richard Morris | TEDxMadrid", channel: "TEDx Talks", topics: ["psychology"] },
  { id: "eTgNgGO_bLs", title: "What happens when we sleep?", channel: "The Economist", topics: ["psychology"] },
  { id: "yg16u_bzjPE", title: "Would you sacrifice one person to save five? - Eleanor Nelsen", channel: "TED-Ed", topics: ["philosophy", "psychology"] },
  { id: "h6fcK_fRYaI", title: "The Egg - A Short Story", channel: "Kurzgesagt – In a Nutshell", topics: ["philosophy"] },
  { id: "x51H6rQqvSg", title: "The Ship of Theseus’ Paradox", channel: "The Art of Thinking", topics: ["philosophy"] },
  { id: "9HXXQBz6Vv0", title: "Bioluminescence on Camera | National Geographic", channel: "National Geographic", topics: ["ocean"] },
  { id: "GD7g1c5-CJU", title: "Bioluminescence in the deep sea: Glow-in-the-dark corals light up the deep ocean", channel: "MBARI (Monterey Bay Aquarium Research Institute)", topics: ["ocean"] },
  { id: "sC_9hiwwZac", title: "How Deep-Sea Creatures Use Bioluminescence to Survive", channel: "Kabil", topics: ["ocean"] },
  { id: "0OyhASRR0To", title: "The History of Computers", channel: "Art of the Problem", topics: ["computing", "math"] },
  { id: "moYxYEfxO7g", title: "The early history of computing | Professor Ursula Martin (Lecture 1)", channel: "University of St Andrews", topics: ["computing"] },
  { id: "uSMGENDH_QI", title: "Cosmic Dawn (NASA+ Original Documentary)", channel: "NASA", topics: ["space"] },
  { id: "HS0ASkG_ayA", title: "Apollo 11: Rare NASA Films from the National Archives", channel: "US National Archives", topics: ["space"] },
  { id: "VyQR2yvLK8Q", title: "The Voyager Effect  |  NASA+ Teaser Trailer", channel: "NASA Jet Propulsion Laboratory", topics: ["space"] },
  { id: "riu0QTq-TlY", title: "How The James Webb Space Telescope Was Built", channel: "Spark", topics: ["space", "physics"] },
  { id: "zmp09Fd07oc", title: "The Next Great Cycling City", channel: "Not Just Bikes", topics: ["urban"] },
  { id: "ORzNZUeUHAM", title: "Stroads are Ugly, Expensive, and Dangerous (and they're everywhere) [ST05]", channel: "Not Just Bikes", topics: ["urban"] },
  { id: "QpJHjIDwgRg", title: "The Evolution of City Planning – Styles That Shaped Our World\" | Arch Meld", channel: "Arch Meld", topics: ["urban", "architecture"] },
  { id: "NsjsLwYRW8o", title: "Prime Pyramid (with 3Blue1Brown) - Numberphile", channel: "Numberphile", topics: ["math"] },
  { id: "EK32jo7i5LQ", title: "Why do prime numbers make these spirals? | Dirichlet’s theorem and pi approximations", channel: "3Blue1Brown", topics: ["math"] },
  { id: "YAsHGOwB408", title: "The Prime Number Race (with 3Blue1Brown) - Numberphile", channel: "Numberphile", topics: ["math"] },
  { id: "Nu-lW-Ifyec", title: "Fibonacci Mystery - Numberphile", channel: "Numberphile", topics: ["math"] },
];
export const video = (id: string) => VIDEOS.find((v) => v.id === id)!;
export const watchUrl = (v: Video) => `https://www.youtube.com/watch?v=${v.id}`;
/** Official thumbnail URLs on YouTube's image host. `hq` is 4:3 with bars (crop to 16:9); `max` is true 16:9. */
export const thumbUrl = (v: Video, size: "hq" | "max" = "hq") => `https://i.ytimg.com/vi/${v.id}/${size === "max" ? "maxresdefault" : "hqdefault"}.jpg`;
