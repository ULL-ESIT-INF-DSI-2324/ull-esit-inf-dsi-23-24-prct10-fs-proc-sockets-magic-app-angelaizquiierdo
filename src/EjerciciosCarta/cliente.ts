import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import chalk from "chalk";
import {
  Carta,
  Color,
  LineaTipo,
  Rareza,
  ImprimirCarta,
} from "./cartas_magic.js";
import net from "net";

let info = "";
/**
 * Comando para añadir una carta a la colección.
 */
let argv = yargs(hideBin(process.argv))
  .command(
    "añadir",
    "Añade una carta a la colección",
    {
      usuario: {
        describe: "Usuario que compro la carta coleccionable de la carta.",
        demandOption: true,
        type: "string",
      },
      id: {
        describe: "Debe ser un valor numérico único que identifica la carta.",
        demandOption: true,
        type: "number",
      },
      nombre: {
        describe: "Cadena con el nombre de la carta coleccionable.",
        demandOption: true,
        type: "string",
      },
      coste_mana: {
        description: "Numero con el costo de maná de la carta coleccionable.",
        type: "number",
        demandOption: true,
      },
      color: {
        description:
          "Color de la carta coleccionable que se quiere añadir, que puede ser  blanco, azul, negro, rojo, verde, incoloro o multicolor.",
        type: "string",
        choices: Object.values(Color),
        demandOption: true,
      },
      tipo: {
        description:
          "Línea de tipo de la carta coleccionable que se quiere añadir, que puede ser Tierra, Criatura, Ecantamiento, Conjuro, Instantáneo, Artefacto o Planeswalker.Si la carta es de tipo  criatura se debe incluir  --fuerza y --resistencia. Si la carta es de tipo Planeswalker se debe incluir --marcasdelealtad.",
        type: "string",
        choices: Object.values(LineaTipo),
        demandOption: true,
      },
      rareza: {
        description:
          "Rareza de la carta coleccionable que se quiere añadir ,que puede ser común, infrecuente, rara o mítica.",
        type: "string",
        choices: Object.values(Rareza),
        demandOption: true,
      },
      textoregla: {
        description:
          "Cadena de texto que contiene descripcion de los efectos de la carta y cualquier regla especial que tenga.",
        type: "string",
        demandOption: true,
      },
      fueza: {
        description:
          "Valor númerico de la fuerza que solo se incluyen si el --tipo Criatura.",
        type: "number",
        demandOption: false,
      },
      resistencia: {
        description:
          "Valor númerico de la resistencia que solo se incluye si el --tipo Criatura.",
        type: "number",
        demandOption: false,
      },
      marcas_lealtad: {
        description:
          "Valor númerico de marca de lealtad que solo se incluye si el --tipo Planeswalker.",
        type: "number",
        demandOption: false,
      },
      valormercado: {
        description:
          "Valor numérico que indica el valor de la carta en el mercado.",
        type: "number",
        demandOption: true,
      },
    },
    (argv) => {
      if (!Object.values(Color).includes(argv.color)) {
        throw chalk.red(new Error("Color debe ser un color válido"));
      }

      if (!Object.values(LineaTipo).includes(argv.tipo)) {
        throw chalk.red(new Error("Tipo debe ser un tipo válido"));
      }

      if (!Object.values(Rareza).includes(argv.rareza)) {
        throw chalk.red(new Error("Rareza debe ser una rareza válida"));
      }

      if (argv.tipo === "Criatura" && argv.fuerza_resistencia === undefined) {
        throw new Error("Criatura necesito el atributo de fuerza/resistencia");
      }
      if (argv.tipo === "Planeswalker" && argv.marcas_lealtad === undefined) {
        throw new Error("Planeswalker necesita la marca de lealtad");
      }
      const carta: Carta = new Carta(
        argv.id,
        argv.nombre,
        argv.coste_mana,
        argv.color,
        argv.tipo,
        argv.rareza,
        argv.textoregla,
        argv.fueza,
        argv.resistencia,
        argv.marcas_lealtad,
        argv.valormercado,
      );
      info = JSON.stringify({
        accion: "añadir",
        carta: carta,
        usuario: argv.usuario,
        fin: "FIN",
      });
      //cliente.write(info);
    },
  )
  .help().argv;

/**
 * Comando para mostrar una carta de la colección.
 */
argv = yargs(hideBin(process.argv))
  .command(
    "mostrar",
    "Muestra una carta de la colección",
    {
      usuario: {
        describe: "Usuario que compro la carta coleccionable de la carta.",
        demandOption: true,
        type: "string",
      },
      id: {
        describe: "Debe ser un valor numérico único que identifica la carta.",
        demandOption: true,
        type: "number",
      },
    },
    (argv) => {
      info = JSON.stringify({
        accion: "mostrar",
        id: argv.id,
        usuario: argv.usuario,
        fin: "FIN",
      });
    },
  )
  .help().argv;

/**
 * Comando para listar todas las cartas de la colección.
 */
argv = yargs(hideBin(process.argv))
  .command(
    "lista",
    "Muestra todas las cartas de la colección",
    {
      usuario: {
        describe: "Usuario que compro la carta coleccionable de la carta.",
        demandOption: true,
        type: "string",
      },
    },
    (argv) => {
      info = JSON.stringify({
        accion: "listar",
        usuario: argv.usuario,
        fin: "FIN",
      });
      // cliente.write(info);
    },
  )
  .help().argv;

/**
 * Comando para eliminar una carta de la colección.
 */
argv = yargs(hideBin(process.argv))
  .command(
    "eliminar",
    "Elimina una carta de la colección",
    {
      usuario: {
        describe: "Usuario que compro la carta coleccionable de la carta.",
        demandOption: true,
        type: "string",
      },
      id: {
        describe: "Debe ser un valor numérico único que identifica la carta.",
        demandOption: true,
        type: "number",
      },
    },
    (argv) => {
      info = JSON.stringify({
        accion: "eliminar",
        id: argv.id,
        usuario: argv.usuario,
        fin: "FIN",
      });
      //cliente.write(info);
    },
  )
  .help().argv;

/**
 * Comando para actualizar una carta de la colección.
 */
argv = yargs(hideBin(process.argv))
  .command(
    "actualizar",
    "Actualiza una carta a la colección",
    {
      usuario: {
        describe: "Usuario que compro la carta coleccionable de la carta.",
        demandOption: true,
        type: "string",
      },
      id: {
        describe: "Debe ser un valor numérico único que identifica la carta.",
        demandOption: true,
        type: "number",
      },
      nombre: {
        describe:
          "Cadena con el Cadena con el nombre de la carta coleccionable. coleccionable.",
        demandOption: true,
        type: "string",
      },
      coste_mana: {
        description: "Numero con el costo de maná de la carta coleccionable.",
        type: "number",
        demandOption: true,
      },
      color: {
        description:
          "Color de la carta coleccionable que se quiere añadir, que puede ser  blanco, azul, negro, rojo, verde, incoloro o multicolor.",
        type: "string",
        choices: Object.values(Color),
        demandOption: true,
      },
      tipo: {
        description:
          "Línea de tipo de la carta coleccionable que se quiere añadir, que puede ser Tierra, Criatura, Ecantamiento, Conjuro, Instantáneo, Artefacto o Planeswalker.Si la carta es de tipo  criatura se debe incluir  --fuerza y --resistencia. Si la carta es de tipo Planeswalker se debe incluir --marcasdelealtad.",
        type: "string",
        choices: Object.values(LineaTipo),
        demandOption: true,
      },
      rareza: {
        description:
          "Rareza de la carta coleccionable que se quiere añadir ,que puede ser común, infrecuente, rara o mítica.",
        type: "string",
        choices: Object.values(Rareza),
        demandOption: true,
      },
      texto_reglas: {
        description:
          "Cadena de texto que contiene descripcion de los efectos de la carta y cualquier regla especial que tenga.",
        type: "string",
        demandOption: true,
      },
      fuerza: {
        description:
          "Valor númerico de la fuerza que solo se incluyen si es --tipo Criatura.",
        type: "number",
        demandOption: false,
      },
      resistencia: {
        description:
          "Valor númerico de la resistencia que solo se incluyen si es --tipo Criatura.",
        type: "number",
        demandOption: false,
      },
      marcas_lealtad: {
        description:
          "Valor númerico de marca de lealtad que solo se incluye si el --tipo Planeswalker.",
        type: "number",
        demandOption: false,
      },
      valor_mercado: {
        description:
          "Valor numérico que indica el valor de la carta en el mercado.",
        type: "number",
        demandOption: true,
      },
    },
    (argv) => {
      if (argv.tipo === "Criatura" && argv.fuerza_resistencia === undefined) {
        throw new Error("Criatura necesito el atributo de fuerza/resistencia");
      }
      if (argv.tipo === "Planeswalker" && argv.marcas_lealtad === undefined) {
        throw new Error("Planeswalker necesita la marca de lealtad");
      }
      const carta: Carta = new Carta(
        argv.id,
        argv.nombre,
        argv.coste_mana,
        argv.color,
        argv.tipo,
        argv.rareza,
        argv.texto_reglas,
        argv.fuerza,
        argv.resistencia,
        argv.marcas_lealtad,
        argv.valor_mercado,
      );
      info = JSON.stringify({
        accion: "actualizar",
        carta: carta,
        usuario: argv.usuario,
        fin: "FIN",
      });
      //cliente.write(info);
    },
  )
  .help().argv;

const cliente = net.connect({ port: 60300 }, () => {
  console.log("Conectado al servidor");
  cliente.write(info);
  //cliente.write(JSON.stringify({ tipo: "FIN" }));
});

let wholeData = "";
cliente.on("data", (dataChunk) => {
  wholeData += dataChunk;
});

cliente.on("end", () => {
  const respuesta = JSON.parse(wholeData);
  let receivedData: string[];
  switch (respuesta.tipo) {
    case "Error":
      console.log(chalk.red(respuesta.respuesta));
      break;
    case "Success":
      console.log(chalk.green(respuesta.respuesta));
      break;
    case "SuccessCartas":
      receivedData = JSON.parse(respuesta.respuesta);
      receivedData.forEach((carta: string) => {
        console.log(`--------------------------------`);
        ImprimirCarta(carta);
      });
      console.log(`--------------------------------`);
      break;
    case "SuccessCarta":
      receivedData = JSON.parse(respuesta.respuesta);
      console.log(`--------------------------------`);
      ImprimirCarta(receivedData.toString());
      console.log(`--------------------------------`);
      break;
  }
});

cliente.on("close", () => {
  console.log("Conexion cerrada");
});
