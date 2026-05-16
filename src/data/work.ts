export type Role = {
  role: string;
  org: string;
  tenure: string;
  summary: string;
  href: string;
  location?: string;
  featured?: boolean;
};

export const work: Role[] = [
  {
    role: 'Founder & CEO',
    org: 'UNI SIM',
    tenure: 'Current',
    summary:
      "The UK's #1 manufacturer of haptic training simulators for dental and medical education.",
    href: 'https://unisim.co.uk',
    location: 'United Kingdom',
  },
  {
    role: 'Commercial Director',
    org: 'HRV Simulation',
    tenure: 'Current',
    summary:
      'Driving commercial strategy and international growth for the French innovator in clinical simulation training.',
    href: 'https://hrv-simulation.com',
    location: 'France',
  },
  {
    role: 'Export Champion',
    org: 'Department for Business and Trade',
    tenure: 'Volunteer',
    summary:
      'Mentoring early-stage UK exporters on behalf of the UK Government. Trade missions and policy contribution.',
    href: 'https://www.great.gov.uk',
    location: 'United Kingdom',
    featured: true,
  },
];
