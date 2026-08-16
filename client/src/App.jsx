import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import TerminalWindow from "./components/TerminalWindow";
import JsonFormatter from "./tools/JsonFormatter";
import Base64Tool from "./tools/Base64Tool";
import RegexTester from "./tools/RegexTester";
import PasswordGenerator from "./tools/PasswordGenerator";
import Md5Generator from "./tools/Md5Generator";
import CaseConverter from "./tools/CaseConverter";
import LoremIpsum from "./tools/LoremIpsum";
import UrlEncoder from "./tools/UrlEncoder";
import ColorConverter from "./tools/ColorConverter";
import BinaryConverter from "./tools/BinaryConverter";
import WhatsMyIp from "./tools/WhatsMyIp";
import UserAgentFinder from "./tools/UserAgentFinder";
import CanonicalGenerator from "./tools/CanonicalGenerator";
import MetaTagGenerator from "./tools/MetaTagGenerator";
import OgTagGenerator from "./tools/OgTagGenerator";
import TwitterCardGenerator from "./tools/TwitterCardGenerator";
import RobotsGenerator from "./tools/RobotsGenerator";
import HtaccessGenerator from "./tools/HtaccessGenerator";
import PrivacyPolicyGenerator from "./tools/PrivacyPolicyGenerator";
import TermsGenerator from "./tools/TermsGenerator";
import DisclaimerGenerator from "./tools/DisclaimerGenerator";
import QrCodeGenerator from "./tools/QrCodeGenerator";
import BarcodeGenerator from "./tools/BarcodeGenerator";
import TextToImage from "./tools/TextToImage";
import FaviconGenerator from "./tools/FaviconGenerator";
import SslChecker from "./tools/SslChecker";
import NsLookup from "./tools/NsLookup";
import PingIp from "./tools/PingIp";
import WebsiteStatus from "./tools/WebsiteStatus";
import MetaDescriptionChecker from "./tools/MetaDescriptionChecker";
import VoiceToText from "./tools/VoiceToText";
import CronParser from "./tools/CronParser";
import IdGenerator from "./tools/IdGenerator";
import DiffChecker from "./tools/DiffChecker";
import CsvJsonConverter from "./tools/CsvJsonConverter";
import ColorPalette from "./tools/ColorPalette";
import Minifier from "./tools/Minifier";
import SlugGenerator from "./tools/SlugGenerator";
import JwtDecoder from "./tools/JwtDecoder";
import MarkdownPreviewer from "./tools/MarkdownPreviewer";
import TimestampConverter from "./tools/TimestampConverter";
import XmlFormatter from "./tools/XmlFormatter";
import HtmlFormatter from "./tools/HtmlFormatter";
import CssFormatter from "./tools/CssFormatter";
import JsonValidator from "./tools/JsonValidator";
import JsonSchemaValidator from "./tools/JsonSchemaValidator";
import Base32HexConverter from "./tools/Base32HexConverter";
import EnvGenerator from "./tools/EnvGenerator";
import PassphraseGenerator from "./tools/PassphraseGenerator";
import RandomDataGenerator from "./tools/RandomDataGenerator";
import SitemapGenerator from "./tools/SitemapGenerator";
import XmlJsonConverter from "./tools/XmlJsonConverter";
import BrokenLinkChecker from "./tools/BrokenLinkChecker";
import ImageResizer from "./tools/ImageResizer";
import PagespeedInsights from "./tools/PagespeedInsights";
import DomainIntelligence from "./tools/DomainIntelligence";
import SchemaGenerator from "./tools/SchemaGenerator";
import HttpStatusReference from "./tools/HttpStatusReference";
import RegexCheatsheet from "./tools/RegexCheatsheet";
import TextStatistics from "./tools/TextStatistics";
import KeywordDensity from "./tools/KeywordDensity";
import SemverTool from "./tools/SemverTool";
import GraphqlFormatter from "./tools/GraphqlFormatter";
import CodeDiff from "./tools/CodeDiff";
import CurlConverter from "./tools/CurlConverter";
import HmacGenerator from "./tools/HmacGenerator";
import PasswordHasher from "./tools/PasswordHasher";
import CertificateDecoder from "./tools/CertificateDecoder";
import SvgOptimizer from "./tools/SvgOptimizer";
import ImageFormatConverter from "./tools/ImageFormatConverter";
import ColorBlindnessSimulator from "./tools/ColorBlindnessSimulator";
import RequestBin from "./tools/RequestBin";
import ReadabilityChecker from "./tools/ReadabilityChecker";
import FindReplace from "./tools/FindReplace";
import EmojiPicker from "./tools/EmojiPicker";
import JwtEncoder from "./tools/JwtEncoder";
import AndroidIconGenerator from "./tools/AndroidIconGenerator";
import IosIconGenerator from "./tools/IosIconGenerator";
import WebIconGenerator from "./tools/WebIconGenerator";
import GitignoreGenerator from "./tools/GitignoreGenerator";
import LicenseGenerator from "./tools/LicenseGenerator";
import NginxGenerator from "./tools/NginxGenerator";
import IpGeoLookup from "./tools/IpGeoLookup";
import BadgeGenerator from "./tools/BadgeGenerator";
import ContrastChecker from "./tools/ContrastChecker";
import IdentifierCaseConverter from "./tools/IdentifierCaseConverter";
import { fetchTools } from "./api";

// Local fallback metadata — used only if the API can't be reached, so the
// console still renders (with a visible "api offline" badge) during local
// frontend-only work. Keep in sync with server/toolRegistry.js.
const FALLBACK_TOOLS = [
  { id: "json-formatter", name: "JSON Formatter", description: "Validate, pretty-print, or minify JSON.", category: "format" },
  { id: "base64", name: "Base64 Encode / Decode", description: "Convert text to and from Base64.", category: "encode" },
  { id: "regex-tester", name: "Regex Tester", description: "Test a pattern against sample text.", category: "text" },
  { id: "password-generator", name: "Password Generator", description: "Generate a random password.", category: "generate" },
  { id: "md5-generator", name: "MD5 Generator", description: "Hash text with MD5.", category: "generate" },
  { id: "case-converter", name: "Case Converter", description: "Convert text case.", category: "text" },
  { id: "lorem-ipsum", name: "Lorem Ipsum Generator", description: "Generate placeholder text.", category: "generate" },
  { id: "url-encoder", name: "URL Encode / Decode", description: "Encode or decode URL components.", category: "encode" },
  { id: "color-converter", name: "RGB / Hex Converter", description: "Convert colors between RGB and hex.", category: "format" },
  { id: "binary-converter", name: "Binary / Text Converter", description: "Convert text to binary and back.", category: "encode" },
  { id: "whats-my-ip", name: "What's My IP", description: "Show the IP this request came from.", category: "network" },
  { id: "user-agent-finder", name: "User Agent Finder", description: "Show this request's User-Agent.", category: "network" },
  { id: "canonical-generator", name: "Canonical Link Generator", description: "Generate a canonical link tag.", category: "seo" },
  { id: "meta-tag-generator", name: "Meta Tag Generator", description: "Generate meta tags.", category: "seo" },
  { id: "og-tag-generator", name: "Open Graph Tag Generator", description: "Generate Open Graph tags.", category: "seo" },
  { id: "twitter-card-generator", name: "Twitter Card Generator", description: "Generate Twitter Card tags.", category: "seo" },
  { id: "robots-generator", name: "Robots.txt Generator", description: "Generate a robots.txt file.", category: "seo" },
  { id: "htaccess-generator", name: ".htaccess Generator", description: "Generate common .htaccess rules.", category: "seo" },
  { id: "privacy-policy-generator", name: "Privacy Policy Generator", description: "Generate a boilerplate privacy policy.", category: "legal" },
  { id: "terms-generator", name: "Terms & Conditions Generator", description: "Generate boilerplate terms.", category: "legal" },
  { id: "disclaimer-generator", name: "Disclaimer Generator", description: "Generate a boilerplate disclaimer.", category: "legal" },
  { id: "qr-code-generator", name: "QR Code Generator", description: "Generate a QR code with custom colors, size, logo, and border.", category: "generate" },
  { id: "barcode-generator", name: "Barcode Generator", description: "Generate a Code 128 barcode image.", category: "generate" },
  { id: "text-to-image", name: "Text to Image Generator", description: "Render text onto an image.", category: "generate" },
  { id: "favicon-generator", name: "Image to Favicon Generator", description: "Convert an image into a .ico favicon.", category: "generate" },
  { id: "ssl-checker", name: "SSL Checker", description: "Inspect a domain's TLS certificate.", category: "network" },
  { id: "ns-lookup", name: "Domain Nameserver Lookup", description: "Look up a domain's nameservers.", category: "network" },
  { id: "ping-ip", name: "Ping IP", description: "Check host reachability and latency.", category: "network" },
  { id: "website-status", name: "Website Status Check", description: "Check a URL's HTTP status.", category: "network" },
  { id: "meta-description-checker", name: "Meta Description Checker", description: "Check a page's meta description.", category: "seo" },
  { id: "cron-parser", name: "Cron Expression Parser", description: "Explain a cron expression and show next run times.", category: "text" },
  { id: "id-generator", name: "UUID / ULID Generator", description: "Generate one or many UUIDs or ULIDs.", category: "generate" },
  { id: "diff-checker", name: "Diff Checker", description: "Compare two blocks of text.", category: "text" },
  { id: "csv-json-converter", name: "CSV / JSON Converter", description: "Convert between CSV and JSON.", category: "format" },
  { id: "color-palette", name: "Color Palette Generator", description: "Extract or generate a color palette.", category: "generate" },
  { id: "minifier", name: "HTML / CSS / JS Minifier", description: "Minify HTML, CSS, or JavaScript.", category: "format" },
  { id: "slug-generator", name: "Slug Generator", description: "Turn a title into a URL slug.", category: "text" },
  { id: "xml-json-converter", name: "XML / JSON Converter", description: "Convert between XML and JSON.", category: "format" },
  { id: "xml-formatter", name: "XML Formatter", description: "Pretty-print and validate XML.", category: "format" },
  { id: "html-formatter", name: "HTML Formatter", description: "Pretty-print HTML.", category: "format" },
  { id: "css-formatter", name: "CSS Formatter", description: "Beautify minified CSS.", category: "format" },
  { id: "json-validator", name: "JSON Validator", description: "Check whether text is valid JSON.", category: "format" },
  { id: "json-schema-validator", name: "JSON Schema Validator", description: "Validate JSON against a schema.", category: "format" },
  { id: "env-generator", name: "Env File Generator", description: "Convert key-value pairs to .env/shell/docker-compose.", category: "generate" },
  { id: "base32-hex-converter", name: "Base32 / Hex Converter", description: "Encode or decode as Base32 or hex.", category: "encode" },
  { id: "passphrase-generator", name: "Passphrase Generator", description: "Generate a word-based passphrase.", category: "generate" },
  { id: "random-data-generator", name: "Random Data Generator", description: "Generate fake test data.", category: "generate" },
  { id: "image-resizer", name: "Image Resizer / Compressor", description: "Resize and compress an image.", category: "generate" },
  { id: "schema-generator", name: "Schema.org / JSON-LD Generator", description: "Generate structured data snippets.", category: "seo" },
  { id: "sitemap-generator", name: "Sitemap Generator", description: "Build a sitemap.xml from URLs.", category: "seo" },
  { id: "broken-link-checker", name: "Broken Link Checker", description: "Check a page's outbound links.", category: "seo" },
  { id: "domain-intelligence", name: "Domain Intelligence", description: "DNS/WHOIS/age/subdomains/availability/email-auth lookups \u2014 free, keyless.", category: "network" },
  { id: "pagespeed-insights", name: "PageSpeed Insights Audit", description: "Performance/SEO/accessibility audit via Lighthouse.", category: "seo" },
  { id: "semver-tool", name: "Semver Comparator / Bumper", description: "Compare or bump semantic versions.", category: "text" },
  { id: "graphql-formatter", name: "GraphQL Query Formatter", description: "Pretty-print a GraphQL query.", category: "format" },
  { id: "code-diff", name: "Code Diff", description: "Line diff with within-line token highlighting.", category: "text" },
  { id: "curl-converter", name: "cURL / Fetch / Axios Converter", description: "Convert between curl and fetch/axios code.", category: "text" },
  { id: "hmac-generator", name: "HMAC Generator", description: "Sign a message with a secret key.", category: "generate" },
  { id: "password-hasher", name: "Password Hash Generator / Checker", description: "Hash or verify passwords with bcrypt/argon2id.", category: "generate" },
  { id: "certificate-decoder", name: "Certificate Decoder", description: "Parse a PEM certificate's fields.", category: "network" },
  { id: "svg-optimizer", name: "SVG Optimizer", description: "Strip metadata and whitespace from SVG.", category: "generate" },
  { id: "image-format-converter", name: "Image Format Converter", description: "Convert images between formats.", category: "generate" },
  { id: "color-blindness-simulator", name: "Color Blindness Simulator", description: "Preview an image under color vision deficiency.", category: "generate" },
  { id: "request-bin", name: "Webhook / Request Bin", description: "A temporary URL that logs incoming requests.", category: "network" },
  { id: "android-icon-generator", name: "Android Icon Generator", description: "Generate launcher/adaptive/notification/action-bar icons as a res/ folder zip.", category: "generate" },
  { id: "ios-icon-generator", name: "iOS App Icon Generator", description: "Generate an AppIcon.appiconset with Contents.json.", category: "generate" },
  { id: "web-icon-generator", name: "Web / PWA Icon Generator", description: "Generate favicon.ico, PNG set, and site.webmanifest.", category: "generate" },
  { id: "gitignore-generator", name: ".gitignore Generator", description: "Combine templates for languages and frameworks.", category: "generate" },
  { id: "license-generator", name: "License Generator", description: "Generate open-source license text.", category: "legal" },
  { id: "nginx-generator", name: "Nginx Config Generator", description: "Generate an nginx server block.", category: "seo" },
  { id: "ip-geo-lookup", name: "IP Geolocation Lookup", description: "Show your IP's location, or look up any IP/domain.", category: "network" },
];

// Client-only tools that don't call the API — appended to whatever the
// server returns so they always show up in the sidebar.
const CLIENT_ONLY_TOOLS = [
  { id: "voice-to-text", name: "Voice to Text", description: "Speech-to-text using your browser's microphone.", category: "client" },
  { id: "jwt-decoder", name: "JWT Decoder", description: "Decode a JWT's header and payload (no verification).", category: "client" },
  { id: "markdown-previewer", name: "Markdown Previewer", description: "Live-rendered markdown preview.", category: "client" },
  { id: "timestamp-converter", name: "Timestamp Converter", description: "Unix timestamp to/from human-readable, timezone-aware.", category: "client" },
  { id: "http-status-reference", name: "HTTP Status Code Reference", description: "Searchable reference for HTTP status codes.", category: "client" },
  { id: "regex-cheatsheet", name: "Regex Cheatsheet", description: "Common regex patterns, ready to copy.", category: "client" },
  { id: "text-statistics", name: "Text Statistics", description: "Word/character count and reading time.", category: "client" },
  { id: "keyword-density", name: "Keyword Density Analyzer", description: "Word frequency analysis for a block of text.", category: "client" },
  { id: "readability-checker", name: "Grammar / Readability Checker", description: "Flesch-Kincaid score, passive voice, long-sentence flags.", category: "client" },
  { id: "find-replace", name: "Find & Replace (Regex)", description: "Bulk find and replace with optional regex.", category: "client" },
  { id: "emoji-picker", name: "Emoji / Unicode Picker", description: "Searchable emoji and symbols, click to copy.", category: "client" },
  { id: "jwt-encoder", name: "JWT Encoder", description: "Build and sign an HS256 JWT (secret never leaves your browser).", category: "client" },
  { id: "badge-generator", name: "README Badge Generator", description: "Build shields.io-style badges for your README.", category: "client" },
  { id: "contrast-checker", name: "Color Contrast Checker", description: "WCAG AA/AAA contrast ratio between two colors.", category: "client" },
  { id: "identifier-case-converter", name: "Identifier Case Converter", description: "camelCase / snake_case / PascalCase / kebab-case / CONSTANT_CASE.", category: "client" },
];

const TOOL_COMPONENTS = {
  "json-formatter": JsonFormatter,
  base64: Base64Tool,
  "regex-tester": RegexTester,
  "password-generator": PasswordGenerator,
  "md5-generator": Md5Generator,
  "case-converter": CaseConverter,
  "lorem-ipsum": LoremIpsum,
  "url-encoder": UrlEncoder,
  "color-converter": ColorConverter,
  "binary-converter": BinaryConverter,
  "whats-my-ip": WhatsMyIp,
  "user-agent-finder": UserAgentFinder,
  "canonical-generator": CanonicalGenerator,
  "meta-tag-generator": MetaTagGenerator,
  "og-tag-generator": OgTagGenerator,
  "twitter-card-generator": TwitterCardGenerator,
  "robots-generator": RobotsGenerator,
  "htaccess-generator": HtaccessGenerator,
  "privacy-policy-generator": PrivacyPolicyGenerator,
  "terms-generator": TermsGenerator,
  "disclaimer-generator": DisclaimerGenerator,
  "qr-code-generator": QrCodeGenerator,
  "barcode-generator": BarcodeGenerator,
  "text-to-image": TextToImage,
  "favicon-generator": FaviconGenerator,
  "ssl-checker": SslChecker,
  "ns-lookup": NsLookup,
  "ping-ip": PingIp,
  "website-status": WebsiteStatus,
  "meta-description-checker": MetaDescriptionChecker,
  "voice-to-text": VoiceToText,
  "cron-parser": CronParser,
  "id-generator": IdGenerator,
  "diff-checker": DiffChecker,
  "csv-json-converter": CsvJsonConverter,
  "color-palette": ColorPalette,
  minifier: Minifier,
  "slug-generator": SlugGenerator,
  "jwt-decoder": JwtDecoder,
  "markdown-previewer": MarkdownPreviewer,
  "timestamp-converter": TimestampConverter,
  "xml-json-converter": XmlJsonConverter,
  "xml-formatter": XmlFormatter,
  "html-formatter": HtmlFormatter,
  "css-formatter": CssFormatter,
  "json-validator": JsonValidator,
  "json-schema-validator": JsonSchemaValidator,
  "base32-hex-converter": Base32HexConverter,
  "env-generator": EnvGenerator,
  "passphrase-generator": PassphraseGenerator,
  "random-data-generator": RandomDataGenerator,
  "image-resizer": ImageResizer,
  "schema-generator": SchemaGenerator,
  "sitemap-generator": SitemapGenerator,
  "broken-link-checker": BrokenLinkChecker,
  "domain-intelligence": DomainIntelligence,
  "pagespeed-insights": PagespeedInsights,
  "http-status-reference": HttpStatusReference,
  "regex-cheatsheet": RegexCheatsheet,
  "text-statistics": TextStatistics,
  "keyword-density": KeywordDensity,
  "semver-tool": SemverTool,
  "graphql-formatter": GraphqlFormatter,
  "code-diff": CodeDiff,
  "curl-converter": CurlConverter,
  "hmac-generator": HmacGenerator,
  "password-hasher": PasswordHasher,
  "certificate-decoder": CertificateDecoder,
  "svg-optimizer": SvgOptimizer,
  "image-format-converter": ImageFormatConverter,
  "color-blindness-simulator": ColorBlindnessSimulator,
  "request-bin": RequestBin,
  "readability-checker": ReadabilityChecker,
  "find-replace": FindReplace,
  "emoji-picker": EmojiPicker,
  "jwt-encoder": JwtEncoder,
  "android-icon-generator": AndroidIconGenerator,
  "ios-icon-generator": IosIconGenerator,
  "web-icon-generator": WebIconGenerator,
  "gitignore-generator": GitignoreGenerator,
  "license-generator": LicenseGenerator,
  "nginx-generator": NginxGenerator,
  "ip-geo-lookup": IpGeoLookup,
  "badge-generator": BadgeGenerator,
  "contrast-checker": ContrastChecker,
  "identifier-case-converter": IdentifierCaseConverter,
};

export default function App() {
  const [tools, setTools] = useState([...FALLBACK_TOOLS, ...CLIENT_ONLY_TOOLS]);
  const [activeId, setActiveId] = useState("json-formatter");
  const [status, setStatus] = useState("connecting");

  useEffect(() => {
    let cancelled = false;
    fetchTools()
      .then((list) => {
        if (cancelled) return;
        if (Array.isArray(list) && list.length) setTools([...list, ...CLIENT_ONLY_TOOLS]);
        setStatus("online");
      })
      .catch(() => {
        if (!cancelled) setStatus("offline");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const active = tools.find((t) => t.id === activeId) ?? tools[0];
  const ActiveComponent = TOOL_COMPONENTS[active?.id];

  return (
    <div className="shell">
      <Sidebar tools={tools} activeId={active?.id} onSelect={setActiveId} status={status} />
      <main className="main">
        <TerminalWindow title={`~/tools/${active?.id ?? ""}`}>
          {ActiveComponent ? <ActiveComponent /> : null}
        </TerminalWindow>
      </main>
    </div>
  );
}
