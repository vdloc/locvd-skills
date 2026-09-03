'use strict';
// PostToolUse (Edit|Write). GSAP timelines/ScrollTriggers created inside a React component
// keep running/referencing unmounted DOM unless killed/reverted on cleanup.
const path = require('path');
const { readInput, readPkg, hasDep, readFileSafe, allowSilent, postToolContext } = require('./_util');

const input = readInput();
const cwd = input.cwd || process.cwd();
const filePath = input.tool_input && input.tool_input.file_path;
if (!filePath || !/\.(tsx?|jsx?)$/.test(filePath)) allowSilent();

const pkg = readPkg(cwd);
if (!hasDep(pkg, 'gsap')) allowSilent();

const content = readFileSafe(filePath);
if (!content) allowSilent();

const createsAnimation = /gsap\.(timeline|to|from|fromTo)\s*\(|ScrollTrigger\.create\s*\(/;
const insideEffect = /useEffect\s*\(/.test(content);
const hasCleanup = /\.kill\s*\(\)|\.revert\s*\(\)|return\s*\(\)\s*=>/.test(content);

if (createsAnimation.test(content) && insideEffect && !hasCleanup) {
  postToolContext(
    `check-gsap-cleanup: ${path.basename(filePath)} creates a GSAP timeline/animation ` +
    `inside useEffect with no visible .kill()/.revert() or cleanup return function. On ` +
    `unmount/re-render this keeps animating detached DOM or double-fires on the next ` +
    `effect run. Prefer gsap.context(() => {...}, ref) and \`return () => ctx.revert()\`.`
  );
}
allowSilent();
