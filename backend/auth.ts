import bcrypt from "bcryptjs";
import passport from "passport";
import express, { Request, Response } from "express";
import { User } from "../src/models/user";
import { getUserBy, getUserById } from "./database";

const LocalStrategy = require("passport-local").Strategy;
const router = express.Router();

// configure passport for local strategy
passport.use(
  new LocalStrategy(function (username: string, password: string, done: Function) {
    const user = getUserBy("username", username);

    const failureMessage = "Incorrect username or password.";
    if (!user) {
      return done(null, false, { message: failureMessage });
    }

    // validate password
    if (!bcrypt.compareSync(password, user.password)) {
      return done(null, false, { message: failureMessage });
    }

    return done(null, user);
  })
);

passport.serializeUser(function (user: User, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id: string, done) {
  const user = getUserById(id);
  done(null, user);
});

// authentication routes
/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Authentication for the site
 * /login:
 *  post:
 *    tags: [Authentication]
 *    summary: Authenticate a User
 *    description: Login to the system
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - username
 *              - password
 *            properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
 *              remember:
 *                type: boolean
 *                description: Keep the user logged in even after the browser closes
 *            example:
 *              username: Heath93
 *              password: s3cret
 *              remember: false
 *    responses:
 *      '200':
 *        description: A successful response, returns user data
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                user:
 *      '401':
 *        description: Unauthorized, returns an error message
 */
router.post("/login", passport.authenticate("local"), (req: Request, res: Response): void => {
  if (req.body.remember) {
    req.session!.cookie.maxAge = 24 * 60 * 60 * 1000 * 30; // Expire in 30 days
  } else {
    req.session!.cookie.expires = undefined;
  }

  res.send({ user: req.user });
});

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Authentication for the site
 * /logout:
 *  post:
 *    tags: [Authentication]
 *    summary: Deauthenticate (Logout) a User
 *    description: Logout from the system
 *    responses:
 *      '200':
 *        description: A successful response, returns a redirect to the home page
 *      '500':
 *        description: Internal Server Error, returns an error message
 */
router.post("/logout", (req: Request, res: Response): void => {
  res.clearCookie("connect.sid");
  req.logout(() => res.redirect("/"));
  req.session!.destroy(function (err) {
    res.redirect("/");
  });
});

router.get("/checkAuth", (req, res) => {
  /* istanbul ignore next */
  if (!req.user) {
    res.status(401).json({ error: "User is unauthorized" });
  } else {
    res.status(200).json({ user: req.user });
  }
});

export default router;
