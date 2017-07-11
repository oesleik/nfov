## NFOV
NPC Field of View

## Instalação

Faça o download da última versão em [https://github.com/oesleik/nfov](https://github.com/oesleik/nfov) e inclua o código fonte:

```javascript
<script src="nfov/dist/nfov.min.js"></script>
```

## Utilização

Primeiro é necessário criar uma instância com as configurações desejadas:

```javascript
var nfov = new NFOV({ ... })
```

Com a instância criada, basta chamar o método `detect` dentro do loop principal do jogo:

```javascript
nfov.detect(agent, targets, function (agent, target) {
  // do something...
})
```

## Configurações

`distance` default `0`<br />
Distância máxima do raio de visão do agente.

`angle` default `0`<br />
Ângulo máximo de visão do agente.

`angleUnit` default `NFOV.RADIANS`<br />
Unidade de medida do ângulo (`NFOV.RADIANS` ou `NFOV.DEGREES`).

`orientation` default `NFOV.COUNTERCLOCKWISE`<br />
Sentido da orientação do ângulo (`NFOV.COUNTERCLOCKWISE` ou `NFOV.CLOCKWISE`).

`grid` default `null`<br />
Tilemap do cenário no formato de um array de 2 dimensões. Ex:
```javascript
[[1, 1, 1, 1, 1],
 [1, 0, 0, 0, 1],
 [1, 0, 0, 0, 1],
 [1, 0, 0, 0, 1],
 [1, 1, 1, 1, 1]]
```

`tileSize` default `{ width: 1, height: 1 }`<br />
Objeto com as dimensões dos tiles do tilemap no formato `{ width, height }`.

`acceptableTiles` default `[]`<br />
Array com os valores dos tiles visíveis.

`handler` default `nfov/handlers/basic`<br />
Função responsável por detectar objetos no campo de visão dos agentes.

## Métodos

`setDistance(distance)`<br />
Configura a distância máxima do raio de visão do agente.

`getDistance()`<br />
Obtém a distância máxima do raio de visão do agente.

`setAngle(angle)`<br />
Configura o ângulo máximo de visão do agente.

`getAngle(angleUnit)`<br />
Obtém o ângulo máximo de visão do agente na unidade de medida configurada. Caso o parâmetro `angleUnit` seja informado, o ângulo é convertido para o formato informado.

`setAngleUnit(angleUnit)`<br />
Configura a unidade de medida utilizada nos ângulos. Os valores possíveis são `NFOV.RADIANS` e `NFOV.DEGREES`.

`getAngleUnit()`<br />
Obtém a unidade de medida utilizada nos ângulos.

`setOrientation(orientation)`<br />
Configura o sentido da orientação utilizado nos ângulos. Os valores possíveis são `NFOV.COUNTERCLOCKWISE` e `NFOV.CLOCKWISE`.

`getOrientation()`<br />
Obtém o sentido da orientação utilizado nos ângulos.

`setGrid(grid)`<br />
Configura o tilemap do cenário no formato de um array de 2 dimensões. Ex:
```javascript
[[1, 1, 1, 1, 1],
 [1, 0, 0, 0, 1],
 [1, 0, 0, 0, 1],
 [1, 0, 0, 0, 1],
 [1, 1, 1, 1, 1]]
```

`getGrid()`<br />
Obtém o tilemap do cenário configurado.

`setTileSize(widthOrObject, height)`<br />
Configura as dimensões dos tiles. O parâmetro `widthOrObject` pode ser um valor numérico representando a largura dos tiles ou um objeto no formato `{ width, height }`.

`getTileSize()`<br />
Obtém o objeto com as dimensões dos tiles no formato `{ width, height }`.

`setAcceptableTiles(tiles)`<br />
Configura um array com os tiles visíveis.

`getAcceptableTiles()`<br />
Obtém um array com os tiles visíveis.

`setHandler(handler)`<br />
Configura a função responsável por detectar objetos no campo de visão dos agentes. Esta função recebe como parâmetros a instância atual, os agentes, os objetos-alvo e a função de callback. Ex:
```javascript
function handler (nfovInstance, agents, targets, callback) {
  // code...
}
```

`getHandler()`<br />
Obtém a função responsável por detectar objetos no campo de visão dos agentes.

`detect(agents, targets, callback)`<br />
Método responsável por detectar objetos no campo de visão do agente. Os parâmetros `agents` e `targets` podem ser informados como
 um objeto ou como um array de objetos, respeitando as propriedades necessárias para cada um, conforme apresentado mais abaixo.

O parâmetro `callback` referencia a função que será chamada quando um objeto estiver dentro do campo de visão de um agente recebendo como parâmetros o agente e objeto-alvo em questão. Ex:
```javascript
function (agent, target) {
  console.log(agent.name + ' can see ' + target.name)
}
```

## Objeto `agent`

Sprites utilizadas pelo *Phaser* ou *Pixi* são suportadas sem necessidade de configurações adicionais.

`x`<br />
Coordenada do agente no eixo x.

`y`<br />
Coordenada do agente no eixo y.

`width`<br />
Largura do agente.

`height`<br />
Altura do agente.

`distance` Opcional<br />
Distância máxima do raio de visão do agente. Caso não informado, é utilizado o valor configurado na instância.

`maxAngle` Opcional<br />
Ângulo máximo de visão do agente. Caso não informado, é utilizado o valor configurado na instância.

`direction` Opcional default `0`<br />
Direção em que o agente está apontando. O valor `0` indica o lado direito, isto é, x positivo e y `0`.

## Objeto `target`

Sprites utilizadas pelo *Phaser* ou *Pixi* são suportadas sem necessidade de configurações adicionais.

`x`<br />
Coordenada do objeto no eixo x.

`y`<br />
Coordenada do objeto no eixo y.

`width`<br />
Largura do objeto.

`height`<br />
Altura do objeto.
