import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'La nostra flotta — Mercedes, BMW, Range Rover',
  description:
    'Flotta SM Luxury Chauffeur: Mercedes Classe S, Classe E, V-Class, BMW Serie 7 e Range Rover. Veicoli premium per transfer, eventi e tour a Milano, Brianza e in tutta Italia.',
  alternates: { canonical: '/fleet' },
  openGraph: {
    title: 'La nostra flotta luxury · SM Luxury Chauffeur',
    description:
      'Mercedes, BMW e Range Rover sempre disponibili per i tuoi spostamenti a Milano e Brianza.',
    url: '/fleet',
    type: 'website',
  },
};

export default function FleetLayout({ children }: { children: React.ReactNode }) {
  return children;
}
