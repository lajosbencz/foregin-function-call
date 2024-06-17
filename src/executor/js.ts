
import { BaseExecutor, Executor } from "../executor.js"


export default class extends BaseExecutor implements Executor {

    cmd(): string {
        return 'node'
    }

    template(definition: string, fArgs: string, fResult: string): string {
        return `
import {readFileSync, writeFileSync} from 'fs';
const args = JSON.parse(readFileSync('${fArgs}'));
try {
    const result = (${definition})(...args);
    writeFileSync('${fResult}', JSON.stringify({success: true, result}));
} catch(e) {
    console.error(e.message)
    writeFileSync('${fResult}', JSON.stringify({success: false, error: e.message}));
    process.exit(1)
}`
    }
}
