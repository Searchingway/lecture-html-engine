function defs(){
  return `
  <defs>
    <filter id="rough">
      <feTurbulence type="fractalNoise" baseFrequency=".012 .05" numOctaves="2" seed="7" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.3" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
      <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" stroke-width=".55" opacity=".26"/>
    </pattern>
    <linearGradient id="fade" x1="0" x2="1"><stop offset="0" stop-color="#f2eee4" stop-opacity="0"/><stop offset=".75" stop-color="#f2eee4" stop-opacity=".3"/><stop offset="1" stop-color="#f2eee4" stop-opacity=".9"/></linearGradient>
  </defs>`;
}
function svgWrap(inner, dark=true){
  const stroke=dark?"#d9d6cc":"#2a2b26";
  return `<svg class="art-svg" viewBox="0 0 900 620" preserveAspectRatio="xMidYMid slice" style="color:${stroke}" aria-hidden="true">${defs()}${inner}</svg>`;
}
function art(kind){
  const common=`fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" filter="url(#rough)"`;
  if(kind==="ravine"||kind==="final_ravine"){
    return svgWrap(`
      <g opacity=".95">
        <path ${common} d="M520 55 C605 120 650 160 730 178 C810 196 860 246 876 310"/>
        <path ${common} d="M498 74 C550 138 582 190 604 252 C626 314 656 365 744 416 C798 447 844 505 876 610"/>
        <path ${common} d="M550 612 C590 536 618 462 604 405 C590 350 540 311 512 260 C485 211 482 152 498 74"/>
        <path ${common} d="M622 258 L686 224 L749 235 L785 282 L760 314 L695 325 L643 302 Z"/>
        <path ${common} d="M704 325 L704 410 M680 348 L730 350 M678 376 L732 378"/>
        <path ${common} d="M360 612 L405 456 L455 368 L505 312" opacity=".7"/>
        <path d="M506 615 L900 615 L900 205 Q740 140 600 40 Z" fill="url(#hatch)" opacity=".35"/>
        <circle cx="505" cy="478" r="10" fill="currentColor"/>
        <path ${common} d="M505 489 L503 542 M503 510 L483 533 M504 510 L526 528 M503 542 L486 580 M503 542 L524 581" stroke-width="4"/>
        <path ${common} d="M780 160 C815 120 846 100 885 85 M774 160 C820 180 852 195 892 230" opacity=".5"/>
      </g>`,true);
  }
  if(kind==="jungle"||kind==="jungle_split"){
    return svgWrap(`
      <g opacity=".95">
        <path ${common} d="M558 0 C515 82 534 146 500 209 C468 270 420 318 426 390 C430 456 478 522 462 620"/>
        <path ${common} d="M610 0 C570 95 600 160 552 230 C522 275 488 320 502 389 C515 449 560 509 548 620"/>
        <path ${common} d="M690 0 C634 102 666 182 610 252 C571 300 548 349 568 417 C590 488 632 538 620 620"/>
        <path ${common} d="M760 0 C700 96 734 173 690 241 C651 301 635 354 659 424 C681 488 738 552 720 620"/>
        <path ${common} d="M405 620 C412 520 438 465 468 422 C498 378 542 356 593 348 C662 336 727 351 817 402"/>
        <path ${common} d="M588 350 Q655 304 739 328 Q790 344 835 382"/>
        <path d="M520 368 Q678 312 842 408 L900 620 L490 620 Z" fill="url(#hatch)" opacity=".38"/>
        <path ${common} d="M740 360 L780 324 L822 342 L846 395 L819 428 L770 415 Z" opacity=".8"/>
      </g>`,true);
  }
  if(kind==="desert"){
    return svgWrap(`
      <g opacity=".95">
        <path ${common} d="M440 390 Q555 300 694 335 Q792 358 900 318"/>
        <path ${common} d="M390 456 Q530 368 690 404 Q790 425 900 392"/>
        <path ${common} d="M410 520 Q556 447 740 470 Q828 482 900 456"/>
        <path ${common} d="M610 337 L662 252 L728 258 L765 334 Z"/>
        <path ${common} d="M631 287 L713 287 M651 256 L651 337 M700 260 L700 337"/>
        <circle cx="770" cy="154" r="62" ${common} opacity=".35"/>
        <path ${common} d="M745 154 Q770 126 796 154 Q770 186 745 154 Z" opacity=".55"/>
        <path d="M430 398 Q560 314 708 344 Q800 363 900 330 L900 620 L410 620 Z" fill="url(#hatch)" opacity=".26"/>
      </g>`,true);
  }
  if(kind==="artifact"){
    return svgWrap(`
      <g opacity=".95">
        <path ${common} d="M620 118 L748 150 L785 280 L732 395 L590 402 L535 290 L562 172 Z"/>
        <path ${common} d="M604 198 Q664 156 722 202 Q682 250 614 242 Z"/>
        <path ${common} d="M598 285 L731 285 M622 315 L710 315 M646 346 L690 346"/>
        <path ${common} d="M510 438 Q620 410 760 445 Q820 461 880 505"/>
        <path ${common} d="M470 474 Q650 449 860 528"/>
        <path ${common} d="M820 80 L860 140 M790 110 L870 95 M796 152 L870 178" opacity=".45"/>
        <path d="M552 171 L617 120 L748 151 L785 280 L730 396 L591 402 L535 291 Z" fill="url(#hatch)" opacity=".25"/>
      </g>`,true);
  }
  if(kind==="well"){
    return svgWrap(`
      <g opacity=".95">
        <ellipse cx="680" cy="330" rx="180" ry="112" ${common}/>
        <ellipse cx="680" cy="330" rx="112" ry="70" ${common} opacity=".75"/>
        <path ${common} d="M501 330 C512 428 562 531 626 620 M859 330 C842 432 807 532 754 620"/>
        <path ${common} d="M638 84 L695 56 L750 90 L742 224 L666 248 L612 210 Z"/>
        <path ${common} d="M660 118 Q684 94 710 120 M648 150 Q685 124 725 154 M648 185 Q684 158 724 190"/>
        <path ${common} d="M800 70 C758 120 770 172 815 222 C857 269 868 314 850 375" opacity=".55"/>
        <path d="M505 331 C523 428 564 525 631 620 L750 620 C807 527 845 432 856 331 Z" fill="url(#hatch)" opacity=".28"/>
      </g>`,true);
  }
  if(kind==="figure"||kind==="walk_light"){
    return svgWrap(`
      <g opacity=".92">
        <path ${common} d="M450 620 Q540 520 624 468 Q705 418 820 395"/>
        <circle cx="630" cy="300" r="22" fill="currentColor"/>
        <path ${common} d="M630 323 L625 430 M625 350 L585 392 M628 350 L672 386 M625 430 L590 500 M625 430 L667 498" stroke-width="6"/>
        <path ${common} d="M786 175 Q830 210 868 274 M765 196 Q820 242 848 318" opacity=".35"/>
        <circle cx="848" cy="284" r="115" fill="currentColor" opacity=".04"/>
      </g>`,true);
  }
  if(kind==="green_tomb"){
    return svgWrap(`
      <g opacity=".92">
        <path ${common} d="M566 430 L600 210 L754 180 L826 278 L804 438 Z"/>
        <path ${common} d="M617 254 L743 230 L764 383 L607 399 Z"/>
        <path ${common} d="M646 294 Q690 246 733 300 Q689 356 646 294 Z"/>
        <path ${common} d="M545 454 Q674 420 840 466"/>
        <path ${common} d="M702 111 C664 149 670 199 707 231 C738 260 744 303 721 339" stroke="#758a79" stroke-width="4"/>
        <path d="M590 228 L754 181 L826 279 L804 438 L566 430 Z" fill="#415846" opacity=".12"/>
      </g>`,true);
  }
  if(kind==="stele"||kind==="tablet"||kind==="totem"){
    return svgWrap(`
      <g opacity=".94">
        <path ${common} d="M585 90 Q690 44 786 104 L801 510 L566 520 Z"/>
        <path ${common} d="M623 160 Q680 112 744 168 Q692 224 631 185 Z"/>
        <path ${common} d="M617 242 Q682 204 751 248 M620 292 Q690 252 755 300 M621 346 Q681 308 751 354"/>
        <path ${common} d="M654 410 Q684 372 717 408 Q687 453 654 410 Z"/>
        <path d="M585 91 Q690 45 786 104 L801 510 L566 520 Z" fill="url(#hatch)" opacity=".34"/>
      </g>`,true);
  }
  if(kind==="entropy"){
    return svgWrap(`
      <g opacity=".92">
        <path ${common} d="M694 535 C676 451 706 394 676 336 C652 289 607 255 620 203 C631 159 673 133 683 83"/>
        <path ${common} d="M680 344 C727 311 758 274 762 224 M671 300 C636 265 604 225 599 180 M685 401 C741 382 780 353 803 310"/>
        <path ${common} d="M676 336 C628 339 585 327 548 293 M687 454 C633 458 586 445 548 420"/>
        <path ${common} d="M604 181 Q581 137 610 98 M762 224 Q800 186 790 139 M548 292 Q505 274 484 232 M803 310 Q850 298 870 258"/>
        <circle cx="694" cy="536" r="18" fill="currentColor"/>
        <path d="M548 620 Q616 537 694 536 Q771 535 845 620 Z" fill="url(#hatch)" opacity=".25"/>
      </g>`,true);
  }
  if(kind==="recursive"){
    return svgWrap(`
      <g opacity=".94">
        <rect x="550" y="105" width="250" height="380" ${common}/>
        <rect x="600" y="165" width="150" height="240" ${common}/>
        <rect x="634" y="208" width="82" height="142" ${common}/>
        <circle cx="675" cy="255" r="15" fill="currentColor"/>
        <path ${common} d="M675 271 L675 318 M675 287 L654 307 M675 287 L697 307"/>
        <path ${common} d="M500 475 L550 420 M830 478 L800 422" opacity=".55"/>
      </g>`,true);
  }
  if(kind==="box"){
    return svgWrap(`
      <g opacity=".94">
        <path ${common} d="M585 214 L716 173 L814 229 L815 390 L684 434 L584 378 Z"/>
        <path ${common} d="M585 214 L684 269 L814 229 M684 269 L684 434"/>
        <path ${common} d="M620 313 Q680 276 748 311 Q692 351 620 313 Z"/>
        <path ${common} d="M801 115 C745 139 726 172 715 197 M818 479 C753 461 733 435 716 411" opacity=".5"/>
      </g>`,true);
  }
  if(kind==="ruin"){
    return svgWrap(`
      <g opacity=".94">
        <path ${common} d="M540 450 L578 220 L770 220 L832 450 Z"/>
        <path ${common} d="M608 220 L608 450 M664 220 L664 450 M722 220 L722 450 M774 241 L798 450"/>
        <path ${common} d="M548 450 Q678 421 846 458"/>
        <path ${common} d="M584 184 Q681 138 782 184"/>
      </g>`,false);
  }
  if(kind==="creature"){
    return svgWrap(`
      <g opacity=".88">
        <path ${common} d="M588 388 Q620 286 701 272 Q781 260 821 344 Q774 421 684 438 Q630 439 588 388 Z"/>
        <path ${common} d="M622 315 Q591 286 580 249 M760 286 Q779 245 807 229"/>
        <path ${common} d="M651 433 L631 489 M730 428 L747 488"/>
        <circle cx="761" cy="325" r="8" fill="currentColor"/>
      </g>`,false);
  }
  if(kind==="formula"){
    return svgWrap(`<g opacity=".56">
      <path ${common} d="M570 184 H830 M570 240 H748 M570 300 H808 M570 360 H720"/>
      <text x="585" y="170" fill="currentColor" font-size="30" font-family="serif">x → f(x) → model</text>
      <text x="585" y="230" fill="currentColor" font-size="26" font-family="serif">P(A|B) ≠ A</text>
      <text x="585" y="292" fill="currentColor" font-size="25" font-family="serif">measurement ≠ totality</text>
    </g>`,false);
  }
  if(kind==="archive"){
    return svgWrap(`
      <g opacity=".6">
        <rect x="560" y="120" width="250" height="340" ${common}/>
        <path ${common} d="M590 170 H774 M590 206 H744 M590 242 H782 M590 370 H760"/>
        <path ${common} d="M615 286 Q678 256 750 294 Q696 336 630 316 Z"/>
        <circle cx="710" cy="302" r="32" ${common}/>
      </g>`,false);
  }
  if(kind==="fracture"||kind==="fracture_time"||kind==="blank_fracture"){
    return svgWrap(`<g opacity=".42">
      <path ${common} d="M700 25 L666 135 L711 214 L650 300 L694 366 L629 470 L670 620"/>
      <path ${common} d="M666 135 L588 170 M650 300 L560 258 M694 366 L778 403 M629 470 L538 521"/>
      <path ${common} d="M790 100 C750 160 760 215 803 260 C842 300 852 356 832 418" opacity=".45"/>
    </g>`,kind==="fracture_time");
  }
  if(kind==="frame_in"){
    return svgWrap(`<g opacity=".55">
      <rect x="530" y="94" width="300" height="420" ${common}/>
      <rect x="580" y="150" width="200" height="308" ${common}/>
      <circle cx="680" cy="286" r="24" fill="currentColor"/>
      <path ${common} d="M680 311 V380 M680 333 L648 361 M680 333 L714 359"/>
    </g>`,false);
  }
  return "";
}
