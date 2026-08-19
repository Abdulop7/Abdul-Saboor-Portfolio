import {
  siApachekafka,
  siClickhouse,
  siCloudflare,
  siDocker,
  siFastapi,
  siFigma,
  siGit,
  siGithubactions,
  siGo,
  siGraphql,
  siGreensock,
  siKubernetes,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPython,
  siReact,
  siRedis,
  siRust,
  siTailwindcss,
  siTerraform,
  siThreedotjs,
  siTrpc,
  siTypescript,
  siVercel,
  siVitest,
  type SimpleIcon,
} from "simple-icons";

// Explicit imports keep tree-shaking intact — only these 26 paths ship.
const ICONS: Record<string, SimpleIcon> = {
  apachekafka: siApachekafka,
  clickhouse: siClickhouse,
  cloudflare: siCloudflare,
  docker: siDocker,
  fastapi: siFastapi,
  figma: siFigma,
  git: siGit,
  githubactions: siGithubactions,
  go: siGo,
  graphql: siGraphql,
  greensock: siGreensock,
  kubernetes: siKubernetes,
  nextdotjs: siNextdotjs,
  nodedotjs: siNodedotjs,
  postgresql: siPostgresql,
  python: siPython,
  react: siReact,
  redis: siRedis,
  rust: siRust,
  tailwindcss: siTailwindcss,
  terraform: siTerraform,
  threedotjs: siThreedotjs,
  trpc: siTrpc,
  typescript: siTypescript,
  vercel: siVercel,
  vitest: siVitest,
};

export default function TechIcon({
  slug,
  className = "h-8 w-8",
  color = false,
}: {
  slug: string;
  className?: string;
  color?: boolean;
}) {
  const icon = ICONS[slug];
  if (!icon) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      role="img"
      aria-hidden
      style={color ? { fill: `#${icon.hex}` } : { fill: "currentColor" }}
    >
      <path d={icon.path} />
    </svg>
  );
}
