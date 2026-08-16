import jsonFormatter from "./tools/jsonFormatter.js";
import base64 from "./tools/base64.js";
import regexTester from "./tools/regexTester.js";
import passwordGenerator from "./tools/passwordGenerator.js";
import md5Generator from "./tools/md5Generator.js";
import caseConverter from "./tools/caseConverter.js";
import loremIpsum from "./tools/loremIpsum.js";
import urlEncoder from "./tools/urlEncoder.js";
import colorConverter from "./tools/colorConverter.js";
import binaryConverter from "./tools/binaryConverter.js";
import whatsMyIp from "./tools/whatsMyIp.js";
import userAgentFinder from "./tools/userAgentFinder.js";
import canonicalGenerator from "./tools/canonicalGenerator.js";
import metaTagGenerator from "./tools/metaTagGenerator.js";
import ogTagGenerator from "./tools/ogTagGenerator.js";
import twitterCardGenerator from "./tools/twitterCardGenerator.js";
import robotsGenerator from "./tools/robotsGenerator.js";
import htaccessGenerator from "./tools/htaccessGenerator.js";
import privacyPolicyGenerator from "./tools/privacyPolicyGenerator.js";
import termsGenerator from "./tools/termsGenerator.js";
import disclaimerGenerator from "./tools/disclaimerGenerator.js";
import qrCodeGenerator from "./tools/qrCodeGenerator.js";
import barcodeGenerator from "./tools/barcodeGenerator.js";
import cronParserTool from "./tools/cronParserTool.js";
import idGenerator from "./tools/idGenerator.js";
import diffChecker from "./tools/diffChecker.js";
import csvJsonConverter from "./tools/csvJsonConverter.js";
import colorPalette from "./tools/colorPalette.js";
import minifier from "./tools/minifier.js";
import slugGenerator from "./tools/slugGenerator.js";
import textToImage from "./tools/textToImage.js";
import faviconGenerator from "./tools/faviconGenerator.js";
import sslChecker from "./tools/sslChecker.js";
import nsLookup from "./tools/nsLookup.js";
import pingIp from "./tools/pingIp.js";
import websiteStatus from "./tools/websiteStatus.js";
import metaDescriptionChecker from "./tools/metaDescriptionChecker.js";
import xmlJsonConverter from "./tools/xmlJsonConverter.js";
import xmlFormatter from "./tools/xmlFormatter.js";
import htmlFormatter from "./tools/htmlFormatter.js";
import cssFormatter from "./tools/cssFormatter.js";
import jsonValidator from "./tools/jsonValidator.js";
import jsonSchemaValidator from "./tools/jsonSchemaValidator.js";
import envGenerator from "./tools/envGenerator.js";
import base32HexConverter from "./tools/base32HexConverter.js";
import passphraseGenerator from "./tools/passphraseGenerator.js";
import randomDataGenerator from "./tools/randomDataGenerator.js";
import imageResizer from "./tools/imageResizer.js";
import schemaGenerator from "./tools/schemaGenerator.js";
import sitemapGenerator from "./tools/sitemapGenerator.js";
import brokenLinkChecker from "./tools/brokenLinkChecker.js";
import domainIntelligence from "./tools/domainIntelligence.js";
import pagespeedInsights from "./tools/pagespeedInsights.js";
import semverTool from "./tools/semverTool.js";
import graphqlFormatter from "./tools/graphqlFormatter.js";
import codeDiff from "./tools/codeDiff.js";
import curlConverter from "./tools/curlConverter.js";
import hmacGenerator from "./tools/hmacGenerator.js";
import passwordHasher from "./tools/passwordHasher.js";
import certificateDecoder from "./tools/certificateDecoder.js";
import svgOptimizer from "./tools/svgOptimizer.js";
import imageFormatConverter from "./tools/imageFormatConverter.js";
import colorBlindnessSimulator from "./tools/colorBlindnessSimulator.js";
import requestBin from "./tools/requestBin.js";
import androidIconGenerator from "./tools/androidIconGenerator.js";
import iosIconGenerator from "./tools/iosIconGenerator.js";
import webIconGenerator from "./tools/webIconGenerator.js";
import gitignoreGenerator from "./tools/gitignoreGenerator.js";
import licenseGenerator from "./tools/licenseGenerator.js";
import nginxGenerator from "./tools/nginxGenerator.js";
import ipGeoLookup from "./tools/ipGeoLookup.js";

// Each entry: metadata shown to the client + a server-side handler.
// Adding a new tool = add one file in ./tools + one entry here. No route
// plumbing needed elsewhere (client picks up new entries from GET /api/tools).
const registry = [
  { id: "json-formatter", name: "JSON Formatter", description: "Validate, pretty-print, or minify JSON.", category: "format", handler: jsonFormatter },
  { id: "base64", name: "Base64 Encode / Decode", description: "Convert text to and from Base64.", category: "encode", handler: base64 },
  { id: "regex-tester", name: "Regex Tester", description: "Test a pattern against sample text and inspect matches.", category: "text", handler: regexTester },
  { id: "password-generator", name: "Password Generator", description: "Generate a random password from chosen character sets.", category: "generate", handler: passwordGenerator },
  { id: "md5-generator", name: "MD5 Generator", description: "Hash text with MD5.", category: "generate", handler: md5Generator },
  { id: "case-converter", name: "Case Converter", description: "Convert text between upper, lower, title, and sentence case.", category: "text", handler: caseConverter },
  { id: "lorem-ipsum", name: "Lorem Ipsum Generator", description: "Generate placeholder text by words, sentences, or paragraphs.", category: "generate", handler: loremIpsum },
  { id: "url-encoder", name: "URL Encode / Decode", description: "Encode or decode URL components.", category: "encode", handler: urlEncoder },
  { id: "color-converter", name: "RGB / Hex Converter", description: "Convert colors between RGB and hex.", category: "format", handler: colorConverter },
  { id: "binary-converter", name: "Binary / Text Converter", description: "Convert text to binary and back.", category: "encode", handler: binaryConverter },
  { id: "whats-my-ip", name: "What's My IP", description: "Show the IP address this request came from.", category: "network", handler: whatsMyIp },
  { id: "user-agent-finder", name: "User Agent Finder", description: "Show the User-Agent string this request sent.", category: "network", handler: userAgentFinder },
  { id: "canonical-generator", name: "Canonical Link Generator", description: "Generate a canonical <link> tag for a URL.", category: "seo", handler: canonicalGenerator },
  { id: "meta-tag-generator", name: "Meta Tag Generator", description: "Generate title, description, keyword, and viewport meta tags.", category: "seo", handler: metaTagGenerator },
  { id: "og-tag-generator", name: "Open Graph Tag Generator", description: "Generate Open Graph tags for social sharing.", category: "seo", handler: ogTagGenerator },
  { id: "twitter-card-generator", name: "Twitter Card Generator", description: "Generate Twitter Card meta tags.", category: "seo", handler: twitterCardGenerator },
  { id: "robots-generator", name: "Robots.txt Generator", description: "Generate a robots.txt file.", category: "seo", handler: robotsGenerator },
  { id: "htaccess-generator", name: ".htaccess Generator", description: "Generate common .htaccess rules (HTTPS, www, caching, gzip).", category: "seo", handler: htaccessGenerator },
  { id: "privacy-policy-generator", name: "Privacy Policy Generator", description: "Generate a boilerplate privacy policy for your site.", category: "legal", handler: privacyPolicyGenerator },
  { id: "terms-generator", name: "Terms & Conditions Generator", description: "Generate boilerplate terms & conditions for your site.", category: "legal", handler: termsGenerator },
  { id: "disclaimer-generator", name: "Disclaimer Generator", description: "Generate a boilerplate disclaimer for your site.", category: "legal", handler: disclaimerGenerator },
  { id: "qr-code-generator", name: "QR Code Generator", description: "Generate a QR code with custom colors, dot style, gradient, logo, and border.", category: "generate", handler: qrCodeGenerator },
  { id: "barcode-generator", name: "Barcode Generator", description: "Generate a Code 128 barcode image from text.", category: "generate", handler: barcodeGenerator },
  { id: "cron-parser", name: "Cron Expression Parser", description: "Explain a cron expression and show its next run times.", category: "text", handler: cronParserTool },
  { id: "id-generator", name: "UUID / ULID Generator", description: "Generate one or many UUIDs or ULIDs.", category: "generate", handler: idGenerator },
  { id: "diff-checker", name: "Diff Checker", description: "Compare two blocks of text and highlight the differences.", category: "text", handler: diffChecker },
  { id: "csv-json-converter", name: "CSV \u2194 JSON Converter", description: "Convert between CSV and JSON.", category: "format", handler: csvJsonConverter },
  { id: "color-palette", name: "Color Palette Generator", description: "Extract colors from an image, or generate a scheme from one color.", category: "generate", handler: colorPalette },
  { id: "minifier", name: "HTML / CSS / JS Minifier", description: "Minify HTML, CSS, or JavaScript.", category: "format", handler: minifier },
  { id: "slug-generator", name: "Slug Generator", description: "Turn a title into a URL-friendly slug.", category: "text", handler: slugGenerator },
  { id: "text-to-image", name: "Text to Image Generator", description: "Render text onto an image you can download.", category: "generate", handler: textToImage },
  { id: "favicon-generator", name: "Image to Favicon Generator", description: "Convert an uploaded image into a multi-size .ico favicon.", category: "generate", handler: faviconGenerator },
  { id: "ssl-checker", name: "SSL Checker", description: "Inspect a domain's TLS certificate.", category: "network", handler: sslChecker },
  { id: "ns-lookup", name: "Domain Nameserver Lookup", description: "Look up a domain's nameservers.", category: "network", handler: nsLookup },
  { id: "ping-ip", name: "Ping IP", description: "Check if a host is reachable and measure connect latency.", category: "network", handler: pingIp },
  { id: "website-status", name: "Website Status Check", description: "Check a URL's HTTP status and response time.", category: "network", handler: websiteStatus },
  { id: "meta-description-checker", name: "Meta Description Checker", description: "Fetch a page and check its meta description length.", category: "seo", handler: metaDescriptionChecker },
  { id: "xml-json-converter", name: "XML \u2194 JSON Converter", description: "Convert between XML and JSON.", category: "format", handler: xmlJsonConverter },
  { id: "xml-formatter", name: "XML Formatter", description: "Pretty-print and validate XML.", category: "format", handler: xmlFormatter },
  { id: "html-formatter", name: "HTML Formatter", description: "Pretty-print HTML.", category: "format", handler: htmlFormatter },
  { id: "css-formatter", name: "CSS Formatter", description: "Beautify minified or compact CSS.", category: "format", handler: cssFormatter },
  { id: "json-validator", name: "JSON Validator", description: "Check whether text is valid JSON.", category: "format", handler: jsonValidator },
  { id: "json-schema-validator", name: "JSON Schema Validator", description: "Validate JSON data against a JSON Schema.", category: "format", handler: jsonSchemaValidator },
  { id: "env-generator", name: "Env File Generator", description: "Convert key-value pairs into .env, docker-compose, or shell export format.", category: "generate", handler: envGenerator },
  { id: "base32-hex-converter", name: "Base32 / Hex Converter", description: "Encode or decode text as Base32 or hex.", category: "encode", handler: base32HexConverter },
  { id: "passphrase-generator", name: "Passphrase Generator", description: "Generate a word-based passphrase (correct-horse-battery-staple style).", category: "generate", handler: passphraseGenerator },
  { id: "random-data-generator", name: "Random Data Generator", description: "Generate fake names, emails, addresses, and phone numbers for testing.", category: "generate", handler: randomDataGenerator },
  { id: "image-resizer", name: "Image Resizer / Compressor", description: "Resize and compress an uploaded image.", category: "generate", handler: imageResizer },
  { id: "schema-generator", name: "Schema.org / JSON-LD Generator", description: "Generate structured data for Article, Product, or FAQ pages.", category: "seo", handler: schemaGenerator },
  { id: "sitemap-generator", name: "Sitemap Generator", description: "Build a sitemap.xml from a list of URLs.", category: "seo", handler: sitemapGenerator },
  { id: "broken-link-checker", name: "Broken Link Checker", description: "Fetch a page and check the status of every outbound link.", category: "seo", handler: brokenLinkChecker },
  { id: "domain-intelligence", name: "Domain Intelligence (DNS/WHOIS/Email Auth)", description: "DNS records, WHOIS/RDAP, domain age, subdomains, availability, SPF/DMARC/DKIM \u2014 free, keyless (Cloudflare DoH, RDAP, crt.sh).", category: "network", handler: domainIntelligence },
  { id: "pagespeed-insights", name: "PageSpeed Insights Audit", description: "Performance, SEO, and accessibility audit via Google PageSpeed Insights (Lighthouse).", category: "seo", handler: pagespeedInsights },
  { id: "semver-tool", name: "Semver Comparator / Bumper", description: "Compare two versions or bump major/minor/patch.", category: "text", handler: semverTool },
  { id: "graphql-formatter", name: "GraphQL Query Formatter", description: "Pretty-print a GraphQL query.", category: "format", handler: graphqlFormatter },
  { id: "code-diff", name: "Code Diff", description: "Line diff with within-line token highlighting.", category: "text", handler: codeDiff },
  { id: "curl-converter", name: "cURL \u2194 Fetch/Axios Converter", description: "Convert a curl command to fetch/axios JS, or back to curl.", category: "text", handler: curlConverter },
  { id: "hmac-generator", name: "HMAC Generator", description: "Sign a message with a secret key.", category: "generate", handler: hmacGenerator },
  { id: "password-hasher", name: "Password Hash Generator / Checker", description: "Hash a password with bcrypt or argon2id, or verify one against a hash.", category: "generate", handler: passwordHasher },
  { id: "certificate-decoder", name: "Certificate Decoder", description: "Parse a PEM certificate's fields.", category: "network", handler: certificateDecoder },
  { id: "svg-optimizer", name: "SVG Optimizer", description: "Strip unnecessary metadata and whitespace from SVG.", category: "generate", handler: svgOptimizer },
  { id: "image-format-converter", name: "Image Format Converter", description: "Convert an image between PNG, JPEG, BMP, GIF, and TIFF.", category: "generate", handler: imageFormatConverter },
  { id: "color-blindness-simulator", name: "Color Blindness Simulator", description: "Preview an image under protanopia, deuteranopia, or tritanopia.", category: "generate", handler: colorBlindnessSimulator },
  { id: "request-bin", name: "Webhook / Request Bin", description: "Get a temporary URL that logs incoming requests, for testing webhooks.", category: "network", handler: requestBin },
  { id: "android-icon-generator", name: "Android Icon Generator", description: "Generate launcher, adaptive, notification, or action-bar icons across all densities as a res/ folder zip.", category: "generate", handler: androidIconGenerator },
  { id: "ios-icon-generator", name: "iOS App Icon Generator", description: "Generate an AppIcon.appiconset with every required size and Contents.json.", category: "generate", handler: iosIconGenerator },
  { id: "web-icon-generator", name: "Web / PWA Icon Generator", description: "Generate favicon.ico, PNG icon set, apple-touch-icon, and site.webmanifest.", category: "generate", handler: webIconGenerator },
  { id: "gitignore-generator", name: ".gitignore Generator", description: "Combine templates for common languages and frameworks.", category: "generate", handler: gitignoreGenerator },
  { id: "license-generator", name: "License Generator", description: "Generate MIT, Apache-2.0, BSD-3-Clause, ISC, GPL-3.0, or Unlicense text.", category: "legal", handler: licenseGenerator },
  { id: "nginx-generator", name: "Nginx Config Generator", description: "Generate an nginx server block (reverse proxy, HTTPS redirect, gzip, caching).", category: "seo", handler: nginxGenerator },
  { id: "ip-geo-lookup", name: "IP Geolocation Lookup", description: "Show your IP's location, or look up any IP/domain \u2014 via ipwho.is.", category: "network", handler: ipGeoLookup },
];

export function listTools() {
  return registry.map(({ id, name, description, category }) => ({
    id,
    name,
    description,
    category,
  }));
}

export function getTool(id) {
  return registry.find((tool) => tool.id === id);
}
