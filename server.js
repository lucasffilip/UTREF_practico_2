const express = require("express");
const { connectToDB, disconnectFromMongoDB } = require("./src/mongodb");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Middleware para establecer el encabezado Content-Type en las respuestas
app.use((req, res, next) => {
  res.header("Content-Type", "application/json; charset=utf-8");
  next();
});

// Ruta de inicio
app.get("/", (req, res) => {
  res.status(200).end("Bienvenido a la API de Prendas");
});

// Ruta para obtener todas las prendas
app.get("/prendas", async (req, res) => {
  try {
    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      res.status(500).send("Error al conectarse a MongoDB");
      return;
    }

    // Obtener la colección de prendas y convertir los documentos a un array
    const db = client.db("prendas");
      const prendas = await db.collection("prendas").find().toArray();
    res.json(prendas);
  } catch (error) {
    // Manejo de errores al obtener las prendas
      res.status(500).send("Error al obtener las prendas de la base de datos");
  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});

// Ruta para obtener una prenda por su código
app.get("/prendas/:codigo", async (req, res) => {
  const codigoPrenda = parseInt(req.params.codigo);
  try {
    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      res.status(500).send("Error al conectarse a MongoDB");
      return;
    }

    // Obtener la colección de prendas y buscar la prenda por su código
    const db = client.db("prendas");
      const prenda = await db.collection("prendas").findOne({ codigo: codigoPrenda });
    if (prenda) {
      res.json(prenda);
    } else {
      res.status(404).send("Código no encontrado");
    }
  } catch (error) {
    // Manejo de errores al obtener la prenda
    res.status(500).send("Error al obtener la prenda de la base de datos");
  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});

// Ruta para obtener una prenda por su nombre o parte de su nombre
app.get("/prendas/nombre/:nombre", async (req, res) => {
  const prendaQuery = req.params.nombre;
  let prendaNombre = RegExp(prendaQuery, "i");
  try {
    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      res.status(500).send("Error al conectarse a MongoDB");
      return;
    }

    // Ruta para buscar prendas por su Nombre
    const db = client.db("prendas");
    const prenda = await db
      .collection("prendas")
      .find({ nombre: prendaNombre })
      .toArray();
    if (prenda.length > 0) {
      res.json(prenda);
    } else {
      res.status(404).send("Prenda no encontrada");
    }
  } catch (error) {
    // Manejo de errores al obtener la prenda
    res.status(500).send("Error al obtener la prenda de la base de datos");
  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});

// Ruta para obtener prendas por categoría o parte de la categoría
app.get("/prendas/categoria/:categoria", async (req, res) => {
  const prendasQuery = req.params.categoria;
  let prendasCategoria = RegExp(prendasQuery, "i")
  try {
    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      res.status(500).send("Error al conectarse a MongoDB");
      return;
    }

    // Obtener la colección de prendas y buscar la prenda por su categoría
    const db = client.db("prendas");
    const prenda = await db
      .collection("prendas")
      .find({ categoria: prendasCategoria })
      .toArray();

    if (prenda.length > 0) {
      res.json(prenda);
    } else {
      res.status(404).send("Prenda no encontrada");
    }
  } catch (error) {
    // Manejo de errores al obtener la prenda
    res.status(500).send("Error al obtener la prenda de la base de datos");
  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});

// Ruta para agregar un nuevo recurso
app.post("/prendas", async (req, res) => {
  const nuevaPrenda = req.body;
  try {
    if (nuevaPrenda === undefined) {
      res.status(400).send("Error en el formato de datos a crear.");
    }

    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      res.status(500).send("Error al conectarse a MongoDB");
    }

    const db = client.db("prendas");
    const collection = db.collection("prendas");
    await collection.insertOne(nuevaPrenda);
    console.log("Nueva prenda creada");
    res.status(201).send(nuevaPrenda);
  } catch (error) {
    // Manejo de errores al agregar la prenda
    res.status(500).send("Error al intentar agregar una nueva prenda");
  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});

//Ruta para modificar el atributo "precio" del recurso
app.patch("/prendas/:codigo", async (req, res) => {
    const codiPrenda = parseInt(req.params.codigo);
    const nuevosDatos = req.body;
    try {
        if (!nuevosDatos || typeof nuevosDatos.precio !== 'number') {       // Valida que el atributo "precio" exista en el body recibido y que tenga un valor numérico.
            res.status(400).send("Error en el formato de datos a crear.");
        }
        else {
        // Conexión a la base de datos
        const client = await connectToDB();
        if (!client) {
            res.status(500).send("Error al conectarse a MongoDB");
        }

        const db = client.db("prendas");
        const collection = db.collection("prendas");

        await collection.updateOne({ codigo: codiPrenda }, { $set: { precio: nuevosDatos.precio }});

        console.log("Precio de prenda Modificado");

            res.status(200).send(nuevosDatos);
        }
    } catch (error) {
        // Manejo de errores al modificar la prenda
        res.status(500).send("Error al modificar la prenda");
    } finally {
        // Desconexión de la base de datos
        await disconnectFromMongoDB();
    }
});

// Ruta para eliminar un recurso
app.delete("/prendas/:codigo", async (req, res) => {
  const codigPrenda = parseInt(req.params.codigo);
  try {
    if (!codigPrenda) {
      res.status(400).send("Error en el formato de datos enviados.");
      return;
    }

    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      res.status(500).send("Error al conectarse a MongoDB");
      return;
    }

    // Obtener la colección de prendas, buscar la prenda por su codigo y eliminarla
    const db = client.db("prendas");
    const collection = db.collection("prendas");
    const resultado = await collection.deleteOne({ codigo: codigPrenda });
    if (resultado.deletedCount === 0) {
      res
        .status(404)
        .send("No se encontró ninguna prenda con el cídigo seleccionado.");
    } else {
      console.log("Prenda Eliminada");
      res.status(204).send();
    }
  } catch (error) {
    // Manejo de errores al obtener las prendas
    res.status(500).send("Error al eliminar la prenda");
  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});

// Ruta para manejar las solicitudes a rutas no existentes
app.get("*", (req, res) => {
    res.status(404).send("Lo sentimos, la página que buscas no existe.");
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
