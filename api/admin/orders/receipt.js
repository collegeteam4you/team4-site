// Vercel's catch-all API function does not reliably match this deeper route.
// Re-export the shared handler from an exact route so receipt requests reach it
// instead of falling through to the site's index.html rewrite.
module.exports = require('../../[...path].js');
