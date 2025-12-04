// Script para crear un usuario admin en MongoDB
// Ejecutar: node create-admin-user.js

const { MongoClient } = require('mongodb');

// Conexión local (asegúrate de que MongoDB esté corriendo en localhost:27017)
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function crearAdminUser() {
    try {
        console.log('Conectando a MongoDB en localhost...');
        await client.connect();
        
        const db = client.db('llevarayasar');
        const usuariosCollection = db.collection('usuarios');

        // Usuario admin para testing
        const adminUser = {
            rut: '20.000.000-0',
            nombre: 'Administrador',
            email: 'admin@llevarayasar.cl',
            password: 'Admin123!',
            telefono: '9123456789',
            direccion: 'Admin Street 123',
            ciudad: 'Santiago',
            region: 'Metropolitana',
            rol: 'ADMIN',
            activo: true,
            fechaRegistro: new Date()
        };

        const result = await usuariosCollection.updateOne(
            { rut: adminUser.rut },
            { $set: adminUser },
            { upsert: true }
        );

        if (result.upsertedCount > 0) {
            console.log('✅ Usuario admin creado exitosamente');
            console.log('RUT: 20.000.000-0');
            console.log('Contraseña: Admin123!');
        } else {
            console.log('✅ Usuario admin ya existe o fue actualizado');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n⚠️ Asegúrate de que MongoDB esté corriendo en localhost:27017');
        console.log('Si usas MongoDB Atlas, actualiza la URI en el script');
    } finally {
        await client.close();
    }
}

crearAdminUser();
