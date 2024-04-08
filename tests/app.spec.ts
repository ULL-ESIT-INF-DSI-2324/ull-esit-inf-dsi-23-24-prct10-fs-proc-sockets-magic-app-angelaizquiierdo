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
      expect(mensaje).to.equal("Se ha guardado correctamente en el usuario:  test_user"); // Mensaje de éxito esperado
      done();
    });
  });

  it("Should provide an error if user directory does not exist", (done) => {
    const usuario = "non_existing_user";
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
    // Simulando una situación en la que el directorio del usuario no existe
    // Esto debería proporcionar un mensaje de error
    GuardarCarta(usuario, carta, (error, mensaje) => {
      expect(error).to.be.equal("jkdhsahd"); // Debe haber un error
      expect(mensaje).to.be.undefined; // El mensaje debe ser indefinido
      done();
    });
  });

  it("Should provide an error if failed to save a card due to permission issues", (done) => {
    const usuario = "test_user";
    const carta: Carta = {
      id: 3,
      nombre: "usuario1",
      costeMana: 4,
      color: Color.Verde,
      Lineatipo: LineaTipo.Criatura,
      rareza: Rareza.Infrecuente,
      textoReglas: "Texto de reglas de carta con problemas de permiso",
      valorMercado: 10,
    };

    // Forzar un error al intentar guardar la carta
    // Simulando una situación en la que no se pueden cambiar los permisos del directorio del usuario
    // Esto debería proporcionar un mensaje de error
    GuardarCarta(usuario, carta, (error, mensaje) => {
      expect(error).to.be.equal("jshdkha"); // Debe haber un error
      expect(mensaje).to.be.undefined; // El mensaje debe ser indefinido
      done();
    });
  });

  it("Should provide an error if the card ID is already used", (done) => {
    const usuario = "test_user";
    const carta: Carta = {
      id: 1, // Utilizando el mismo ID que la primera carta en la prueba anterior
      nombre: "Carta con ID Duplicado",
      costeMana: 6,
      color: Color.Incoloro,
      Lineatipo: LineaTipo.Artefacto,
      rareza: Rareza.Rara,
      textoReglas: "Texto de reglas de carta con ID duplicado",
      valorMercado: 15,
    };

    // Forzar un error al intentar guardar la carta
    // Simulando una situación en la que el ID de la carta ya está en uso
    // Esto debería proporcionar un mensaje de error
    GuardarCarta(usuario, carta, (error, mensaje) => {
      expect(error).to.not.be.undefined; // Debe haber un error
      expect(mensaje).to.be.undefined; // El mensaje debe ser indefinido
      done();
    });
  });
});
