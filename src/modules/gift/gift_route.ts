import express from "express";
import { get, hello, near, store } from "./gift_controller";

const router = express.Router();

router.get("/", get);

router.get("/near", near);

router.get("/hello", hello);

router.post("/store", store);

export default router;
