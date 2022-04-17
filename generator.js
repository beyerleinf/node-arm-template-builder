/* eslint-disable node/no-unpublished-require */

const fs = require('fs-extra');
const path = require('path');
const schema = require('json-schema-to-typescript');

const basePath = path.join(__dirname, 'azure-resource-manager-schemas', 'schemas');
const outputDir = path.join(__dirname, 'src/types/generated');

const MIN_API_VERSION = '0-0-0';

const main = async () => {
  let apiVersions = await fs.readdir(basePath);
  apiVersions = apiVersions.filter(version => isApiVersionNewer(MIN_API_VERSION, version));

  for (const apiVersion of apiVersions) {
    const files = await fs.readdir(path.join(basePath, apiVersion));

    for (const file of files) {
      console.log(`Processing ${apiVersion}/${file}`);
      try {
        const generated = await schema.compileFromFile(path.join(basePath, apiVersion, file), {
          style: { singleQuote: true, bracketSpacing: true },
          bannerComment: `// eslint-disable\n\n/**\n  * This file was auto generated. DO NOT MODIFY.\n  * ${apiVersion}/${file}\n*/`,
        });
        const fileName = path.join(outputDir, path.basename(file, 'json').replaceAll('.', ''), apiVersion, 'index.ts');
        await fs.outputFile(fileName, generated);
      } catch (error) {
        console.log('Failed to process.');
        console.error(error);
      }
    }
  }
};

main();

function parseApiVersion(version) {
  const [year, month, day, preview] = version.split('-');

  return { year: Number(year), month: Number(month), day: Number(day), isPreview: !!preview };
}

function isApiVersionNewer(v1, v2) {
  const parsedV1 = parseApiVersion(v1);
  const parsedV2 = parseApiVersion(v2);

  return parsedV2.year >= parsedV1.year && parsedV2.month >= parsedV1.month && parsedV2.day >= parsedV1.day;
}
