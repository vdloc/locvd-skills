'use strict';
// PostToolUse (Edit|Write). Next.js App Router: a component using hooks/handlers
// needs "use client" at the top or it silently breaks (or fails) at build/runtime.
const path = require('path');
const { readInput, readPkg, hasDep, readFileSafe, allowSilent, postToolContext } = require('./_util');

const input = readInput();
const cwd = input.cwd || process.cwd();
const filePath = input.tool_input && input.tool_input.file_path;
if (!filePath || !/\.(tsx|jsx)$/.test(filePath)) allowSilent();

const pkg = readPkg(cwd);
if (!hasDep(pkg, 'next') && !hasDep(pkg, 'react')) allowSilent();

const content = readFileSafe(filePath);
if (!content) allowSilent();

// Skip route handlers / API routes / server-only files — different rules there.
if (/[\\/]api[\\/]/.test(filePath) || /\.server\.(tsx?|jsx?)$/.test(filePath)) allowSilent();

const firstDirectiveMatch = content.slice(0, 200).match(/^\s*['"](use client|use server)['"]/m);
const hasDirective = !!firstDirectiveMatch;

const interactivePattern = /use(State|Effect|Reducer|Context|Ref|LayoutEffect)\s*\(|on[A-Z]\w*\s*=\s*\{/;
if (!hasDirective && interactivePattern.test(content)) {
  postToolContext(
    `check-use-client: ${path.basename(filePath)} uses hooks/event handlers but has no ` +
    `"use client" directive at the top. In Next.js App Router this either fails the build ` +
    `or silently renders as a Server Component (handlers become no-ops). Add "use client" ` +
    `as the first line if this component is meant to be interactive.`
  );
}
allowSilent();
