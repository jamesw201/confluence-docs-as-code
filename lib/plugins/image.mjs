import path from 'node:path';
import util from '../util.mjs';

export default function plugin(md) {
    const _default = md.renderer.rules.image;
    md.renderer.rules.image = (tokens, idx, options, env, self) => {
        const image = tokens[idx];
        const { src } = Object.fromEntries(image.attrs);

        if (isLocal(src)) {
            const file = path.basename(src);
            const relPath = util.safePath(src, env.source);
            if (relPath) {
                env.images.push(relPath);
                return toConfluenceImage(image.content, file);
            }
        }

        return _default(tokens, idx, options, env, self);
    };
}

function isLocal(src) {
    return !src.startsWith('http');
}

export function toConfluenceImage(alt, filename) {
    return `<ac:image ac:alt="${alt}"><ri:attachment ri:filename="${filename}" /></ac:image>`;
}
