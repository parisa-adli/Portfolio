#!/usr/bin/env bash
# Usage: scripts/lh.sh <path> <name>  (needs `next start` on :3000, or set BASE_URL). Mobile Lighthouse via Playwright's Chromium.
export CHROME_PATH="${CHROME_PATH:-$(ls -d "$LOCALAPPDATA"/ms-playwright/chromium-*/chrome-win64/chrome.exe 2>/dev/null | head -1)}"
npx lighthouse "${BASE_URL:-http://localhost:3000}$1" --form-factor=mobile --quiet --chrome-flags="--headless=new" --output=json --output-path="screenshots/lh/$2.json" >/dev/null 2>&1
node -e "
const r=require('./screenshots/lh/$2.json');
console.log(['performance','accessibility','best-practices','seo'].map(k=>k+' '+Math.round(r.categories[k].score*100)).join(' | '));
console.log(['largest-contentful-paint','cumulative-layout-shift','total-blocking-time','interactive'].map(a=>a+' '+r.audits[a].displayValue).join(' | '));
for (const [k,a] of Object.entries(r.audits)) if (a.score!==null && a.score<0.9 && !['informative','notApplicable','manual'].includes(a.scoreDisplayMode)) console.log('  FAIL', k, a.displayValue||'', (a.details?.items||[]).slice(0,3).map(i=>(i.node?.snippet||i.url||'').slice(0,90)).join(' ; '));
"
