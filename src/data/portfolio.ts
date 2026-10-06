/**
 * Single source of truth for every word on the site.
 *
 * Components read from here and never hard-code copy, so this file is the only
 * thing that needs editing to change what the site says.
 *
 * Anything marked TODO is a real gap, not a placeholder to be left as-is:
 * those are the details only Aurora can supply.
 */

/** The hero's photograph. Nullable on purpose: setting `portrait: null` is the
 *  documented way to ship the site without one, and the hero then drops the
 *  whole travel choreography and falls back to a plain in-flow name. */
type Portrait = {
  src: string;
  alt: string;
};

export const profile: {
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
  secondaryRole: string;
  location: string;
  email: string;
  phone: string;
  portrait: Portrait | null;
} = {
  /** Split for the logotype: the given name carries the display size, the
   *  double surname sits beneath it. A Spanish double surname is too long to
   *  set at 120px, and shrinking the whole thing would lose the confidence
   *  that the size is there to create. */
  firstName: 'Aurora',
  lastName: 'Del Pino Gallardo',
  /** The short form used in the <title>, structured data and the footer. */
  fullName: 'Aurora Del Pino Gallardo',
  role: 'Product Designer',
  secondaryRole: 'Product Ops',
  location: 'Málaga, Spain',
  email: 'auroradpgallardo@gmail.com',
  phone: '+34622301904',
  /** The portrait, in the hero's right column. The one piece of colour on the
   *  page: everything else is white ground and ink, so the photograph has to
   *  carry something. A local `~/assets/...` path — drop the file in
   *  `src/assets/images/` and point at it. Left empty, the slot collapses and
   *  the hero falls back to type only. */
  portrait: {
    src: '~/assets/images/aurora.jpg',
    alt: 'Aurora Del Pino Gallardo, Product Designer in Málaga',
  },
};

export const links = {
  linkedin: 'https://www.linkedin.com/in/auroradpgallardo/',
  // TODO: add a portfolio, Dribbble or Behance URL when one exists.
  dribbble: '',
  behance: '',
} as const;

export const hero = {
  headline: 'I design for what happens',
  headlineEmphasis: 'after the click.',
  /** Rendered under the logotype, above the role line. */
  lede: 'A background in growth and customer success helps me see the whole journey—from the first click to the moment a product earns trust.',
  meta: [
    { label: 'Role', value: 'Product Designer · Product Ops' },
    { label: 'Now', value: 'Docline' },
    { label: 'Based', value: 'Málaga, Spain' },
  ],
} as const;

/** An employer and the roles Aurora held there. */
export interface Employer {
  slug: string;
  title: string;
  industry: string;
  summary?: string;
  url: string;
  wordmark: string;
  roles: {
    title: string;
    period: string;
    detail: string;
  }[];
}

/** Real employers, rather than portfolio case studies. */
export const employers: Employer[] = [
  {
    slug: 'docline',
    title: 'Docline',
    industry: 'Digital health · Telemedicine',
    summary: 'Telemedicine for hospitals, clinics and independent practitioners.',
    url: 'https://www.docline.com/',
    wordmark: 'docline',
    roles: [
      {
        title: 'UX/UI Designer',
        period: '2025—now',
        detail: 'Moved into design with a year and a half of customer evidence already filed away.',
      },
      {
        title: 'Customer Success',
        period: '2023—24',
        detail: 'Front line for how the product actually felt to the hospitals and clinicians using it.',
      },
    ],
  },
  {
    slug: 'prosfy',
    title: 'PROSFY',
    industry: 'Market benchmarking',
    url: 'https://www.prosfy.com/',
    wordmark: 'PROSFY',
    roles: [
      {
        title: 'Digital Marketing Manager',
        period: '2023',
        detail: 'Ran communication and marketing while still shipping the work myself.',
      },
      {
        title: 'Growth Hacker',
        period: '2023',
        detail: 'Social, email through HubSpot, SEO, graphic and web design.',
      },
    ],
  },
] as const;

const employerStep = (slug: Employer['slug'], roleIndex: number) => {
  const employer = employers.find((item) => item.slug === slug);
  const role = employer?.roles[roleIndex];

  if (!employer || !role) {
    throw new Error(`Missing employer role ${roleIndex} for "${slug}" in the experience timeline.`);
  }

  return {
    year: role.period,
    title: role.title,
    body: role.detail,
    employer: slug,
    organization: null,
  };
};

export const capabilities = {
  lede: 'A background in growth, a practice in design, and a product mindset—each one makes the others sharper.',
  groups: [
    {
      title: 'Before design',
      phase: 'Growth & marketing',
      description: 'I learned what earns attention, what gets ignored, and how people find their way to a product.',
      items: ['Digital marketing', 'SEO', 'HubSpot', 'Analytics', 'Market research'],
    },
    {
      title: 'Design',
      phase: 'Craft & clarity',
      description: 'I turn those signals into useful interfaces, then test the details with the people using them.',
      items: ['Interface design', 'Design systems', 'Prototyping', 'Usability testing', 'Accessibility'],
    },
    {
      title: 'Product',
      phase: 'Healthcare & SaaS',
      description: 'Working close to customers helps me shape flows around the real work a product needs to do.',
      items: ['User flows', 'Wireframing', 'Heuristic evaluation', 'Product ops', 'Roadmap shaping'],
    },
  ],
} as const;

/**
 * Trajectory.
 *
 * This replaces the "my process" section a portfolio template would ship.
 * Process is a claim anyone can make; the order these roles happened in is a
 * fact, and it is the most interesting thing about her background — a designer
 * who used to own the funnel that the interface feeds.
 */
export const trajectory = {
  lede: 'I did not start in design. The order I did things in is the part I would rather you judged.',
  steps: [
    {
      year: '2019—2023',
      title: 'Marketing & Market Research student',
      body: '',
      employer: null,
      organization: {
        title: 'Universidad de Málaga',
        url: 'https://www.uma.es/',
        detail: 'Facultad de Marketing e Investigación de Mercados',
        summary: undefined,
      },
    },
    employerStep('prosfy', 1),
    employerStep('prosfy', 0),
    employerStep('docline', 1),
    {
      year: '2025',
      title: 'UI/UX Master',
      body: '',
      employer: null,
      organization: {
        title: 'Universidad de Málaga',
        url: 'https://www.uma.es/',
        detail: 'Máster de UI/UX',
        summary: undefined,
      },
    },
    employerStep('docline', 0),
  ],
} as const;

export const contact = {
  headline: {
    first: 'Let’s make',
    second: 'something',
    third: 'matter',
  },
  lede: 'If you are hiring a product designer who can also tell you why the funnel metric moved, this is the right page.',
  channels: [
    {
      label: 'Email',
      value: profile.email,
      href: `mailto:${profile.email}`,
      note: 'For ideas, roles, and good questions.',
    },
    {
      label: 'Phone',
      value: '+34 622 301 904',
      href: `tel:${profile.phone}`,
      note: 'Call or message me directly.',
    },
    {
      label: 'LinkedIn',
      value: 'Aurora Del Pino Gallardo',
      href: links.linkedin,
      note: 'Find me on LinkedIn.',
    },
  ],
} as const;

export const seo = {
  title: 'Aurora Del Pino Gallardo — Product Designer in Málaga',
  description:
    'Product designer in Málaga, Spain. I design healthcare and SaaS interfaces after a run in growth marketing — so I know what happens after the click.',
} as const;
