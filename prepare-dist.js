const path = require('path');
const fs = require('fs').promises;

const packagePath = process.cwd();
const distPath = path.join(packagePath, './build');

const writeJson = (targetPath, obj) => fs.writeFile(targetPath, JSON.stringify(obj, null, 2), 'utf8');

async function createPackageFile() {
  const packageData = await fs.readFile(path.resolve(packagePath, './package.json'), 'utf8');
  /* eslint-disable-next-line no-unused-vars */
  const { scripts, devDependencies, husky, ...packageOthers } = JSON.parse(packageData);
  const packageName = packageOthers.name;
  const newPackageData = {
    ...packageOthers,
    private: false,
    main: './index.js',
    types: './index.d.ts',
  };

  if (packageName === '@regraph/geo') {
    delete newPackageData.main;
    delete newPackageData.module;
  }
  const targetPath = path.resolve(distPath, './package.json');

  await writeJson(targetPath, newPackageData);
  console.log(`Created package.json in ${targetPath}`);
}

async function includeFileInBuild(file) {
  const sourcePath = path.resolve(packagePath, file);
  const targetPath = path.resolve(distPath, path.basename(file));
  await fs.copyFile(sourcePath, targetPath);
  console.log(`Copied ${sourcePath} to ${targetPath}`);
}

async function run() {
  try {
    await createPackageFile();
    await includeFileInBuild('./README.md');
    await includeFileInBuild('./LICENSE.md');
  } catch (err) {
    console.error(err);
    throw err;
  }
}

run();
