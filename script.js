console.log(
	'El codigo es una locura porque hace un año no programo, pero funciona, creo... no critiquen asdfghjklñtrwq'
);

const tabla = document.getElementById('tabla');
const botonsito = document.getElementById('boton');
const parrafoxd = document.getElementById('parrafo');
const turno = document.getElementById('turnoActual');
// let bando = 'bl';
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
let bando = randomNumber(0, 1) ? 'bl' : 'ne';
let bandoPrincipal = bando;
let avanceDobleVerdadero = '';

ActualizarTurno(bando, turno);

botonsito.addEventListener('click', () => {
	parrafoxd.hidden = !parrafoxd.hidden;
});

const imagenes = {
	peon: {
		bl: '<img src="images/wp.png" alt="Peón blanco">',
		ne: '<img src="images/bp.png" alt="Peón negro">'
	},
	torre: {
		bl: '<img src="images/wr.png" alt="Torre blanca">',
		ne: '<img src="images/br.png" alt="Torre negra">'
	},
	caballo: {
		bl: '<img src="images/wn.png" alt="Caballo blanco">',
		ne: '<img src="images/bn.png" alt="Caballo negro">'
	},
	alfil: {
		bl: '<img src="images/wb.png" alt="Alfil blanco">',
		ne: '<img src="images/bb.png" alt="Alfil negro">'
	},
	reina: {
		bl: '<img src="images/wq.png" alt="Reina blanca">',
		ne: '<img src="images/bq.png" alt="Reina negra">'
	},
	rey: {
		bl: '<img src="images/wk.png" alt="Rey blanco">',
		ne: '<img src="images/bk.png" alt="Rey negro">'
	}
};

let fichas = [
	crearPieza('torre', 'bl', '1-1'),
	crearPieza('caballo', 'bl', '1-2'),
	crearPieza('alfil', 'bl', '1-3'),
	crearPieza('reina', 'bl', '1-5'),
	crearPieza('rey', 'bl', '1-4'),
	crearPieza('alfil', 'bl', '1-6'),
	crearPieza('caballo', 'bl', '1-7'),
	crearPieza('torre', 'bl', '1-8'),
	crearPieza('peon', 'bl', '2-1'),
	crearPieza('peon', 'bl', '2-2'),
	crearPieza('peon', 'bl', '2-3'),
	crearPieza('peon', 'bl', '2-4'),
	crearPieza('peon', 'bl', '2-5'),
	crearPieza('peon', 'bl', '2-6'),
	crearPieza('peon', 'bl', '2-7'),
	crearPieza('peon', 'bl', '2-8'),

	crearPieza('torre', 'ne', '8-1'),
	crearPieza('caballo', 'ne', '8-2'),
	crearPieza('alfil', 'ne', '8-3'),
	crearPieza('reina', 'ne', '8-5'),
	crearPieza('rey', 'ne', '8-4'),
	crearPieza('alfil', 'ne', '8-6'),
	crearPieza('caballo', 'ne', '8-7'),
	crearPieza('torre', 'ne', '8-8'),
	crearPieza('peon', 'ne', '7-1'),
	crearPieza('peon', 'ne', '7-2'),
	crearPieza('peon', 'ne', '7-3'),
	crearPieza('peon', 'ne', '7-4'),
	crearPieza('peon', 'ne', '7-5'),
	crearPieza('peon', 'ne', '7-6'),
	crearPieza('peon', 'ne', '7-7'),
	crearPieza('peon', 'ne', '7-8')
];

let peonseleccionado = undefined;

// creando tabla de ajedrez 8 x 8
for (let i = 1; i <= 8; i++) {
	let tr = document.createElement('tr');
	tabla.appendChild(tr);
	for (let j = 1; j <= 8; j++) {
		let td = document.createElement('td');
		td.id = `${i}-${j}`;
		tr.appendChild(td);
	}
}

// dibuja todas las fichas
fichas.forEach(pieza => {
	const [fila, columna] = pieza.posicion.split('-');
	tabla.rows[fila - 1].cells[columna - 1].innerHTML = imagenes[pieza.tipo][pieza.color];
});

if (bando === 'ne') {
	bando = 'bl';
	leTocaALaIaXD();
}

tabla.addEventListener('click', e => {
	// if (bando !== bandoPrincipal) {
	// 	return;
	// }
	// obtener el td mas cerca
	let event = e.target.closest('td');
	const posicionxd = event.id;
	// const [fila, columna] = posicionxd.split('-');
	const pieza = obtenerPieza(posicionxd);

	if (pieza) {
		if (peonseleccionado) {
			if (pieza.posicion === peonseleccionado.posicion) {
				document
					.getElementById(peonseleccionado.posicion)
					.classList.remove('seleccionado');
				peonseleccionado = undefined;
				document
					.querySelectorAll('.movimiento')
					.forEach(e => e.classList.remove('movimiento'));
				return;
			}
		}
		if (pieza.color === bando) {
			if (peonseleccionado) {
				document
					.getElementById(peonseleccionado.posicion)
					.classList.remove('seleccionado');
			}
			peonseleccionado = pieza;
			event.classList.add('seleccionado');
		} else {
			if (peonseleccionado) {
				if (puedeMoverse(peonseleccionado, posicionxd)) {
					if (!movimientoDejaReyEnJaque(peonseleccionado, posicionxd)) {
						document
							.getElementById(peonseleccionado.posicion)
							.classList.remove('seleccionado');
						moverPieza(peonseleccionado, posicionxd);
						peonseleccionado = undefined;
						bando = bando === 'bl' ? 'ne' : 'bl';
						ActualizarTurno(bando, turno);
						////////////////////////////////////////
						leTocaALaIaXD();
					} else {
						document
							.getElementById(peonseleccionado.posicion)
							.classList.remove('seleccionado');
						peonseleccionado = undefined;
					}
				} else {
					document
						.getElementById(peonseleccionado.posicion)
						.classList.remove('seleccionado');
					peonseleccionado = undefined;
				}
			}
		}
	} else if (peonseleccionado) {
		if (puedeMoverse(peonseleccionado, posicionxd)) {
			if (!movimientoDejaReyEnJaque(peonseleccionado, posicionxd)) {
				document
					.getElementById(peonseleccionado.posicion)
					.classList.remove('seleccionado');
				moverPieza(peonseleccionado, posicionxd);
				peonseleccionado = undefined;
				bando = bando === 'bl' ? 'ne' : 'bl';
				ActualizarTurno(bando, turno);

				////////////////////////////////////////
				leTocaALaIaXD();
			} else {
				document
					.getElementById(peonseleccionado.posicion)
					.classList.remove('seleccionado');
				peonseleccionado = undefined;
			}
		} else {
			document.getElementById(peonseleccionado.posicion).classList.remove('seleccionado');
			peonseleccionado = undefined;
		}
	}

	let seleccionado = document.querySelector('.seleccionado');
	document.querySelectorAll('.movimiento').forEach(e => e.classList.remove('movimiento'));
	if (seleccionado) {
		let [fila, columna] = seleccionado.id.split('-');
		fila = parseInt(fila);
		columna = parseInt(columna);
		for (let i = 1; i <= 8; i++) {
			for (let j = 1; j <= 8; j++) {
				if (puedeMoverse(obtenerPieza(seleccionado.id), `${i}-${j}`)) {
					if (!obtenerPieza(`${i}-${j}`) || obtenerPieza(`${i}-${j}`).color !== bando) {
						document.getElementById(`${i}-${j}`).classList.add('movimiento');
					}
				}
			}
		}
	}
});
