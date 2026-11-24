import { BSONType } from 'mongodb';

export const Actor = {
  _id: BSONType.objectId,
  idPelicula: BSONType.string,
  nombre: BSONType.string,
  edad: BSONType.int,
  estaRetirado: BSONType.bool,
  premios: BSONType.array,
};
