import { Router } from 'express';
import {
  handleGetActorByIdRequest,
  handleGetActoresByPeliculaIdRequest,
  handleGetActoresRequest,
  handleInsertActorRequest,
} from './controller.js';

export const ActorRoutes = Router();

ActorRoutes.post('/actor', handleInsertActorRequest);
ActorRoutes.get('/actores', handleGetActoresRequest);
ActorRoutes.get('/actor/:id', handleGetActorByIdRequest);
ActorRoutes.get('/pelicula/:id/actores', handleGetActoresByPeliculaIdRequest);
