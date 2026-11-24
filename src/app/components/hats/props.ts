// Typed port of design-ref/hats/props.js: the seven hats as SVG-string factories.
// PROPS[id].svg(icon) returns markup in the portrait's 800×1000 coordinate space
// (icon=true is the orbit-button variant), PROPS[id].vb is the crop used for the
// button icon. PBLADES(theta, speed) draws the propeller blades + onion-skin ghosts.

export type HatId = 'notes' | 'party' | 'helmet' | 'beret' | 'propeller' | 'ninja' | 'cat';
export interface PropDef { vb: string; svg: (icon?: boolean) => string }

export function PBLADES(th: number, w: number): string {let o='';const L=78,cy=88;
 const blade=(t: number,c: string,op: number|string)=>{const cx=400+Math.cos(t)*L/2,y=cy+Math.sin(t)*5,rx=Math.max(5,Math.abs(Math.cos(t))*L/2);return `<ellipse cx="${cx.toFixed(1)}" cy="${y.toFixed(1)}" rx="${rx.toFixed(1)}" ry="11" fill="${c}" opacity="${op}"/>`};
 if(w>.12)for(let k=3;k>=1;k--){const g=th-k*w*.9;o+=blade(g,'#FF4D4D',(.22/k).toFixed(2))+blade(g+Math.PI,'#2F6BFF',(.22/k).toFixed(2))}
 const A=blade(th,'#FF4D4D',1),B=blade(th+Math.PI,'#2F6BFF',1);o+=Math.sin(th)>0?B+A:A+B;
 return o+'<circle cx="400" cy="88" r="11" fill="#FFD84D"/><circle cx="400" cy="88" r="4" fill="#B38600"/>'}
export const PROPS: Record<HatId, PropDef> = {
notes:{vb:'250 140 300 180',svg:()=>(([[300,214,-14,'#FFD84D'],[400,182,6,'#FF9EB5'],[500,214,14,'#8FD3FF'],[352,266,-4,'#B9F18C'],[462,272,8,'#FFB86B']] as [number,number,number,string][]).map(([x,y,r,c])=>
 `<g class="note" transform="rotate(${r} ${x} ${y})"><rect x="${x-32}" y="${y-32}" width="64" height="64" rx="3" fill="${c}"/><path d="M${x+32} ${y+16} L${x+16} ${y+32} L${x+32} ${y+32} Z" fill="rgba(0,0,0,.12)"/><path d="M${x-20} ${y-12}h34M${x-20} ${y}h26M${x-20} ${y+12}h30" stroke="rgba(0,0,0,.22)" stroke-width="4" stroke-linecap="round"/></g>`).join(''))},
party:{vb:'320 -20 210 240',svg:()=>`<g transform="rotate(12 420 190)">
 <polygon points="340,190 500,190 420,14" fill="#FF5FA2"/>
 <path d="M396 66 L444 66 L455 90 L385 90 Z" fill="#7BE0C3"/>
 <path d="M372 120 L468 120 L480 146 L360 146 Z" fill="#FFD84D"/>
 <polygon points="420,14 500,190 470,190" fill="#E0367F" opacity=".5"/>
 <ellipse cx="420" cy="190" rx="86" ry="15" fill="#E0367F"/>
 <circle cx="420" cy="12" r="20" fill="#FFD84D"/><circle cx="406" cy="2" r="10" fill="#FFE98A"/><circle cx="434" cy="22" r="9" fill="#F5C22E"/></g>`},
helmet:{vb:'170 150 460 550',svg:(icon?: boolean)=>`<path fill-rule="evenodd" fill="#1F2228" d="M400 164 C538 164 620 268 620 410 C620 512 592 592 540 642 C508 672 456 688 400 688 C344 688 292 672 260 642 C208 592 180 512 180 410 C180 268 262 164 400 164 Z M262 404 C262 376 330 352 400 352 C470 352 538 376 538 404 L534 478 C532 500 516 512 494 510 C460 506 430 512 400 520 C370 512 340 506 306 510 C284 512 268 500 266 478 Z"/>
 <path d="M300 548 C346 566 454 566 500 548 L524 612 C478 652 322 652 276 612 Z" fill="#2B2F37"/>
 <path d="M372 590 h56 M378 606 h44 M384 622 h32" stroke="#14161A" stroke-width="7" stroke-linecap="round"/>
 <path d="M378 168 C392 166 408 166 422 168 L426 346 C409 342 391 342 374 346 Z" fill="#FF4D2E"/>
 <path d="M216 372 Q228 262 312 206" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="16" stroke-linecap="round"/>
 <circle cx="236" cy="430" r="14" fill="#2F333B"/><circle cx="564" cy="430" r="14" fill="#2F333B"/>
 <g class="visor"><path d="M252 402 C252 366 326 342 400 342 C474 342 548 366 548 402 L544 482 C542 510 520 522 494 520 C460 516 430 522 400 530 C370 522 340 516 306 520 C280 522 258 510 256 482 Z" fill="#33475B" opacity="${icon?'.95':'.97'}"/><path d="M252 402 C252 366 326 342 400 342 C474 342 548 366 548 402" fill="none" stroke="#4E6680" stroke-width="6"/><polygon points="330,356 372,352 318,514 278,512" fill="#fff" opacity=".14"/><polygon points="392,350 408,350 352,514 336,514" fill="#fff" opacity=".1"/><path d="M238 430 L256 424 M562 430 L544 424" stroke="#33475B" stroke-width="12" stroke-linecap="round"/></g>`},
beret:{vb:'230 60 340 260',svg:()=>`<g transform="translate(0 34) rotate(-12 400 190) translate(400 190) scale(1.18) translate(-400 -190)">
 <path class="drip" d="M318 200 q-4 40 2 56 a8 8 0 0 0 16 0 q2-20 0-54z" fill="#2F6BFF"/>
 <path class="drip" d="M436 208 q-2 28 1 38 a7 7 0 0 0 14 0 q1-16 0-38z" fill="#FFC400"/>
 <path class="drip" d="M494 198 q-1 50 4 66 a8 8 0 0 0 15-1 q0-30-3-64z" fill="#14B87A"/>
 <ellipse cx="400" cy="196" rx="142" ry="34" fill="#B81E33"/><ellipse cx="408" cy="166" rx="128" ry="56" fill="#D7263D"/>
 <rect x="402" y="98" width="14" height="22" rx="5" fill="#9E1A2C"/>
 <circle cx="360" cy="158" r="14" fill="#2F6BFF"/><circle cx="452" cy="148" r="9" fill="#FFC400"/><circle cx="426" cy="186" r="8" fill="#14B87A"/></g>`},
propeller:{vb:'232 40 336 236',svg:(icon?: boolean)=>`<rect x="394" y="94" width="12" height="32" rx="4" fill="#9AA1AB"/>
 <path d="M250 236 C250 152 320 120 400 120 C480 120 550 152 550 236 Z" fill="#FFD84D"/>
 <path d="M250 236 C250 160 300 126 360 122 C340 160 334 200 336 236 Z" fill="#2F6BFF"/>
 <path d="M550 236 C550 160 500 126 440 122 C460 160 466 200 464 236 Z" fill="#FF4D4D"/>
 <path d="M262 200 C270 160 300 136 338 128" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="8" stroke-linecap="round"/>
 <path d="M244 236 C300 220 500 220 556 236 L556 254 C500 238 300 238 244 254 Z" fill="#14B87A"/>
 <g class="blades">${PBLADES(icon?0.5:0,0)}</g>`},
ninja:{vb:'220 240 480 180',svg:()=>`<g class="tails"><path d="M560 288 C612 286 652 270 692 280 L688 300 C650 292 614 308 564 314 Z" fill="#232B44"/><path d="M560 310 C604 320 640 330 676 356 L664 372 C632 348 600 340 562 332 Z" fill="#232B44"/></g>
 <path d="M232 306 C300 266 500 262 568 300 L568 352 C500 318 300 322 232 362 Z" fill="#2B3550"/>
 <rect x="340" y="266" width="120" height="66" rx="10" fill="#B9BFC9"/><rect x="348" y="274" width="104" height="50" rx="6" fill="#DDE1E7"/>
 <g fill="#8E96A3"><circle cx="350" cy="278" r="4"/><circle cx="450" cy="278" r="4"/><circle cx="350" cy="320" r="4"/><circle cx="450" cy="320" r="4"/></g>
 <path d="M416 286 C404 279 386 284 388 296 C390 308 414 302 414 314 C414 326 394 328 384 320" fill="none" stroke="#6B7380" stroke-width="6" stroke-linecap="round"/>`},
cat:{vb:'210 56 380 300',svg:()=>`<path class="cattail" d="M300 196 C250 206 226 262 236 334" fill="none" stroke="#D97F33" stroke-width="26" stroke-linecap="round"/>
 <ellipse cx="400" cy="182" rx="124" ry="52" fill="#E8913F"/>
 <path d="M330 146 q10 24 0 52 M376 134 q10 28 0 62 M422 134 q10 28 0 62" fill="none" stroke="#C7702A" stroke-width="9" stroke-linecap="round"/>
 <ellipse cx="468" cy="228" rx="20" ry="11" fill="#F2B36B"/><ellipse cx="506" cy="224" rx="20" ry="11" fill="#F2B36B"/>
 <polygon points="476,120 484,70 514,104" fill="#E8913F"/><polygon points="524,100 556,66 566,120" fill="#E8913F"/>
 <polygon points="485,110 489,84 505,102" fill="#F4A5A8"/><polygon points="532,100 551,80 556,112" fill="#F4A5A8"/>
 <circle cx="518" cy="152" r="52" fill="#E8913F"/>
 <ellipse cx="498" cy="154" rx="11" ry="8" fill="#9CCB3B"/><ellipse cx="538" cy="154" rx="11" ry="8" fill="#9CCB3B"/>
 <path d="M498 150v9M538 150v9" stroke="#2A1A0A" stroke-width="3" stroke-linecap="round"/>
 <path class="catlid" d="M486 154 a12 9 0 0 1 24 0 z M526 154 a12 9 0 0 1 24 0 z" fill="#E8913F"/>
 <path d="M486 154h24M526 154h24" stroke="#3A2410" stroke-width="3.5" stroke-linecap="round"/>
 <path d="M513 170h10l-5 6z" fill="#E86A7A"/><path d="M518 176q-6 7-12 4M518 176q6 7 12 4" fill="none" stroke="#3A2410" stroke-width="2.5" stroke-linecap="round"/>
 <path d="M478 172l-26-3M478 180l-26 7M558 172l26-3M558 180l26 7" stroke="#fff" stroke-opacity=".75" stroke-width="2.5" stroke-linecap="round"/>`}
};
