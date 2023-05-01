/**
 * @module plugins/swagger
 */
// import path from 'node:path'
// import { writeFileSync } from 'node:fs'
// import Graph from '../models/graph.js'
// import yaml from 'js-yaml';
// import fs from 'fs';

/**
 * MarkdownIt plugin to handle swagger code blocks
 * 
 * @param {MarkdownIt} md - A `MarkdownIt` instance
 * @param {object} options - Plugin options
 */
// eslint-disable-next-line no-unused-vars
import swaggerUi from 'swagger-ui-dist';
// import logger from '../logger.js';

function plugin(md) {
    const _default = md.renderer.rules.text;
    md.renderer.rules.text = (tokens, idx, options, env, self) => {
        const token = tokens.find(token => token.type === 'text' && /!!swagger (.+?)!!/.test(token.content));
        if (token) {
        //     const filename = RegExp.$1;
        //     const spec = yaml.load(fs.readFileSync(`./docs/${filename}`, 'utf8'));
        //     // const spec = require(`./docs/${filename}`);
        //     const html = `<div id="swagger-ui"></div>
        // <script>
        //   window.onload = function() {
        //     const ui = SwaggerUIBundle({
        //       spec: ${yaml.dump(spec)},
        //       dom_id: '#swagger-ui',
        //       deepLinking: true,
        //       presets: [
        //         SwaggerUIBundle.presets.apis,
        //         SwaggerUIBundle.SwaggerUIStandalonePreset
        //       ],
        //       plugins: [
        //         SwaggerUIBundle.plugins.DownloadUrl
        //       ],
        //       layout: 'StandaloneLayout'
        //     });
        //   };
        // </script>`;
            // token.content = token.content.replace(/!!swagger (.+?)!!/, html);
          
            // const macro = `<ac:structured-macro ac:name="swagger-ui">
            return `<ac:structured-macro ac:name="swagger-ui">
            <ac:parameter ac:name="data">
              {url:"http://petstore.swagger.io/v2/swagger.json"}
            </ac:parameter>
          </ac:structured-macro>`;
            // return macro

            /*           token.content = token.content.replace(/!!swagger (.+?)!!/, macro); */
        }
        return _default(tokens, idx, options, env, self);
    };
}

export default plugin;

// function plugin(md) {
//     logger.info('running the swagger plugin');

//     // md.renderer.rules.replace_swagger = function(tokens, idx, options, env, self) {
//     //   
//     // }
//     md.core.ruler.push('replace-swagger', (state) => {
//         state.tokens.forEach((token) => {
//             logger.info(`swagger reading token: ${JSON.stringify(token)}`);
//             if (token.type === 'inline') {
//                 token.children.forEach((child) => {
//                     logger.info(`token: ${JSON.stringify(child)}`);

//                     if (child.type === 'text' && /!!swagger (.+?)!!/.test(child.content)) {
//                         // const filename = RegExp.$1;
//                         // const spec = require(`./docs/${filename}`);
//                         //           const html = `<div id="swagger-ui"></div>
//                         // <script>
//                         //   window.onload = function() {
//                         //     const ui = SwaggerUIBundle({
//                         //       spec: ${JSON.stringify(spec)},
//                         //       dom_id: '#swagger-ui',
//                         //       deepLinking: true,
//                         //       presets: [
//                         //         SwaggerUIBundle.presets.apis,
//                         //         SwaggerUIBundle.SwaggerUIStandalonePreset
//                         //       ],
//                         //       plugins: [
//                         //         SwaggerUIBundle.plugins.DownloadUrl
//                         //       ],
//                         //       layout: 'StandaloneLayout'
//                         //     });
//                         //   };
//                         // </script>`;
//                         // child.content = child.content.replace(/!!swagger (.+?)!!/, html);
//                         child.content = child.content.replace(/!!swagger (.+?)!!/, 'some replacement text');
//                     }
//                 });
//             }
//         });
//     });
// }

// export default plugin;

