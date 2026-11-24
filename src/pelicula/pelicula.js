import { BSONType } from 'mongodb';

export const Pelicula = {
  _id: BSONType.objectId,
  nombre: BSONType.string,
  géneros: BSONType.array,
  anioEstreno: BSONType.int,
};
