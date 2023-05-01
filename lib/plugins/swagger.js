/**
 * @module plugins/swagger
 */
// import path from 'node:path'
// import { writeFileSync } from 'node:fs'
// import Graph from '../models/graph.js'

/**
 * MarkdownIt plugin to handle swagger code blocks
 * 
 * @param {MarkdownIt} md - A `MarkdownIt` instance
 * @param {object} options - Plugin options
 */
// const MarkdownIt = require('markdown-it');
// const swaggerUi = require('swagger-ui-dist');

function plugin(md) {
    md.core.ruler.push('replace-swagger', (state) => {
        state.tokens.forEach((token) => {
            if (token.type === 'inline') {
                token.children.forEach((child) => {
                    if (child.type === 'text' && /!!swagger (.+?)!!/.test(child.content)) {
                        const filename = RegExp.$1;
                        const spec = require(`./${filename}`);
                        const html = `<div id="swagger-ui"></div>
              <script>
                window.onload = function() {
                  const ui = SwaggerUIBundle({
                    spec: ${JSON.stringify(spec)},
                    dom_id: '#swagger-ui',
                    deepLinking: true,
                    presets: [
                      SwaggerUIBundle.presets.apis,
                      SwaggerUIBundle.SwaggerUIStandalonePreset
                    ],
                    plugins: [
                      SwaggerUIBundle.plugins.DownloadUrl
                    ],
                    layout: 'StandaloneLayout'
                  });
                };
              </script>`;
                        child.content = child.content.replace(/!!swagger (.+?)!!/, html);
                    }
                });
            }
        });
    });
}

// function plugin(md, options) {
//     const config = options.graphs
//     const supportedGraphs = Object.keys(config)

//     md.renderer.rules.swagger = (tokens, idx, _, env) => {
//         const token = tokens[idx]
//         const language = token?.info?.trim()
//         const content = token?.content?.trim()
//         if (supportedGraphs.includes(language)) {
//             return processGraph(config[language], content, env)
//         }
//         return codeMacro(language, content)
//     }
// }

export default plugin;

