import express from 'express';
import cors from 'cors';
import { client, connect } from './src/common/db.js';
import { peliculaRoutes } from './src/pelicula/routes.js';
import { ActorRoutes } from './src/actor/routes.js';

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.head('/', (req, res) => res.set('Allow', 'GET').sendStatus(405));
app.get('/', (req, res) => res.send('Bienvenido al cine Iplacex'));
app.use('/api', peliculaRoutes, ActorRoutes);
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada.' }));
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const status = error.status >= 400 && error.status < 500 ? error.status : 500;
  if (status === 500) {
    console.error('Error al procesar la solicitud:', error.name);
  }
  return res.status(status).json({
    error: status === 500 ? 'Error interno.' : 'Solicitud inválida.',
  });
});

try {
  await connect();
  console.log('Conexión con MongoDB confirmada.');
} catch (error) {
  console.error('Error al conectar con MongoDB:', error.name);
  await client.close();
  process.exit(1);
}

try {
  const server = app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${server.address().port}.`);
  });
  server.on('error', async (error) => {
    console.error('Error al iniciar Express:', error.code);
    await client.close();
    process.exitCode = 1;
  });
} catch (error) {
  console.error('Error al configurar el puerto de Express:', error.code ?? error.name);
  await client.close();
  process.exitCode = 1;
}
