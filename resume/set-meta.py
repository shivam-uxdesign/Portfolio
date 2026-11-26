"""Sets author, subject and keywords on the resume PDFs (Chromium's print only sets the title).
Run by build.cjs after printing: python3 resume/set-meta.py <pdf> [<pdf>...]"""
import sys
from pypdf import PdfReader, PdfWriter

META = {
    '/Title': 'Shivam Sehgal · Resume',
    '/Author': 'Shivam Sehgal',
    '/Subject': 'Product designer: design systems and internal tools',
    '/Keywords': 'product designer, design systems, UX, interaction design, fintech, Figma, prototyping, user research',
}
for path in sys.argv[1:]:
    r = PdfReader(path); w = PdfWriter(clone_from=r)
    w.add_metadata(META)
    with open(path, 'wb') as f: w.write(f)
