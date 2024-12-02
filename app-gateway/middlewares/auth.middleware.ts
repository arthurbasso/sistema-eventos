import axios from "axios"

import type { Request, Response, NextFunction } from "express";

export async function isLogged(req: Request, res: Response, next: NextFunction) {

    let api = axios.create({
        baseURL: "http://localhost:3001",
    })

    api.defaults.headers.common["Authorization"] = req.headers?.authorization

    let response = await api.get("/session/check")

    if (response.data.verified) {
        next()
    } else {
        res.status(401).send("Unauthorized")
    }
}