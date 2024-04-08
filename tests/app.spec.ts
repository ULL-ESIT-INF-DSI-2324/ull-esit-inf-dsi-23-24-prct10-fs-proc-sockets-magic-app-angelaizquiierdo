import { expect } from "chai";
import { Carta, Color, LineaTipo, Rareza } from "../src/modificacion/cartas_magic.js";
import { GuardarCarta } from "../src/modificacion/gestor_cartas.js";

describe("GuardarCarta function tests", () => {
  it("Should save a card without errors", (done) => {
    const usuario = "test_user";
    const carta: Carta = {
      id: 1,
      nombre: "Carta de Prueba",
      costeMana: 2,
      color: Color.Azul,
      Lineatipo: LineaTipo.Criatura,
      rareza: Rareza.Rara,
      textoReglas: "Texto de reglas de prueba",
      valorMercado: 5,
    };

    GuardarCarta(usuario, carta, (error, mensaje) => {
      expect(error).to.be.undefined; // No debe haber errores
      expect(mensaje).to.equal("La carta ha sido guardada correctamente."); // Mensaje de éxito esperado
      done();
    });
  });

  it("Should provide an error if failed to save a card", (done) => {
    const usuario = "test_user";
    const carta: Carta = {
      id: 2,
      nombre: "Otra Carta de Prueba",
      costeMana: 3,
      color: Color.Rojo,
      Lineatipo: LineaTipo.Conjuro,
      rareza: Rareza.Comun,
      textoReglas: "Texto de reglas de otra prueba",
      valorMercado: 8,
    };

    // Forzar un error al intentar guardar la carta
    // Esto simula una situación en la que no se puede escribir en el directorio
    // Esto debería proporcionar un mensaje de error
    GuardarCarta(usuario, carta, (error, mensaje) => {
      expect(error).to.not.be.undefined; // Debe haber un error
      expect(mensaje).to.be.undefined; // El mensaje debe ser indefinido
      done();
    });
  });
});
