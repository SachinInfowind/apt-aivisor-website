const http = require('http');

const options = {
  hostname: 'localhost',
  port: 1337,
  path: '/api/pages/lb4m001fr3e4ug3il9eq8i46?populate[sections][populate]=items',
  method: 'GET'
};

const req = http.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const partnerSection = json.data.sections.find(s => s.__component === 'sections.solutions-partner');
      console.log(JSON.stringify(partnerSection.items, null, 2));
    } catch(e) {
      console.error(e);
      console.log(data);
    }
  });
});
req.end();
