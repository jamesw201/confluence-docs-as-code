/**
 * @module models/graph
 */
import Attachment from './attachment.js';
import { extname, basename } from 'node:path';

/**
 * Represents a graph found in a markdown file
 * 
 * @extends Attachment
 */
class Graph extends Attachment {
    constructor(path, type, renderer, alt) {
        super(path);
        this.type = type;
        this.renderer = renderer;
        this.alt = alt || `${type} graph`;
    }

    /**
     * HTML markup for this graph
     * 
     * @type {string} 
     */
    get imageFilename() {
        const ext = extname(this.filename);
        const base = basename(this.filename, ext);
        return base + '.svg';
    }

    /**
    * 
    * @returns {string} the HTML markup for this graph
    */
    get markup() {
        switch (this.renderer) {
            case 'kroki':
            case 'plantuml':
                return `<ac:image ac:alt="${this.alt}" ac:width="650"><ri:attachment ri:filename="${this.imageFilename}" />
</ac:image>`;
            case 'mermaid-plugin':
                return `<ac:structured-macro ac:name="mermaid-cloud" data-layout="default" ><ac:parameter ac:name="filename">${this.filename}</ac:parameter></ac:structured-macro>`;
            default:
                return '';
        }
    }

    render(renderer) {
        return renderer.renderGraph(this);
    }
}

export default Graph;
