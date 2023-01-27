const inquirer = require('inquirer');
require('colors');


const imprimirMenu = async () => {


    const preguntas ={
        type: 'list',
        name: 'opt',
        message: 'Seleccione una opcion',
        choices: [
            {
                value: 1,
                name: 'Buscar ciudad'
            },
            {
                value: 2,
                name: 'Historial'
            }, 
            {
                value: 0,
                name: 'Salir'
            }
        ]
    } 

    console.clear();
    console.log('=========================='.green);
    console.log('  Seleccione una opción'.white );
    console.log('==========================\n'.green);

    const  { opt }  =  await inquirer.prompt(preguntas);

    return opt; 
}

const pausa = async () => {
    
    const question = [{
         type: 'input',
         name: 'enter',
         message: `Presione ${'ENTER'.green} para continuar`
    }];

    await inquirer.prompt(question);
 
 
}

const leerInput = async( message ) => {

    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ) {
                if( value.length === 0 ) {
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];

    const { desc } = await inquirer.prompt(question);
    return desc;
}


const listarLugares = async ( lugares = [] ) => {
    
    const choices = lugares.map( (lugar , i) =>{

        const idx = `${i+1}.`.green;
    
        return {
            value: lugar.id,
            name: `${ idx } ${lugar.nombre}`
        }
    })


choices.unshift({
            value: 0,
            name: `0. Cancelar`
})

const preguntas = [
    {
        type: 'list',
        name: 'id',
        message: 'Borrar',
        choices
    }
]

    const { id } = await inquirer.prompt(preguntas);
    return id

}

module.exports = { imprimirMenu, pausa, leerInput, listarLugares }