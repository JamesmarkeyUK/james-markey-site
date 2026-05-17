export type PressImage = {
  src: string;
  alt: string;
  caption: string;
  orientation: 'portrait' | 'landscape' | 'square';
};

export const pressImages: PressImage[] = [
  {
    src: '/press/James_Hero.jpg',
    alt: 'James Markey — hero shot',
    caption: 'Hero shot',
    orientation: 'landscape',
  },
  {
    src: '/press/James_headshot.JPG',
    alt: 'James Markey — headshot',
    caption: 'Headshot',
    orientation: 'portrait',
  },
  {
    src: '/press/JamesMarkey_Flag.jpg',
    alt: 'James Markey with the Union flag',
    caption: 'With the Union flag',
    orientation: 'portrait',
  },
  {
    src: '/press/James_Side.jpg',
    alt: 'James Markey — profile',
    caption: 'Profile',
    orientation: 'portrait',
  },
  {
    src: '/press/James_Ipad.jpg',
    alt: 'James Markey with iPad',
    caption: 'With iPad',
    orientation: 'landscape',
  },
  {
    src: '/press/James_Chair_Long.jpg',
    alt: 'James Markey seated portrait',
    caption: 'Seated portrait',
    orientation: 'portrait',
  },
  {
    src: '/press/James_camera_preview.jpg',
    alt: 'James Markey — preview shot',
    caption: 'Preview shot',
    orientation: 'landscape',
  },
  {
    src: '/press/JamesMarkey6.jpg',
    alt: 'James Markey portrait',
    caption: 'Portrait',
    orientation: 'portrait',
  },
];
