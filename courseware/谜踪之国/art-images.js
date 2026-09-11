(function(){
  const legacyArt = window.art;
  const ART_IMAGES = {
    ravine:"assets/cover.webp",
    final_ravine:"assets/final.webp",
    jungle:"assets/jungle.webp",
    jungle_split:"assets/jungle.webp",
    desert:"assets/desert.webp",
    artifact:"assets/shennong.webp",
    well:"assets/youqian.webp",
    figure:"assets/sima.webp",
    walk_light:"assets/final.webp",
    green_tomb:"assets/green.webp",
    stele:"assets/stele.webp",
    tablet:"assets/stele.webp",
    totem:"assets/stele.webp",
    entropy:"assets/entropy.webp",
    recursive:"assets/stele.webp",
    box:"assets/desert.webp",
    ruin:"assets/jungle.webp",
    creature:"assets/jungle.webp",
    formula:"assets/shennong.webp",
    fracture:"assets/cover.webp",
    fracture_time:"assets/desert.webp",
    fragments:"assets/final.webp",
    frame_in:"assets/stele.webp",
    loop_figure:"assets/desert.webp",
    network:"assets/cover.webp",
    archive:"assets/jungle.webp",
    blank:"assets/final.webp",
    blank_fracture:"assets/final.webp"
  };
  const POS = {sima:"38% center"};
  window.art = function(kind){
    const src=ART_IMAGES[kind];
    if(!src) return typeof legacyArt==='function' ? legacyArt(kind) : '';
    const name=src.split('/').pop().replace(/\.webp$/i,'');
    const pos=POS[name]||'center';
    return `<img class="art-img art-img-${name}" src="${src}" alt="" draggable="false" loading="eager" style="object-position:${pos}">`;
  };
})();
