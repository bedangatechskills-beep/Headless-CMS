import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = Router();

// POST /api/auth/login   body: { "email": "...", "password": "..." }
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // Same message for wrong email and wrong password —
    // never tell an attacker which half was correct.
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const passwordOk = await bcrypt.compare(password, user.passwordHash);
    if (!passwordOk) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

export default router;