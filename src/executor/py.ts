
import { BaseExecutor, Executor } from "../executor.js"

export default class extends BaseExecutor implements Executor {
    cmd(): string {
        return 'python3'
    }

    template(definition: string, fArgs: string, fResult: string): string {
        const rgx = /^def\s+([^\(\s)]+)/
        const name = rgx.exec(definition)?.[1]
        if (!name) {
            throw new Error('Failed to determine function name')
        }

        return `
#!/usr/bin/python3

import json

if __name__ == '__main__':
    args = []
    with open("${fArgs}", "r") as f:
        args = json.load(f)
    
    scope = {}
    exec("${definition.replace(/\n/g, '\\n')}", {}, scope)
    result = scope['${name}'](*args)
    
    with open("${fResult}", "w") as f:
        json.dump({'result': result}, f)
`
    }
}
