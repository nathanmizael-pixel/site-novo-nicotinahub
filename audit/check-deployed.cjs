const https = require('https');

const url = 'https://temporary-agile-gold-znpk7ql.vercel.app';

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('=== INDEX.HTML ===');
    console.log(data.substring(0, 3000));
    
    // Find the JS file
    const jsMatch = data.match(/src="(\/assets\/index-[^"]+\.js)"/);
    if (jsMatch) {
      const jsUrl = 'https://temporary-agile-gold-znpk7ql.vercel.app' + jsMatch[1];
      console.log('\n=== JS URL:', jsUrl);
      
      https.get(jsUrl, (jsRes) => {
        let jsData = '';
        jsRes.on('data', chunk => jsData += chunk);
        jsRes.on('end', () => {
          console.log('\n=== DEPLOYED JS (first 5000 chars) ===');
          console.log(jsData.substring(0, 5000));
          
          console.log('\n=== Contains "Meu perfil":', jsData.includes('Meu perfil'));
          console.log('=== Contains "Sair":', jsData.includes('Sair'));
          console.log('=== Contains "userMenuOpen":', jsData.includes('userMenuOpen'));
        });
      });
    }
  });
});