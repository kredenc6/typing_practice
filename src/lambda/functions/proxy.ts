import express from "express";
import serverless from "serverless-http";
import wikiExpressRouter from "../expressRouters/wiki/wikiExpressRouter";
import oselExpressRouter from "../expressRouters/osel/oselExpressRouter";

const app = express();

app.use("/.netlify/functions/proxy", wikiExpressRouter);
app.use("/.netlify/functions/proxy", oselExpressRouter);

export const handler = serverless(app);
