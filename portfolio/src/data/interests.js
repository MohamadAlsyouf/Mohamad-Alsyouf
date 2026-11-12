export const interests = [
  {
    kind: 'e30',
    name: '1988 BMW 325i Convertible',
    detail:
      'I have a BMW E30. I swapped the engine, built out the suspension, and heavily modified it to OEM+ spec. It takes all my money. I need more.',
    alt: 'Dark navy-blue 1988 BMW E30 325i convertible with the top down, black leather interior, chrome bumpers, and silver basketweave wheels.',
  },
  {
    kind: 'wheel',
    name: 'Three-piece wheels',
    detail:
      'I build and source period-correct three-piece wheels for the classic BMW community. 1 of many side hustles.',
    alt: 'Exploded three-piece BBS-style wheel with a gold mesh center, polished barrel, and separate outer lip.',
  },
  {
    kind: 'pi',
    name: 'I dabble',
    detail:
      'I bought a Raspberry Pi to experiment with embedded software and personal hardware projects. Shoutout Codex.',
    alt: 'Detailed green Raspberry Pi 5 board with processor, GPIO pins, USB ports, and Ethernet socket.',
  },
  {
    kind: 'engine',
    name: 'Classic BMWs',
    detail:
      'I buy, restore, and sell classic BMWs as a hobby. Before software, I did this full-time.',
    alt: 'Overhead BMW M50 inline-six engine with six intake runners and silver BMW lettering on its black cover.',
  },
  {
    kind: 'fishing',
    name: 'I enjoy fishing',
    detail: 'I fish around Newport Beach on weekends.',
    background:
      'I co-founded the Marquette High School Fishing Club where I went to school in St. Louis, Missouri.',
    alt: 'Graphite fishing rod, baitcasting reel, and minnow lure alongside an olive-green largemouth bass.',
  },
  {
    kind: 'sword',
    name: 'MMORPGs',
    detail:
      'I grew up playing MMOs and still play World of Warcraft and Aion 2 occasionally.',
    alt: 'Ornate silver fantasy greatsword with a winged gold guard, dark grip, and emerald inlays.',
  },
  {
    kind: 'phone',
    name: '< Mobile app dev />',
    detail:
      'I build mobile apps with React Native, TypeScript, Expo, and Firebase. My latest project is Arkan, a faith-based learning app.',
    link: { href: 'https://arkan-app.com', label: 'Arkan website' },
    alt: 'Dark titanium iPhone showing a green mobile app dashboard with Build and Ship on its screen.',
  },
].map((interest) => ({
  ...interest,
  image: `/interests/${interest.kind}.webp`,
  imageSmall: `/interests/${interest.kind}-480.webp`,
}))
