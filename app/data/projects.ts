export interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
  appUrl?: string;
  image?: string;
  color: string;
  year: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "SSB Portal - Belize Social Security",
    subtitle: "National Social Security Self-Service Platform",
    description: "Developed the official online portal for Belize's Social Security Board, enabling citizens to manage their social security accounts, submit claims, apply for cards, and access benefits. The platform serves thousands of Belizeans with secure, user-friendly access to essential government services.",
    technologies: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "AWS", "REST API"],
    link: "https://ssbportal.org.bz/",
    color: "rgb(0, 166, 81)", // SSB Portal Green
    year: "2023"
  },
  {
    id: 2,
    title: "Kolektivo Network",
    subtitle: "Powering Regenerative Ecosystems",
    description: "Built technology platform enabling changemakers to achieve regenerative developments in local communities. Features ecosystem mapping, community impact activation tools, and natural capital development solutions. Focused on transitioning from extractive to regenerative economic models.",
    technologies: ["React", "TypeScript", "Web3", "Blockchain", "Celo", "Node.js", "GraphQL"],
    link: "https://www.kolektivo.network/",
    appUrl: "https://apps.apple.com/us/app/kolektivo-tt/id6502837818",
    color: "#2aa6a1", // Kolektivo teal
    year: "2023"
  },
  {
    id: 3,
    title: "WAM - Caribbean Digital Wallet",
    subtitle: "Financial Inclusion Platform",
    description: "Built digital payment platform bridging cash and digital economies in Trinidad & Tobago. Features instant P2P transfers, QR payments, cash agent network, and bank integrations. Designed for both banked and unbanked populations with focus on financial mobility.",
    technologies: ["React Native", "TypeScript", "Node.js", "AWS", "PostgreSQL", "Biometric Auth", "2FA"],
    link: "https://wam.money/",
    appUrl: "https://apps.apple.com/us/app/wam/id6738292068",
    color: "#7C3AED", // WAM Purple
    year: "2023"
  },
  {
    id: 4,
    title: "Americana - Collectibles NFT Marketplace",
    subtitle: "Real World Asset Tokenization Platform",
    description: "Built blockchain-based vaulting platform bridging physical and digital collectibles. Features secure on-premise vault storage, gasless transactions on Ethereum mainnet, NFT authentication, and trading of physical assets without movement. Transformed collectibles into tradeable digital assets.",
    technologies: ["React", "Solidity", "Ethereum", "Web3.js", "IPFS", "Node.js", "PostgreSQL"],
    link: "https://web.archive.org/web/20220507050821/https://americana.io/",
    color: "#FFFFFF", // White
    year: "2022"
  }
];