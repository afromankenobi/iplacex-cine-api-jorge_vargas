import { Router } from 'express';
import {
  handleDeletePeliculaByIdRequest,
  handleGetPeliculaByIdRequest,
  handleGetPeliculasRequest,
  handleInsertPeliculaRequest,
  handleUpdatePeliculaByIdRequest,
} from './controller.js';

export const peliculaRoutes = Router();

peliculaRoutes.post('/pelicula', handleInsertPeliculaRequest);
peliculaRoutes.get('/peliculas', handleGetPeliculasRequest);
peliculaRoutes.route('/pelicula/:id')
  .get(handleGetPeliculaByIdRequest)
  .put(handleUpdatePeliculaByIdRequest)
  .delete(handleDeletePeliculaByIdRequest);
