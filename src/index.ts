import express from "express";
import cors from "cors";
import { createConnection } from "typeorm";
import "reflect-metadata";

//   All Routes Import
import GiftRouter from "./modules/gift/gift_route";
import { Gift } from "./entity/gift";

createConnection().then(async (connection) => {
  console.log("Database Connection Established");

  const app = express();

  //   app.use(cors({ origin: ["*"] }));
  //   app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  const PORT = 3000;

  app.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`);
  });

  app.use("/api/v1/gift", GiftRouter);
});
