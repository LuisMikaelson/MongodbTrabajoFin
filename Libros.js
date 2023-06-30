const {faker} = require ('@faker-js/faker');
const {MongoClient, MongoDBNamespace} = require('mongodb');
const uri = "mongodb+srv://juanda52141:juanda52141@cluster0.hlnd5vi.mongodb.net/?retryWrites=true&w=majority"
// require('dotenv').config({path: './.env'});
// const uri = process.env.uri; 
// async function mostrarDatos() {
//     const cliente = new MongoClient(uri);
  
//     try {
//       await cliente.connect();
  
//       const database = cliente.db('BookWare');
//       const collection = database.collection('Libros');
  
//       // Obtener los documentos de la colección
//       const documentos = await collection.find({},{limit:5}).toArray();
  
//       // Mostrar los datos
//       documentos.forEach((documento) => {
//         console.log(documento);
//       });
//     } catch (error) {
//       console.error('Error al mostrar los datos:', error);
//     } finally {
//       await cliente.close();
//     }
//   }
  
//    mostrarDatos();
// Crear conexión con esquema de los libros
async function crearcoleccion(){
    const cliente = new MongoClient(uri);
    try {
        await cliente.connect();
        const resultado = await cliente.db('BookWare').createCollection('Libross',{
            validator:{
                $jsonSchema:{
                    bsonType:'object',
                    title:'EsquemaLibros',
                    required:[
                        'idLibro',
                        'isbnLibro',
                        'NombreLibro',
                        'generoLibro',
                        'autorLibro',
                        'descripcionLibro',
                        'estadoLibro',
                        'cantidadLibro'

                    ],
                    properties:{
                        idLibro:{bsonType:'int'},
                        isbnLibro:{bsonType:'string'},
                        NombreLibro:{bsonType:'string'},
                        generoLibro:{bsonType:'string'},
                        autorLibro:{bsonType:'string'},
                        descripcionLibro:{bsonType:'string'},
                        estadoLibro:{bsonType:'string'},
                        cantidadLibro:{bsonType:'int'},
                        imagenLibro:{bsonType:'string'}
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
// // // ELIMINAR COLECCCON
// // async function eliminarColeccion() {
// // const client = new MongoClient(uri);

// //   try {
// //     await client.connect();

// //     const database = client.db('BookWare');
// //     const collection = database.collection('Libros');

// //     // Eliminar la colección
// //     await collection.drop();

// //     console.log(`La colección "Libros" ha sido eliminada exitosamente.`);
// //   } catch (error) {
// //     console.error('Error al eliminar la colección:', error);
// //   } finally {
// //     await client.close();
// //   }
// // }
// // eliminarColeccion();

// -------------------------------------------------------------------------------  - - - - - - - ----------------------------------------------------------------


async function mostrarDato() {
  const client = await MongoClient.connect(uri);
  try {
    const database = client.db('BookWare');
    const collection = database.collection('Libros');
    const datoMostrar = 2810;
    const filtro = { idLibro:datoMostrar }; 
    const pipeline = [
      {
        $match: filtro
      },
      {
        $limit: 1
      }
    ];

    const resultado = await collection.aggregate(pipeline).toArray();
    if (resultado){
      console.log(resultado); 
    }else{
      console.log("no funcionó mamaguevo"); 
    }
    client.close();
  } catch (error) {
    console.error('Error al eliminar el registro:', error);
  }
}
// mostrarDato();
async function eliminardatos(){
  const cliente = new MongoClient(uri);
  try {
    const database = cliente.db('BookWare');
    const collection = database.collection('Libros');
    const eliminar = await collection.deleteMany({});
    if (eliminar){
      console.log("Eliminado");
    }
  } catch (error) {
    
  }
}
// eliminardatos(); 
async function mostrarDatos(){
  const cliente = new MongoClient (uri);
  try{
    await cliente.connect();
    const database = cliente.db('BookWare');
    const collection = database.collection('Libros');
    const pipeline = [
      {
        $skip : 100
      },
      {
        $limit : 10
      }
    ];
    const resultadoC = await collection.aggregate(pipeline).toArray();
    if(resultadoC){
      console.log(resultadoC);
    }else{
     console.log(ERROR);
    }

  }catch (e){
    console.log(e)
  }finally{
    cliente.close();
  }
}
// mostrarDatos();



async function registrarLibro() {
  const cliente = new MongoClient(uri);
  try {
    await cliente.connect();
    const datos = [];
    for (let i = 0; i< 2; i++) {
      const nombreLi = faker.helpers.arrayElements(['Harry Potter y la prieda filosofal', 'Animales Fantásticos y dónde encontrarlos', /* ... */ ]);
      const nombrelidos = nombreLi[0];
      const genero = faker.helpers.arrayElements(['aventura', 'terror', 'ciencia ficcion']);
      const generodos = genero[0];
      const estado = faker.helpers.arrayElements(['ACTIVO', 'INACTIVO']);
      const estadodos = estado[0];

      const datosinsertar = {
        idLibro: faker.number.int({ min: 1, max: 4000 }),
        isbnLibro: faker.string.alphanumeric(10),
        NombreLibro: nombrelidos,
        generoLibro: generodos,
        autorLibro: faker.person.fullName(),
        descripcionLibro: faker.lorem.sentence(),
        estadoLibro: estadodos,
        cantidadLibro: faker.number.int({ min: 1, max: 10 }),
        imagenLibro: faker.image.url()
      };
      datos.push(datosinsertar)
      console.log(`Se han insertado ${i + 1} registros`);
    }

    const resultado = await cliente.db('BookWare').collection('Libros').insertMany(datos)

    if (resultado) {
      console.log('La inserción de registros se completó correctamente.');
    } else {
      console.log('Hubo un error al insertar los registros.');
    }
  } catch (e) {
    console.log(e);
  } finally {
    await cliente.close();
  }
}

// registrarLibro();

async function registrarLibroOne(){

  const cliente = new MongoClient(uri);
      try {
          await cliente.connect();
          const datosLibros = [];
              const datosinsertar={
                  idLibro:10500,
                  isbnLibro:"abcd123456",
                  NombreLibro:"MongoDB",
                  generoLibro: "Ficcion",
                  autorLibro:"German",
                  descripcionLibro:"Examen Mongo",
                  estadoLibro : "Actuivo",
                  cantidadLibro: 10,
                  imagenLibro:faker.image.url()
              }
              datosLibros.push(datosinsertar);
              console.log(datosinsertar);
          const resultado = await cliente.db('BookWare').collection('Libros').insertOne(datosinsertar);
          if(resultado){
            console.log(resultado);
              console.log('a dormir mama guevo');
          }else{
              console.log('suerte pa, siga');
          }
      } catch (e) {
          console.log(e);
      }
      finally { 
          await cliente.close();
      }
  }
  // registrarLibroOne();
  async function actualizarDatos() {
    const client = new MongoClient(uri);
    const dbName = 'BookWare'; 
    const collectionName = 'Libros'; 
  
    try {
      await client.connect();
  
      const database = client.db(dbName);
      const collection = database.collection(collectionName);
      const datoAcambiar = 'Prueba taller';
      const datoActualizar = 'literatura';
      const filtro = { NombreLibro: datoAcambiar };
      const update = { $set: { generoLibro: datoActualizar, cantidadLibro: 10 } };

      const encontrar = await collection.find({NombreLibro: datoAcambiar}).limit(10).skip(100).toArray();
      if(encontrar){
        console.log(encontrar);
      }else{
        console.log("No se encuentrar datos con el nombre de libro especificado")
      }
  
      const resultado = await collection.updateMany(filtro,update);
  
      console.log(`${resultado.modifiedCount} documentos actualizados exitosamente.`);
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
    } finally {
      await client.close();
    }
  }
  
  // actualizarDatos();
  async function actualizarUndato(){
    const client = new MongoClient(uri);
    try{
      await client.connect();
      const database = client.db("BookWare");
      const collection = database.collection("Libros");
      const datoAcambiar = 'Moby-Dick';
      const datoActualizar = 'Actualizado';
      const filtro = { NombreLibro: datoAcambiar};
      const update = { $set:{NombreLibro: datoActualizar}}
      const encontrar = await collection.find({NombreLibro: datoAcambiar}).limit(1).toArray();
    if(encontrar){
      console.log(encontrar);
    }else{
      console.log(`No se encontraron datos con el nombre del libro: ${datoAcambiar}`);
    }
    const resultado = await collection.updateOne(filtro,update); 
    if(resultado){
      console.log(`Sen han Actualizado Exitosamente`)
    }
    }catch(e){
      console.log(e);
    }finally{
      client.close();
    }
  }
  // actualizarUndato();

  async function EliminarDatos(){
    const client = new MongoClient(uri);
    try {
      await client.connect();
      const database = client.db("BookWare");
      const collection = database.collection("Libros");
      const datoEliminar = 2810; 
      const filtro = { idLibro: datoEliminar};
      const encontrar = await collection.find({NombreLibro: datoEliminar}).limit(10).toArray();
      if (encontrar){
        console.log("Ejemplo de los datos a eliminar");
        console.log(encontrar)
      }else{
        console.log(`No se encontraron libros con el nombre ${datoEliminar} Verifica bien el nombre`);
      }
      const eliminar = await collection.deleteMany(filtro);
      if(eliminar){
        console.log(`Se han eliminado ${eliminar.deletedCount} con el nombre de ${datoEliminar}.`);
      }
    } catch (error) {
      console.log(error);
    }finally{
      client.close();
    }
  }
  EliminarDatos();
  
  async function eliminardato(){
    const client = new MongoClient(uri);
    try {
      await client.connect();
      const database = client.db("BookWare");
      const collection = database.collection("Libros");
      const eliminar = ("Romeo y Julieta");
      const Filtro = ({NombreLibro: eliminar })
      const encontrar = await collection.find(Filtro).limit(1).toArray();
      if (encontrar){
        console.log(`Primer Dato Encontrado con el nombre Libro ${eliminar}`)
        console.log(encontrar);
      }else{
        console.log(`Datos no encontrados con el nombre Libro ${eliminar}`);
      }
      const eliminarD = await collection.deleteOne(Filtro);
      if(eliminarD){
        console.log(`Se ha eliminado correctamente el nombre Libro ${eliminar}`);
      }else{
        console.log("Error al eliminar");
      }
    } catch (error) {
      console.log(error)
    } finally {
      client.close();
    }
  }
  // eliminardato();

