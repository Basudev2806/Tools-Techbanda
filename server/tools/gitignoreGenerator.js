const TEMPLATES = {
  node: `# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*
dist/
build/
.env
.env.local
*.tsbuildinfo`,

  python: `# Python
__pycache__/
*.py[cod]
*.egg-info/
.eggs/
.venv/
venv/
env/
.mypy_cache/
.pytest_cache/
*.egg
dist/
build/`,

  java: `# Java
*.class
*.jar
*.war
*.ear
target/
.gradle/
build/
out/`,

  android: `# Android
*.apk
*.ap_
*.aab
*.dex
local.properties
.gradle/
build/
captures/
.externalNativeBuild/
.cxx/
*.keystore
!debug.keystore`,

  ios: `# Xcode / iOS
build/
DerivedData/
*.moved-aside
*.pbxuser
*.xcuserstate
*.xcscmblueprint
Pods/
*.ipa
*.dSYM.zip`,

  flutter: `# Flutter
.dart_tool/
.flutter-plugins
.flutter-plugins-dependencies
.packages
build/
*.g.dart
*.freezed.dart`,

  react: `# React
node_modules/
build/
dist/
.env
.env.local
coverage/`,

  macos: `# macOS
.DS_Store
.AppleDouble
.LSOverride
._*
.Spotlight-V100
.Trashes`,

  windows: `# Windows
Thumbs.db
Desktop.ini
$RECYCLE.BIN/
*.lnk`,

  vscode: `# VS Code
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json`,

  intellij: `# JetBrains IDEs
.idea/
*.iml
*.iws
out/`,

  terraform: `# Terraform
.terraform/
*.tfstate
*.tfstate.backup
.terraform.lock.hcl`,

  logs: `# Logs
*.log
logs/`,
};

const LABELS = {
  node: "Node.js",
  python: "Python",
  java: "Java",
  android: "Android",
  ios: "Xcode / iOS",
  flutter: "Flutter",
  react: "React",
  macos: "macOS",
  windows: "Windows",
  vscode: "VS Code",
  intellij: "JetBrains IDEs",
  terraform: "Terraform",
  logs: "Logs",
};

export function listTemplates() {
  return Object.keys(TEMPLATES).map((id) => ({ id, label: LABELS[id] }));
}

/**
 * body: { templates: string[] }
 */
export default function gitignoreGenerator(body = {}) {
  const { templates = [] } = body;

  const selected = (Array.isArray(templates) ? templates : []).filter((t) => TEMPLATES[t]);
  if (!selected.length) {
    return { ok: false, error: "Pick at least one template." };
  }

  const output = selected.map((t) => TEMPLATES[t]).join("\n\n");
  return { ok: true, output };
}
