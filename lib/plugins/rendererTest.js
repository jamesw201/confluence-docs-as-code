// import MarkdownIt from 'markdown-it'
// const yaml = require('js-yaml');
// const fs   = require('fs');

// const md = new MarkdownIt();

const proxy = (tokens, idx, options, env, self) => self.renderToken(tokens, idx, options);

// const defaultSwaggerRenderer = md.renderer.rules.text || proxy;

/**
 * MarkdownIt plugin to handle images
 * 
 * @param {MarkdownIt} md - A `MarkdownIt` instance
 */
function plugin(md) {
    const _default = md.renderer.rules.text || proxy;
    md.renderer.rules.text = (tokens, idx, options, env, self) => {
        tokens.forEach((token) => {
            if (token.type === 'text' && /!!swagger (.+?)!!/.test(token.content)) {
                token.content = token.content.replace(/!!swagger (.+?)!!/, 'some replacement text');
            // token.content = token.content.replace(/!!swagger (.+?)!!/, html);
            }
        });     
        return _default(tokens, idx, options, env, self);
    };
}

export default plugin;


// md.renderer.rules.text = function(tokens, idx, options, env, self) {
//     
//     tokens.forEach((token) => {
//         if (token.type === 'text' && /!!swagger (.+?)!!/.test(token.content)) {
//             token.content = token.content.replace(/!!swagger (.+?)!!/, html);
//         }
//     })
//     return `${defaultSwaggerRenderer(tokens, idx, options, env, self)}`;
// };

// console.log(md.render("here some page text !!swagger swagger.yml!!"));

