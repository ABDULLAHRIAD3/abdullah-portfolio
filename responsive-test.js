const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const PAGES = [
  { name: 'home', url: 'http://127.0.0.1:8080/index.html' },
  { name: 'ai-coach', url: 'http://127.0.0.1:8080/project-ai-coach.html' },
  { name: 'file-organizer', url: 'http://127.0.0.1:8080/project-file-organizer.html' },
  { name: 'financial-dashboard', url: 'http://127.0.0.1:8080/project-financial-dashboard.html' },
];

const VIEWPORTS = [
  { width: 320, height: 568, label: '320px' },
  { width: 375, height: 812, label: '375px' },
  { width: 414, height: 896, label: '414px' },
  { width: 768, height: 1024, label: '768px' },
  { width: 1024, height: 768, label: '1024px' },
  { width: 1440, height: 900, label: '1440px' },
  { width: 1920, height: 1080, label: '1920px' },
];

const OUTPUT_DIR = path.join(__dirname, 'responsive-test-screenshots');

(async () => {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    executablePath: '/usr/bin/google-chrome',
  });

  const issues = [];
  let testCount = 0;

  for (const page of PAGES) {
    for (const vp of VIEWPORTS) {
      testCount++;
      const tab = await browser.newPage();
      await tab.setViewport({ width: vp.width, height: vp.height });
      
      try {
        await tab.goto(page.url, { waitUntil: 'networkidle2', timeout: 15000 });
      } catch (e) {
        try {
          await tab.goto(page.url, { waitUntil: 'load', timeout: 10000 });
        } catch (e2) {
          issues.push(`❌ LOAD FAILURE: ${page.name} @ ${vp.label} — ${e2.message}`);
          await tab.close();
          continue;
        }
      }
      
      // Wait for rendering
      await new Promise(r => setTimeout(r, 1000));

      // Full-page screenshot
      const filename = `${page.name}_${vp.label}.png`;
      await tab.screenshot({
        path: path.join(OUTPUT_DIR, filename),
        fullPage: true,
      });

      // === Test 1: Horizontal overflow ===
      const scrollInfo = await tab.evaluate(() => {
        return {
          bodyScrollWidth: document.body.scrollWidth,
          windowInnerWidth: window.innerWidth,
          htmlScrollWidth: document.documentElement.scrollWidth,
        };
      });

      const hasHScroll = scrollInfo.bodyScrollWidth > scrollInfo.windowInnerWidth + 1 || 
                          scrollInfo.htmlScrollWidth > scrollInfo.windowInnerWidth + 1;
      if (hasHScroll) {
        issues.push(`⚠️  HORIZONTAL OVERFLOW: ${page.name} @ ${vp.label} — body=${scrollInfo.bodyScrollWidth}px, html=${scrollInfo.htmlScrollWidth}px vs viewport=${scrollInfo.windowInnerWidth}px`);
      }

      // === Test 2: Overflowing elements ===
      const overflows = await tab.evaluate(() => {
        const vw = window.innerWidth;
        const results = [];
        document.querySelectorAll('body *').forEach(el => {
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          // Skip fixed/absolute positioned elements meant to be offscreen (backgrounds, blobs)
          if (style.position === 'fixed' || style.position === 'absolute') return;
          if (rect.width <= 0 || rect.height <= 0) return;
          if (style.overflow === 'hidden' || style.overflowX === 'hidden') return;
          if (style.visibility === 'hidden') return;
          
          if (rect.right > vw + 5) {
            const tag = el.tagName.toLowerCase();
            const cls = el.className ? String(el.className).split(' ').slice(0,3).join('.') : '';
            results.push(`${tag}.${cls} — right:${Math.round(rect.right)}px > viewport:${vw}px`);
          }
        });
        return results.slice(0, 5);
      });

      if (overflows.length > 0) {
        issues.push(`⚠️  ELEMENT OVERFLOW on ${page.name} @ ${vp.label}:`);
        overflows.forEach(o => issues.push(`     ${o}`));
      }

      // === Test 3: Text clipping / unreadable ===
      const textIssues = await tab.evaluate(() => {
        const results = [];
        document.querySelectorAll('h1, h2, h3, p, .btn, .pill, .project-badge').forEach(el => {
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          if (style.visibility === 'hidden') return;
          const vw = window.innerWidth;
          if (rect.width > 0 && rect.left < 0) {
            results.push(`LEFT CLIP: ${el.tagName}.${el.className} left=${Math.round(rect.left)}px`);
          }
          if (rect.width > 0 && rect.right > vw + 5) {
            const style = window.getComputedStyle(el);
            if (style.overflow !== 'hidden' && style.overflowX !== 'hidden') {
              results.push(`RIGHT CLIP: ${el.tagName}.${el.className} right=${Math.round(rect.right)}px > ${vw}px`);
            }
          }
        });
        return results.slice(0, 5);
      });

      if (textIssues.length > 0) {
        issues.push(`⚠️  TEXT CLIPPING on ${page.name} @ ${vp.label}:`);
        textIssues.forEach(t => issues.push(`     ${t}`));
      }

      // === Test 4: SaaS Showcase checks (on project pages) ===
      if (page.name !== 'home') {
        const showcaseCheck = await tab.evaluate(() => {
          const wrapper = document.querySelector('.saas-showcase-wrapper');
          if (!wrapper) return { exists: false };
          const showcase = wrapper.querySelector('.saas-showcase');
          const cards = wrapper.querySelectorAll('.saas-card');
          const dots = wrapper.querySelectorAll('.saas-dot');
          const activeCard = wrapper.querySelector('.saas-card.active');
          const controls = wrapper.querySelector('.saas-controls');
          const info = wrapper.querySelector('.saas-info-container');
          
          const wrapperRect = wrapper.getBoundingClientRect();
          const vw = window.innerWidth;
          
          return {
            exists: true,
            cardCount: cards.length,
            dotCount: dots.length,
            hasActiveCard: !!activeCard,
            hasControls: !!controls,
            hasInfo: !!info,
            wrapperOverflow: wrapperRect.right > vw + 2,
            infoTitle: info ? info.querySelector('.saas-info-title')?.textContent : null,
            infoDesc: info ? info.querySelector('.saas-info-desc')?.textContent : null,
          };
        });

        if (showcaseCheck.exists) {
          if (showcaseCheck.cardCount !== 5) {
            issues.push(`⚠️  SHOWCASE: ${page.name} @ ${vp.label} — Expected 5 cards, got ${showcaseCheck.cardCount}`);
          }
          if (showcaseCheck.dotCount !== 5) {
            issues.push(`⚠️  SHOWCASE: ${page.name} @ ${vp.label} — Expected 5 dots, got ${showcaseCheck.dotCount}`);
          }
          if (!showcaseCheck.hasActiveCard) {
            issues.push(`⚠️  SHOWCASE: ${page.name} @ ${vp.label} — No active card found`);
          }
          if (!showcaseCheck.hasControls) {
            issues.push(`⚠️  SHOWCASE: ${page.name} @ ${vp.label} — No controls found`);
          }
          if (!showcaseCheck.hasInfo) {
            issues.push(`⚠️  SHOWCASE: ${page.name} @ ${vp.label} — No info container found`);
          }
          if (showcaseCheck.wrapperOverflow) {
            issues.push(`⚠️  SHOWCASE OVERFLOW: ${page.name} @ ${vp.label} — Wrapper extends past viewport`);
          }
          if (!showcaseCheck.infoTitle || showcaseCheck.infoTitle.trim() === '') {
            issues.push(`⚠️  SHOWCASE: ${page.name} @ ${vp.label} — Caption title is empty`);
          }
        } else {
          issues.push(`❌ SHOWCASE MISSING: ${page.name} @ ${vp.label}`);
        }
      }

      // === Test 5: Navigation check ===
      const navCheck = await tab.evaluate(() => {
        const navbar = document.querySelector('.navbar');
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        
        if (!navbar) return { error: 'No navbar found' };
        
        const navRect = navbar.getBoundingClientRect();
        const vw = window.innerWidth;
        const hamburgerVisible = hamburger && window.getComputedStyle(hamburger).display !== 'none';
        const linksVisible = navLinks && window.getComputedStyle(navLinks).display !== 'none';
        
        return {
          navWidth: Math.round(navRect.width),
          navOverflow: navRect.right > vw + 2,
          hamburgerVisible,
          linksVisible,
          viewportWidth: vw,
        };
      });

      if (navCheck.error) {
        issues.push(`❌ NAV: ${page.name} @ ${vp.label} — ${navCheck.error}`);
      } else {
        if (navCheck.navOverflow) {
          issues.push(`⚠️  NAV OVERFLOW: ${page.name} @ ${vp.label}`);
        }
        // At ≤768px, hamburger should be visible and links hidden
        if (vp.width <= 768 && !navCheck.hamburgerVisible) {
          issues.push(`⚠️  NAV: ${page.name} @ ${vp.label} — Hamburger should be visible at ${vp.width}px`);
        }
        if (vp.width > 768 && navCheck.hamburgerVisible) {
          issues.push(`⚠️  NAV: ${page.name} @ ${vp.label} — Hamburger should be hidden at ${vp.width}px`);
        }
      }

      // === Test 6: Footer check ===
      const footerCheck = await tab.evaluate(() => {
        const footer = document.querySelector('.footer-inner');
        if (!footer) return null;
        const rect = footer.getBoundingClientRect();
        return { right: Math.round(rect.right), width: Math.round(rect.width) };
      });

      await tab.close();
      console.log(`✓ ${page.name} @ ${vp.label} — ${hasHScroll ? 'OVERFLOW!' : 'clean'}`);
    }
  }

  await browser.close();

  // === RTL Test ===
  console.log('\n--- Running RTL tests ---');
  const browser2 = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    executablePath: '/usr/bin/google-chrome',
  });

  for (const page of PAGES) {
    for (const vp of [{ width: 375, height: 812, label: '375px-RTL' }, { width: 1440, height: 900, label: '1440px-RTL' }]) {
      testCount++;
      const tab = await browser2.newPage();
      await tab.setViewport({ width: vp.width, height: vp.height });
      
      try {
        await tab.goto(page.url, { waitUntil: 'networkidle2', timeout: 15000 });
      } catch (e) {
        await tab.goto(page.url, { waitUntil: 'load', timeout: 10000 });
      }
      
      // Click the language toggle to switch to Arabic
      await tab.evaluate(() => {
        const btn = document.getElementById('langToggle');
        if (btn) btn.click();
      });
      await new Promise(r => setTimeout(r, 1500));

      // Screenshot
      const filename = `${page.name}_${vp.label}.png`;
      await tab.screenshot({
        path: path.join(OUTPUT_DIR, filename),
        fullPage: true,
      });

      // Check RTL dir
      const rtlCheck = await tab.evaluate(() => {
        const dir = document.documentElement.getAttribute('dir');
        const lang = document.documentElement.getAttribute('lang');
        const bodyScrollWidth = document.body.scrollWidth;
        const vw = window.innerWidth;
        return { dir, lang, hasHScroll: bodyScrollWidth > vw + 1 };
      });

      if (rtlCheck.dir !== 'rtl') {
        issues.push(`⚠️  RTL: ${page.name} @ ${vp.label} — dir="${rtlCheck.dir}" (expected "rtl")`);
      }
      if (rtlCheck.lang !== 'ar') {
        issues.push(`⚠️  RTL: ${page.name} @ ${vp.label} — lang="${rtlCheck.lang}" (expected "ar")`);
      }
      if (rtlCheck.hasHScroll) {
        issues.push(`⚠️  RTL OVERFLOW: ${page.name} @ ${vp.label}`);
      }

      await tab.close();
      console.log(`✓ ${page.name} @ ${vp.label} — RTL ${rtlCheck.hasHScroll ? 'OVERFLOW!' : 'clean'}`);
    }
  }

  await browser2.close();

  // === Meta/SEO check ===
  console.log('\n--- SEO Checks ---');
  const browser3 = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    executablePath: '/usr/bin/google-chrome',
  });

  for (const page of PAGES) {
    testCount++;
    const tab = await browser3.newPage();
    await tab.goto(page.url, { waitUntil: 'load', timeout: 10000 });
    
    const seo = await tab.evaluate(() => {
      return {
        title: document.title,
        hasViewport: !!document.querySelector('meta[name="viewport"]'),
        hasDescription: !!document.querySelector('meta[name="description"]'),
        description: document.querySelector('meta[name="description"]')?.content || '',
        hasOgTitle: !!document.querySelector('meta[property="og:title"]'),
        hasOgDesc: !!document.querySelector('meta[property="og:description"]'),
        h1Count: document.querySelectorAll('h1').length,
        imgCount: document.querySelectorAll('img').length,
        lazyCount: document.querySelectorAll('img[loading="lazy"]').length,
        scriptDefer: !!document.querySelector('script[defer]'),
      };
    });

    if (!seo.hasViewport) issues.push(`⚠️  SEO: ${page.name} — Missing viewport meta`);
    if (!seo.hasDescription) issues.push(`⚠️  SEO: ${page.name} — Missing meta description`);
    if (seo.h1Count !== 1) issues.push(`⚠️  SEO: ${page.name} — ${seo.h1Count} h1 tags (should be 1)`);
    if (seo.imgCount > 0 && seo.lazyCount === 0) issues.push(`⚠️  SEO: ${page.name} — ${seo.imgCount} images, none lazy-loaded`);
    
    console.log(`✓ SEO ${page.name}: title="${seo.title}", desc=${seo.hasDescription}, og=${seo.hasOgTitle}, h1=${seo.h1Count}, imgs=${seo.imgCount}/${seo.lazyCount}lazy, defer=${seo.scriptDefer}`);
    
    await tab.close();
  }

  await browser3.close();

  // === SUMMARY ===
  console.log('\n========================================');
  console.log(`  RESPONSIVE AUDIT COMPLETE`);
  console.log(`  Tests run: ${testCount}`);
  console.log(`  Screenshots saved: ${OUTPUT_DIR}`);
  console.log('========================================');
  
  if (issues.length === 0) {
    console.log('✅ ALL CLEAR — No issues found across all pages and viewports.');
  } else {
    console.log(`\n🔍 Found ${issues.length} issue(s):\n`);
    issues.forEach((i, idx) => console.log(`  ${idx + 1}. ${i}`));
  }
  console.log('\n========================================');
})();
