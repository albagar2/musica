import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import 'dotenv/config';
import mime from 'mime-types'; // Necesitaremos instalar mime-types

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  }
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'musica';
const musicDir = path.resolve(__dirname, '../music');

async function uploadFiles() {
  if (!fs.existsSync(musicDir)) {
    console.error(`❌ La carpeta de música no existe: ${musicDir}`);
    return;
  }

  const files = fs.readdirSync(musicDir).filter(f => f.endsWith('.mp3') || f.endsWith('.m4a'));
  console.log(`Encontrados ${files.length} archivos para subir.`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(musicDir, file);
    const fileStream = fs.createReadStream(filePath);
    const mimeType = mime.lookup(file) || 'audio/mpeg';

    // R2 requiere ContentLength si no usamos @aws-sdk/lib-storage Upload (aunque lib-storage es mejor para streams grandes)
    // Para simplificar, subiremos en paralelo o secuencial
    try {
      console.log(`[${i+1}/${files.length}] Subiendo: ${file}...`);
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: file, // El nombre del archivo en el bucket
        Body: fs.readFileSync(filePath), // Leer a memoria (los mp3 suelen pesar 3-5MB, no hay problema)
        ContentType: mimeType,
      });

      await s3.send(command);
      successCount++;
    } catch (err: any) {
      console.error(`❌ Error al subir ${file}: ${err.message}`);
      errorCount++;
    }
  }

  console.log(`\n🎉 Subida completada: ${successCount} con éxito, ${errorCount} errores.`);
}

uploadFiles().catch(console.error);
