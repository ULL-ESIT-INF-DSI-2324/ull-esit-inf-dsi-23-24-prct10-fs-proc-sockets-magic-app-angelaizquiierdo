[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/7bX30zK4)

# Práctica 10: Aplicación cliente-servidor para coleccionistas de cartas Magic

# Indice

## Configuracion del entorno

Lo primero que hago es instalar las dependencias de desarrollo.

Instala la versión más reciente de Node.js. `nvm install node` y en Codespaces de Github se tiene que instalar `npm install --global typescript` para poder compilar el código typescripts.

Inicialiamos un nuevo proyecto de Node.js, con la este comando `npm init --yes` se creará un entorno de ejecución, lo que se creará un archivo **package.json** con la configuración predeterminada.

Luego, inicialiciamos un archivo de configuración **tsconfig.json** para esta práctica `tsc --init`, que permite configurar el comportamiento del compilador de TypeScript.

Para configurarlo para hacer uso de **módulo ESM**, lo que se tiene que configurar el fichero **package.json** para establecer la propiedad `type` al valor module:

```json
{
  "name": "ull-esit-inf-dsi-23-24-prct09-filesystem-magic-app-angelaizquiierdo",
  "version": "1.0.0",
  "description": "[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/T5K9tzcv)",
  "main": "ejercicio-1/cliente.js",
  "type": "module",
  "scripts": {
    "dev": "tsc-watch --onSuccess \"node dist/ejercicio-1/cliente.js\"",
    "doc": "typedoc",
    "test": "mocha",
    "coverage": "c8 npm test && c8 report --reporter=lcov"
  }
}
```

Y el modificar el fichero de configuración del **compilador de TypeScript - tsconfig.json** para modificar la propiedad module, asígnándole el valor **node16**. Quedando de la siguiente manera:

```json
{
  "exclude": ["./tests", "./node_modules", "./dist"],
  "compilerOptions": {
    "target": "es2022",
    "module": "node16",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true
  }
}
```

Luego instalamos **tsc-watch** para observar loss cambios en los archivos TypeScript y recompila automáticamente el código cuando se detectan cambios. `npm install --save-dev tsc-watch`.
Asi mismo instalamos más dependencias:

- Instalamos 2 paquetes de la heramienta **ESlint** especifico para nuestro proyecto **@typescript-eslint/eslint-plugin** y **@typescript-eslint/parser**. Intalamos el fichero de configuración con el comando `eslint --init`. Quedando la configuración de la siguiente manera el fichero que debemos editar es **.eslintrc.json**:

```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest"
  },
  "plugins": ["@typescript-eslint"],
  "rules": {}
}
```

- Instala **Prettier** y **eslint-config-prettier** para formatear de código junto con ESLint `npm i --save-dev prettier eslint-config-prettier`. Creamos un fichero de configuración de prettier llamado **.prettierrc.json** en donde añadimos los corchetes `{}`. Luego creamos un fichero donde ponemos los ficheros que no queremos que se formateen en este caso **.prettierignore.json**

```javascript
dist;
tests.nyc_output.github.eslintrc.json.pretterignore.prettierrc.json.mocharc
  .json;
package - lock.json;
package.json;
tsconfig.json;
typedoc.json;
README.md;
```

- Instala **Typedoc** para generar la documentación a partir de comentarios en el código fuente `npm install --save-dev typedoc`. Creamos el fichero **typedoc.json** para la configuracion de typedoc y como configuración es:

```json
{
  "entryPoints": ["./src/**/*.ts"],
  "out": "./docs"
}
```

- Instalamos **Mocha**, **Chai** para la realización de las pruebas unitarias y ts-node permite ejecutar archivos TypeScript directamente sin necesidad de compilarlos primero. `npm install --save-dev mocha chai@4.4.1 @types/mocha @types/chai ts-node`. Creamos el fichero **.mocharc.json** para la configuración de mocha para las pruebas unitarias con los modulos ESM quedando asi:

```json
{
  "extension": ["ts"],
  "spec": "tests/**/*.spec.ts",
  "loader": "ts-node/esm"
}
```

La última indica a Mocha que debe ejecutar las pruebas unitarias haciendo uso del cargador ESM de ts-node. También, deberá añadir la extensión .js a los módulos importados a través de las sentencias **import** incluidas en los ficheros `*.spec.ts` que definen las pruebas.

- Instalamos en **c8** es una herramienta de cobertura de código para Node.js `npm install --save-dev c8`, ya que `nyc` no se puede usar para los modulos ESM.

- Instalamos el paquete **chalk** es una biblioteca de Node.js que lo utilizaremos para dar formato y colorear el t
  exto en la terminal. Instalamos el paquete Chalk en el proyecto `npm install chalk` y instalamos tipos de chalk para tener soporte de TypeScript al utilizar Chalk necesita que sea como una dependencia de desarrollo. `npm install --save-dev @types/chalk`.

- Instalamos el paquete **yargs** que nos permite parsearle distintos argumentos pasados a un programa desde la línea de comandos. Instalamos el paquete Yargs en el proyecto` npm i yargs` y instalamos tipos de yargs para tener soporte de typescript al utilizar Yargs necesita que sea como una dependencia de desarrollo `npm i --save-dev @types/yargs`.

Luego creamos grupo de flujo en este caso [Github action](https://docs.github.com/en/actions), cubrimiento de código converalls y realizar un análisis de la calidad y seguridad de su código fuente a través de `Sonar Cloud`.

Para ello vamos a nuestro repositorio [Github](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct09-filesystem-magic-app-angelaizquiierdo.git), en la pestaña de **Actions** hacemos clic en "Set up a workflow" y selecciona "Simple workflow" y se nos generara un flujo de trabajo que lo editamos quedando asi el fichero **node.js.yml** :

```yml
name: Tests

on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["main"]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x, 18.x, 19.x, 20.x, 21.x]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm test
```

Después hacemos público el repositorio y en coveralls añadimos [este repositorio](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct09-filesystem-magic-app-angelaizquiierdo.git) para el ver el cubrimiento del codigo con los test unitarios de mocha y chai. Creamos en el directorio **./git/workflows** un flujo de trabajo de coveralls para enviar la información de cubrimiento a su plataforma para análisarlo y visualizarlo. Antes tenemos que agregar el secreto de nuestro token generado por coveralls en Github action para ulizarlo en nuevo flujo de trabajo.

```yml
name: Coveralls

on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["main"]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Cloning repo
        uses: actions/checkout@v4
      - name: Use Node.js 21.x
        uses: actions/setup-node@v4
        with:
          node-version: 21.x
      - name: Installing dependencies
        run: npm ci
      - name: Generating coverage information
        run: npm run coverage
      - name: Coveralls GitHub Action
        uses: coverallsapp/github-action@v2.2.3
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

Y configuramos el flujo de trabajo de sonarcloud, pero antes creamos un nuevo proyecto en SonarCloud para tu repositorio de GitHub y generar un token de acceso en SonarCloud: Ve a tu perfil de usuario en SonarCloud y genera un token de acceso. Este token se utilizará para autenticar el análisis de SonarCloud desde GitHub. Y agregamos el secretos `SONAR_TOKEN`: Este secreto debe contener el token de acceso generado en SonarCloud.

Creamos un archivo YAML para el flujo de trabajo en el directorio **.github/workflows** y el fichero lo llamamos sonarcloud.yml y editamos hasta que quede la siguiente configuración:

```yml
name: Sonar-Cloud
on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened]
jobs:
  sonarcloud:
    name: SonarCloud
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0 # Shallow clones should be disabled for a better relevancy of analysis
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # Needed to get PR information, if any
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```
Tenemos que instalar el paquete `@types/node` como dependencia de desarrollo para poder hacer uso de cualquiera de los módulos proporcionados por el API de Node.js, en este caso los sitema de ficheros.

## Desarrollo de la Aplicación

Siguiendo la practica 9 presenta un completo **gestor de cartas de Magic** con el fin de administrar las colecciones de cartas, en esta caso es una aplicación de servidor-cliente. En donde cada uno de los usuarios puede añadir cartas nuevas, actualizar de las cartas existentes, eliminar cartas y mostrar las cartas presentes en la colección o una carta individual de un usuario.


### Cliente.ts

Lo primero que hago es importar los modulos yargs, chalk, net, y tus propios módulos para manejar las cartas de Magic, luego defino los  yargs.command() para definir cada comando que el cliente puede ejecutar como hecho en la práctica 9. Y para que funcione el cliente-servidor, lo primero que hago es configurar la conexión TCP:

```ts
const cliente = net.connect({ port: 60300 }, () => { ... });// Establece una conexión TCP con el servidor en el puerto 60300.
```

Y el manejo de los eventos de conexion.
`data`: para escuchar los datos recibidpr del servidor.
`end`: se ejecuta cuando el servidor cierra la conexion
`close`: se ejecuta cuando la conexion se cierre completamente un fin de mensaje.

Interpreto los datos recibidos del servidor :Dependiendo del tipo de respuesta del servidor (Error, Success, SuccessCartas, SuccessCarta), se muestra un mensaje correspondiente en la consola.

### Servidor.ts

Lo primero importar los módulos, luego defino mi clase `EventEmitterSocket`

```ts
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
```
En mi clase constructor, establezco un listener para los eventos data y close de la conexión. Cuando se recibe un chunk de datos, se intenta parsear como JSON y, si tiene éxito, se emite el evento peticion con los datos parseados y la conexión asociada.

Luego creo un servidor TCP 

```ts
const server = net.createServer((connection) => {});
```
Que cuando se establece una conexión con un cliente, se instancia un objeto `EventEmitterSocket` asociado a esa conexión. Se define un listener para el evento peticion del objeto `EventEmitterSocket`. Y dependiendo del tipo de acción en la petición, se realiza la operación correspondiente utilizando las funciones importadas del archivo gestor_cartas.js.
Cuando se recibe la respuesta de la operación, se envía de vuelta al cliente a través de la conexión, y luego se cierra la conexión.
Se manejan los eventos close de la conexión en el servidor y se imprime un mensaje cuando un cliente se desconecta, y inicio el servidor escuchando por el puerto 60300.


### gestor_cartas.ts
Solo se ha cambiado con respecto a la practica 9 el hecho que sea funciones asincronas, con el uso de patrón callback.

### cartas_magic.ts 

Se ha mantenido igual con las enum y la intefaz, esta vez con la incorporación de una clase `Carta` aplicando el Principio de Responsabilidad Única ya que es la única responsabilidad representar una carta del juego Magic y proporcionar métodos relacionados con las características de esa carta.

Y cambie la funcion de ImprimirCarta separar la lógica de impresión de la lógica de conversión del string JSON.  

```ts

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

```
