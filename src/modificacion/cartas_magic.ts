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
export interface Carta {
  id: number;
  nombre: string;
  costeMana: number;
  color: Color;
  Lineatipo: LineaTipo;
  rareza: Rareza;
  textoReglas: string;
  fuerza?: number;
  resistencia?: number;
  marcasLealtad?: number;
  valorMercado: number;
}

/**
 * Función que imprime los detalles de una carta.
 * @param carta La carta a imprimir.
 * @returns Una cadena con los detalles de la carta.
 */
export function ImprimirCarta(carta: Carta): string {
  // Construir la cadena de salida con los datos de la carta
  const output = `ID: ${carta.id}
Nombre: ${carta.nombre}
Costo de mana: ${carta.costeMana}
Color: ${carta.color}
Linea Tipo: ${carta.Lineatipo}
Rareza: ${carta.rareza}
Texto Reglas: ${carta.textoReglas}
Valor Mercado: ${carta.valorMercado}
${carta.fuerza !== undefined ? `Fuerza: ${carta.fuerza}` : ""}
${carta.resistencia !== undefined ? `Resistencia: ${carta.resistencia}` : ""}
${carta.marcasLealtad !== undefined ? `Marcas de lealtad: ${carta.marcasLealtad}` : ""}
`;

  return output.trim(); // Eliminar espacios en blanco adicionales al final y al inicio
}

/**
 * Función que crea una carta con los campos proporcionados.
 * @param id El ID de la carta.
 * @param nombre El nombre de la carta.
 * @param costeMana El coste de mana de la carta.
 * @param color El color de la carta.
 * @param tipo El tipo de línea de la carta.
 * @param rareza La rareza de la carta.
 * @param textoReglas El texto de reglas de la carta.
 * @param valorMercado El valor de mercado de la carta.
 * @param fuerza La fuerza de la carta (solo si el tipo es "Criatura").
 * @param resistencia La resistencia de la carta (solo si el tipo es "Criatura").
 * @param marcasLealtad Las marcas de lealtad de la carta (solo si el tipo es "Planeswalker").
 * @returns La carta creada.
 * @throws Si se proporcionan campos incorrectos para el tipo de carta.
 */
export function CrearCarta(
  id: number,
  nombre: string,
  costeMana: number,
  color: Color,
  tipo: LineaTipo,
  rareza: Rareza,
  textoReglas: string,
  valorMercado: number,
  fuerza?: number,
  resistencia?: number,
  marcasLealtad?: number,
): Carta {
  // Verifica si la carta es de tipo Criatura
  const esCriatura = tipo === LineaTipo.Criatura;

  // Verifica si la carta es de tipo Planeswalker
  const esPlaneswalker: boolean = tipo === LineaTipo.Planeswalker;

  // Si es Criatura, verifica que se proporcionen fuerza y resistencia
  if (esCriatura && (fuerza === undefined || resistencia === undefined)) {
    throw new Error(
      "Las criaturas deben tener valores de fuerza y resistencia.",
    );
  }

  // Si es Planeswalker, verifica que se proporcione la marca de lealtad
  if (esPlaneswalker && marcasLealtad === undefined) {
    throw new Error(
      "Los Planeswalkers deben tener un valor de marcas de lealtad.",
    );
  }

  const carta: Carta = {
    id: id,
    nombre: nombre,
    costeMana: costeMana,
    color: color,
    Lineatipo: tipo,
    rareza: rareza,
    textoReglas: textoReglas,
    valorMercado: valorMercado,
  };

  // Añade los campos opcionales si corresponde
  if (esCriatura) {
    carta.fuerza = fuerza!;
    carta.resistencia = resistencia!;
  }

  if (esPlaneswalker) {
    carta.marcasLealtad = marcasLealtad!;
  }

  return carta;
}
