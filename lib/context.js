/**
 * @module context
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import fs from 'fs';
import path from 'node:path';
import YAML from 'yaml';
import util from './util.js';
import logger from './logger.js';
import config from './config.js';
import { Meta, LocalPage } from './models/index.js';

const MKDOCS_YML = 'mkdocs.yml';
const README_MD = 'README.md';
/**
 * Loads an parses the 'mkdocs.yml' file 
 * 
 * @param {string} basePath - the basepath to look for 'mkdocs.yml'
 * @returns {object} with nav, repo_url, site_name attributes
 */
function loadConfig(basePath) {
    const mkDocsFile = path.resolve(basePath, MKDOCS_YML);
    const yml = readFileSync(mkDocsFile, 'utf8');
    const json = YAML.parse(yml);
    const { nav, repo_url, site_name } = json;
    if (!Array.isArray(nav)) {
        throw new Error(`nav is missing from your ${MKDOCS_YML} file`);
    }
    if (typeof repo_url !== 'string' || repo_url.trim().length === 0) {
        throw new Error(`repo_url is missing from your ${MKDOCS_YML} file`);
    }

    logger.info(`site_name: ${site_name}`);
    return { nav, repo_url, site_name };
}

function traverse2(site_name, repo_url, basePath, pages = []) {
    logger.info(`traverse2 basePath: ${basePath}`);
    const fullBasePath = basePath === '.' ? path.resolve(process.cwd(), 'docs') : basePath;
    const files = readdirSync(fullBasePath, []);
  
    files.forEach(filePath => {
        const fullPath = path.resolve(fullBasePath, filePath);
        const isDirectory = fs.statSync(fullPath).isDirectory();
        if (isDirectory) {
            traverse2(site_name, repo_url, fullPath, pages);
        }
        if (filePath.endsWith('.md')) {
            logger.info(`found markdown file: ${filePath}`);
            const page = getPage(repo_url, filePath.slice(0, -3), fullPath);
            // const relPath = path.relative(process.cwd(), filePath)
            if (basePath !== '.') {
                // logger.info(`trying to create page for ${relPath.substring(0, relPath.indexOf('/'))}`)
                // reconstruct pagePath for parent page
                const basePathCount = `${process.cwd()}/docs/`.length;
                const newParentTitle = fullPath.substring(basePathCount, fullPath.lastIndexOf('/'));
                const newParentFile = `${newParentTitle}.md`;
                // const newParentPath = path.resolve(process.cwd(), 'docs', newParentFile)
                const newParentPath = `${basePath}.md`;
                logger.info(`newParentPath: ${newParentPath}`);
                logger.info(`newParentTitle: ${newParentTitle}`);
                const sha = util.fileHash(newParentPath);
 
                let parent = pages.find(page => page.title === newParentTitle);

                let initials = '';
                if (site_name.includes(' ')) {
                    initials = site_name.split(' ').map(token => token[0].toUpperCase()).join('');
                }
                if (site_name.includes('-')) {
                    initials = site_name.split('-').map(token => token[0].toUpperCase()).join('');
                }
                if (!parent) {
                    logger.info(`attempting to create parent page: ${newParentTitle} at ${basePath}`);
                    parent = new LocalPage(newParentTitle, new Meta(repo_url, `docs/${newParentFile}`, sha), initials);
                    pages.push(parent);
                }
                if (page) {
                    page.parentPageTitle = newParentTitle;
                }
            }
            if (page) {
                pages.push(page);
            }
        }
    });

    return pages;
}

/**
 * Recursively traverses the `nav` object and adds `LocalPage`s to `pages` array
 *  
 * @param {string} repo_url - repo_url from 'mkdocs.yml'
 * @param {*} nav - nav object from 'mkdocs.yml'
 * @param {*} basePath - the basepath to resolve files
 * @param {Array<LocalPage>} pages 
 * @returns {Array<LocalPage>} The array with all pages from `nav`
 */
// function traverse(repo_url, nav, basePath, pages = []) {
//     nav.forEach((item) => {
//         if (typeof item === 'string') {
//             throw new Error(`No title for ${item}`)
//         }
//         const pageTitle = Object.keys(item)[0]
//         const pagePath = Object.values(item)[0]
//         if (Array.isArray(pagePath)) {
//             traverse(repo_url, pagePath, basePath, pages)
//         } else {
//             const page = getPage(repo_url, pageTitle, path.resolve(basePath, 'docs', pagePath))
//             const relPath = path.relative(process.cwd(), pagePath)
//             if (relPath.includes('/')) {
//                 logger.info(`trying to create page for ${relPath.substring(0, relPath.indexOf('/'))}`)
//                 // reconstruct pagePath for parent page
//                 const newParentTitle = pagePath.substring(0, pagePath.lastIndexOf('/'))
//                 const newParentFile = `${newParentTitle}.md`
//                 const newParentPath = path.resolve(basePath, 'docs', newParentFile)
//                 logger.info(`newParentPath: ${newParentPath}`)
//                 const sha = util.fileHash(newParentPath)
//                 const newParent = new LocalPage(newParentTitle, new Meta(repo_url, `docs/${newParentFile}`, sha))
//                 pages.push(newParent)
//                 if (page) {
//                     page.parentPageTitle = newParentTitle
//                 }
//             }
//             if (page) {
//                 pages.push(page)
//             }
//         }
//     })
//     return pages
// }

/**
 * Creates `LocalPage` instances from the parameters
 * 
 * @param {string} repo_url - Repository url 
 * @param {string} title - Page title
 * @param {string} pagePath - Page path
 * @param {string} titlePrefix - Page title prefix
 * @returns {LocalPage} The page created from the parameters
 */
function getPage(repo_url, title, pagePath, titlePrefix = config.confluence.titlePrefix) {
    const safe = pagePath.startsWith(process.cwd());
    const exists = safe && existsSync(pagePath);
    const relPath = path.relative(process.cwd(), pagePath);
    if (!exists) {
        logger.warn(`Page "${title}" not found at "${relPath}"`);
        return;
    }
    const sha = util.fileHash(pagePath);
    const prefixedTitle = `${titlePrefix} ${title}`.trim();
    logger.info(`creating LocalPage ${prefixedTitle} with pagePath: ${pagePath}, and relPath: ${relPath}`);
    return new LocalPage(prefixedTitle, new Meta(repo_url, relPath, sha));
}

/**
 * Create a context object with all information needed for the sync 
 * 
 * @param {string} basePath - Base path to resolve files
 * @returns {object} The context object
 */
function getContext(basePath = '.') {
    // const { nav, repo_url, site_name } = loadConfig(basePath)
    const { repo_url, site_name } = loadConfig(basePath);

    const pages = traverse2(site_name, repo_url, basePath);
  
    // const pages = traverse(repo_url, nav, basePath)
    const readMe = getPage(repo_url, site_name, path.resolve(process.cwd(), README_MD), '');
    logger.debug(`readme title: ${readMe.title}`);
    const pageRefs = pages.reduce((obj, page) => {
        obj[page.meta.path] = page.title;
        return obj;
    }, readMe ? { [readMe.meta.path]: readMe.title } : {});
    const context = { siteName: site_name, repo: repo_url, pages, pageRefs };
    if (readMe) {
        context.readMe = readMe;
    }

    if (logger.isDebug()) {
        logger.debug(`Context:\n${JSON.stringify(context, null, 2)}`);
    }
    return context;
}

export default { getContext };
