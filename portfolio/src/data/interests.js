export const interests = [
  {
    kind: 'e30',
    name: '1988 BMW 325i Convertible',
    label: 'TOP DOWN. TIMELESS.',
    detail: 'I build classic BMWs from the ground up. Same with software.',
    alt: 'Dark navy-blue 1988 BMW E30 325i convertible with the top down, black leather interior, chrome bumpers, and silver basketweave wheels.',
  },
  {
    kind: 'wheel',
    name: 'Three-piece wheels',
    label: 'BUILT IN LAYERS',
    detail:
      'I build and source period-correct three-piece wheels to sell within the classic BMW community. On the side, I enjoy fusing passion and profit.',
    alt: 'Exploded three-piece BBS-style wheel with a gold mesh center, polished barrel, and separate outer lip.',
  },
  {
    kind: 'pi',
    name: 'Raspberry Pi 5',
    label: 'SMALL BOARD. BIG IDEAS.',
    detail:
      'I recently started exploring the Raspberry Pi ecosystem, writing embedded software for ideas I’ve had for years. With modern AI capabilities, I finally have no excuse not to build them.',
    alt: 'Detailed green Raspberry Pi 5 board with processor, GPIO pins, USB ports, and Ethernet socket.',
  },
  {
    kind: 'engine',
    name: 'BMW M50',
    label: 'MECHANICAL SYMPATHY',
    detail:
      'The mechanical side of my BMW obsession. I love understanding how individual parts work together as a system—just like software.',
    alt: 'Overhead BMW M50 inline-six engine with six intake runners and silver BMW lettering on its black cover.',
  },
  {
    kind: 'fishing',
    name: 'Bass fishing',
    label: 'A DIFFERENT KIND OF FLOW',
    detail:
      'Catch me at Newport Beach on a calm Sunday morning. Thinking about nothing is nice sometimes.',
    funFact:
      'I co-founded the Marquette High School Fishing Club where I went to school in St. Louis, Missouri.',
    alt: 'Graphite fishing rod, baitcasting reel, and minnow lure alongside an olive-green largemouth bass.',
  },
  {
    kind: 'sword',
    name: 'Aion 2–inspired sword',
    label: 'OTHER WORLDS',
    detail:
      'I have a love-hate relationship with World of Warcraft and Aion 2. I grew up playing MMOs and crave the nostalgia now and then. Eventually, I log off and “vibe code.”',
    alt: 'Ornate silver fantasy greatsword with a winged gold guard, dark grip, and emerald inlays.',
  },
  {
    kind: 'phone',
    name: 'Mobile app development',
    label: 'IDEA → APP',
    detail:
      'I love building native mobile apps. My latest, Arkan, is currently going through Apple’s App Store review.',
    link: { href: 'https://arkan-app.com', label: 'Explore Arkan' },
    alt: 'Dark titanium iPhone showing a green mobile app dashboard with Build and Ship on its screen.',
  },
].map((interest) => ({
  ...interest,
  image: `/interests/${interest.kind}.webp`,
  imageSmall: `/interests/${interest.kind}-480.webp`,
}))
