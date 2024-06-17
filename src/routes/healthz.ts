import {Request, Response} from 'express'

export default (req: Request, res: Response) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end('Ok.')
}
