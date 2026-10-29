// Professional facts and impact figures are drawn from Mohamad's October 2026 résumé.
// Keep portfolio copy here so the presentation can evolve independently.
export const personalInfo = {
  name: 'Mohamad Alsyouf',
  title: 'Senior Full Stack Engineer',
  tagline: 'I turn complex problems into products people love to use.',
  email: 'mohamadalsyouf99@gmail.com',
  github: 'https://github.com/MohamadAlsyouf',
  linkedin: 'https://www.linkedin.com/in/mohamad-alsyouf/',
  location: 'Anaheim, California',
  resume: '/Mohamad-Alsyouf-Resume.pdf',
  availability: 'Open to the right opportunity',
}

export const metrics = [
  { value: '1M+', label: 'monthly users', detail: 'Customer experiences built for national reach.' },
  { value: '80%', label: 'less cloud egress cost', detail: 'Smarter caching. A materially smaller CloudFront bill.' },
  { value: '130+', label: 'ERP users connected', detail: 'Project managers, production, and three offshore teams.' },
  { value: '30%', label: 'faster project delivery', detail: 'An enterprise workflow designed around real operations.' },
]

export const aboutText = "I'm a senior full stack engineer who connects the dots between product, people, and production. At Focus 360, I own systems that bring customers, sales, project management, and offshore production together. I care as much about the conversation that defines the problem as the code that solves it."

export const projects = [
  {
    id: 'erp',
    number: '01',
    eyebrow: 'ENTERPRISE SYSTEMS / FOCUS 360',
    title: 'Complex operations.\nOne connected platform.',
    description: 'An ERP that brings project managers, coordinators, production, and three offshore teams into the same workflow. Built around how people actually work.',
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
    title: 'A million users.\nEvery interaction matters.',
    description: 'Interactive home discovery experiences, delivered as installable PWAs on touch kiosks in thousands of sales centers nationwide.',
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
    title: 'Purpose,\nmade portable.',
    description: 'Arkan is a faith-based learning project that brings my product thinking and full stack experience into mobile development.',
    impact: 'Independent product · Cross-platform development',
    tech: ['React Native', 'TypeScript', 'Expo', 'Firebase'],
    liveUrl: 'https://arkan-app.com',
    githubUrl: null,
    kind: 'arkan',
    role: 'Independent product development',
    details: [
      'A faith-based learning project exploring thoughtful mobile experiences.',
      'Built with a React Native and TypeScript stack, with Expo and Firebase supporting cross-platform development.',
      'An independent space to bring product ideas from concept into a tangible experience.',
    ],
  },
]

export const experience = [
  {
    period: 'SEP 2026 — PRESENT',
    title: 'Senior Full Stack Developer, R&D',
    company: 'Focus 360',
    location: 'Aliso Viejo, California',
    description: 'Engineering ownership that spans the product, the platform, and the people building it.',
    highlights: [
      'Own end-to-end development across ERP, scheduling, and digital asset management systems.',
      'Serve as Scrum Master: plan Agile sprints, manage JIRA epics, and keep team deliverables moving.',
      'Lead weekly product meetings that turn cross-department needs into clear technical priorities.',
    ],
  },
  {
    period: 'SEP 2022 — SEP 2026',
    title: 'Full Stack Developer, R&D',
    company: 'Focus 360',
    location: 'Aliso Viejo, California',
    description: 'Built the foundations for customer experiences at scale and enterprise systems with measurable impact.',
    highlights: [
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
    title: 'Engineer the whole system.',
    description: 'From a considered React interface to the API, database, and cloud infrastructure behind it. I own the path from first requirement to production.',
    icon: 'code',
  },
  {
    number: '02',
    title: 'Bring the room together.',
    description: 'Sales, product, project managers, production, and offshore teams. I turn different perspectives into shared priorities and a plan people can execute.',
    icon: 'people',
  },
  {
    number: '03',
    title: 'Make momentum repeatable.',
    description: 'Scrum Master experience, sprint planning, JIRA epics, and purposeful product meetings. Clear decisions, visible ownership, and fewer blockers.',
    icon: 'orbit',
  },
  {
    number: '04',
    title: 'Build with AI. Own the outcome.',
    description: 'Cursor, Claude, and Codex are part of my engineering toolkit. I use agentic workflows to explore, debug, and iterate, with human judgment and code review at the center.',
    icon: 'spark',
  },
]

export const workflow = [
  { number: '01', title: 'Understand the real problem.', description: 'Get the right people in the conversation. Map the workflow, surface constraints, and define what success looks like.' },
  { number: '02', title: 'Make a plan worth building.', description: 'Translate the discussion into technical decisions, scoped work, clear ownership, and an achievable sprint.' },
  { number: '03', title: 'Build fast. Think deeply.', description: 'Use AI-assisted workflows to shorten iteration cycles. Review the code, test the assumptions, and keep the system understandable.' },
  { number: '04', title: 'Ship. Learn. Raise the bar.', description: 'Deliver to production, listen to the people using it, and turn what we learn into the next meaningful improvement.' },
]

export const stackGroups = [
  { label: 'INTERFACES', items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Zustand', 'TanStack'] },
  { label: 'SYSTEMS', items: ['Node.js', 'Express', 'REST APIs', 'MySQL', 'PostgreSQL', 'Socket.IO'] },
  { label: 'CLOUD & DELIVERY', items: ['AWS Lambda', 'S3', 'CloudFront', 'SQS', 'EventBridge', 'Docker', 'Cypress'] },
  { label: 'MOBILE & AI', items: ['React Native', 'PWA', 'Workbox', 'Cursor', 'Claude', 'Codex', 'Agentic workflows'] },
]

export const skills = stackGroups.flatMap(({ label, items }) =>
  items.map((name) => ({ name, category: label })),
)
