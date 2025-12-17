// Script para crear un usuario admin en MongoDB Atlas
// Ejecutar: node create-admin-user.js

import { MongoClient } from 'mongodb';

// Conexión a MongoDB Atlas
const uri = 'mongodb+srv://pabgarciam_db_user:Pq9pEQl8W3mWhpTt@cluster0.0pkavoy.mongodb.net/llevarayasar?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

async function crearAdminUser() {
    try {
        console.log('Conectando a MongoDB Atlas...');
        await client.connect();
        
        const db = client.db('llevarayasar');
        const usuariosCollection = db.collection('usuarios');

        // Usuario admin con credenciales especificadas
        const adminUser = {
            email: 'test@admin',
            password: 'admin,123',
            nombre: 'Administrador',
            rut: '20.000.000-0',
            rol: 'ADMIN',
            activo: true,
            fechaRegistro: new Date()
        };

        const result = await usuariosCollection.updateOne(
            { email: adminUser.email },
            { $set: adminUser },
            { upsert: true }
        );

        if (result.upsertedCount > 0) {
            console.log('✅ Usuario admin creado exitosamente');
            console.log('Email: test@admin');
            console.log('Contraseña: admin,123');
            console.log('Rol: ADMIN');
        } else if (result.matchedCount > 0) {
            console.log('✅ Usuario admin ya existe o fue actualizado');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.close();
    }
}

crearAdminUser();
