/**
 * @module plugins/swagger
 */
import yaml from 'js-yaml';
import fs from 'fs';

/**
 * MarkdownIt plugin to handle swagger code blocks
 * 
 * @param {MarkdownIt} md - A `MarkdownIt` instance
 * @param {object} options - Plugin options
 */
function plugin(md) {
    const _default = md.renderer.rules.text;
    md.renderer.rules.text = (tokens, idx, options, env, self) => {
        const token = tokens.find(token => token.type === 'text' && /!!swagger (.+?)!!/.test(token.content));
        if (token) {
            const filename = RegExp.$1;
            const spec = yaml.load(fs.readFileSync(`./docs/${filename}`, 'utf8'));
            const content = JSON.stringify(spec);
            
            const cdata = `<![CDATA[${escape(content)}]]>`;
            return `<ac:structured-macro ac:name="swagger-open-api-macro" ac:schema-version="1" data-layout="default" ac:macro-id="7bdf7115-8438-453e-b900-fcac1decbad9">
                <ac:plain-text-body>${cdata}</ac:plain-text-body>
              </ac:structured-macro>`;
        }
        return _default(tokens, idx, options, env, self);
    };
}

/**
 * Escape the string `]]>` found in `str` in order to be valid inside a `CDATA` block
 *  
 * @param {string} str - Text to escape
 * @returns {string} Escaped text
 */
function escape(str) {
    return str.replace(/]]>/g, ']]]]><![CDATA[>');
}

export default plugin;

