import 'mocha';
import {expect} from 'chai';
import { Carta, Color, LineaTipo, Rareza, ImprimirCarta } from '../src/EjerciciosCarta/cartas_magic.js';
import { GuardarCarta, CargarCartas, ActualizarCarta, EliminarCarta } from '../src/EjerciciosCarta/gestor_cartas.js';
import { EventEmitter } from 'events';
import { EventEmitterSocket } from '../src/EjerciciosCarta/servidor.js';
import fs from 'fs';


describe('GuardarCarta', () => {
  it('Debería guardar una carta correctamente', (done) => {
    const usuario = 'usuario_prueba';
    const carta = new Carta(
      1,
      'Carta de Prueba',
      3,
      Color.Azul,
      LineaTipo.Criatura,
      Rareza.Rara,
      'Texto de reglas de la carta de prueba',
      3,
      3,
      undefined,
      10
    );

    GuardarCarta(usuario, carta, (err, data) => {
      expect(err).to.be.undefined;
      expect(data).to.equal(`Se ha guardado correctamente en el usuario: ${usuario}`);

      // Limpieza después de la prueba
      const filePath = `./src/EjerciciosCarta/usuarios/${usuario}/${carta.id}.json`;
      fs.unlinkSync(filePath);
      done();
    });
  });
});

describe('CargarCartas', () => {
  it('Debería cargar las cartas de un usuario correctamente', (done) => {
    const usuario = 'usuario_prueba';
    const carta = new Carta(
      1,
      'Carta de Prueba',
      3,
      Color.Azul,
      LineaTipo.Criatura,
      Rareza.Rara,
      'Texto de reglas de la carta de prueba',
      5,
      3,
      undefined,
      10
    );

    GuardarCarta(usuario, carta, (err, data) => {
      if (err) {
        done(err);
      } else {
        CargarCartas(usuario, (err, coleccion) => {
          expect(err).to.be.undefined;
          expect(coleccion).to.be.an('array');
          expect(coleccion?.length).to.equal(0);
          if(coleccion) {
            expect(coleccion[0]).to.deep.equal(carta);
          }
          

          // Limpieza después de la prueba
          const filePath = `./src/EjerciciosCarta/usuarios/${usuario}/${carta.id}.json`;
          fs.unlinkSync(filePath);
          done();
        });
      }
    });
  });
});

describe('ActualizarCarta', () => {
  it('Debería actualizar una carta existente correctamente', (done) => {
    const usuario = 'usuario_prueba';
    const carta = new Carta(
      1,
      'Carta de Prueba',
      3,
      Color.Azul,
      LineaTipo.Planeswalker,
      Rareza.Rara,
      'Texto de reglas de la carta de prueba',
      undefined,
      undefined,
      5,
      10);
    const nuevaCarta = new Carta(
      5,
      'Carta de Prueba',
      3,
      Color.Azul,
      LineaTipo.Planeswalker,
      Rareza.Rara,
      'Texto de reglas de la carta de prueba',
      undefined,
      undefined,
      6,
      10);

    GuardarCarta(usuario, carta, (err, data) => {
      if (err) {
        done(err);
      } else {
        ActualizarCarta(usuario, carta.id, nuevaCarta, (err, data) => {
          expect(err).to.be.undefined;
          expect(data).to.equal(`Se ha guardado correctamente en el usuario: ${usuario}`);

          // Verificar que la carta se haya actualizado correctamente
          CargarCartas(usuario, (err, coleccion) => {
            expect(err).to.be.undefined;
            expect(coleccion).to.be.an('array');
            expect(coleccion?.length).to.equal(1);
            if(coleccion) {
              expect(coleccion[0]).to.deep.equal(nuevaCarta);
            }
      

            // Limpieza después de la prueba
            const filePath = `./src/EjerciciosCarta/usuarios/${usuario}/${nuevaCarta.id}.json`;
            fs.unlinkSync(filePath);
            done();
          });
        });
      }
    });
  });

});

describe('EliminarCarta', () => {
  it('Debería eliminar una carta existente correctamente', (done) => {
    const usuario = 'usuario_prueba';
    const carta = new Carta(
      1,
      'Carta de Prueba',
      3,
      Color.Azul,
      LineaTipo.Planeswalker,
      Rareza.Rara,
      'Texto de reglas de la carta de prueba',
      undefined,
      undefined,
      undefined,
      10
    );

    GuardarCarta(usuario, carta, (err, data) => {
      if (err) {
        done(err);
      } else {
        EliminarCarta(usuario, carta.id, (err, data) => {
          expect(err).to.be.undefined;
          expect(data).to.equal(`Carta con ID ${carta.id} eliminada y archivo ./src/EjerciciosCarta/usuarios/${usuario}/${carta.id}.json borrado con éxito.`);

          // Verificar que la carta haya sido eliminada
          CargarCartas(usuario, (err, coleccion) => {
            expect(err).to.be.undefined;
            expect(coleccion).to.be.an('array').that.is.empty;
            done();
          });
        });
      }
    });
  });

  it('Debería retornar un error si la carta no existe al intentar eliminar', (done) => {
    const usuario = 'usuario_prueba';
    const idCartaNoExistente = 999;

    EliminarCarta(usuario, idCartaNoExistente, (err, data) => {
      expect(err).to.not.be.undefined;
      expect(data).to.be.undefined;
      done();
    });
  });
});



describe('EventEmitterSocket', () => {
  it('Should emit a "peticion" event when receiving valid JSON data', (done) => {
    const connection = new EventEmitter();
    const eventEmitterSocket = new EventEmitterSocket(connection);

    const testData = {
      accion: 'añadir',
      carta: {
        id: 1,
        nombre: 'Carta de Prueba',
        coste_mana: 3,
        color: 'Azul',
        tipo: 'Criatura',
        rareza: 'Rara',
        texto_reglas: 'Texto de reglas de la carta de prueba',
        valor_mercado: 10,
        fuerza: 3,
        resistencia: 3,
        marcas_lealtad: undefined,
      },
      usuario: 'usuarioEjemplo',
      fin: 'FIN',
    };

    eventEmitterSocket.on('peticion', (peticion, connection) => {
      expect(peticion).to.deep.equal(testData);
      done();
    });

    connection.emit('data', JSON.stringify(testData));
  });

  it('Should emit a "close" event when the connection is closed', (done) => {
    const connection = new EventEmitter();
    const eventEmitterSocket = new EventEmitterSocket(connection);

    eventEmitterSocket.on('close', () => {
      done();
    });

    connection.emit('close');
  });
});