// Professional facts and impact figures are drawn from Mohamad's October 2026 résumé.
// Keep portfolio copy here so the presentation can evolve independently.
export const personalInfo = {
  name: 'Mohamad Alsyouf',
  title: 'Senior Full Stack Engineer',
  tagline: 'Enterprise systems, web applications, and mobile development.',
  email: 'mohamadalsyouf99@gmail.com',
  github: 'https://github.com/MohamadAlsyouf',
  linkedin: 'https://www.linkedin.com/in/mohamad-alsyouf/',
  location: 'Anaheim, California',
  resume: '/Mohamad-Alsyouf-Resume.pdf',
  availability: 'Open to the right opportunity',
}

export const metrics = [
  {
    value: '1M+',
    label: 'monthly users',
    detail:
      'Customer-facing web applications used in sales centers nationwide.',
  },
  {
    value: '80%',
    label: 'less cloud egress cost',
    detail:
      'Reduced AWS CloudFront egress costs through service worker caching.',
  },
  {
    value: '130+',
    label: 'ERP users connected',
    detail: 'Project managers, production, and three offshore teams.',
  },
  {
    value: '30%',
    label: 'faster project delivery',
    detail: 'Reduced project delivery times through a shared ERP workflow.',
  },
]

export const aboutText =
  "I'm a senior full stack engineer at Focus 360. I develop ERP, scheduling, digital asset management, and customer-facing applications. My work includes requirements gathering, architecture, development, testing, and deployment."

export const projects = [
  {
    id: 'erp',
    number: '01',
    eyebrow: 'ENTERPRISE SYSTEMS / FOCUS 360',
    title: 'Enterprise resource\nplanning platform',
    description:
      'An ERP for project managers, coordinators, production staff, and three offshore teams, with shared work orders and digital asset management.',
    impact: '30% faster delivery · 130+ users',
    tech: ['React', 'TypeScript', 'Node.js', 'AWS', 'MySQL'],
    liveUrl: null,
    githubUrl: null,
    kind: 'erp',
    role: 'Architecture · Full stack development · Cross-functional delivery',
    details: [
      'Architected and developed a React and TypeScript ERP for 130+ users across three offshore teams.',
      'Reduced project delivery times by 30% and improved operational productivity by 70%.',
      'Connected the in-house digital asset management platform to asset creation, updates, and retrieval inside work order workflows.',
      'Owned requirements, technical planning, testing, and production deployment while aligning product priorities with the business.',
    ],
  },
  {
    id: 'next',
    number: '02',
    eyebrow: 'CUSTOMER EXPERIENCE / FOCUS 360',
    title: 'Home discovery\napplications',
    description:
      'Interactive home discovery experiences, delivered as installable PWAs on touch kiosks in thousands of sales centers nationwide.',
    impact: '1M+ monthly users · 80% lower egress cost',
    tech: ['React', 'TypeScript', 'PWA', 'Workbox', 'AWS Lambda'],
    liveUrl: null,
    githubUrl: null,
    kind: 'next',
    role: 'Product engineering · Performance · Serverless integrations',
    details: [
      'Built customer-facing web applications that serve more than one million monthly users across a national sales-center footprint.',
      'Integrated live floor plans, pricing, and housing data through AWS Lambda, SQL queries, and secure REST APIs.',
      'Used Workbox service workers to improve offline access and repeat-load performance while reducing AWS CloudFront egress costs by 80%.',
      'Delivered responsive interfaces for a touch-first, installable progressive web app experience.',
    ],
  },
  {
    id: 'arkan',
    number: '03',
    eyebrow: 'INDEPENDENT PRODUCT / MOBILE',
    title: 'Arkan: faith-based\nlearning app',
    description:
      'A cross-platform faith-based learning app built with React Native, TypeScript, Expo, and Firebase.',
    impact: 'Independent product · Cross-platform development',
    tech: ['React Native', 'TypeScript', 'Expo', 'Firebase'],
    liveUrl: 'https://arkan-app.com',
    githubUrl: null,
    kind: 'arkan',
    role: 'Independent product development',
    details: [
      'An independent mobile app for faith-based learning.',
      'Built with a React Native and TypeScript stack, with Expo and Firebase supporting cross-platform development.',
      'Responsible for product planning and full stack development.',
    ],
  },
]

export const experience = [
  {
    period: 'Sep 2026 — Present',
    title: 'Senior Full Stack Developer, R&D',
    company: 'Focus 360',
    location: 'Aliso Viejo, California',
    description:
      'Lead development of internal systems and coordinate technical priorities across departments.',
    emphasis: [],
    highlights: [
      'Own end-to-end development across ERP, scheduling, and digital asset management systems.',
      'Serve as Scrum Master: plan Agile sprints, manage JIRA epics, and keep team deliverables moving.',
      'Lead weekly product meetings that turn cross-department needs into clear technical priorities.',
    ],
  },
  {
    period: 'Sep 2022 — Sep 2026',
    title: 'Full Stack Developer, R&D',
    company: 'Focus 360',
    location: 'Aliso Viejo, California',
    description:
      'Developed customer-facing web applications, reusable interfaces, backend services, and enterprise systems.',
    emphasis: ['80%', '0.5–2 seconds'],
    highlights: [
      'Reduced AWS CloudFront data transfer costs by 80% through Workbox service worker caching.',
      'Built reusable React and TypeScript interfaces, reducing duplicated frontend code by 40%.',
      'Optimized MySQL and REST APIs, taking key load times from 6–7 seconds to 0.5–2 seconds.',
      'Shipped serverless Node.js services on AWS and strengthened reliability with Cypress and Postman.',
      'Mentored interns through onboarding and code review; integrated Cursor, Claude, and Codex into development workflows.',
    ],
  },
]

export const capabilities = [
  {
    number: '01',
    title: 'Full stack development',
    description:
      'Develop React interfaces, APIs, databases, and cloud infrastructure, from requirements through production deployment.',
    icon: 'code',
  },
  {
    number: '02',
    title: 'Cross-functional collaboration',
    description:
      'Work with sales, product, project management, production, and offshore teams to define requirements and technical priorities.',
    icon: 'people',
  },
  {
    number: '03',
    title: 'Delivery & sprint planning',
    description:
      'Serve as Scrum Master, plan sprints, manage JIRA epics, and lead weekly product meetings.',
    icon: 'orbit',
  },
  {
    number: '04',
    title: 'AI-assisted development',
    description:
      'Use Cursor, Claude, and Codex for codebase exploration, debugging, and implementation, with code review and testing before release.',
    icon: 'spark',
  },
]

export const workflow = [
  {
    number: '01',
    title: 'Define requirements',
    description:
      'Review workflows with the people using them, document constraints, and agree on requirements and success criteria.',
  },
  {
    number: '02',
    title: 'Plan implementation',
    description:
      'Choose the architecture, break the work into tasks, assign ownership, and plan the sprint.',
  },
  {
    number: '03',
    title: 'Develop & test',
    description:
      'Implement the changes, use AI tools where useful, review the code, and test functionality and performance.',
  },
  {
    number: '04',
    title: 'Deploy & improve',
    description:
      'Deploy to production, collect user feedback, and prioritize fixes and follow-up improvements.',
  },
]

export const stackGroups = [
  {
    label: 'INTERFACES',
    items: [
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Tailwind CSS',
      'Zustand',
      'TanStack',
    ],
  },
  {
    label: 'SYSTEMS',
    items: [
      'Node.js',
      'Express',
      'REST APIs',
      'MySQL',
      'PostgreSQL',
      'Socket.IO',
    ],
  },
  {
    label: 'CLOUD & DELIVERY',
    items: [
      'AWS Lambda',
      'S3',
      'CloudFront',
      'SQS',
      'EventBridge',
      'Docker',
      'Cypress',
    ],
  },
  {
    label: 'MOBILE & AI',
    items: [
      'React Native',
      'PWA',
      'Workbox',
      'Cursor',
      'Claude',
      'Codex',
      'Agentic workflows',
    ],
  },
]

export const skills = stackGroups.flatMap(({ label, items }) =>
  items.map((name) => ({ name, category: label })),
)
