const initialBalance = 10;
let userBalance = localStorage.getItem('userBalance') || initialBalance;
userBalance = parseFloat(userBalance);
		
		const caballos = [
		  {
			nombre: 'Siempre Regia',
			fuerza: 70,
			agilidad: 60,
			resistencia: 80,tamaño: 1.8,
			experiencia: 5,
		  },
		  {
			nombre: 'Yogurdemoratenis',
			fuerza: 80,
			agilidad: 70,
			resistencia: 75,
			tamaño: 1.9,
			experiencia: 3,
		},
		  {
			nombre: 'Poor Facho',
			fuerza: 60,
			agilidad: 80,
			resistencia: 70,
			tamaño: 1.7,
			experiencia: 7,
		  },
		  {
			nombre: 'Esta Es Wena Viejo',
			fuerza: 75,
			agilidad: 75,
			resistencia: 85,tamaño: 1.75,
			experiencia: 4,
		  },
		  {
			nombre: 'Rechazado',
			fuerza: 85,
			agilidad: 65,
			resistencia: 65,
			tamaño: 1.85,
			experiencia: 6,
		  },
		];

    function simularTiempo(caballo, modificaciones) {
      const caballoActualizado = { ...caballo }; // Create a copy of the horse object

      if (random(1, 100) <= 10) {
        // Update the horse properties
        Object.keys(modificaciones).forEach(propiedad => {
          caballoActualizado[propiedad] += modificaciones[propiedad];
        });
      }

      return caballoActualizado; // Return the updated horse object as an array
    }

		function random(min, max) {
  return Math.floor(Math.random() * (max -min + 1)) + min;
}

function actualizarCaballos(indiceCaballoSeleccionado) {
  caballos.forEach((caballo, index) => {
    if (index === indiceCaballoSeleccionado) {
      caballo.experiencia += 1; // Incrementar la experiencia del caballo seleccionado
    }
  });
  actualizarRadiosButtons(caballos);

  //Set the selected input as checked
  const input = document.querySelector(`input[name="caballo"][value="${indiceCaballoSeleccionado}"]`);
  if (input) {
    input.checked = true;
  }return caballos; //Return the updated caballos array
}

function calcularCaballoGanador(caballosActualizados) {
  const simulados = caballosActualizados.map(caballo => simularTiempo(caballo, {}));
  const randomIndex = Math.floor(Math.random() * simulados.length);
  return caballosActualizados[randomIndex];
}

let inputSeleccionado = null;

function seleccionarCaballo(caballos, indiceCaballoSeleccionado) {
  console.log('seleccionarCaballo called');

  const caballosActualizados = caballos.map((caballo, index) => {
    if (index === indiceCaballoSeleccionado) {
      return simularTiempo(caballo, {
        fuerza: random(1, 10),
        agilidad: random(1, 10),
        experiencia: random(1, 5),
      });
    } else {
      return simularTiempo(caballo, {});
    }
  });

  return caballosActualizados; 
}

function actualizarRadiosButtons(caballosActualizados) {
  console.log('actualizarRadiosButtons called');
	const listaCaballos = document.getElementById('caballos-lista');


  while (listaCaballos.firstChild) {
    listaCaballos.removeChild(listaCaballos.firstChild);
  }

  caballosActualizados.forEach((caballo, index) => {
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'caballo';
    input.value = index;
    input.id = `caballo-${index}`;
    input.checked = index === 0; 

    const label = document.createElement('label');
    label.htmlFor = `caballo-${index}`;
    label.textContent = caballo.nombre;

    const li = document.createElement('li');
    li.appendChild(input);
    li.appendChild(label);

    listaCaballos.appendChild(li);


    input.addEventListener('click', (event) => {
      const selectedIndex = Array.from(document.querySelectorAll('input[name="caballo"]')).findIndex(input => input.checked);
      if (selectedIndex !== index) {
        seleccionarCaballo(event, caballos, index);
      }
    });
  });
}


caballosActualizados = seleccionarCaballo(caballos, 0);
actualizarRadiosButtons(caballosActualizados);

function apostarPorCaballo() {
  if (isNaN(userBalance)) {
    userBalance = initialBalance;
  }

  const apuesta = parseFloat(document.getElementById('apuesta-input').value);
  if (apuesta < 0) {
    const mensajeError = document.createElement('p');
    mensajeError.classList.add('mensaje');
    mensajeError.textContent = 'La apuesta debe ser un número no negativo.';
    document.getElementById('mensaje-container').appendChild(mensajeError);
    return;
  }

  const caballoSeleccionado = document.querySelector('input[name="caballo"]:checked');

  if (caballoSeleccionado) {
    const indiceCaballoSeleccionado = caballoSeleccionado.value;

    // Reset the experience values of all horses
    caballos.forEach((caballo, index) => {
      caballosActualizados[index] = { ...caballo, experiencia: caballo.experiencia };
    });

    // Update the experience values of the horses
    const caballosActualizadosConExperiencia = actualizarCaballos(indiceCaballoSeleccionado);

    // Update the list of horses
    caballosActualizados = seleccionarCaballo(caballosActualizadosConExperiencia, indiceCaballoSeleccionado);
    actualizarRadiosButtons(caballosActualizados);

    const mensajeContainer = document.getElementById('mensaje-container');
    mensajeContainer.innerHTML = ''; // Clear the existing messages

    if (caballoSeleccionado) {
      const caballoGanador = calcularCaballoGanador(caballosActualizados);

      if (caballoGanador.nombre === caballos[indiceCaballoSeleccionado].nombre) {
        userBalance += apuesta;
        const mensajeGanador = document.createElement('p');
        mensajeGanador.classList.add('mensaje');
        mensajeGanador.textContent = `¡Felicidades! Has ganado tu apuesta. El caballo ganador fue ${caballoGanador.nombre}.`;
        mensajeContainer.appendChild(mensajeGanador);
      } else {
        userBalance -= apuesta;
        const mensajePerdedor = document.createElement('p');
        mensajePerdedor.classList.add('mensaje');
        mensajePerdedor.textContent = `Lo siento, has perdido tu apuesta. El caballo ganador fue ${caballoGanador.nombre}.`;
        mensajeContainer.appendChild(mensajePerdedor);
      }

      // Update the user's balance on the page
      document.getElementById('balance-value').textContent = userBalance.toFixed(2);

      // Update the user's balance inlocalStorage
      localStorage.setItem('userBalance', userBalance);
    } else {
      const mensajeError = document.createElement('p');
      mensajeError.classList.add('mensaje');
      mensajeError.textContent = "Por favor, selecciona un caballo.";
      document.getElementById('mensaje-container').appendChild(mensajeError);
    }
  }
}