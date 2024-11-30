import { Router } from "express";
import type { Request, Response } from "express";

import { RegisterController } from "../controllers/registers.controllers.ts";

const router = Router();
const controller = new RegisterController();

router.get("/registers", async (req: Request, res: Response) => {
  try {
    const registers = await controller.getRegisters();
    res.status(200).send(registers);
  } catch (e: any) {
    res.status(400).send({ error: e.message });
  }
});

router.get("/registers/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const register = await controller.getRegisterById(id);
    res.status(200).send(register);
  } catch (e: any) {
    res.status(404).send({ error: e.message });
  }
});

router.get("/registers/user/:id", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const registers = await controller.getRegistersByUserId(userId);
    res.status(200).send(registers);
  } catch (e: any) {
    res.status(404).send({ error: e.message });
  }
});

router.post("/registers", async (req: Request, res: Response) => {
  try {
    const register = req.body;
    const newRegister = await controller.createRegister(register);
    res.status(201).send(newRegister);
  } catch (e: any) {
    res.status(400).send({ error: e.message });
  }
});

router.delete("/registers/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await controller.deleteRegister(id);
    res.status(204).send();
  } catch (e: any) {
    res.status(404).send({ error: e.message });
  }
});

router.put("/checkin", async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    await controller.registerPresence(id);
    res.status(200).send({ success: true });
  } catch (e: any) {
    res.status(400).send({ error: e.message });
  }
});

export default router;