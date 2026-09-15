const https = require('https');
const url = 'https://site-novo-nicotinahub.vercel.app';

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('=== INDEX.HTML (first 5000) ===');
    console.log(data.substring(0, 5000));
    
    const jsMatch = data.match(/src="(\/assets\/index-[^"]+\.js)"/);
    if (jsMatch) {
      const jsUrl = 'https://site-novo-nicotinahub.vercel.app' + jsMatch[1];
      console.log('\n=== JS URL:', jsUrl);
      
      https.get(jsUrl, (jsRes) => {
        let jsData = '';
        jsRes.on('data', chunk => jsData += chunk);
        jsRes.on('end', () => {
          console.log('\n=== DEPLOYED JS (first 8000 chars) ===');
          console.log(jsData.substring(0, 8000));
          
          console.log('\n=== Key checks ===');
          console.log('Contains titleAs:', jsData.includes('titleAs'));
          console.log('Contains Perfil não encontrado:', jsData.includes('Perfil não encontrado'));
          console.log('Contains Vazio por aqui:', jsData.includes('Vazio por aqui'));
          console.log('Contains O vazio escuta:', jsData.includes('O vazio escuta'));
          console.log('Contains A forja está fria:', jsData.includes('A forja está fria'));
          console.log('Contains Nada por aqui:', jsData.includes('Nada por aqui'));
          console.log('Contains ArrowLeft:', jsData.includes('ArrowLeft'));
          console.log('Contains SkeletonCard:', jsData.includes('SkeletonCard'));
        });
      });
    } else {
      console.log('\nNo JS match found');
    }
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});