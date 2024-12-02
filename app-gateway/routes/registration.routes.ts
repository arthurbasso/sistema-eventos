import { Router } from "express";

const router = Router();

import { isLogged } from "../middlewares/auth.middleware";

import * as eventApi from "../api/events";

router.get("/", isLogged, async (req, res) => {
    try {
        let events = await eventApi.getRegistrations();
        res.send(events.data);
    } catch (error: any) {
        if (error.response.status === 400) res.status(400).send("Invalid data");
        else res.status(500).send("Internal server error");
    }
})

router.get("/user/:id", isLogged, async (req, res) => {
    let id = parseInt(req.params.id)
    try {
        let events = await eventApi.getParticipantEvents(id)
        res.send(events.data)
    } catch (error: any) {
        if (error.response.status === 400) res.status(400).send("Invalid data")
        else res.status(500).send("Internal server error")
    }
})

router.get("/event/:id", isLogged, async (req, res) => {
    let id = parseInt(req.params.id)
    try {
        let events = await eventApi.getEventParticipants(id)
        res.send(events.data)
    } catch (error: any) {
        if (error.response.status === 400) res.status(400).send("Invalid data")
        else res.status(500).send("Internal server error")
    }
})

router.post("/", isLogged, async (req, res) => {
    try {
        let event_id = req.body.event_id;
        let user_id = req.body.user_id;

        await eventApi.registerParticipant(event_id, user_id);
        res.status(201).send("Participant registered");
    } catch (error: any) {
        if (error.response.status === 400) res.status(400).send("Invalid data");
        else res.status(500).send("Internal server error");
    }
})

export default router;