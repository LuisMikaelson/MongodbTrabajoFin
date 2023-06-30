const {faker} = require ('@faker-js/faker');
const {MongoClient} = require('mongodb');
const uri = ("mongodb+srv://juanda52141:juanda52141@cluster0.hlnd5vi.mongodb.net/?retryWrites=true&w=majority")
// require('dotenv').config({path: './.env'});
// const uri = process.env.uri; 

async function crearcoleccion(){
    const cliente = new MongoClient(uri);
    try {
        await cliente.connect();
        const resultado = await cliente.db('BookWare').createCollection('Reservas',{
          // Generamos el esquema de nuestra collección Usando el validator y el $jsonSchem 
            validator:{
                $jsonSchema:{
                    bsonType:'object',
                    title:'EsquemaLibros',
                    required:[
                        'idreserva',
                        'idLibro',
                        'idUsurio',
                        'Fechareserva',
                        'Fechaentrega',
                        'Fechamaximaentrega',

                    ],
                    // Le generamos sus respectivas cualidades, los tipos de campos que vamos a usar 
                    properties:{
                        idreserva:{bsonType:'int'},
                        idLibro:{bsonType:'int'},
                        idUsuario:{bsonType:'int'},
                        Fechareserva:{bsonType:'date'},
                        Fechaentrega:{bsonType:'date'},
                        Fechamaximaentrega:{bsonType:'date'}
                    }
                }
            }
        });
        if(resultado){
            console.log('registro existoso');
        }
        else{
            console.log('error care verga');
        }
    } catch (e) {
        console.log(e);
    }
    finally{
        await cliente.close();
    }
}
//  crearcoleccion();

// Acá vamos a ingresr Reservas con insertmany
async function ingresarReserva() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    // Inicializamos datosreserva, ya que esta será un array y si no lo especificamos podremos tener errores 
    const datosReserva = [];
    // En este for vamos a indicar Cuantos registros va a ingrasar, en el vaor i<1 ahí pondremos el numero de reservas a ingresar
    for (i=0; i<1; i++){
      // Usando el faker, vamos a introducir los datos, especificando al inicio sobre que campo iría de nuestra coleccion
        const datosinsertar = {
          // NOTA: Algo importante a la hora de hacer este procedimiento es verificar que en el schema los tipos de datos los cuales recibe
          // y pues obviamente, tambien hacer la validacion de los nombres de los campos
          idreserva: parseInt(faker.number.int({ min: 1, max: 4000 })),
          idLibro: parseInt(faker.number.int({ min: 1, max: 4000 })),
          idUsurio: parseInt(faker.number.int({ min: 1, max: 4000 })),
            Fechareserva: new Date(faker.date.recent()),
            Fechaentrega: new Date(faker.date.recent()),
            Fechamaximaentrega: new Date(faker.date.recent()),
          }
        datosReserva.push(datosinsertar);
        console.log(`Se han insertado ${i} registros`);
        console.log(datosinsertar);
    }
    // Acá hacemos efectiva la insrsion de los datos en la base de datos
    const resultado = await client.db('BookWare').collection('Reservas').insertMany(datosReserva);
    if(resultado){
        console.log('a dormir mama guevo');
    }else{
        console.log('suerte pa, siga');
    }
    } catch (e) {
        console.log(e);
    }
    finally { 
        await client.close();
    }
}
// ingresarReserva();
// NO EJECUTAAAAR :)))
// async function eliminarbase(){
//   const client = new MongoClient(uri);
//   try{
//     await client.connect();
//     const database = client.db('BookWare');
//     await database.dropDatabase(database);
//     console.log("Base de datos eliminada correctamente");
//   }catch(e){
//     console.log(e);

//   }finally{
//     client.close();
//   }
// }

// Ingresar una reserva, En este caso usamos la misma metodología que en la anterior, con el detalle
// De que ya no usaremos un for para ingresar los datos, debido a que solo sera un dato el que vamos a ingresar
// Usando el inserOne
async function ingresarUnaReserva() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const reserva = {
      idreserva: parseInt(faker.number.int({ min: 1, max: 4000 })),
            idLibro: parseInt(faker.number.int({ min: 1, max: 4000 })),
            idUsurio: parseInt(faker.number.int({ min: 1, max: 4000 })),
            Fechareserva: new Date(faker.date.recent()),
            Fechaentrega: new Date(faker.date.recent()),
            Fechamaximaentrega: new Date(faker.date.recent()),
    };
    // Acá hacemos uso de los famosos pipelines, los cuales nos van a funcionar para poder traer campos relacionados
    // traemos el nombre del libro por medio de idLibro, y tambien el Nombre del usuario por medio del idUsuario 
    const pipeline = [
      {
        $lookup: {
          from: 'Libros',
          localField: 'idLibro',
          foreignField: 'idLibro',
          as: 'nombreLibro'
        }
      },
      {
        $lookup: {
          from: 'Usuarios',
          localField: 'idUsurio',
          foreignField: 'idUsuario',
          as: 'nombreUsuario'
        }
      },
      {
        $sample: { size: 1 }
      },
      {
        // Acá vamos a especificar cuales campos deseamos mostrar, poniendo en nombre del campo y posteriormente true o false
        $project:{
          _id: false,
          idLibro : true,
          idreserva: true,
          idUsurio : true,
          Fechareserva: true,
          Fechaentrega: true,
          Fechamaximaentrega: true,
          "nombreLibro": { $arrayElemAt: ["$nombreLibro.NombreLibro", 0] },
          "nombreUsuario": { $arrayElemAt: ["$nombreUsuario.nombreUsuario",0] },
        }
      }
    ];
    // Le especificamos el pipeline que va a hacer un insertOne, y le pasamos la variable creada con el faker arriba
    pipeline.push = ({
      $insertOne:{
      $document : reserva,
      }
    });
    // Posteriormente acá usamos el agregate para poder hacer la inserción pasando el pipeline (ya el contiene el insertOne)
    const resultado = await client.db('BookWare').collection('Reservas').aggregate(pipeline).toArray();
    if (resultado) {
      console.log('La reserva se ha insertado correctamente.', resultado);
    } else {
      console.log('No se pudo insertar la reserva.');
    }
  } catch (error) {
    console.error('Error al ingresar la reserva:', error);
  } finally {
    await client.close();
  }
}

// ingresarUnaReserva();



// ingresarReserva();
// Acá hacemos la funcion de mostrar Datos, usando el find
async function mostrarDatos() {
  const cliente = new MongoClient(uri);
  try {
    await cliente.connect();

    const database = cliente.db('BookWare');
    const pipeline = [
    // Creamos el pipeline y adentro creamos nuestros lookup, para traer los nombres de los libros
    // por medio de los id, y los nombre de usuario por medio de los idUsuario
      {
        $lookup: {
          from: "Libros",
          localField: "idLibro",
          foreignField: "idLibro",
          as: "nombreLibro"
        }
      },
      {
        $lookup: {
          from: "usuarios",
          localField: "idUsurio",
          foreignField: "idUsuario",
          as: "nombreUsuario"
        }
      },
      {
        // hacemos la separación de los array, para dejarlos como datos "sueltos" por así decirlo
        $unwind: "$nombreUsuario"
      },
      {
        $unwind: "$nombreLibro"
      },
      {
        $project: {
          _id: false,
          "nombreLibro.NombreLibro": "$nombreLibro.NombreLibro",
          Fechaentrega: true,
          Fechareserva: true,
          idLibro : true,
          "nombreUsuario.nombreUsuario": true,
        }
      },
      {
        // generemos un skip, para que salte 10 registros 
        $skip: 10
      },
      {
        // con esto lo que hacemos es limitar los datos para mostrar o sea 10 
        $limit: 10
      }
    ];
    // hacemos nuestro respectivo agregate pasando el pipeline, ya este conteniendo todos los parametros
    // Pasamos toda la consulta a toArray, Para que pueda ser mostrada posteriormente
    const resultadoC = await cliente.db('BookWare').collection('Reservas').aggregate(pipeline).toArray();
    console.log(resultadoC);
  } catch (error) {
    console.error('Error al mostrar los datos:', error);
  } finally {
    await cliente.close();
  }
}

// mostrarDatos();

// Acá tenemos una funcion de findone, muy normalita, todo lo explicado arriba está acá
async function mostrarUndato() {
  const cliente = new MongoClient(uri);
  try {
    await cliente.connect();

    const database = cliente.db('BookWare');
    const collection = database.collection('Reservas');

    const filtro = { idLibro: 381 }; 

    const resultado = await collection.findOne(filtro);

    if (resultado) {
      console.log("Dato encontrado:", resultado);
    } else {
      console.log("Dato no encontrado");
    }
  } catch (error) {
    console.error('Error al mostrar el dato:', error);
  } finally {
    await cliente.close();
  }
}

mostrarUndato();


// async function mostrarUndato() {
//   const cliente = new MongoClient(uri);
//   try {
//     await cliente.connect();
//     const pipeline = [
//       {
//         $match : {idUsurio: 3777}
//       },
//       {
//         $lookup: {
//           from: "Libros",
//           localField: "idLibro",
//           foreignField: "idLibro",
//           as: "nombreLibro"
//         }
//       },
//       {
//         $lookup: {
//           from: "usuarios",
//           localField: "idUsurio",
//           foreignField: "idUsuario",
//           as: "nombreUsuario"
//         }
//       },
//       {
//         $unwind: "$nombreUsuario"
//       },
//       {
//         $unwind: "$nombreLibro"
//       },
//       {
//         $project: {
//           _id: false,
//           "nombreLibro.NombreLibro": "$nombreLibro.NombreLibro",
//           Fechaentrega: true,
//           Fechareserva: true,
//           idLibro : true,
//           "nombreUsuario.nombreUsuario": true,
//         }
//       },
//       {
//         $skip: 10
//       },
//       {
//         $limit: 10
//       }
//     ];

//     const resultadoC = await cliente.db('BookWare').collection('Reservas').aggregate(pipeline).toArray();
//     if(resultadoC){
//       console.log("Datos Encontrados con ese Idlibro",resultadoC);
//     }else{
//       console.log("Datos No encotrados :,");
//     }
    
//   } catch (error) {
//     console.error('Error al mostrar los datos:', error);
//   } finally {
//     await cliente.close();
//   }
// }
// mostrarUndato();


  
// creamos una funcion para actualizar Datos (updateMany)
async function actualizarDatos() {
    const client = new MongoClient(uri);
    const dbName = 'BookWare'; 
    const collectionName = 'Reservas'; 
  
    try {
      await client.connect();
  
      const database = client.db(dbName);
      const collection = database.collection(collectionName);
      // Creamos el filtro por el cual vamos a encontrar el dato
      const filtro = { idLibro: 125 }; 
      // Luego creamos el dato que deseamos poner, para reemplazar al antiguo
      const update = { $set: { idUsurio : 92500400 } }; 
  // Creamos el updateMany, pasando por el el filtro y el dato a actualizar
      const resultado = await collection.updateMany(filtro, update);
  // Aca imprimomos cuantos datos se han modificado
      console.log(`${resultado.modifiedCount} documentos actualizados exitosamente.`);
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
    } finally {
      await client.close();
    }
  }
  // actualizarDatos();

  // Creamos un actualizar pero ahora para actualizar solo un dato
  async function actualizarUnDato() {
    const cliente = new MongoClient(uri);
    const dbName = 'BookWare';
    const collectionName = 'Reservas';
  
    try {
      await cliente.connect();
  
      const database = cliente.db(dbName);
      const collection = database.collection(collectionName);
  // Creamos nuestro filtro
      const filtro = { idLibro: 2222 };
      // especificamos cual será el nuevo valor
      const update = { $set: { idreserva: 2222 } };
      // ordenamos posteriormente todo, con el sort de manera ascendente
      const options = { $sort: { idLibro: 1 } };
  
      const resultado = await collection.updateOne(filtro, update, options);
  if (resultado){
    console.log(`documento actualizado exitosamente`);
  }   
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
    } finally {
      await cliente.close();
    }
  }
  
  // actualizarUnDato();
  
// Ahora creamos un eliminar Registro
async function eliminarRegistro() {
    const client = new MongoClient (uri);
    try {
      const database = client.db('BookWare');
      const collection = database.collection('Reservas');
      // Creamos una cosntante en la cual almacenaremos el dato por el cual deseamos eliminar todo el campo
      const datoEliminar = 2478;
      // Creamos en filtro por el idLibro, pasando el datoEliminar 
      const filtro = { idLibro : datoEliminar }; 
      const resultado = await collection.deleteOne(filtro);
  
      if (resultado) {
        console.log(`La reserva se eliminó correctamente.`);
      } else {
        console.log('No se encontró ningún registro con el ID especificado.');
      }
  
      // Cerraramos la conexión
      client.close();
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
    }
  }
  // eliminarRegistro();
// En esta funcion vamos a usar el deletemany
  async function eliminarUnRegistro() {
    const client = await MongoClient.connect(uri);
    try {
      const database = client.db('BookWare');
      const collection = database.collection('Reservas');
      // cremaos una variable donde vamos a almacenar el dato por el cual se desea elimiar
      const datoEliminar = 2222;
      // Creamos el filtro por el cual va a basar para hacer la eliminacion
      const filtro = { idLibro: datoEliminar };
      // hacemos un .find, para mostrarle al usuario cuales serán los primeros datos que se eliinarán
      const datoeli = await collection.find(filtro).toArray();
      if(datoeli){
        console.log("Los siguientes datos serán eliminados");
        console.log(datoeli);
      }else{
        console.log("No se encontraron datos para eliminar");
      }
  // Luego ejecutamos la funcion del deleteMany, donde eliminaremos todos los datos que contiene el filtro
      const resultado = await collection.deleteMany(filtro);
  
      if (resultado.deletedCount > 0) {
        // Le mostramos al usuario cuantos fueron los datos eliminados
        console.log(`Se eliminaron ${resultado.deletedCount} registros correctamente.`);
      } else {
        console.log('No se encontraron registros con el ID especificado.');
      }
  
      client.close();
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
    }
  }
  
  // eliminarUnRegistro();
// Y ya, fin de mi presentación son 100 puntos profe, no? 
  
async function eliminardatos(){
  const cliente = new MongoClient(uri);
  try {
    const database = cliente.db('BookWare');
    const collection = database.collection('Reservas');
    const eliminar = await collection.deleteMany({});
    if (eliminar){
      console.log("Eliminado");
    }
  } catch (error) {
    
  }
}
// eliminardatos(); 