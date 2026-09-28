const fs = require('fs');
const path = require('path');

const cmsRoot = path.join(__dirname, '../aptaivisor-cms/src/components');

const founderFeatureSchema = {
  "collectionName": "components_shared_founder_features",
  "info": {
    "displayName": "Founder Feature",
    "description": ""
  },
  "options": {},
  "attributes": {
    "text": { "type": "string", "required": true }
  }
};

const founderTabSchema = {
  "collectionName": "components_shared_founder_tabs",
  "info": {
    "displayName": "Founder Tab",
    "description": ""
  },
  "options": {},
  "attributes": {
    "title": { "type": "string" },
    "description": { "type": "text" },
    "features": {
      "type": "component",
      "repeatable": true,
      "component": "shared.founder-feature"
    },
    "ctaLabel": { "type": "string" },
    "ctaHref": { "type": "string" },
    "image": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": ["images"]
    }
  }
};

const founderSectionSchema = {
  "collectionName": "components_sections_solutions_founders",
  "info": {
    "displayName": "Solutions Founder",
    "description": ""
  },
  "options": {},
  "attributes": {
    "badge": { "type": "string" },
    "headline": { "type": "string" },
    "headlineAccent": { "type": "string" },
    "subhead": { "type": "text" },
    "tabs": {
      "type": "component",
      "repeatable": true,
      "component": "shared.founder-tab"
    }
  }
};

const ctaSectionSchema = {
  "collectionName": "components_sections_solutions_ctas",
  "info": {
    "displayName": "Solutions Cta",
    "description": ""
  },
  "options": {},
  "attributes": {
    "badge": { "type": "string" },
    "headline": { "type": "string" },
    "subhead": { "type": "text" },
    "primaryButtonLabel": { "type": "string" },
    "primaryButtonHref": { "type": "string" },
    "secondaryButtonLabel": { "type": "string" },
    "secondaryButtonHref": { "type": "string" },
    "tertiaryButtonLabel": { "type": "string" },
    "tertiaryButtonHref": { "type": "string" },
    "image": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": ["images"]
    },
    "footerLeftText": { "type": "string" },
    "footerRightText": { "type": "string" }
  }
};

fs.writeFileSync(
  path.join(cmsRoot, 'shared/founder-feature.json'),
  JSON.stringify(founderFeatureSchema, null, 2)
);

fs.writeFileSync(
  path.join(cmsRoot, 'shared/founder-tab.json'),
  JSON.stringify(founderTabSchema, null, 2)
);

fs.writeFileSync(
  path.join(cmsRoot, 'sections/solutions-founder.json'),
  JSON.stringify(founderSectionSchema, null, 2)
);

fs.writeFileSync(
  path.join(cmsRoot, 'sections/solutions-cta.json'),
  JSON.stringify(ctaSectionSchema, null, 2)
);

const pageSchemaPath = path.join(__dirname, '../aptaivisor-cms/src/api/page/content-types/page/schema.json');
const pageSchema = JSON.parse(fs.readFileSync(pageSchemaPath, 'utf8'));

if (!pageSchema.attributes.sections.components.includes('sections.solutions-founder')) {
  pageSchema.attributes.sections.components.push('sections.solutions-founder');
  console.log('Added solutions-founder to page.json components!');
}

if (!pageSchema.attributes.sections.components.includes('sections.solutions-cta')) {
  pageSchema.attributes.sections.components.push('sections.solutions-cta');
  console.log('Added solutions-cta to page.json components!');
}

fs.writeFileSync(pageSchemaPath, JSON.stringify(pageSchema, null, 2));

console.log('Components successfully written to CMS!');

