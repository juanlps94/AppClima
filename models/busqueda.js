     const fs = require('fs')

     const axios = require('axios')

     class Busquedas {
            historial = []
            dbPath = './db/historial.json';
        constructor() {
            this.leerHistorial();
        }


        get paramsMapBox() {
               return {
                    'access_token' : process.env.MAPBOX_KEY,
                    'limit' : 5,
                    'languaje' : 'es'
                }
        
        }

         get paramsOpenWheater() {
            return {
                appid : process.env.OPENWHEATHER_KEY,
                units: 'metric',
                lang: 'es'
             }
     } 


        async ciudad ( lugar = '') {

            //Aqui es donde se hace la peticion http


            try {
                const instance = axios.create({
                    baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                    params: this.paramsMapBox

                });

                const resp = await instance.get();


            const respuesta = (resp.data.features.map( lugares => ({
                id: lugares.id,
                nombre: lugares.place_name,
                lng: lugares.center[0],
                lat: lugares.center[1]
            })))

                return respuesta 
            
            } catch (error) {
                return [];
            }
        }
 


        async climaLugar (lat, lon) {

            try {
                
                const instance = axios.create({
                    baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                    params: {...this.paramsOpenWheater, lat, lon}
                });            
                const resp = await instance.get();
                const { weather , main} = resp.data;

                return  {
                    desc: weather[0].description,
                    min: main.temp_min,
                    max: main.temp_max,
                    temp: main.temp
                } 
            }



            catch (error) {
                console.log(error)
            }
        }

        guardarHistorial( lugar ) {
            if(this.historial.includes( lugar.toLocaleLowerCase() )){
                return
            }
            console.log('Historial guardado');

            const payload = {
                historial: this.historial
            }
            this.historial.unshift( lugar.toLocaleLowerCase() );
            fs.writeFileSync(this.dbPath, JSON.stringify( payload ) );
        }


       capitalizarHistorial(){
            return this.historial.map( lugar =>{

                let palabras = lugar.split(' ');
                palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) )
                return palabras.join(' ')
            })
        }

        leerHistorial(){
            if( !fs.existsSync(this.dbPath) ) return;

            const info = fs.readFileSync(this.dbPath, {encoding:'utf-8'});
            const data = JSON.parse(info);
            this.historial = data.historial;
        }

    };



        module.exports = { Busquedas }