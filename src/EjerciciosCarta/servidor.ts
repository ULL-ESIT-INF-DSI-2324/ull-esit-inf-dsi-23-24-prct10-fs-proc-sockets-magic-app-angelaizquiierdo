import {
  GuardarCarta,
  CargarCartas,
  ActualizarCarta,
  MostrarCarta,
  EliminarCarta,
} from "./gestor_cartas.js";
import { Carta } from "./cartas_magic.js";
import { EventEmitter } from "events";
import net from "net";

export class EventEmitterSocket extends EventEmitter {
  /**
   * Constructor de la clase EventEmitterSocket.
   * @param connection La conexión EventEmitter asociada.
   */
  constructor(connection: EventEmitter) {
    super();
    let wholeData = "";
    connection.on("data", (dataChunk) => {
      wholeData += dataChunk;

      console.log("Datos recibidos del cliente: ", wholeData.toString());

      try {
        const peticion = JSON.parse(wholeData);
        if (peticion) {
          this.emit("peticion", peticion, connection);
        }
      } catch {
        console.log("Error al parsear los datos.");
      }
    });

    connection.on("close", () => {
      this.emit("close");
    });
  }
}

const server = net.createServer((connection) => {
  console.log("Un cliente se ha conectado.");

  const serverSocket = new EventEmitterSocket(connection);

  serverSocket.on("peticion", (peticion, connection) => {
    let carta: Carta;
    if (peticion.accion === "añadir" || peticion.accion === "actualizar") {
      carta = new Carta(
        peticion.carta.id,
        peticion.carta.nombre,
        peticion.carta.coste_mana,
        peticion.carta.color,
        peticion.carta.tipo,
        peticion.carta.rareza,
        peticion.carta.texto_reglas,
        peticion.carta.valor_mercado,
        peticion.carta.fuerza,
        peticion.carta.resistencia,
        peticion.carta.marcas_lealtad,
      );
    }

    console.log("Solicitud recibida: ", peticion.accion);
    switch (peticion.accion) {
      case "añadir":
        GuardarCarta(peticion.usuario, carta!, (error, resultado) => {
          if (error) {
            console.log("Error al guardar la carta: ", error);
            connection.write(
              JSON.stringify({ tipo: "Error", respuesta: error }),
            );
          } else {
            console.log("Carta guardada con éxito: ", resultado);
            connection.write(
              JSON.stringify({ tipo: "Success", respuesta: resultado }),
            );
          }
          connection.end();
        });
        break;
      case "actualizar":
        ActualizarCarta(
          peticion.usuario,
          peticion.id,
          carta!,
          (error, resultado) => {
            if (error) {
              console.log("Error al actualizar la carta: ", error);
              connection.write(
                JSON.stringify({ tipo: "Error", respuesta: error }),
              );
            } else {
              console.log("Carta actualizada con éxito: ", resultado);
              connection.write(
                JSON.stringify({ tipo: "Success", respuesta: resultado }),
              );
            }
            connection.end();
          },
        );
        break;
      case "eliminar":
        EliminarCarta(peticion.usuario, peticion.id, (error, resultado) => {
          if (error) {
            connection.write(
              console.log("Error al eliminar la carta: ", error),
              JSON.stringify({ tipo: "Error", respuesta: error }),
            );
          } else {
            console.log("Carta eliminada con éxito: ", resultado);
            connection.write(
              JSON.stringify({ tipo: "Success", respuesta: resultado }),
            );
          }
          connection.end();
        });
        break;
      case "listar":
        CargarCartas(peticion.usuario, (error, resultado) => {
          if (error) {
            console.log("Error al cargar las cartas: ", error);
            connection.write(
              JSON.stringify({ tipo: "Error", respuesta: error }),
            );
          } else {
            console.log("Cartas cargadas con éxito: ", resultado);
            connection.write(
              JSON.stringify({ tipo: "SuccessCartas", respuesta: resultado }),
            );
          }
          connection.end();
        });
        break;
      case "mostrar":
        MostrarCarta(peticion.usuario, peticion.id, (error, resultado) => {
          if (error) {
            console.log("Error al mostrar la carta: ", error);
            connection.write(
              JSON.stringify({ tipo: "Error", respuesta: error }),
            );
          } else {
            console.log("Carta mostrada con éxito: ", resultado);
            connection.write(
              JSON.stringify({ tipo: "SuccessCarta", respuesta: resultado }),
            );
          }
          connection.end();
        });
        break;
      default:
        connection.write(console.log("Accion invalida"));
        connection.end();
    }
  });

  serverSocket.on("close", () => {
    console.log("Un cliente se ha desconectado");
  });
});
server.listen(60300, () => {
  console.log("Esperando que los clientes se conecten.");
});
