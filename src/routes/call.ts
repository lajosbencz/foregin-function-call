
import { Request, Response } from 'express'
import { getExecutorForLanguage } from '../executor_utils.js'

export default async (req: Request, res: Response) => {
    try {
        const {language, definition, args} = req.body
        const executor = getExecutorForLanguage(language, {
            tmpdir: process.env.TMPDIR?.replace(/\/+$/, '') || '/tmp/.ffc'
        })
        const result = await executor.call(definition, ...args)
        res.json({
            success: true,
            result,
        })
    } catch (e: any) {
        res.status(400)
        res.json({
            success: false,
            error: {
                type: e.constructor.name,
                message: e.message,
            },
        })
    }
    finally {
        res.end()
    }
}
