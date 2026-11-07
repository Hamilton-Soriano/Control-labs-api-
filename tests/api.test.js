const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const express = require('express');
const app = require('../dist/src/app.js').default;
const {
  globalErrorHandler,
} = require('../dist/src/middlewares/errorHandler.middleware.js');

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });

  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('No se pudo determinar el puerto del servidor de pruebas.');
  }
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test('health check devuelve 200', async () => {
  const response = await fetch(`${baseUrl}/api/v1/health`);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).status, 'success');
});

test('un préstamo sin campos requeridos devuelve 400', async () => {
  const response = await fetch(`${baseUrl}/api/v1/loans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      roomId: 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44',
      instructorId: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33',
      numeroPc: 12,
    }),
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    success: false,
    error: 'Datos del préstamo inválidos.',
  });
});

test('un préstamo con tipos incorrectos devuelve 400', async () => {
  const response = await fetch(`${baseUrl}/api/v1/loans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      roomId: 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44',
      instructorId: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33',
      guardaId: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22',
      numeroPc: 'doce',
    }),
  });

  assert.equal(response.status, 400);
});

test('una cantidad de computadores no positiva devuelve error de dominio 400', async () => {
  const response = await fetch(`${baseUrl}/api/v1/loans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      roomId: 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44',
      instructorId: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33',
      guardaId: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22',
      numeroPc: 0,
    }),
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    success: false,
    code: 'VALIDATION_ERROR',
    error: 'El número de PCs debe ser un entero positivo.',
  });
});

test('un cuerpo JSON malformado devuelve 400', async () => {
  const response = await fetch(`${baseUrl}/api/v1/loans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{invalid',
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    success: false,
    error: 'El cuerpo JSON está malformado.',
  });
});

test('un error inesperado devuelve 500 sin exponer el detalle', async () => {
  const errorApp = express();
  errorApp.get('/__test/error', (_req, _res, next) => {
    next(new Error('Error de prueba'));
  });
  errorApp.use(globalErrorHandler);

  const errorServer = errorApp.listen(0);
  try {
    await new Promise((resolve, reject) => {
      errorServer.once('listening', resolve);
      errorServer.once('error', reject);
    });

    const address = errorServer.address();
    assert.ok(address && typeof address !== 'string');

    const response = await fetch(
      `http://127.0.0.1:${address.port}/__test/error`,
    );
    const body = await response.json();

    assert.equal(response.status, 500);
    assert.equal(body.message, 'Error interno del servidor en ControlLabs');
    assert.equal(JSON.stringify(body).includes('Error de prueba'), false);
  } finally {
    await new Promise((resolve, reject) => {
      errorServer.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test('una ruta inexistente devuelve 404', async () => {
  const response = await fetch(`${baseUrl}/api/v1/not-found`);
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), {
    success: false,
    error: 'Ruta no encontrada.',
  });
});
