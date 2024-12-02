import { Router, type Request, type Response } from "express";

const router = Router();

import { isLogged } from "../middlewares/auth.middleware";

import * as userApi from "../api/users";

router.get("/", isLogged, async (req: Request, res: Response) => {
    try {
        let users = await userApi.getUsers()
        res.status(200).send(users.data)
    } catch (error: any) {
        if (error.response.status === 404) res.status(404).send("User not found")
        else res.status(500).send("Internal server error")
    }
})

router.get("/:id", isLogged, async (req, res) => {
    let id = parseInt(req.params.id);
    try {
        let user = await userApi.getUser(id);
        res.send(user.data);
    } catch (error: any) {
        if (error.response.status === 404) res.status(404).send("User not found");
        else res.status(500).send("Internal server error");
    }
})

router.post("/", isLogged, async (req, res) => {
    try {
        let user = await userApi.createUser(req.body);
        res.status(201).send(user.data);
    } catch (error: any) {
        if (error.response.status === 400) res.status(400).send("Invalid data");
        else res.status(500).send("Internal server error");
    }
})

router.put("/:id", isLogged, async (req, res) => {
    let id = parseInt(req.params.id);

    try {
        let user = await userApi.updateUser(id, req.body);
        res.send(user.data);
    } catch (error: any) {
        if (error.response.status === 404) res.status(404).send("User not found");
        else if (error.response.status === 400) res.status(400).send("Invalid data");
        else res.status(500).send("Internal server error");
    }
})

router.delete("/:id", isLogged, async (req, res) => {
    let id = parseInt(req.params.id);
    let user = await userApi.deleteUser(id);

    res.send(user.data);
})

router.delete("/:id", isLogged, async (req, res) => {
    let id = parseInt(req.params.id);
    let user = await userApi.deleteUser(id);

    res.send(user.data);
})

export default router;