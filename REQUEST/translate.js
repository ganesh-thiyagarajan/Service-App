function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'en,af,sq,am,ar,hy,az,eu,be,bn,bh,bs,bg,my,ca,zh-CN,zh-TW,hr,cs,da,nl,eo,et,tl,fi,fr,gl,ka,de,el,gu,iw,hi,hu,is,id,ga,it,ja,jw,kn,kk,km,ko,ku,ky,lo,lv,lt,mk,ms,ml,mt,mi,mr,mn,ne,no,fa,pl,pt,pa,ro,ru,sa,sr,sk,sl,es,su,sw,sv,ta,te,th,tr,uk,ur,uz,vi,cy,yi', // All languages
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');
}

document.addEventListener('DOMContentLoaded', function() {
  const language = sessionStorage.getItem('language');
  if (language && language !== 'en') {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `function googleTranslateElementInit() {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,af,sq,am,ar,hy,az,eu,be,bn,bh,bs,bg,my,ca,zh-CN,zh-TW,hr,cs,da,nl,eo,et,tl,fi,fr,gl,ka,de,el,gu,iw,hi,hu,is,id,ga,it,ja,jw,kn,kk,km,ko,ku,ky,lo,lv,lt,mk,ms,ml,mt,mi,mr,mn,ne,no,fa,pl,pt,pa,ro,ru,sa,sr,sk,sl,es,su,sw,sv,ta,te,th,tr,uk,ur,uz,vi,cy,yi', // All languages
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
      }, 'google_translate_element');
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = '${language}';
        select.dispatchEvent(new Event('change'));
      }
    }`;
    document.head.appendChild(script);
  }
});

function setLanguage(language) {
  sessionStorage.setItem('language', language);
  location.reload(); // Reload to apply the language immediately
}
