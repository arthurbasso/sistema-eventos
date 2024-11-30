import { Router } from 'express'
import type { Request, Response } from 'express'

const router = Router()

import { SessionService } from '../services/session.service'

const sessionService = new SessionService()

router.get('/check', async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            throw new Error('No token provided')
        }

        const verified = await sessionService.verifySession(token)
        res.status(200).json({ verified })
    } catch (e: any) {
        console.error(e)
        res.status(500).json({ error: e.message })
    }
})

export default router