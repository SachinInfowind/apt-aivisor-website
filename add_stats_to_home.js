const http = require('http');

const putData = JSON.stringify({
  data: {
    sections: [
      { id: 17, __component: "sections.home-hero" },
      {
        __component: "sections.stats",
        heading: "See Why Customer Love Us",
        items: [
          { value: "20%", label: "Of technology contracts never negotiated" },
          { value: "21%", label: "Avg vendor cost reduction with intelligence" },
          { value: "$36k+", label: "Entry price for enterprise procurement tools" },
          { value: "$0", label: "Institutional deal knowledge most startups have" }
        ]
      },
      { id: 18, __component: "sections.feature-table" },
      { id: 20, __component: "sections.faq" },
      { id: 24, __component: "sections.waitlist" },
      { id: 7, __component: "sections.who-it-is-for" }
    ]
  }
});

const req = http.request({
  hostname: 'localhost',
  port: 1337,
  path: '/api/pages/dcqkdts8r6oge5o1jp7h5oco',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(putData)
  }
}, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    if(res.statusCode !== 200) console.log(body);
    else console.log('Successfully added Stats section to Home page!');
  });
});

req.on('error', e => console.error(e));
req.write(putData);
req.end();
