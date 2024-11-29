import { RegisterService } from "../services/registers.service";
import { RegisterError } from "../enums/RegisterError";

import type { Register } from "../types/Register";

export class RegisterController {
  protected service: RegisterService;

  constructor() {
    this.service = new RegisterService();
  }

  async getRegisters() {
    try {
      let registers: Register[] = await this.service.getAll();

      if (!registers) {
        throw new Error('No registers found');
      }

      return registers;
    } catch (e) {
      console.error(e);
      throw new Error(RegisterError.NotFound);
    }
  }

  async getRegisterById(id: number) {
    try {
      const register: Register | null = await this.service.getById(id);

      if (!register) {
        throw new Error('Register not found');
      }

      return register;
    } catch (e) {
      console.error(e);
      throw new Error(RegisterError.NotFound);
    }
  }

  async getRegistersByUserId(userId: number) {
    try {
      const registers = await this.service.getByUserId(userId);

      if (!registers) {
        throw new Error('No registers found for this user');
      }

      return registers;
    } catch (e) {
      console.error(e);
      throw new Error(RegisterError.NotFound);
    }
  }

  async createRegister(register: Register) {
    try {
      if (!register.user_id) {
        throw new Error("User ID is required.");
      }

      const newRegisterId: number | bigint = await this.service.create(register);

      if (!newRegisterId) {
        throw new Error(RegisterError.NotCreated);
      }

      return { id: newRegisterId, ...register };
    } catch (e) {
      console.error(e);
      throw new Error(RegisterError.NotCreated);
    }
  }

  async deleteRegister(id: number) {
    try {
      const deleted = await this.service.delete(id);

      if (!deleted) {
        throw new Error(RegisterError.NotDeleted);
      }

      return { success: true };
    } catch (e) {
      console.error(e);
      throw new Error(RegisterError.NotDeleted);
    }
  }

  async registerPresence(registerId: number) {
    try {
      const register = await this.service.getById(registerId);

      const updated = await this.service.update(registerId, { category: "checked-in" });

      if (!updated) {
        throw new Error(RegisterError.NotUpdated);
      }

      return { success: true };
    } catch (e) {
      console.error(e);
      throw new Error("Presence not registered");
    }
  }
}