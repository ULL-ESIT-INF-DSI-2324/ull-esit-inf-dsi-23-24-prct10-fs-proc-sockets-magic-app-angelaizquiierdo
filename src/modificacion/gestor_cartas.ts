import fs from "fs";
import { Carta, ImprimirCarta } from "./cartas_magic.js";
import chalk from "chalk";
import path from "path";

/**
 * Función para guardar una carta en la colección del usuario.
 * @param usuario Nombre del usuario.
 * @param carta Carta a guardar.
 */
export const GuardarCarta = (
  usuario: string,
  carta: Carta,
  callback: (err: string | undefined, data: string | undefined) => void,
) => {
  const directorioUsuario = `./src/modificacion/usuarios/${usuario}`;
  const rutaCarta = `${directorioUsuario}/${carta.id}.json`;
  fs.access(directorioUsuario, fs.constants.F_OK, (err) => {
    if (err) {
      // Si no existe, crear el directorio
      fs.mkdir(directorioUsuario, { recursive: true }, (err) => {
        if (err) {
          callback(
            `Error al crear el directorio del usuario: ${err}`,
            undefined,
          );
        } else {
          fs.writeFile(rutaCarta, JSON.stringify(carta), (err) => {
            if (err) {
              callback(`Error al guardar la carta: ${err.message}`, undefined);
            } else {
              callback(
                undefined,
                `Se ha creado el directorio y guardado correctamente en el usuario: ${usuario}`,
              );
            }
          });
        }
      });
    } else {
      fs.writeFile(rutaCarta, JSON.stringify(carta), (err) => {
        if (err) {
          callback(`Error al guardar la carta: ${err.message}`, undefined);
        } else {
          callback(
            undefined,
            `Se ha guardado correctamente en el usuario:  ${usuario}`,
          );
        }
      });
    }
  });
  //fs.writeFile(rutaCarta, JSON.stringify(carta));
};
