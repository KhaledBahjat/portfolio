import { useState, type ComponentType, type SVGProps } from 'react';
import {
    SiDocker,
    SiFigma,
    SiFirebase,
    SiFlutter,
    SiGit,
    SiGithub,
    SiGraphql,
    SiJavascript,
    SiLinux,
    SiMongodb,
    SiMysql,
    SiNextdotjs,
    SiNodedotjs,
    SiPostgresql,
    SiPrisma,
    SiPython,
    SiReact,
    SiRedis,
    SiRedux,
    SiSupabase,
    SiTailwindcss,
    SiTypescript,
    SiVercel,
} from 'react-icons/si';

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const iconLibraryMap: Record<string, IconComponent> = {
    'logos:flutter': SiFlutter,
    'logos:react': SiReact,
    'logos:nextdotjs': SiNextdotjs,
    'logos:typescript': SiTypescript,
    'logos:javascript': SiJavascript,
    'logos:nodejs': SiNodedotjs,
    'logos:tailwindcss': SiTailwindcss,
    'logos:supabase': SiSupabase,
    'logos:firebase': SiFirebase,
    'logos:mongodb': SiMongodb,
    'logos:postgresql': SiPostgresql,
    'logos:python': SiPython,
    'logos:docker': SiDocker,
    'logos:github': SiGithub,
    'logos:git': SiGit,
    'logos:linux': SiLinux,
    'logos:redux': SiRedux,
    'logos:vercel': SiVercel,
    'logos:prisma': SiPrisma,
    'logos:figma': SiFigma,
    'logos:mysql': SiMysql,
    'logos:redis': SiRedis,
    'logos:graphql': SiGraphql,
    'mdi:react': SiReact,
    'mdi:language-javascript': SiJavascript,
    'mdi:language-typescript': SiTypescript,
    'mdi:git': SiGit,
    'mdi:docker': SiDocker,
    'mdi:nodejs': SiNodedotjs,
    'mdi:tailwind': SiTailwindcss,
};

function isImageValue(value: string) {
    if (!value) return false;

    const trimmed = value.trim();
    if (!trimmed) return false;

    if (trimmed.startsWith('data:image/') || trimmed.startsWith('blob:') || trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
        return true;
    }

    return /\.(svg|png|jpg|jpeg|webp|ico|avif)(\?.*)?$/i.test(trimmed);
}

function getLibraryIcon(value: string) {
    if (!value) return null;

    const normalized = value.trim().toLowerCase();
    const separatorIndex = normalized.indexOf(':');
    if (separatorIndex === -1) return null;

    const prefix = normalized.slice(0, separatorIndex);
    const name = normalized.slice(separatorIndex + 1);
    if (!prefix || !name) return null;

    return iconLibraryMap[`${prefix}:${name}`] ?? null;
}

export default function SkillIcon({
    icon,
    className = 'h-5 w-5',
    alt = 'Skill icon',
}: {
    icon?: string;
    className?: string;
    alt?: string;
}) {
    const [hasImageError, setHasImageError] = useState(false);

    if (!icon) {
        return <span className={`inline-flex items-center justify-center text-base leading-none ${className}`} aria-hidden="true">⚙️</span>;
    }

    const trimmedIcon = icon.trim();
    const isImage = isImageValue(trimmedIcon);
    const LibraryIcon = getLibraryIcon(trimmedIcon);

    if (isImage && !hasImageError) {
        return (
            <img
                src={trimmedIcon}
                alt={alt}
                className={`flex-shrink-0 object-contain ${className}`}
                loading="lazy"
                decoding="async"
                onError={() => setHasImageError(true)}
            />
        );
    }

    if (LibraryIcon) {
        return <LibraryIcon className={`flex-shrink-0 ${className}`} />;
    }

    return <span className={`inline-flex items-center justify-center text-base leading-none ${className}`} aria-hidden="true">{trimmedIcon}</span>;
}
