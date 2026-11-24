import { ObjectId } from 'mongodb';
import { client, databaseName } from '../common/db.js';
import { validateDocument } from '../common/document.js';
import { Pelicula } from './pelicula.js';

export const peliculaCollection = client.db(databaseName).collection('peliculas');

export async function handleInsertPeliculaRequest(req, res, next) {
  const { document, error } = validateDocument(Pelicula, req.body ?? {});
  if (error) {
    return res.status(400).json({ error });
  }

  return peliculaCollection.insertOne(document)
    .then(({ insertedId }) => res
      .location(`/api/pelicula/${insertedId}`)
      .status(201)
      .json({ ...document, _id: insertedId }))
    .catch(next);
}

export async function handleGetPeliculasRequest(req, res, next) {
  return peliculaCollection.find().toArray()
    .then((peliculas) => res.status(200).json(peliculas))
    .catch(next);
}

export async function handleGetPeliculaByIdRequest(req, res, next) {
  let id;
  try {
    id = ObjectId.createFromHexString(req.params.id);
  } catch {
    return res.status(400).json({ error: 'ID de película mal formado.' });
  }

  return peliculaCollection.findOne({ _id: id })
    .then((pelicula) => pelicula
      ? res.status(200).json(pelicula)
      : res.status(404).json({ error: 'Película no encontrada.' }))
    .catch(next);
}

export async function handleUpdatePeliculaByIdRequest(req, res, next) {
  let id;
  try {
    id = ObjectId.createFromHexString(req.params.id);
  } catch {
    return res.status(400).json({ error: 'ID de película mal formado.' });
  }

  const { document, error } = validateDocument(Pelicula, req.body ?? {}, { partial: true });
  if (error) {
    return res.status(400).json({ error });
  }

  return peliculaCollection.findOneAndUpdate({ _id: id }, { $set: document }, {
    returnDocument: 'after',
  })
    .then((pelicula) => pelicula
      ? res.status(200).json(pelicula)
      : res.status(404).json({ error: 'Película no encontrada.' }))
    .catch(next);
}

export async function handleDeletePeliculaByIdRequest(req, res, next) {
  let id;
  try {
    id = ObjectId.createFromHexString(req.params.id);
  } catch {
    return res.status(400).json({ error: 'ID de película mal formado.' });
  }

  return peliculaCollection.findOneAndDelete({ _id: id })
    .then((pelicula) => pelicula
      ? res.status(200).json(pelicula)
      : res.status(404).json({ error: 'Película no encontrada.' }))
    .catch(next);
}
