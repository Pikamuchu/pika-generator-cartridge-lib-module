/* eslint-disable no-console */
const path = require('path');
const { existsSync, lstatSync, readdirSync } = require('fs');
const { spawnSync } = require('child_process');
const replace = require('replace');

const REPLACE_REQUIRE_REGEX = /require\s*\(['"`]([^`"'.\\/]+)[`'"]\)/;
const FIND_REPLACE_REQUIRE_REGEX = /.*require\s*\(['"`]([^`"'.\\/]+)[`'"]\)/g;
const IGNORE_MODULE_DEPENDENCIES = ['.bin'];

const main = () => {
    const args = process.argv.slice(2);
    const moduleName = args[0];
    if (!moduleName) {
        console.log('No moduleName arg. Exiting.');
        return;
    }

    console.log(process.cwd());

    console.log(`Building node module "${moduleName}" code as sfra cartridge lib.\n`);

    let source = `node_modules/${moduleName}`;
    let cartridgePath = `cartridges/lib_${moduleName}/cartridge/scripts/lib`;
    let destination = `${cartridgePath}/${moduleName}`;
    let only = [`${source}/*.js`, `${source}/lib`, `${source}/dist`];

    babelTransform(source, destination, only);

    while (isDirectory(`${source}/node_modules`)) {
        const currentDirectory = `${source}/node_modules`;
        let directories = getDirectories(currentDirectory);
        directories.forEach(directory => {
            try {
                const dependencyName = directory && /([^\\/]+$)/.exec(directory)[1];
                if (dependencyName && !IGNORE_MODULE_DEPENDENCIES.includes(dependencyName)) {
                    console.log(`Processing dependency module "${dependencyName}"...`);
                    source = `${directory}`;
                    destination = `${cartridgePath}/${dependencyName}`;
                    only = [`${source}/*.js`, `${source}/lib`, `${source}/dist`];
                    babelTransform(source, destination, only);
                }
            } catch (e) {
                console.error(e);
            }
        });
        if (currentDirectory === `${source}/node_modules`) {
            // No more dependencies
            break;
        }
    }

    requireReplace(cartridgePath);

    prettier();
};

const babelTransform = (source, destination, only) => {
    console.log(`Babel Transforming module "${source}" to "${destination}"...`);
    const babel = path.sep === '/' ? 'babel' : 'babel.cmd';
    const result = spawnSync(babel, [source, '-d', destination, '--only', only]);
    if (result.error && result.error.errno) {
        console.error(result.error);
    }
    console.log(String(result.stdout));
};

const requireReplace = path => {
    console.log(`Transforming require cartridge on "${path}"...`);
    replace({
        regex: FIND_REPLACE_REQUIRE_REGEX,
        replacement: (str, p1) => {
            console.log (str + ' ' + p1 + '  ' + str.match(/^\s*\*/))
            return str.match(/^\s*\*/) ? str : str.replace(REPLACE_REQUIRE_REGEX, `require('*/cartridge/scripts/lib/${p1}')`)
        },
        paths: [path],
        recursive: true,
        silent: true
    });
};

const prettier = () => {
    console.log('Prettier generated code...');
    const npm = path.sep === '/' ? 'npm' : 'npm.cmd';
    const result = spawnSync(npm, ['run', 'prettier']);
    if (result.error && result.error.errno) {
        console.error(result.error);
    }
    console.log(String(result.stdout));
};

const isDirectory = source => existsSync(source) && lstatSync(source).isDirectory();

const getDirectories = source =>
    readdirSync(source)
        .map(name => [source, name].join('/'))
        .filter(isDirectory);

main();
