export const interests = [
  {
    kind: 'wheel',
    name: 'Three-piece wheels',
    label: 'BUILT IN LAYERS',
    detail: 'Polished lips. Cross-spoke centers. Every bolt has a purpose.',
    alt: 'Exploded three-piece BBS-style wheel with a gold mesh center, polished barrel, and separate outer lip.',
  },
  {
    kind: 'pi',
    name: 'Raspberry Pi 5',
    label: 'SMALL BOARD. BIG IDEAS.',
    detail: 'Where a few lines of code become something you can hold.',
    alt: 'Detailed green Raspberry Pi 5 board with processor, GPIO pins, USB ports, and Ethernet socket.',
  },
  {
    kind: 'engine',
    name: 'BMW M50',
    label: 'MECHANICAL SYMPATHY',
    detail: 'An inline-six, seen from above. A love for how things work.',
    alt: 'Overhead BMW M50 inline-six engine with six intake runners and silver BMW lettering on its black cover.',
  },
  {
    kind: 'fishing',
    name: 'Bass fishing',
    label: 'A DIFFERENT KIND OF FLOW',
    detail: 'A rod, a reel, and a little time away from the screen.',
    alt: 'Graphite fishing rod, baitcasting reel, and minnow lure alongside an olive-green largemouth bass.',
  },
  {
    kind: 'sword',
    name: 'Aion 2–inspired sword',
    label: 'OTHER WORLDS',
    detail: 'A little adventure. A lot of appreciation for the details.',
    alt: 'Ornate silver fantasy greatsword with a winged gold guard, dark grip, and emerald inlays.',
  },
  {
    kind: 'phone',
    name: 'Mobile app development',
    label: 'IDEA → APP',
    detail: 'Thoughtful interfaces. Useful tools. Built for your pocket.',
    alt: 'Dark titanium iPhone showing a green mobile app dashboard with Build and Ship on its screen.',
  },
].map((interest) => ({
  ...interest,
  image: `/interests/${interest.kind}.webp`,
  imageSmall: `/interests/${interest.kind}-480.webp`,
}))
