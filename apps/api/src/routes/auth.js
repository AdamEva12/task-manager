const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createError } = require("../utils/createError");

function createAuthRouter(prisma) {
    const router = express.Router();

    function createToken(userId) {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not set");
        }
        return jwt.sign(
            { userId },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
    }

    router.post("/register", async (req, res, next) => {
        try {
            const { email, password } = req.body;
            if (typeof email !== "string" || !email.trim()) {
                return next(createError("Email is required", 400));
            }
            if (typeof password !== "string" || password.length < 6) {
                return next(createError("Password must be at least 6 characters", 400));
            }
            const existingUser = await prisma.user.findUnique({
                where: { email: email.trim().toLowerCase() },
            });
            if (existingUser) {
                return next(createError("User already exists", 409));
            }
            const passwordHash = await bcrypt.hash(password, 10);
            const user = await prisma.user.create({
                data: {
                    email: email.trim().toLowerCase(),
                    passwordHash,
                },
            });
            const token = createToken(user.id);
            res.status(201).json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                },
            });
        } catch (error) {
            next(error);
        }
    });


    router.post("/login", async (req, res, next) => {
        try {
            const { email, password } = req.body;
            if (typeof email !== "string" || typeof password !== "string") {
                return next(createError("Email and password are required", 400));
            }
            const user = await prisma.user.findUnique({
                where: { email: email.trim().toLowerCase() },
            });
            if (!user) {
                return next(createError("Invalid email or password", 401));
            }
            const isValidPassword = await bcrypt.compare(password, user.passwordHash);
            if (!isValidPassword) {
                return next(createError("Invalid email or password", 401));
            }
            const token = createToken(user.id);
            res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                },
            });
        } catch (error) {
            next(error);
        }
    });
    return router;
}

module.exports = { createAuthRouter };