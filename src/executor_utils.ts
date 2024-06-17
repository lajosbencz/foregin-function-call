
import { Language } from "./language.js"
import e_js from './executor/js.js'
import e_pl from './executor/pl.js'
import e_py from './executor/py.js'
import e_php from './executor/php.js'
import { Executor, ExecutorConfig } from "./executor.js"
import { UnknownLanguageError } from "./error.js"

export function getExecutorForLanguage(language: Language, config?: ExecutorConfig): Executor {
    if(!config) {
        config = new ExecutorConfig()
    }
    switch (language) {
        case Language.Javascript:
            return new e_js(config)
        case Language.Python:
            return new e_py(config)
        case Language.Perl:
            return new e_pl(config)
            case Language.PHP:
                return new e_php(config)
        default:
            throw new UnknownLanguageError('Unkonwn language: ' + language)
    }
}
