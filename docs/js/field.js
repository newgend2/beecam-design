// Photo enlargement stays entirely local; images are bundled with the viewer.
export function initFieldPhotos(){
  const photos=[...document.querySelectorAll('.field-photo')];
  const dialog=document.querySelector('#field-photo-dialog');
  const full=document.querySelector('#field-photo-full');
  let current=0;
  function show(index){
    current=(index+photos.length)%photos.length;
    const photo=photos[current],img=photo.querySelector('img');
    const caption=photo.closest('figure').querySelector('figcaption');
    full.src=img.getAttribute('src');
    full.alt=img.alt;
    full.width=img.width;full.height=img.height;
    full.classList.toggle('tag-crop',photo.dataset.photo==='tag');
    document.querySelector('#field-photo-title').textContent=caption.querySelector('strong').textContent;
    document.querySelector('#field-photo-caption').textContent=[...caption.querySelectorAll('span,small')].map(el=>el.textContent).join(' · ');
    document.querySelector('#field-photo-counter').textContent=`${current+1} / ${photos.length}`;
  }
  photos.forEach((photo,i)=>photo.addEventListener('click',()=>{
    show(i);dialog.showModal();document.body.classList.add('photo-open');
  }));
  document.querySelector('#field-photo-close').onclick=()=>dialog.close();
  document.querySelector('#field-photo-prev').onclick=()=>show(current-1);
  document.querySelector('#field-photo-next').onclick=()=>show(current+1);
  dialog.addEventListener('close',()=>document.body.classList.remove('photo-open'));
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  dialog.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
      event.preventDefault();show(current+(event.key==='ArrowLeft'?-1:1));
    }
  });
}
