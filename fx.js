/*! © 2026 Kirong Job Kwemoi. Motion layer: small, skippable, no libraries. */
(function(){"use strict";
if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
if(navigator.connection&&navigator.connection.saveData)return;
var d=document,h=d.documentElement,$=function(s,e){return Array.prototype.slice.call((e||d).querySelectorAll(s))},fine=matchMedia("(hover:hover) and (pointer:fine)").matches;
function go(){
h.classList.add("fx");
/* scroll progress */
var bar=d.createElement("div");bar.className="fx-bar";bar.setAttribute("aria-hidden","true");d.body.appendChild(bar);
var tick=0;function sp(){tick=0;var m=h.scrollHeight-innerHeight;bar.style.transform="scaleX("+(m>0?Math.min(1,scrollY/m):0)+")"}
addEventListener("scroll",function(){tick||(tick=requestAnimationFrame(sp))},{passive:true});sp();
/* ambient aurora (CSS-animated, no blur filter) */
if(innerWidth>700){var a=d.createElement("div");a.className="fx-aurora";a.setAttribute("aria-hidden","true");a.innerHTML="<i></i><i></i>";d.body.insertBefore(a,d.body.firstChild)}
/* stagger children of grids when their section reveals */
[".services>.service",".layers>div",".steps>li",".plans>.plan",".skillset>div",".journey>li"].forEach(function(sel){$(sel).forEach(function(el,i){el.classList.add("st");el.style.setProperty("--i",i%6)})});
/* cursor-follow glow on cards */
var cards=$(".service,.plan,.node,.layers>div");cards.forEach(function(c){c.classList.add("glow")});
if(fine)cards.forEach(function(c){c.addEventListener("pointermove",function(e){var r=c.getBoundingClientRect();c.style.setProperty("--mx",e.clientX-r.left+"px");c.style.setProperty("--my",e.clientY-r.top+"px")},{passive:true})});
/* magnetic primary buttons */
if(fine)$(".btn-primary").forEach(function(b){if(b.closest(".plan"))return;
b.addEventListener("pointermove",function(e){var r=b.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)/r.width,y=(e.clientY-r.top-r.height/2)/r.height;b.style.transform="translate("+(x*8).toFixed(1)+"px,"+(y*6).toFixed(1)+"px)"},{passive:true});
b.addEventListener("pointerleave",function(){b.style.transform=""})});
/* count-up */
var n=$(".facts span:first-child b")[0];
if(n&&/^\d+$/.test(n.textContent)){var to=+n.textContent,t0=0;n.textContent="0";
var io=new IntersectionObserver(function(es){if(!es[0].isIntersecting)return;io.disconnect();
(function s(t){t0=t0||t;var p=Math.min(1,(t-t0)/900);n.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(s)})(performance.now())});io.observe(n)}
/* orb: glows purple and sinks into the sea as you scroll */
var sc=$("#scene")[0],orb=$("#orb")[0],gl=$("#orbGlow")[0];
if(sc&&orb&&gl){var W=1,end=1,rt=0;
function meas(){var r=sc.getBoundingClientRect();W=r.width;end=Math.max(1,r.height*.8)}
function sink(){rt=0;var p=Math.min(1,Math.max(0,scrollY/end)),e=p*p*(3-2*p),y=(e*W*.95).toFixed(1);
orb.style.transform="translate3d(0,"+y+"px,0) scale("+(1-.14*e).toFixed(3)+")";
orb.style.filter=e>.01?"hue-rotate("+(78*e).toFixed(1)+"deg) saturate("+(1+.35*e).toFixed(2)+")":"";
gl.style.opacity=Math.min(1,e*1.5).toFixed(2);
gl.style.transform="translate3d(0,"+y+"px,0) scale("+(1.05+.25*e).toFixed(3)+")";
sc.style.setProperty("--rp",Math.max(0,Math.min(1,(e-.3)*2.5)).toFixed(2))}
meas();addEventListener("resize",function(){meas();sink()});
addEventListener("scroll",function(){rt||(rt=requestAnimationFrame(sink))},{passive:true});sink()}
/* architecture flow: a request travelling User -> Agent -> Risk -> Tools -> Storage */
var f=$(".flow")[0];
if(f){var seq=Array.prototype.slice.call(f.children),i=0,timer=0;
function step(){seq.forEach(function(c){c.classList.remove("lit")});seq[i].classList.add("lit");if(seq[i+1])seq[i+1].classList.add("lit");i=(i+1)%seq.length;if(i>=seq.length-1)i=0;timer=setTimeout(step,i===0?1400:520)}
new IntersectionObserver(function(es){if(es[0].isIntersecting){clearTimeout(timer);step()}else{clearTimeout(timer);seq.forEach(function(c){c.classList.remove("lit")})}},{threshold:.4}).observe(f)}
}
(window.requestIdleCallback||function(c){setTimeout(c,60)})(go);
})();
