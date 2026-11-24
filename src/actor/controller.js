import { ObjectId } from 'mongodb';
import { client, databaseName } from '../common/db.js';
import { validateDocument } from '../common/document.js';
import { peliculaCollection } from '../pelicula/controller.js';
import { Actor } from './actor.js';

const actorCollection = client.db(databaseName).collection('actores');

export async function handleInsertActorRequest(req, res, next) {
  const body = req.body ?? {};
  const { nombrePelicula } = body;
  if (typeof nombrePelicula !== 'string' || nombrePelicula.trim() === '') {
    return res.status(400).json({ error: 'Indica nombrePelicula para buscar la película.' });
  }
  const { document: actor, error } = validateDocument(Actor, {
    ...body,
    idPelicula: nombrePelicula,
  });
  if (error) {
    return res.status(400).json({ error });
  }

  const filter = { nombre: nombrePelicula };
  if (Object.hasOwn(body, 'idPelicula')) {
    try {
      filter._id = ObjectId.createFromHexString(body.idPelicula);
    } catch {
      return res.status(400).json({ error: 'ID de película mal formado.' });
    }
  }

  return peliculaCollection.find(filter).limit(2).toArray()
    .then(async (peliculas) => {
      if (peliculas.length === 0) {
        return res.status(404).json({ error: 'Película no encontrada.' });
      }
      if (peliculas.length > 1) {
        return res.status(409).json({
          error: 'Hay más de una película con ese nombre. Indica también idPelicula.',
        });
      }

      actor.idPelicula = peliculas[0]._id.toHexString();
      const { insertedId } = await actorCollection.insertOne(actor);
      return res
        .location(`/api/actor/${insertedId}`)
        .status(201)
        .json({ ...actor, _id: insertedId });
    })
    .catch(next);
}

export async function handleGetActoresRequest(req, res, next) {
  return actorCollection.find().toArray()
    .then((actores) => res.status(200).json(actores))
    .catch(next);
}

export async function handleGetActorByIdRequest(req, res, next) {
  let id;
  try {
    id = ObjectId.createFromHexString(req.params.id);
  } catch {
    return res.status(400).json({ error: 'ID de actor mal formado.' });
  }

  return actorCollection.findOne({ _id: id })
    .then((actor) => actor
      ? res.status(200).json(actor)
      : res.status(404).json({ error: 'Actor no encontrado.' }))
    .catch(next);
}

export async function handleGetActoresByPeliculaIdRequest(req, res, next) {
  let id;
  try {
    id = ObjectId.createFromHexString(req.params.id);
  } catch {
    return res.status(400).json({ error: 'ID de película mal formado.' });
  }

  return peliculaCollection.findOne({ _id: id }, { projection: { _id: 1 } })
    .then(async (pelicula) => {
      if (!pelicula) {
        return res.status(404).json({ error: 'Película no encontrada.' });
      }
      const actores = await actorCollection.find({ idPelicula: id.toHexString() }).toArray();
      return res.status(200).json(actores);
    })
    .catch(next);
}
