import { getRepoImage } from "@/lib/constants";

interface RepoAvatarProps {
  slug: string;
  language?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RepoAvatar({
  slug,
  language,
  size = "md",
  className = "",
}: RepoAvatarProps) {
  const imagePath = getRepoImage(slug, language);

  const sizeMap = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-24 w-24",
  };

  if (!imagePath) {
    // Fallback: black icon
    return (
      <div
        className={`${sizeMap[size]} rounded border-2 border-wood-mid bg-black ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeMap[size]} overflow-hidden rounded border-2 border-wood-mid ${className}`}
    >
      <img
        src={imagePath}
        alt={slug}
        className="h-full w-full object-cover repo-avatar"
        loading="lazy"
      />
    </div>
  );
}
