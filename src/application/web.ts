import express from "express";
import bodyParser from "body-parser";
import {publicRouter} from "../route/public-api";
import {errorMiddleware} from "../middleware/error-middleware";
import {apiRouter} from "../route/api";

export const web = express();
web.use(express.json());
web.use(express.urlencoded({extended: true}));

web.use(bodyParser.json());
web.use(bodyParser.urlencoded({extended: true}));

web.use(publicRouter);
web.use(apiRouter);
web.use(errorMiddleware);