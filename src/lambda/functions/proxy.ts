import express, { Request } from "express";
// import redis from "redis";
// import RedisStore from "connect-redis";
import session from "express-session";
import serverless from "serverless-http";
import wikiExpressRouter from "../expressRouters/wiki/wikiExpressRouter";
import oselExpressRouter from "../expressRouters/osel/oselExpressRouter";
import recaptchaExpressRouter from "../expressRouters/recaptcha/recaptchaExpressRouter";
import createUserRouter from "../expressRouters/createUser/createUserRouter";
import { SESSION_SECRET } from "../../constants/secretConstants";

export interface ExtendedRequest extends Request {
  token?: string;
}

const app = express();
app.use(express.json());

// Configure session middleware
// Create and initialize Redis client
// const redisClient = redis.createClient();
// redisClient.connect().catch(console.error);

// app.use(session({
//   // store: new RedisStore({ client: redisClient, prefix: "typingPractice:" }),
//   secret: SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   cookie: { secure: false } // Set secure to true if using HTTPS
// }));

// Middleware to extract token from Authorization header
app.use((req: ExtendedRequest, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    req.token = token; // Attach the token to the request object
  }

  next();
});

// TODO prevent multiple call for every route
app.use("/.netlify/functions/proxy", wikiExpressRouter);
app.use("/.netlify/functions/proxy", oselExpressRouter);
app.use("/.netlify/functions/proxy", recaptchaExpressRouter);
app.use("/.netlify/functions/proxy", createUserRouter);

export const handler = serverless(app);
