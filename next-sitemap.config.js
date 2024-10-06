/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: 'https://safeconvert.ludgi.ai',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  exclude: ['/admin/*'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/admin' },
    ],
  },
  debug: true,
}
