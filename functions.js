/**
 * Busca el objeto de la pieza en las fichas con su posición.
 * @param {string} posicion - La posición de la pieza a buscar.
 * @returns {object|undefined} - El objeto de la pieza o undefined si no se encontró.
 */
const obtenerPieza = posicion => fichas.find(peon => peon.posicion === posicion);

/**
 * Crea una pieza de ajedrez.
 *
 * @param {string} tipo - El tipo de pieza de ajedrez.
 * @param {string} color - De que color o bando es la pieza.
 * @param {string} posicion - La posición de la pieza en el tablero.
 * @returns {object} - Devuelve como objeto la pieza de ajedrez.
 */
function crearPieza(tipo, color, posicion) {
	return {
		tipo,
		color,
		posicion,
		avanceDoble: false,
		// avanceDobleVerdadero: false,
		seMovio: false
	};
}

/**
 * Mueve una pieza de ajedrez a una nueva posición en el tablero. Tambien se encarga de coronar peones, capturas al paso y enroques.
 * @param {Object} pieza - La pieza de ajedrez a mover.
 * @param {string} nuevaPosicion - La nueva posición de la pieza (formato "fila-columna").
 */
function moverPieza(pieza, nuevaPosicion) {
	const [fila, columna] = nuevaPosicion.split('-');
	const [filaAnterior, columnaAnterior] = pieza.posicion.split('-');

	// Eliminar pieza si la hay en la nueva posición
	if (obtenerPieza(nuevaPosicion)) {
		fichas = fichas.filter(p => p.posicion !== nuevaPosicion);
	}

	// Borrar la pieza de la posición anterior
	tabla.rows[filaAnterior - 1].cells[columnaAnterior - 1].innerHTML = '';

	// Para coronar peones
	let filaParaCoronar = pieza.color === 'bl' ? '8' : '1';

	if (pieza.tipo === 'peon' && fila === filaParaCoronar) {
		nuevoTipo = prompt(
			'Ingrese el tipo de pieza a coronar: torre, caballo, alfil o reina. (Por defecto reina)'
		);

		if (nuevoTipo === 'torre' || nuevoTipo === 'caballo' || nuevoTipo === 'alfil') {
			pieza.tipo = nuevoTipo;
		} else {
			pieza.tipo = 'reina';
		}
	}

	////////////////////////////Para captura al paso/////////////////////////////////////

	bandoContrario = pieza.color === 'bl' ? 'ne' : 'bl';

	// Aparte de verificar si es avance doble, tambien verifica si se puede hacer captura al paso
	const esAvanceDoble =
		(pieza.tipo === 'peon' &&
			Math.abs(fila - filaAnterior) === 2 &&
			Math.abs(columna - columnaAnterior) === 0 &&
			!obtenerPieza(nuevaPosicion) &&
			obtenerPieza(`${fila}-${columna - 1}`)?.color === bandoContrario &&
			obtenerPieza(`${fila}-${columna - 1}`)?.tipo === 'peon') ||
		(obtenerPieza(`${fila}-${columna + 1}`)?.color === bandoContrario &&
			obtenerPieza(`${fila}-${columna + 1}`)?.tipo === 'peon');

	// const avanceDobleVerdadero = pieza.tipo === 'peon' && Math.abs(fila - filaAnterior) === 2;

	const peonDeAtras = obtenerPieza(`${filaAnterior}-${columna}`);

	// Verifica si el movimiento es una captura al paso
	const esCapturaAlPaso =
		pieza.tipo === 'peon' &&
		Math.abs(fila - filaAnterior) === 1 &&
		Math.abs(columna - columnaAnterior) === 1 &&
		!obtenerPieza(nuevaPosicion) &&
		peonDeAtras?.tipo === 'peon' &&
		peonDeAtras?.color === bandoContrario &&
		peonDeAtras?.avanceDoble;

	// Si es captura al paso, eliminar el peón capturado
	if (esCapturaAlPaso) {
		let [filaPeonAtras, columnaPeonAtras] = peonDeAtras.posicion.split('-');
		filaPeonAtras = parseInt(filaPeonAtras);
		columnaPeonAtras = parseInt(columnaPeonAtras);
		fichas = fichas.filter(p => p.posicion !== peonDeAtras.posicion);
		// tabla.rows[filaPeonAtras + 1].cells[columnaPeonAtras + 1].innerHTML = '';
		document.getElementById(peonDeAtras.posicion).innerHTML = '';
	}

	if (pieza.tipo === 'peon' && Math.abs(fila - filaAnterior) === 2) {
		let letrasxd = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
		// invertir letras
		letrasxd = letrasxd.reverse();

		let incrementoFilaxd = pieza.color === 'bl' ? -1 : 1;
		avanceDobleVerdadero =
			letrasxd[parseInt(columna) - 1] + (parseInt(fila) + incrementoFilaxd);
	} else {
		avanceDobleVerdadero = '';
	}

	//////////////////////////////////////////////////////////////////////////////////////

	// Si es enroque, mover la torre también
	if (puedeEnrocar(pieza, nuevaPosicion)) {
		const [reyFila, reyColumna] = pieza.posicion.split('-');
		const torreColumna = columna > reyColumna ? 8 : 1;
		const torre = obtenerPieza(`${fila}-${torreColumna}`);
		const nuevaPosicionTorre = `${fila}-${columna === '2' ? '3' : '5'}`;
		moverPieza(torre, nuevaPosicionTorre);
	}

	// Poner pieza nueva en la tabla
	tabla.rows[fila - 1].cells[columna - 1].innerHTML = imagenes[pieza.tipo][pieza.color];

	// Actualizar posición de la pieza
	pieza.posicion = nuevaPosicion;
	pieza.avanceDoble = esAvanceDoble;
	pieza.seMovio = true;
}

/**
 * Para saber si una pieza puede moverse a una posicion x en el tablero. Aqui se manejan las reglas de movimiento de cada pieza.
 *
 * @param {Object} pieza - La pieza de ajedrez a mover.
 * @param {string} nuevaPosicion - La nueva posicion a moverse (en formato "fila-columna").
 * @returns {boolean} - Devuelve true si la pieza puede moverse a la nueva posición y false si no.
 */
function puedeMoverse(pieza, nuevaPosicion) {
	let [fila, columna] = nuevaPosicion.split('-');
	let piezaPosicion = pieza.posicion.split('-');
	piezaPosicion[0] = parseInt(piezaPosicion[0]);
	piezaPosicion[1] = parseInt(piezaPosicion[1]);
	fila = parseInt(fila);
	columna = parseInt(columna);

	////////////////////////////////Captura al paso/////////////////////////////////////
	if (pieza.tipo === 'peon') {
		let peonAtras;
		if (pieza.color === 'bl') {
			peonAtras = obtenerPieza(`${fila - 1}-${columna}`);
			if (peonAtras) {
				if (
					peonAtras.tipo === 'peon' &&
					peonAtras.color === 'ne' &&
					peonAtras.avanceDoble
				) {
					if (
						fila - piezaPosicion[0] === 1 &&
						Math.abs(columna - piezaPosicion[1]) === 1
					) {
						return true;
					}
				}
			}
		} else if (pieza.color === 'ne') {
			peonAtras = obtenerPieza(`${fila + 1}-${columna}`);
			if (peonAtras) {
				if (
					peonAtras.tipo === 'peon' &&
					peonAtras.color === 'bl' &&
					peonAtras.avanceDoble
				) {
					if (
						piezaPosicion[0] - fila === 1 &&
						Math.abs(columna - piezaPosicion[1]) === 1
					) {
						return true;
					}
				}
			}
		}
	}

	//////////////////////////////////////////////////////////////////////////////////////

	if (pieza.tipo === 'peon') {
		if (pieza.color === 'bl') {
			if (
				fila - piezaPosicion[0] === 1 &&
				columna - piezaPosicion[1] === 0 &&
				!obtenerPieza(nuevaPosicion)
			) {
				return true;
			} else if (
				fila - piezaPosicion[0] === 2 &&
				columna - piezaPosicion[1] === 0 &&
				piezaPosicion[0] === 2 &&
				!obtenerPieza(nuevaPosicion) &&
				!obtenerPieza(`${fila - 1}-${columna}`)
			) {
				// avance doble
				return true;
			} else if (
				fila - piezaPosicion[0] === 1 &&
				Math.abs(columna - piezaPosicion[1]) === 1 &&
				obtenerPieza(nuevaPosicion)
			) {
				return true;
			} else {
				return false;
			}
		} else if (pieza.color === 'ne') {
			if (
				piezaPosicion[0] - fila === 1 &&
				columna - piezaPosicion[1] === 0 &&
				!obtenerPieza(nuevaPosicion)
			) {
				return true;
			} else if (
				piezaPosicion[0] - fila === 2 &&
				columna - piezaPosicion[1] === 0 &&
				piezaPosicion[0] === 7 &&
				!obtenerPieza(nuevaPosicion) &&
				!obtenerPieza(`${fila + 1}-${columna}`)
			) {
				// avance doble
				return true;
			} else if (
				piezaPosicion[0] - fila === 1 &&
				Math.abs(columna - piezaPosicion[1]) === 1 &&
				obtenerPieza(nuevaPosicion)
			) {
				return true;
			} else {
				return false;
			}
		}
	} else if (pieza.tipo === 'torre') {
		if (fila - piezaPosicion[0] === 0 || columna - piezaPosicion[1] === 0) {
			if (fila - piezaPosicion[0] === 0) {
				for (
					let i = Math.min(columna, piezaPosicion[1]) + 1;
					i < Math.max(columna, piezaPosicion[1]);
					i++
				) {
					if (obtenerPieza(`${fila}-${i}`)) {
						return false;
					}
				}
			} else if (columna - piezaPosicion[1] === 0) {
				for (
					let i = Math.min(fila, piezaPosicion[0]) + 1;
					i < Math.max(fila, piezaPosicion[0]);
					i++
				) {
					if (obtenerPieza(`${i}-${columna}`)) {
						return false;
					}
				}
			}
			return true;
		} else {
			return false;
		}
	} else if (pieza.tipo === 'caballo') {
		const filaDif = Math.abs(fila - piezaPosicion[0]);
		const columnaDif = Math.abs(columna - piezaPosicion[1]);
		if ((filaDif === 1 && columnaDif === 2) || (filaDif === 2 && columnaDif === 1)) {
			return true;
		}
		return false;
	} else if (pieza.tipo === 'alfil') {
		const filaDif = Math.abs(fila - piezaPosicion[0]);
		const columnaDif = Math.abs(columna - piezaPosicion[1]);
		if (filaDif === columnaDif) {
			const incrementoFila = fila > piezaPosicion[0] ? 1 : -1;
			const incrementoColumna = columna > piezaPosicion[1] ? 1 : -1;
			for (let i = 1; i < filaDif; i++) {
				const filaIntermedia = piezaPosicion[0] + i * incrementoFila;
				const columnaIntermedia = piezaPosicion[1] + i * incrementoColumna;
				if (obtenerPieza(`${filaIntermedia}-${columnaIntermedia}`)) {
					return false;
				}
			}
			return true;
		}
		return false;
	} else if (pieza.tipo === 'reina') {
		const filaDif = Math.abs(fila - piezaPosicion[0]);
		const columnaDif = Math.abs(columna - piezaPosicion[1]);
		if (filaDif === 0 || columnaDif === 0 || filaDif === columnaDif) {
			// Para movimiento en línea recta (torre) o en diagonal (alfil)
			if (filaDif === 0 || columnaDif === 0) {
				if (filaDif === 0) {
					for (
						let i = Math.min(columna, piezaPosicion[1]) + 1;
						i < Math.max(columna, piezaPosicion[1]);
						i++
					) {
						if (obtenerPieza(`${fila}-${i}`)) {
							return false;
						}
					}
				} else if (columnaDif === 0) {
					for (
						let i = Math.min(fila, piezaPosicion[0]) + 1;
						i < Math.max(fila, piezaPosicion[0]);
						i++
					) {
						if (obtenerPieza(`${i}-${columna}`)) {
							return false;
						}
					}
				}
			} else {
				const incrementoFila = fila > piezaPosicion[0] ? 1 : -1;
				const incrementoColumna = columna > piezaPosicion[1] ? 1 : -1;
				for (let i = 1; i < filaDif; i++) {
					const filaIntermedia = piezaPosicion[0] + i * incrementoFila;
					const columnaIntermedia = piezaPosicion[1] + i * incrementoColumna;
					if (obtenerPieza(`${filaIntermedia}-${columnaIntermedia}`)) {
						return false;
					}
				}
			}
			return true;
		}
		return false;
	} else if (pieza.tipo === 'rey') {
		const filaDif = Math.abs(fila - piezaPosicion[0]);
		const columnaDif = Math.abs(columna - piezaPosicion[1]);
		if (filaDif <= 1 && columnaDif <= 1 && filaDif + columnaDif > 0) {
			return true;
		} else if (puedeEnrocar(pieza, nuevaPosicion)) {
			return true;
		}
		return false;
	}
}

/**
 * Verifica si una casilla está amenazada por una pieza enemiga (Se encuentra amenazada si una pieza enemiga puede moverse a esa casilla).
 *
 * @param {number} fila - La fila de la casilla.
 * @param {number} columna - La columna de la casilla.
 * @param {string} color - El color del bando.
 * @returns {boolean} - True si la casilla está amenazada, false si no lo está.
 */
function casillaAmenazada(fila, columna, color) {
	// Verificar si la casilla está amenazada por una pieza enemiga
	for (const pieza of fichas) {
		if (pieza.color !== color) {
			if (puedeMoverse(pieza, `${fila}-${columna}`)) {
				return true;
			}
		}
	}
	return false;
}

/**
 * Para saber si un movimiento deja al rey en jaque.
 *
 * @param {Object} pieza - El objeto de la pieza de ajedrez.
 * @param {string} nuevaPosicion - La nueva posición de la pieza (en formato "fila-columna").
 * @returns {boolean} - True si el rey queda en jaque después del movimiento y false si no.
 */
function movimientoDejaReyEnJaque(pieza, nuevaPosicion) {
	// simular quitar pieza si la hay
	const fichasOriginal = fichas;
	if (obtenerPieza(nuevaPosicion)) {
		fichas = fichas.filter(pieza => pieza.posicion !== nuevaPosicion);
	}
	// simular quitar pieza por captura al paso

	// Simular el movimiento de la pieza
	const posicionOriginal = pieza.posicion;
	pieza.posicion = nuevaPosicion;

	// Verificar si el rey queda en jaque después del movimiento
	const reyColor = pieza.color;
	let reyPosicion;
	for (const ficha of fichas) {
		if (ficha.tipo === 'rey' && ficha.color === reyColor) {
			reyPosicion = ficha.posicion;
			break;
		}
	}

	if (pieza.tipo === 'rey') {
		reyPosicion = pieza.posicion;
	}
	const [reyFila, reyColumna] = reyPosicion.split('-');
	const enJaque = casillaAmenazada(reyFila, reyColumna, reyColor);

	// Revertir el movimiento de la pieza
	pieza.posicion = posicionOriginal;
	fichas = fichasOriginal;
	return enJaque;
}

/**
 * Verifica si una pieza puede realizar un enroque. Se verifica si el rey y la torre no se han movido, si no hay piezas entre ellos y si las casillas que va a pasar no están amenazadas.
 *
 * @param {Object} pieza - El objeto de la pieza de ajedrez. Debe ser de tipo rey.
 * @param {string} nuevaPosicion - La nueva posición del rey (formato "fila-columna"). Debe ser 2 columnas de diferencia.
 * @returns {boolean} - True si el rey puede realizar un enroque y false si no.
 */
function puedeEnrocar(pieza, nuevaPosicion) {
	if (pieza.tipo === 'rey') {
		const [fila, columna] = nuevaPosicion.split('-');
		const [reyFila, reyColumna] = pieza.posicion.split('-');

		if (Math.abs(columna - reyColumna) === 2) {
			const torreColumna = columna > reyColumna ? 8 : 1;
			const torre = obtenerPieza(`${fila}-${torreColumna}`);
			if (torre && torre.tipo === 'torre' && !pieza.seMovio && !torre.seMovio) {
				const direccion = columna > reyColumna ? 1 : -1;
				for (let i = parseInt(reyColumna) + direccion; i != columna; i += direccion) {
					const casilla = `${fila}-${i}`;

					if (casillaAmenazada(fila, i, pieza.color)) {
						return false;
					}

					if (obtenerPieza(casilla)) {
						return false;
					}
				}

				// Verificar si el rey no está en jaque y las casillas que va a pasar no están amenazadas
				const casillasAmenazadas = [`${fila}-${reyColumna}`, `${fila}-${columna}`];
				for (const casilla of casillasAmenazadas) {
					const [casillaFila, casillaColumna] = casilla.split('-');
					if (
						movimientoDejaReyEnJaque(pieza, casilla) ||
						casillaAmenazada(casillaFila, casillaColumna, pieza.color)
					) {
						return false;
					}
				}
				return true;
			}
		}
	}

	return false;
}

/**
 * Actualiza el turno actual en la interfaz.
 * @param {string} bando - El bando actual ('bl' para blancas, 'negras' para negras).
 * @param {HTMLElement} turnoNode - El elemento de nodo donde se mostrará el turno actual.
 */
function ActualizarTurno(bando, turnoNode) {
	turnoNode.innerText = bando === 'bl' ? 'Blancas' : 'Negras';
}

/**
 * Genera el FEN del tablero actual.
 * @returns {string} - El FEN del tablero actual.
 */
function generateFEN() {
	const piezaMap = {
		peon: 'p',
		torre: 'r',
		caballo: 'n',
		alfil: 'b',
		reina: 'q',
		rey: 'k'
	};

	let fen = '';
	for (let fila = 8; fila >= 1; fila--) {
		let vacios = 0;
		for (let columna = 1; columna <= 8; columna++) {
			const pieza = obtenerPieza(`${fila}-${9 - columna}`);
			if (pieza) {
				if (vacios > 0) {
					fen += vacios;
					vacios = 0;
				}
				fen +=
					pieza.color === 'bl'
						? piezaMap[pieza.tipo].toUpperCase()
						: piezaMap[pieza.tipo];
			} else {
				vacios++;
			}
		}
		if (vacios > 0) {
			fen += vacios;
		}
		if (fila > 1) {
			fen += '/';
		}
	}

	fen += ' ';
	fen += bando === 'bl' ? 'w' : 'b';
	fen += ' ';

	const reyBlanco = obtenerPieza('1-4');
	const reyNegro = obtenerPieza('8-4');
	const torreBlancaCorta = obtenerPieza('1-1');
	const torreBlancaLarga = obtenerPieza('1-8');
	const torreNegraCorta = obtenerPieza('8-1');
	const torreNegraLarga = obtenerPieza('8-8');

	let enroques = '';

	if (reyBlanco?.tipo === 'rey' && !reyBlanco?.seMovio) {
		if (torreBlancaCorta?.tipo === 'torre' && !torreBlancaCorta?.seMovio) {
			enroques += 'K';
		}
		if (torreBlancaLarga?.tipo === 'torre' && !torreBlancaLarga?.seMovio) {
			enroques += 'Q';
		}
	}
	if (reyNegro?.tipo === 'rey' && !reyNegro?.seMovio) {
		if (torreNegraCorta?.tipo === 'torre' && !torreNegraCorta?.seMovio) {
			enroques += 'k';
		}
		if (torreNegraLarga?.tipo === 'torre' && !torreNegraLarga?.seMovio) {
			enroques += 'q';
		}
	}

	fen += enroques || '-';
	fen += ' ';

	// verificar si hay captura al paso
	fen += avanceDobleVerdadero || '-';

	fen += ' ';
	fen += '0'; // Contador de medio movimientos
	fen += ' ';
	fen += '0'; // Contador de movimientos

	// Blanks Escaped
	fen = fen.replace(/ /g, '%20');

	return fen;
}

// XD
function leTocaALaIaXD() {
	fetch(`https://stockfish.online/api/s/v2.php?fen=${generateFEN()}&depth=15`)
		.then(response => response.json())
		.then(data => {
			let bestMove = data.bestmove;
			let [fichaInicial, casillaFinal] = [bestMove.slice(9, 11), bestMove.slice(11, 13)];

			let columnaInicial = fichaInicial.charCodeAt(0) - 96;
			let filaInicial = fichaInicial[1];
			let columnaFinal = casillaFinal.charCodeAt(0) - 96;
			let filaFinal = casillaFinal[1];

			// invertir la columna
			columnaInicial = 9 - columnaInicial;
			columnaFinal = 9 - columnaFinal;

			const piezaAMover = obtenerPieza(`${filaInicial}-${columnaInicial}`);
			const casillaAMover = `${filaFinal}-${columnaFinal}`;

			moverPieza(piezaAMover, casillaAMover);
			bando = bando === 'bl' ? 'ne' : 'bl';
			ActualizarTurno(bando, turno);
		});
}

const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
