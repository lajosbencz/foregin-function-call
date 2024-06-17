
import { BaseExecutor, Executor } from "../executor.js"


export default class extends BaseExecutor implements Executor {

    cmd(): string {
        return 'php'
    }

    template(definition: string, fArgs: string, fResult: string): string {
        return `
<?php

try {
    if(!is_readable('${fArgs}')) {
        throw new RuntimeException("Cannot read file: ${fArgs}");
    }

    $args = json_decode(file_get_contents('${fArgs}'));

    $definition = <<<'EOD'
    ${definition}
    EOD;

    eval('$fn = ' . $definition);

    $result = $fn(...$args);

    file_put_contents('${fResult}', json_encode([
        'success' => true,
        'result' => $result,
    ]));
} catch(Throwable $e) {
    file_put_contents('${fResult}', json_encode([
        'success' => false,
        'result' => $e->getMessage(),
    ]));
    throw $e;
}
`
    }
}
