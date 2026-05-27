import { PrismaClient } from '@prisma/client';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  }
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'musica';
const PUBLIC_R2_URL = process.env.R2_PUBLIC_URL || 'https://pub-your-r2-url.r2.dev';

const premiumTitles = [
  'Chill Out Session', 'Sunset Boulevard', 'Midnight Groove', 'Neon Lights',
  'Summer Breeze', 'Ocean Waves', 'Urban Beats', 'Retro Flow', 'Cyberpunk Dream',
  'Acoustic Soul', 'Golden Hour Tune', 'Infinity Horizon', 'Deep Space', 'Lo-Fi Chill'
];

const premiumArtists = [
  'SoundWave Collective', 'DJ Horizon', 'Luna Eclipse', 'Nova Beats',
  'The Wavemaker', 'Aero Groove', 'Stella Polaris', 'Pixel Perfect'
];

function getGenreForTrack(title: string, artistName: string): string {
  const t = title.toLowerCase();
  const a = artistName.toLowerCase();

  if (
    a.includes('quevedo') || a.includes('gyal') || a.includes('indigo') || 
    a.includes('mendez') || a.includes('turizo') || a.includes('balvin') || 
    a.includes('bunny') || a.includes('farruko') || a.includes('ozuna') || 
    a.includes('bizarrap') || a.includes('rvfv') || t.includes('reggaeton') || 
    t.includes('bachata')
  ) {
    return 'Reggaeton & Urbano';
  }

  if (
    a.includes('delaossa') || a.includes('fernandocosta') || 
    a.includes('akapellah') || a.includes('eminem') || a.includes('drake')
  ) {
    return 'Hip Hop & Rap';
  }

  if (
    a.includes('aitana') || a.includes('yatra') || a.includes('shakira') || 
    a.includes('camilo') || a.includes('morat') || t.includes('summer')
  ) {
    return 'Pop Latino & Hits';
  }

  return 'Clásicos & Chill';
}

async function main() {
  console.log('🧹 Limpiando la base de datos...');
  await prisma.playlistTrack.deleteMany();
  await prisma.track.deleteMany();
  await prisma.playlist.deleteMany();
  await prisma.artist.deleteMany();
  await prisma.user.deleteMany();

  console.log('👤 Creando usuario administrador...');
  const hashedPassword = await bcrypt.hash('password123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@soundwave.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log(`☁️ Buscando canciones en Cloudflare R2 (Bucket: ${BUCKET_NAME})...`);
  
  let insertedCount = 0;
  
  try {
    const command = new ListObjectsV2Command({ Bucket: BUCKET_NAME });
    const response = await s3.send(command);
    
    if (!response.Contents || response.Contents.length === 0) {
      console.log('⚠️ No se encontraron canciones en el bucket.');
      return;
    }

    const files = response.Contents.filter(f => f.Key && (f.Key.endsWith('.mp3') || f.Key.endsWith('.m4a')));
    console.log(`🎶 Se encontraron ${files.length} archivos de audio en R2.`);

    for (const file of files) {
      if (!file.Key) continue;
      
      const ext = file.Key.substring(file.Key.lastIndexOf('.'));
      const rawFile = file.Key;
      let title = '';
      let artistName = '';

      let rawName = rawFile.substring(0, rawFile.length - ext.length);
      rawName = rawName.replace(/^[0-9a-fA-F]{8}[-_][0-9a-fA-F]{4}[-_][0-9a-fA-F]{4}[-_][0-9a-fA-F]{4}[-_][0-9a-fA-F]{12}/g, '');
      rawName = rawName.replace(/^\d{10,25}/g, '').replace(/^[-_\s]+/, '');
      rawName = rawName.replace(/_\d+_(audio_only|audio_on|audio_only_medium)/gi, '').replace(/-140_-_audio_only_medium/gi, '');

      const isPureHash = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}/.test(rawName) || rawName.length < 3;

      if (isPureHash) {
        title = premiumTitles[insertedCount % premiumTitles.length];
        artistName = premiumArtists[insertedCount % premiumArtists.length];
      } else {
        if (rawName.includes('   ')) {
          const parts = rawName.split('   ');
          title = parts[0].trim();
          artistName = parts[1].trim();
        } else if (rawName.includes(' - ')) {
          const parts = rawName.split(' - ');
          artistName = parts[0].trim();
          title = parts[1].trim();
        } else {
          title = rawName.trim();
          artistName = 'SoundWave Artist';
        }
      }

      title = title.replace(/_/g, ' ').trim();
      artistName = artistName.replace(/_/g, ' ').trim();
      if (!title) title = 'Canción Premium';
      if (!artistName) artistName = 'SoundWave Artist';

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      let artist = await prisma.artist.findFirst({ where: { name: artistName } });

      if (!artist) {
        const safeArtistName = artistName.toLowerCase().replace(/[^a-z0-9]/g, '');
        const artistEmail = `${safeArtistName || 'artist' + uniqueSuffix}@soundwave.com`;
        
        let artistUser = await prisma.user.findUnique({ where: { email: artistEmail } });
        if (!artistUser) {
          artistUser = await prisma.user.create({
            data: { email: artistEmail, password: hashedPassword, role: 'ARTIST' }
          });
        }

        artist = await prisma.artist.create({
          data: { name: artistName, bio: `Artista de la colección SoundWave.`, userId: artistUser.id },
        });
      }

      const calculatedGenre = getGenreForTrack(title, artistName);
      
      // La URL ahora es pública directamente desde Cloudflare R2
      const publicUrl = `${PUBLIC_R2_URL}/${encodeURIComponent(file.Key)}`;

      await prisma.track.create({
        data: {
          title: title,
          duration: 180,
          url: publicUrl,
          artistId: artist.id,
          genre: calculatedGenre
        },
      });

      insertedCount++;
    }

    console.log(`✅ Base de datos poblada con éxito. Se insertaron ${insertedCount} canciones desde la nube.`);
  } catch (err) {
    console.error(`❌ Error al conectar con R2 o procesar canciones:`, err);
  }
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());
