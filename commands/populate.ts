import { createConnection } from "typeorm";
import { Gift } from "../src/entity/gift";
import * as faker from "faker";
import { Geometry } from "./../src/entity/geometry";

createConnection().then(async (connection) => {
  const giftRepository = connection.getMongoRepository(Gift);

  for (let i = 0; i < 50; i++) {
    let geo = new Geometry();

    geo.coordinates = [
      faker.datatype.float({ min: 89, max: 91 }),
      faker.datatype.float({ min: 21, max: 23 }),
    ];

    await giftRepository.save({
      title: faker.lorem.words(2),
      price: faker.datatype.number(100),
      geometry: geo,
    });
  }

  process.exit();
});
