require('dotenv').config();

const { imprimirMenu, pausa, leerInput, listarLugares} = require('./helpers/inquirer.js');
const { Busquedas } = require('./models/busqueda.js');


const main = async () => {


    const busqueda = new Busquedas();
    let opt;



    do {




        opt = await imprimirMenu();

        switch (opt) {
            case 1:
                //Mostramos mensaje
                const lugar = await leerInput('Ciudad: ');
                //Buscar los lugares

                const arrLugares = await busqueda.ciudad(lugar);
                           
                
                //seleccionar lugar
                const idSel = await listarLugares(arrLugares);
                if( idSel === 0 ) continue
                
                const lugarSel = arrLugares.find(l => l.id === idSel);

                //Guardar en DB
                busqueda.guardarHistorial(lugarSel.nombre);

                //CLIMA
                const climaData =  await busqueda.climaLugar(lugarSel.lat, lugarSel.lng);
                //MOSTRAR RESULTADOS
                console.clear();
                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre);
                console.log('Lat:', lugarSel.lat);
                console.log('Lng:', lugarSel.lng);
                console.log('Temperatura:', climaData.temp);
                console.log('Minima:', climaData.min);
                console.log('Maxima:', climaData.max);
                console.log('Como esta el clima:', climaData.desc.green);

                break;
            case 2:
                busqueda.capitalizarHistorial().forEach( (lugar, i) => {
                    const idx = `${i+1}.`.green;
                    console.log(`${idx} ${lugar}`);
    
                }) 


                console.log('\n');
                break;
        }
        if (opt !== 0) {
            await pausa();
        }


    } while (opt !== 0);
}



main();