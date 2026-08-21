// Variables -> Espacio en memoria para guardar un valor. 
// Contenedor de informacion, en algunos casos se puede modificar
// su contenido
// La variable generalmente tiene un tipo especifico

// js -> tipado dinamico, interpretado
// ts -> tipado dinamico opcional, transpilado (ts -> js)

// var - no usar var
var nombre = "javier"
// se redeclara
var nombre = 5

// let
// global
let apellido = "lopez"

function mandarina() {
    console.log(apellido)
    let fruta = "manzana"
}
mandarina()

// console.log(fruta)

// Const -> constante
// No puede ser redeclarada ni redefinida
// no se le pueden asignar valores nuevos
// se pueden modificar los datos solo si son: array, objetos
const num = 10
// num = 20

const zapatilla = { color: "negro", marca: "vans"}
zapatilla.color = "rojo"

console.log(zapatilla)

const zapatillas = [{ color: "negro", marca: "nike"}, { color: "rojo", marca: "fila"}]

zapatillas[1].color = "azul"

console.log(zapatillas);
