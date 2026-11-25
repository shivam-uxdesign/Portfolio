// Prints resume.html to A4 PDFs: the styled one (also served at /resume.pdf) and a plain one.
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
    const h = await p.evaluate(() => document.querySelector('.page').scrollHeight);
    console.log(out, 'page height px', h, h > 1123 ? 'OVER ONE PAGE' : 'fits');
    await p.pdf({ path: path.join(__dirname, out), format: 'A4', printBackground: true, preferCSSPageSize: true });
  }
  await b.close();
})();
