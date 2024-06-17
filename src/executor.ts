import { spawn } from "child_process"

import { CallError } from "./error.js"
import { createHash } from "crypto"
import { mkdir, readFile, unlink, writeFile } from "fs/promises"
import { existsSync } from "fs"

export class ExecutorConfig {
    tmpdir: string = '/tmp/.ffc'
}

export interface Executor {
    call(definition: string, ...args: any): Promise<any>
    cmd(): string
    template(definition: string, fArgs: string, fResult: string): string
}

export abstract class BaseExecutor implements Executor {

    config: ExecutorConfig

    constructor(config: ExecutorConfig) {
        this.config = config
    }

    cmd(): string {
        throw new Error('Not implemented')
    }
    
    template(definition: string, fArgs: string, fResult: string): string {
        throw new Error('Not implemented')
    }

    async call(definition: string, ...args: any): Promise<any> {
        const md5 = createHash('md5')
        md5.update(definition)
        md5.update(this.constructor.name)
        const hash = md5.digest('hex')
        const {tmpdir} = this.config
        if (!existsSync(tmpdir)) {
            await mkdir(tmpdir, {recursive: true})
        }
        const fBase = tmpdir + '/.ffc-' + hash
        const fScript = fBase + '-script'
        const fArgs = fBase + '-args.json'
        const fResult = fBase + '-result.json'
        try {
            const body = this.template(definition, fArgs, fResult)
            await Promise.all([
                writeFile(fScript, body),
                writeFile(fArgs, JSON.stringify(args))
            ])
            await this.exec(this.cmd(), [fScript])
            const {result} = JSON.parse((await readFile(fResult)).toString())
            return result
        } finally {
            await Promise.allSettled([
                // unlink(fScript),
                unlink(fArgs),
                unlink(fResult),
            ])
        }
    }

    protected exec(cmd: string, args: ReadonlyArray<string>): Promise<{ stdout: string, stderr: string }> {
        return new Promise((resolve, reject) => {
            try {
                let stdout = '', stderr = ''
                const proc = spawn(cmd, args, { timeout: 2000 })
                proc.stdout.on('data', x => stdout += x)
                proc.stderr.on('data', x => stderr += x)
                proc.on('error', reject)
                proc.on('exit', (code) => {
                    if (code !== 0) {
                        reject(new CallError(stderr.trim()))
                        return
                    }
                    resolve({ stdout, stderr })
                })
            } catch (e) {
                reject(e)
            }
        })
    }
}
