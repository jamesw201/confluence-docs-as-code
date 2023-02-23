import Attachment from './attachment.js';
import { extname, basename } from 'node:path';

export default class Graph extends Attachment {
    constructor(path, type, renderer, alt) {
        super(path);
        this.type = type;
        this.renderer = renderer;
        this.alt = alt || `${type} graph`;
    }

    get imageFilename() {
        const ext = extname(this.filename);
        const base = basename(this.filename, ext);
        return base + '.png';
    }

    render() {
        switch (this.renderer) {
            case 'kroki':
            case 'plantuml':
                return `<ac:image ac:alt="${this.alt}"><ri:attachment ri:filename="${this.imageFilename}" /></ac:image>`;
            case 'mermaid-plugin':
                return `<ac:structured-macro ac:name="mermaid-cloud" data-layout="default" ><ac:parameter ac:name="filename">${this.filename}</ac:parameter></ac:structured-macro>`;
            default:
                return '';
        }
    }
}
