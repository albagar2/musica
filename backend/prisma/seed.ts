import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Lista de nombres premium de repuesto en caso de archivos sin metadatos ni nombres reconocibles
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

  // Reggaeton & Urbano
  if (
    a.includes('quevedo') || 
    a.includes('gyal') || 
    a.includes('indigo') || 
    a.includes('mendez') || 
    a.includes('méndez') || 
    a.includes('rico') || 
    a.includes('xriz') || 
    a.includes('turizo') || 
    a.includes('crespo') || 
    a.includes('daddy') || 
    a.includes('balvin') || 
    a.includes('bunny') || 
    a.includes('farruko') || 
    a.includes('jam') || 
    a.includes('towers') || 
    a.includes('rvfv') || 
    a.includes('miguelo') || 
    a.includes('ozuna') || 
    a.includes('bizarrap') || 
    a.includes('secreto') || 
    a.includes('pashata') || 
    a.includes('kamelia') || 
    a.includes('cano') || 
    a.includes('tokischa') || 
    a.includes('miko') || 
    a.includes('becerra') || 
    a.includes('tini') || 
    a.includes('belinda') || 
    a.includes('proyecto uno') || 
    a.includes('ovy') || 
    a.includes('westcol') ||
    t.includes('reggaeton') || 
    t.includes('chulo') || 
    t.includes('fiebre') ||
    t.includes('choque') ||
    t.includes('lala') ||
    t.includes('falda') ||
    t.includes('columbia') ||
    t.includes('vista al mar') ||
    t.includes('tuchat') ||
    t.includes('pepas') ||
    t.includes('bachata') ||
    t.includes('merengue') ||
    t.includes('revolu') ||
    t.includes('revolú') ||
    t.includes('guerrero') ||
    t.includes('travesuras')
  ) {
    return 'Reggaeton & Urbano';
  }

  // Hip Hop & Rap
  if (
    a.includes('delaossa') || 
    a.includes('fernandocosta') || 
    a.includes('saske') || 
    a.includes('akapellah') || 
    a.includes('aldeano') || 
    a.includes('sceno') || 
    a.includes('ozmut') ||
    a.includes('tupac') ||
    a.includes('2pac') ||
    a.includes('eminem') ||
    a.includes('drake') ||
    a.includes('raggio') ||
    a.includes('abhir') ||
    a.includes('eazyboi')
  ) {
    return 'Hip Hop & Rap';
  }

  // Pop Latino & Hits
  if (
    a.includes('aitana') || 
    a.includes('yatra') || 
    a.includes('calvin harris') || 
    a.includes('dandee') || 
    a.includes('funzo') || 
    a.includes('fectro') || 
    a.includes('henry') || 
    a.includes('shakira') || 
    a.includes('enrique iglesias') || 
    a.includes('camilo') || 
    a.includes('morat') || 
    a.includes('marshmello') ||
    t.includes('mariposas') || 
    t.includes('summer') ||
    t.includes('nena') ||
    t.includes('akí no hay tekno') ||
    t.includes('aki no hay tekno')
  ) {
    return 'Pop Latino & Hits';
  }

  // Fallback
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

  const musicDir = path.resolve(__dirname, '../../music');
  const uploadsDir = path.resolve(__dirname, '../uploads/songs');

  console.log(`📁 Buscando audios en: ${musicDir}`);
  console.log(`📁 Copiando audios a: ${uploadsDir}`);

  // Asegurar que la carpeta de destino existe
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  if (!fs.existsSync(musicDir)) {
    console.error(`❌ La carpeta de música no existe en: ${musicDir}`);
    return;
  }

  const files = fs.readdirSync(musicDir).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return ext === '.mp3' || ext === '.m4a';
  });

  console.log(`🎶 Se encontraron ${files.length} archivos de audio.`);

  let insertedCount = 0;

  // Importación dinámica de music-metadata para CommonJS
  let mm: any = null;
  try {
    mm = await eval('import("music-metadata")');
    console.log('✅ Librería music-metadata cargada para extracción de ID3.');
  } catch (err) {
    console.warn('⚠️ No se pudo cargar music-metadata dinámicamente, se usará el parseador de nombres.');
  }

  for (const file of files) {
    const sourcePath = path.join(musicDir, file);
    
    // Generar un nombre único para evitar colisiones
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file);
    const filename = `audio-${uniqueSuffix}${ext}`;
    const destPath = path.join(uploadsDir, filename);

    try {
      // Copiar archivo físico
      fs.copyFileSync(sourcePath, destPath);

      let title = '';
      let artistName = '';
      let duration = 180; // duración por defecto

      // 1. Intentar extraer metadatos reales del archivo
      if (mm) {
        try {
          const metadata = await mm.parseFile(sourcePath);
          if (metadata.common.title) {
            title = metadata.common.title.trim();
          }
          if (metadata.common.artist) {
            artistName = metadata.common.artist.trim();
          }
          if (metadata.format.duration) {
            duration = Math.round(metadata.format.duration);
          }
        } catch (metadataError) {
          // Ignorar error y seguir con el parseador de nombres
        }
      }

      // 2. Si no tiene metadatos completos, procesar el nombre del archivo de forma ultra-inteligente
      if (!title || !artistName) {
        let rawName = file.substring(0, file.length - ext.length);

        // Limpiar prefijos de UUIDs/IDs largos de YouTube o hashes
        rawName = rawName.replace(/^[0-9a-fA-F]{8}[-_][0-9a-fA-F]{4}[-_][0-9a-fA-F]{4}[-_][0-9a-fA-F]{4}[-_][0-9a-fA-F]{12}/g, '');
        rawName = rawName.replace(/^\d{10,25}/g, ''); // Eliminar números largos al principio
        rawName = rawName.replace(/^[-_\s]+/, ''); // Eliminar guiones/espacios al inicio

        // Limpiar sufijos típicos de ripeadores
        rawName = rawName
          .replace(/_\d+_(audio_only|audio_on|audio_only_medium)/gi, '')
          .replace(/-140_-_audio_only_medium/gi, '')
          .replace(/_140_audio_only_medium/gi, '')
          .replace(/_140_audio_only/gi, '')
          .replace(/_audio_only/gi, '')
          .replace(/_audio/gi, '')
          .replace(/\(Prod\.?\s+[^)]+\)/gi, '')
          .replace(/\(feat\.?\s+[^)]+\)/gi, '');

        // Comprobar si quedó como un hash/UUID puro (por ejemplo, bc0f8ffb-...)
        const isPureHash = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(rawName) || rawName.length < 3;

        if (isPureHash) {
          // Asignar un nombre y artista aleatorio elegante para que no se vea el hash
          title = premiumTitles[insertedCount % premiumTitles.length];
          artistName = premiumArtists[insertedCount % premiumArtists.length];
        } else {
          // Dividir por múltiples espacios "   " o por " - "
          if (rawName.includes('   ')) {
            const parts = rawName.split('   ');
            title = parts[0].trim();
            artistName = parts[1].trim();
          } else if (rawName.includes(' - ')) {
            const parts = rawName.split(' - ');
            artistName = parts[0].trim();
            title = parts[1].trim();
          } else if (rawName.includes('  ')) {
            const parts = rawName.split('  ');
            title = parts[0].trim();
            artistName = parts[1].trim();
          } else {
            title = rawName.trim();
            artistName = 'SoundWave Artist';
          }
        }
      }

      // Reemplazar guiones bajos por espacios en nombres para que queden perfectos
      title = title.replace(/_/g, ' ').trim();
      artistName = artistName.replace(/_/g, ' ').trim();

      // Formatear mayúsculas y minúsculas de forma elegante (Capitalize)
      if (title === title.toLowerCase() || title === title.toUpperCase()) {
        title = title.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      }
      if (artistName === artistName.toLowerCase() || artistName === artistName.toUpperCase()) {
        artistName = artistName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      }

      if (!title) title = 'Canción Premium';
      if (!artistName) artistName = 'SoundWave Artist';

      // Buscar o crear artista
      let artist = await prisma.artist.findFirst({
        where: { name: artistName },
      });

      if (!artist) {
        // Crear un usuario único para este artista
        const safeArtistName = artistName.toLowerCase().replace(/[^a-z0-9]/g, '');
        const artistEmail = `${safeArtistName || 'artist' + uniqueSuffix}@soundwave.com`;
        
        let artistUser = await prisma.user.findUnique({
          where: { email: artistEmail }
        });
        
        if (!artistUser) {
          artistUser = await prisma.user.create({
            data: {
              email: artistEmail,
              password: hashedPassword,
              role: 'ARTIST',
            }
          });
        }

        artist = await prisma.artist.create({
          data: {
            name: artistName,
            bio: `Artista de la colección SoundWave.`,
            userId: artistUser.id,
          },
        });
      }

      // Calcular género basado en título y artista
      const calculatedGenre = getGenreForTrack(title, artistName);

      // Crear track en la base de datos
      await prisma.track.create({
        data: {
          title: title,
          duration: duration,
          url: `/uploads/songs/${filename}`,
          artistId: artist.id,
          genre: calculatedGenre
        },
      });

      insertedCount++;
    } catch (err) {
      console.error(`❌ Error procesando el archivo: ${file}`, err);
    }
  }

  console.log(`✅ Base de datos poblada con éxito. Se insertaron ${insertedCount} canciones con nombres limpios.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
