import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

function safeRead(filePath: string) {
	return fs.readFileSync(filePath, 'utf8');
}

function safeWrite(filePath: string, obj: any) {
	fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf8');

	console.log('Written', filePath);
}

function generateGrammarFiles() {
	const indentationMarker = '<INDENT>';
	const scopeNameMarker = '<SCOPE_NAME>';
	const repoRoot = path.join(fileURLToPath(import.meta.url), '../..');

	const source = path.join(repoRoot, 'syntaxes', 'nestedtext.yaml');
	const strict = path.join(repoRoot, 'syntaxes', 'nestedtext.tmLanguage.json');
	const lax = path.join(repoRoot, 'syntaxes', 'nestedtext-lax.tmLanguage.json');

	const sourceText = safeRead(source);
	const sourceYaml = yaml.load(sourceText);
	const sourceJsonString = JSON.stringify(sourceYaml);
	
	const strictSourceJsonString = sourceJsonString
		.replaceAll(indentationMarker, ' ')
		.replaceAll(scopeNameMarker, 'source.nestedtext.strict');
	const laxSourceJsonString = sourceJsonString
		.replaceAll(indentationMarker, '\\\\s')
		.replaceAll(scopeNameMarker, 'source.nestedtext.lax');
	
	const strictJson = JSON.parse(strictSourceJsonString);
	const laxJson = JSON.parse(laxSourceJsonString);

	safeWrite(strict, strictJson);
	safeWrite(lax, laxJson);

	console.log('Done generating grammar files.');
}

generateGrammarFiles();
