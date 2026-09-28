const http = require('http');

const putData = JSON.stringify({
  data: {
    sections: [
      { id: 8, __component: "sections.solutions-hero" },
      { id: 19, __component: "sections.solutions-features" },
      { id: 20, __component: "sections.solutions-features" },
      { id: 21, __component: "sections.solutions-features" },
      { id: 22, __component: "sections.solutions-features" },
      { id: 3, __component: "sections.solutions-workflows" },
      { id: 2, __component: "sections.solutions-partner" },
      {
        __component: "sections.solutions-security",
        badge: "Security and privacy",
        headline: "Your contracts are",
        headlineAccent: "yours.",
        subhead: "aptAIvisor handles confidential business contracts. We treat your data accordingly.",
        items: [
          {
            title: "Encrypted end-to-end",
            description: "TLS 1.3 in transit, AES-256 at rest. All data stored in AWS US regions. No exceptions."
          },
          {
            title: "Never trains public AI",
            description: "Your contracts are never used to train OpenAI, Anthropic, or Google models. Your data stays yours."
          },
          {
            title: "Fully anonymized benchmarks",
            description: "Any pricing data contributed to benchmarks is completely anonymized. Your company name and specific terms never appear in any dataset."
          },
          {
            title: "You own everything",
            description: "All infrastructure, API accounts, source code, and data are owned by you from day one. No vendor lock-in, ever."
          }
        ]
      }
    ]
  }
});

const req = http.request({
  hostname: 'localhost',
  port: 1337,
  path: '/api/pages/lb4m001fr3e4ug3il9eq8i46',
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
  });
});

req.on('error', e => console.error(e));
req.write(putData);
req.end();
