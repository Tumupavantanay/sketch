export interface Sketch {
  id: number;
  title: string;
  medium: string;
  description: string;
  aspectRatio: "portrait" | "square" | "landscape";
  year: number;
  /** Local like counter seed. Images are served from /public/images/. */
  likes: number;
  imageSrc?: string; // e.g. "/images/solitude.jpg" — leave undefined to use graphite placeholder
}

export const sketches: Sketch[] = [
  {
    id: 1,
    title: "Naruto and Kurama",
    medium: "Graphite pencil shading",
    description:
      "Naruto in a prayer stance with Kurama looming behind him, built with bold contrast, heavy shadows, and a dramatic layered composition.",
    aspectRatio: "portrait",
    year: 2026,
    likes: 0,
    imageSrc: "/images/naruto.jpeg",
  },
  {
    id: 2,
    title: "Eren Portrait",
    medium: "Graphite with soft blending",
    description:
      "A focused portrait of Eren with sharp facial structure, calm expression, and soft smoky shading around the cloak and background.",
    aspectRatio: "portrait",
    year: 2026,
    likes: 0,
    imageSrc: "/images/eren.jpeg",
  },
  {
    id: 3,
    title: "Zoro Battle Pose",
    medium: "Graphite action study",
    description:
      "Zoro drawn mid-fight with swords, scar details, and muscular anatomy pushed forward through high-energy linework and dense tonal shading.",
    aspectRatio: "portrait",
    year: 2026,
    likes: 0,
    imageSrc: "/images/zoro-battle.jpeg",
  },
  {
    id: 4,
    title: "Tanjiro Flame Stance",
    medium: "Graphite character composition",
    description:
      "Tanjiro framed by curling flame motifs, combining crisp outfit patterns with smooth shadow transitions to create a cinematic pose.",
    aspectRatio: "portrait",
    year: 2026,
    likes: 0,
    imageSrc: "/images/tanjiro.jpeg",
  },
  {
    id: 5,
    title: "Jiraiya Sage Mode",
    medium: "Graphite portrait study",
    description:
      "Jiraiya centered with a toad spirit presence behind him, using calm symmetry, clean outlines, and controlled shading to build authority.",
    aspectRatio: "portrait",
    year: 2026,
    likes: 0,
    imageSrc: "/images/jiraiya.jpeg",
  },
  {
    id: 6,
    title: "Madara and Susanoo",
    medium: "Graphite fantasy scene",
    description:
      "Madara stands in front of Susanoo with a composed hand sign, built from layered armor detail, smoke shapes, and a looming guardian backdrop.",
    aspectRatio: "portrait",
    year: 2026,
    likes: 0,
    imageSrc: "/images/madara.jpeg",
  },
  {
    id: 7,
    title: "Ganesha Portrait",
    medium: "Graphite devotional sketch",
    description:
      "A frontal portrait of Ganesha with ornamental headwork and symbolic markings, shaded softly to keep the expression serene and devotional.",
    aspectRatio: "portrait",
    year: 2026,
    likes: 0,
    imageSrc: "/images/ganesha-portrait.jpeg",
  },
  {
    id: 8,
    title: "Zenitsu Portrait",
    medium: "Graphite anime portrait",
    description:
      "A centered Zenitsu portrait focused on expressive eyes, angular hair sections, and neat tonal blocks across the collar and face.",
    aspectRatio: "portrait",
    year: 2026,
    likes: 0,
    imageSrc: "/images/zenitsu.jpeg",
  },
  {
    id: 9,
    title: "Krishna with Calf",
    medium: "Graphite devotional composition",
    description:
      "A gentle Krishna portrait leaning into a calf, surrounded by floral ornament and delicate jewelry detail with soft devotional shading.",
    aspectRatio: "portrait",
    year: 2026,
    likes: 0,
    imageSrc: "/images/krishna.jpeg",
  },
  {
    id: 10,
    title: "Rengoku Flame Arc",
    medium: "Graphite action portrait",
    description:
      "Rengoku lunging through a ring of flames, with flowing motion lines and dark-to-light shading that push the attack toward the viewer.",
    aspectRatio: "portrait",
    year: 2026,
    likes: 0,
    imageSrc: "/images/rengoku.jpeg",
  },
];
