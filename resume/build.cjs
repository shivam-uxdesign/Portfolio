// Prints resume.html to A4 PDFs: the styled one and the plain one (also served at /resume.pdf).
// Run: node resume/build.cjs
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const src = 'file://' + path.join(__dirname, 'resume.html');
  for (const [q, out] of [['', 'Shivam_Sehgal_Resume.pdf'], ['?plain', 'Shivam_Sehgal_Resume_plain.pdf']]) {
    const p = await b.newPage();
    await p.goto(src + q, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    const pdf = await p.pdf({ path: path.join(__dirname, out), format: 'A4', printBackground: true, preferCSSPageSize: true });
    const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
    console.log(out, pages === 1 ? 'one page' : `${pages} PAGES: trim it`);
  }
  await b.close();
})();
