require('dotenv').config({ path: '.env.local' });
fetch(process.env.STRAPI_URL + '/api/pages/lb4m001fr3e4ug3il9eq8i46?populate=deep')
  .then(res => res.json())
  .then(json => {
    const partner = json.data.sections.find(s => s.__component === 'sections.solutions-partner');
    console.log(JSON.stringify(partner, null, 2));
  });
