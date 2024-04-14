import chalk from "chalk";

/**
 * Enumeración de colores de las cartas.
 */
export enum Color {
  Blanco = "Blanco",
  Azul = "Azul",
  Negro = "Negro",
  Rojo = "Rojo",
  Verde = "Verde",
  Incoloro = "Incoloro",
  Multicolor = "Multicolor",
}

/**
 * Enumeración de los tipos de línea de las cartas.
 */
export enum LineaTipo {
  Tierra = "Tierra",
  Criatura = "Criatura",
  Encantamiento = "Encantamiento",
  Conjuro = "Conjuro",
  Instantaneo = "Instantaneo",
  Artefacto = "Artefacto",
  Planeswalker = "Planeswalker",
}

/**
 * Enumeración de las rarezas de las cartas.
 */
export enum Rareza {
  Comun = "Comun",
  Infrecuente = "Infrecuente",
  Rara = "Rara",
  Mitica = "Mitica",
}

/**
 * Interfaz que representa una carta.
 * @param id
 */
export interface Interfazcarta {
  id: number;
  nombre: string;
  costeMana: number;
  color: Color;
  Lineatipo: LineaTipo;
  rareza: Rareza;
  textoReglas: string;
  fuerza: number | undefined;
  resistencia: number | undefined;
  marcasLealtad: number | undefined;
  valorMercado: number;
}

export class Carta implements Interfazcarta {
  /**
   * Constructor de la clase Card.
   * @param id El ID de la carta.
   * @param nombre El nombre de la carta.
   * @param costemana El coste de mana de la carta.
   * @param color El color de la carta.
   * @param lineatipo El tipo de la carta.
   * @param rareza La rareza de la carta.
   * @param reglas Las reglas de la carta.
   * @param fuerza El poder de la carta (solo para criaturas).
   * @param resistencia La resistencia de la carta (solo para criaturas).
   * @param marcasLealtad La lealtad de la carta (solo para planeswalkers).
   * @param valorMercado El valor de la carta.
   */
  constructor(
    public id: number,
    public nombre: string,
    public costemana: number,
    public color: Color,
    public lineatipo: LineaTipo,
    public rareza: Rareza,
    public reglas: string,
    public fuerza: number | undefined,
    public resistencia: number | undefined,
    public marcasLealtad: number | undefined,
    public valorMercado: number,
  ) {
    this.id = id;
    this.nombre = nombre;
    this.costemana = costemana;
    this.color = color;
    this.lineatipo = lineatipo;
    this.rareza = rareza;
    if (this.lineatipo === LineaTipo.Criatura) {
      if (fuerza === undefined || resistencia === undefined) {
        throw new Error(
          "Una carta del tipo CRIATURA debe de tener asociada un atributo de fuerza/resistencia.",
        );
      }
      this.fuerza = fuerza;
      this.resistencia = resistencia;
    } else if (this.lineatipo === LineaTipo.Planeswalker) {
      if (marcasLealtad === undefined) {
        throw new Error(
          "Una carta del tipo PLANESWALKER debe de tener asociada un atributo de lealtad.",
        );
      }
      this.marcasLealtad = marcasLealtad;
    }
    this.valorMercado = valorMercado;
  }
  costeMana: number;
  Lineatipo: LineaTipo;
  textoReglas: string;

  /**
   * Método que devuelve una representación en cadena de las características de la carta.
   * @returns Una cadena que contiene las características de la carta.
   */
  attributes(): string {
    let attributes = "Card Attributes:\n";
    attributes += `ID: ${this.id}\n`;
    attributes += `Name: ${this.nombre}\n`;
    attributes += `Mana: ${this.costemana}\n`;
    attributes += `Color: `;
    switch (this.color) {
      case Color.Blanco:
        attributes += chalk.white(this.color) + "\n";
        break;
      case Color.Azul:
        attributes += chalk.blue(this.color) + "\n";
        break;
      case Color.Negro:
        attributes += chalk.black(this.color) + "\n";
        break;
      case Color.Rojo:
        attributes += chalk.red(this.color) + "\n";
        break;
      case Color.Verde:
        attributes += chalk.green(this.color) + "\n";
        break;
      case Color.Incoloro:
        attributes += chalk.gray(this.color) + "\n";
        break;
      case Color.Multicolor:
        attributes += chalk.yellow(this.color) + "\n";
        break;
      default:
        attributes += this.color + "\n";
    }
    attributes += `Linea de tipo: ${this.lineatipo}\n`;
    attributes += `Rareza: ${this.rareza}\n`;
    attributes += `Reglas: ${this.reglas}\n`;
    if (this.fuerza !== undefined && this.resistencia !== undefined)
      attributes += `Fueza: ${this.fuerza}, Resistencia: ${this.resistencia}\n`;
    if (this.marcasLealtad !== undefined)
      attributes += `marcasLealtad: ${this.marcasLealtad}\n`;
    attributes += `valorMercado: ${this.valorMercado}\n`;
    return attributes;
  }
}

export function ImprimirCarta(carta_string: string): void {
  // Convertir el string a JSON
  const carta_json = JSON.parse(carta_string);

  // Suma de los atributos de las cartas
  let resultado = "";
  resultado += `Id: ${carta_json.id}\n`;
  resultado += `Nombre: ${carta_json.nombre}\n`;
  resultado += `Coste de maná: ${carta_json.costemana}\n`;
  resultado += `Color: ${carta_json.color}\n`;
  resultado += `Linea de tipo: ${carta_json.lineatipo}\n`;
  resultado += `Rareza: ${carta_json.rareza}\n`;
  resultado += `Texto de reglas: ${carta_json.reglas}\n`;

  if (carta_json.lineatipo === "Criatura") {
    // Mostrar la fuerza y resistencia de la criatura
    resultado += `Fuerza/Resistencia: ${carta_json.fuerza}\n`;
    resultado += `Resistencia: ${carta_json.resistencia}\n`;
  }
  if (carta_json.lineatipo === "Planeswalker") {
    // Mostrar las marcas de lealtad del planeswalker
    resultado += `Marcas de lealtad: ${carta_json.marcasLealtad}\n`;
  }
  resultado += `Valor de mercado: ${carta_json.valorMercado}\n`;

  switch (
    carta_json.color // Mostrar el color de la carta
  ) {
    case "Blanco":
      console.log(chalk.white(resultado));
      break;
    case "Azul":
      console.log(chalk.blue(resultado));
      break;
    case "Negro":
      console.log(chalk.black(resultado));
      break;
    case "Rojo":
      console.log(chalk.red(resultado));
      break;
    case "Verde":
      console.log(chalk.green(resultado));
      break;
    case "Incoloro":
      console.log(chalk.gray(resultado));
      break;
    case "Multicolor":
      console.log(chalk.yellow(resultado));
      break;
    default:
      console.log(chalk.red(`No existe esta ese color ${carta_json}`));
      break;
  }
}
