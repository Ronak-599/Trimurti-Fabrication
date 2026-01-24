// backend/config/db.js
const mongoose = require('mongoose');
require('dotenv').config({ override: true });

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://admin:Ronak%402022@fabrication-cluster.yvqgatq.mongodb.net/fabrication_workshop?retryWrites=true&w=majority';
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️  MONGODB_URI not set in environment. Falling back to', uri);
    }
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Ensure required collections exist
    const db = conn.connection.db;
    const requiredCollections = [
      'Grill_Fabrication',
      'Gate_Fabrication',
      'Shed_Fabrication',
      'Railing',
      'Custom_Fabrication',
      'building_work'
    ];

    try {
      const existing = await db.listCollections().toArray();
      const existingNames = new Set(existing.map(c => c.name));

      // Rename old collections to new names if present
      const renameMap = [
        { from: 'Railing & Staircase', to: 'Railing' },
        { from: 'Custom Fabrication', to: 'Custom_Fabrication' }
      ];
      for (const { from, to } of renameMap) {
        try {
          if (existingNames.has(from) && !existingNames.has(to)) {
            await db.collection(from).rename(to);
            console.log(`🔁 Renamed collection: ${from} → ${to}`);
            existingNames.add(to);
            existingNames.delete(from);
          }
        } catch (e) {
          console.warn(`⚠️  Could not rename collection ${from} → ${to}: ${e.message}`);
        }
      }
      for (const name of requiredCollections) {
        if (!existingNames.has(name)) {
          try {
            await db.createCollection(name);
            console.log(`📁 Created collection: ${name}`);
          } catch (e) {
            console.warn(`⚠️  Could not create collection ${name}: ${e.message}`);
          }
        }
      }
    } catch (err) {
      console.warn('⚠️  Could not verify/create collections:', err.message);
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;