// Small, accessible interactions
document.getElementById('year').textContent = new Date().getFullYear();
const cta = document.getElementById('cta');
cta.addEventListener('click', ()=>{
  cta.setAttribute('aria-pressed','true');
  cta.textContent = 'Hello!';
  cta.disabled = true;
  setTimeout(()=>{cta.disabled=false;cta.removeAttribute('aria-pressed');cta.textContent='Say Hello'},1400);
});
