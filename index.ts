const miniminst = require('minimist');
const fs = require('fs');
const path = require('path');

const argv = miniminst(process.argv.slice(2));

const pathAlias = argv.alias ?? argv.a ?? argv._[0];
const rootDir = argv.rootDir ?? argv.r ?? argv._[1];

if (!pathAlias || !rootDir) {
    console.error('You must provide the path alias and the root directory');
    process.exit(1);
}

const pwd = process.cwd();

function readDir(directoryName: string): string[] {
    return fs.readdirSync(directoryName).flatMap((f: string) => {
        const file = path.resolve(directoryName, f);
        const fileStat = fs.statSync(file);

        if (fileStat.isDirectory()) {
            return readDir(file);
        }

        return [file.replace(pwd, '.')];
    });
}

function toAliasedImport(relativeImport: string, filePath: string): string {
    const fileDirectory = filePath.split('/').slice(0, -1).join('/');
    const pathToOmit = path.resolve(pwd, rootDir);
    const fullPath = path.resolve(fileDirectory, relativeImport).replace(pathToOmit, '');

    return pathAlias + fullPath;
}

function replaceRelativeImportsInFile(file: string): number {
    const fileContent = fs.readFileSync(file, 'utf8');

    const relativeImports = fileContent
        .split('\n')
        .map((r: string) => RegExp(/\s+from ('\S+');?/).exec(r))
        .filter((r: RegExpExecArray | null): r is RegExpExecArray => !!r && r.length > 1)
        .map((r: RegExpExecArray) => r[1])
        .filter((r: string) => r.startsWith("'../") || r.startsWith("'./"))
        .map((r: string) => r.replace(/'/g, ''));

    const fileContentWithRelativeImportsReplaced = relativeImports.reduce(
        (acc: string, elem: string) => {
            const aliasedImport = toAliasedImport(elem, file);

            return acc.replace(elem, aliasedImport);
        },
        fileContent
    );

    if (fileContent === fileContentWithRelativeImportsReplaced) {
        return 0;
    }

    fs.writeFile(file, fileContentWithRelativeImportsReplaced, 'utf8', (err: unknown) => {
        if (err) return console.log(err);
    });

    return 1;
}

async function writeFiles(files: string[]) {
    const writtenFilesResult = await Promise.all(
        files.map((file) => replaceRelativeImportsInFile(file))
    );
    const numberOfWrittenFiles = writtenFilesResult.reduce(
        (acc: number, elem: number) => acc + elem,
        0
    );

    console.log(`Changed ${numberOfWrittenFiles} files`);
}

const files = readDir(rootDir);
writeFiles(files);
