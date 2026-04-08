const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

const config = getDefaultConfig(__dirname);

// Do NOT enable unstable_enablePackageExports globally — it breaks
// @babel/runtime's internal relative requires via its strict exports map.
// Instead, resolve subpath imports manually for packages that need them.

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Handle @tanstack/pacer-lite subpath imports (e.g. @tanstack/pacer-lite/lite-throttler)
  const pacerMatch = moduleName.match(/^@tanstack\/pacer-lite\/(.+)$/);
  if (pacerMatch) {
    return {
      filePath: path.resolve(__dirname, 'node_modules/@tanstack/pacer-lite/dist', `${pacerMatch[1]}.js`),
      type: 'sourceFile',
    };
  }

  // Handle @tanstack/db subpath imports if any emerge
  const dbMatch = moduleName.match(/^@tanstack\/db\/(.+)$/);
  if (dbMatch) {
    const candidate = path.resolve(__dirname, 'node_modules/@tanstack/db/dist/esm', `${dbMatch[1]}.js`);
    if (fs.existsSync(candidate)) {
      return { filePath: candidate, type: 'sourceFile' };
    }
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
