import { Router, type Request, type Response } from "express";

const router = Router();

import { isLogged } from "../middlewares/auth.middleware";

import * as eventApi from "../api/events";

router.get("/", async (req: Request, res: Response) => {
    try {
        let events = await eventApi.getEvents()
        res.status(200).send(events.data)
    } catch (error: any) {
        if (error.response.status === 404) res.status(404).send("Event not found")
        else res.status(500).send("Internal server error")
    }
})

router.get("/:id", async (req, res) => {
    let id = parseInt(req.params.id);
    try {
        let event = await eventApi.getEvent(id);
        res.send(event.data);
    } catch (error: any) {
        if (error.response.status === 404) res.status(404).send("Event not found");
        else res.status(500).send("Internal server error");
    }
})

router.post("/", isLogged, async (req, res) => {
    try {
        let event = await eventApi.createEvent(req.body);
        res.send(event.data);
    } catch (error: any) {
        if (error.response.status === 400) res.status(400).send("Invalid data");
        else res.status(500).send("Internal server error");
    }
})

router.put("/:id", isLogged, async (req, res) => {
    let id = parseInt(req.params.id);

    try {
        let event = await eventApi.updateEvent(id, req.body);
        res.send(event.data);
    } catch (error: any) {
        if (error.response.status === 404) res.status(404).send("Event not found");
        else if (error.response.status === 400) res.status(400).send("Invalid data");
        else res.status(500).send("Internal server error");
    }
})

router.delete("/:id", isLogged, async (req, res) => {
    let id = parseInt(req.params.id);
    let event = await eventApi.deleteEvent(id);

    res.send(event.data);
})

router.delete("/:id", isLogged, async (req, res) => {
    let id = parseInt(req.params.id);
    let event = await eventApi.deleteEvent(id);

    res.send(event.data);
})


router.post('/:id/finish', async (req, res) => {
    let id = parseInt(req.params.id);

    try {
        let response = await eventApi.finishEvent(id);
        res.send(response.data);
    } catch (error: any) {
        if (error.response.status === 400) res.status(400).send("Invalid data")
        else res.status(500).send("Internal server error")
    }
})

export default router;