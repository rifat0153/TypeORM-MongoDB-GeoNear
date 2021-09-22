import { Request, Response } from "express";
import { pipeline } from "stream";
import { getMongoRepository } from "typeorm";
import { Gift } from "../../entity/gift";

const isRequired = () => {
  throw new Error("param is required");
};

const geoNearStage = (
  lat: number,
  lng: number,
  maxDistanceInKm: number
) => {
  return {
    $geoNear: {
      near: {
        type: "Point",
        coordinates: [lng, lat],
      },
      maxDistance: maxDistanceInKm * 1000,
      spherical: true,
      distanceField: "distance",
      distanceMultiplier: 0.001,
    },
  };
};

const giftProjectStageWithDistance = {
  $project: {
    _id: 0,
    id: "$_id",
    distance: 1,
    title: 1,
    price: 1,
    geometry: 1,
  },
};

export const near = async (req: Request, res: Response) => {
  try {
    let giftRepository = getMongoRepository(Gift);

    const page: number =
      parseInt(req.query.page as any) < 1
        ? 1
        : parseInt(req.query.page as any) || 1;
    const take = parseInt((req.query.take as any) || (10 as any));
    const total = await giftRepository.count();

    if (req.query.lat && req.query.lng) {
      const lat = parseFloat(req.query.lat as any);
      const lng = parseFloat(req.query.lng as any);
      const maxDistance =
        parseInt(req.query.maxDistanceInKm as any) || 10;

      const result = await giftRepository
        .aggregate([
          geoNearStage(lat, lng, maxDistance),
          giftProjectStageWithDistance,
        ])
        .skip(page * take)
        .limit(take)
        .toArray();

      res.status(200).json({
        result,
        total,
        page,
        last_page: Math.ceil(total / take),
      });
    }
  } catch (error) {
    console.log(error);
    res.status(200).json(error);
  }
};
export const get = async (req: Request, res: Response) => {
  try {
    let giftRepository = getMongoRepository(Gift);

    let options = {};

    if (req.query.s) {
      options = {
        ...options,

        where: {
          $or: [
            { title: new RegExp(req.query.s.toString(), "i") },
            { price: new RegExp(req.query.s.toString(), "i") },
          ],
        },
      };
    }

    if (req.query.sort) {
      options = {
        ...options,
        order: {
          price: req.query.sort.toString().toUpperCase(),
        },
      };
    }

    const page: number =
      parseInt(req.query.page as any) < 1
        ? 1
        : parseInt(req.query.page as any) || 1;
    const take = 10;
    const total = await giftRepository.count();

    options = {
      ...options,
      take: take,
      skip: (page - 1) * take,
    };

    const result = await giftRepository.find(options);

    res.status(200).json({
      result,
      total,
      page,
      last_page: Math.ceil(total / take),
    });
  } catch (error) {
    console.log(error);
    res.status(200).json(error);
  }
};

export const store = async (req: Request, res: Response) => {
  const giftRepository = getMongoRepository(Gift);

  try {
    const newGift = new Gift();
    (newGift.price = 122), (newGift.title = "Gift1");

    const savedGift = await giftRepository.save(newGift);

    res.status(200).json(savedGift);
  } catch (error) {
    console.log(error);
    res.status(200).json(error);
  }
};

export const hello = async (req: Request, res: Response) => {
  const giftRepository = getMongoRepository(Gift);

  try {
    res.status(200).json("Hello");
  } catch (error) {
    console.log(error);
    res.status(200).json(error);
  }
};
