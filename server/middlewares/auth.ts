import { Request, Response, NextFunction } from "express"
import * as Sentry from "@sentry/node" 


export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.auth()

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        next()
    } catch (error: unknown) {
        Sentry.captureException(error)
        const message = error instanceof Error ? error.message : 'Unauthorized'
        const code = typeof error === 'object' && error !== null && 'code' in error
            ? (error as { code?: string }).code
            : undefined

        res.status(401).json({ message: code || message })
    }
}