import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';

/**
 * GeoNames Importer
 * 
 * Downloads and imports location data from GeoNames.org
 * Free geographical database covering all countries
 * 
 * Data files: http://download.geonames.org/export/dump/
 * 
 * Usage:
 *   npm run import:geonames -- --file=allCountries.txt --limit=10000
 *   npm run import:geonames -- --country=DE --type=cities
 */

const prisma = new PrismaClient();

interface GeoNamesEntry {
  geonameid: string;
  name: string;
  asciiname: string;
  alternatenames: string;
  latitude: number;
  longitude: number;
  feature_class: string;
  feature_code: string;
  country_code: string;
  cc2: string;
  admin1_code: string;
  admin2_code: string;
  admin3_code: string;
  admin4_code: string;
  population: number;
  elevation: string;
  dem: string;
  timezone: string;
  modification_date: string;
}

async function parseGeoNamesFile(filePath: string, limit?: number): Promise<GeoNamesEntry[]> {
  const entries: GeoNamesEntry[] = [];
  
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let count = 0;
  for await (const line of rl) {
    if (limit && count >= limit) break;
    
    const parts = line.split('\t');
    if (parts.length < 19) continue;

    entries.push({
      geonameid: parts[0],
      name: parts[1],
      asciiname: parts[2],
      alternatenames: parts[3],
      latitude: parseFloat(parts[4]),
      longitude: parseFloat(parts[5]),
      feature_class: parts[6],
      feature_code: parts[7],
      country_code: parts[8],
      cc2: parts[9],
      admin1_code: parts[10],
      admin2_code: parts[11],
      admin3_code: parts[12],
      admin4_code: parts[13],
      population: parseInt(parts[14]) || 0,
      elevation: parts[15],
      dem: parts[16],
      timezone: parts[17],
      modification_date: parts[18],
    });

    count++;
  }

  return entries;
}

async function importCities(entries: GeoNamesEntry[]) {
  console.log('🏙️ Importing cities from GeoNames...');
  
  // Filter for cities (P.PPL* feature codes)
  const cityEntries = entries.filter(e => 
    e.feature_class === 'P' && e.feature_code.startsWith('PPL')
  );

  const countries = await prisma.country.findMany();
  const countryMap = new Map(countries.map(c => [c.iso2, c.id]));

  let imported = 0;
  let skipped = 0;

  for (const entry of cityEntries) {
    const countryId = countryMap.get(entry.country_code);
    if (!countryId) {
      skipped++;
      continue;
    }

    const slug = entry.asciiname.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    try {
      await prisma.$executeRaw`
        INSERT INTO cities (
          id, country_id, name, slug, name_en, population, location, timezone, 
          is_major_city, created_at, updated_at
        ) VALUES (
          gen_random_uuid(),
          ${countryId}::uuid,
          ${entry.name},
          ${slug},
          ${entry.asciiname},
          ${entry.population},
          ST_SetSRID(ST_MakePoint(${entry.longitude}, ${entry.latitude}), 4326),
          ${entry.timezone},
          ${entry.population > 100000},
          NOW(),
          NOW()
        )
        ON CONFLICT (country_id, slug) DO UPDATE SET
          population = EXCLUDED.population,
          is_major_city = EXCLUDED.is_major_city,
          updated_at = NOW()
      `;
      
      imported++;
      
      if (imported % 1000 === 0) {
        console.log(`✅ Imported ${imported} cities...`);
      }
    } catch (error) {
      console.error(`❌ Error importing ${entry.name}:`, error);
    }
  }

  console.log(`\n✅ Imported ${imported} cities, skipped ${skipped}`);
}

async function importPOIs(entries: GeoNamesEntry[]) {
  console.log('📍 Importing POIs from GeoNames...');
  
  // Filter for POIs (airports, museums, landmarks, etc.)
  const poiEntries = entries.filter(e => 
    e.feature_class === 'S' || // Spots, buildings
    e.feature_code === 'AIRP' || // Airports
    e.feature_code === 'MUS' // Museums
  );

  const cities = await prisma.city.findMany();
  
  let imported = 0;

  for (const entry of poiEntries) {
    // Find nearest city (simplified - in production use geo-query)
    const nearestCity = cities.find(c => c.country?.iso2 === entry.country_code);
    if (!nearestCity) continue;

    const slug = entry.asciiname.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    let poiType = 'LANDMARK';
    
    if (entry.feature_code === 'AIRP') poiType = 'AIRPORT';
    else if (entry.feature_code === 'MUS') poiType = 'MUSEUM';

    try {
      await prisma.$executeRaw`
        INSERT INTO points_of_interest (
          id, city_id, type, name, slug, location, external_id, created_at, updated_at
        ) VALUES (
          gen_random_uuid(),
          ${nearestCity.id}::uuid,
          ${poiType}::poi_type,
          ${entry.name},
          ${slug},
          ST_SetSRID(ST_MakePoint(${entry.longitude}, ${entry.latitude}), 4326),
          ${entry.geonameid},
          NOW(),
          NOW()
        )
        ON CONFLICT (city_id, slug) DO NOTHING
      `;
      
      imported++;
    } catch (error) {
      // Ignore duplicates
    }
  }

  console.log(`\n✅ Imported ${imported} POIs`);
}

async function main() {
  const args = process.argv.slice(2);
  const fileArg = args.find(a => a.startsWith('--file='));
  const limitArg = args.find(a => a.startsWith('--limit='));
  const countryArg = args.find(a => a.startsWith('--country='));
  const typeArg = args.find(a => a.startsWith('--type='));

  if (!fileArg) {
    console.error('❌ Please provide --file=path/to/geonames.txt');
    console.log('\nDownload data from: http://download.geonames.org/export/dump/');
    console.log('Example: wget http://download.geonames.org/export/dump/DE.zip');
    process.exit(1);
  }

  const filePath = fileArg.split('=')[1];
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : undefined;
  const country = countryArg ? countryArg.split('=')[1] : undefined;
  const type = typeArg ? typeArg.split('=')[1] : 'cities';

  console.log(`\n🌍 GeoNames Importer`);
  console.log(`📁 File: ${filePath}`);
  console.log(`🔢 Limit: ${limit || 'No limit'}`);
  console.log(`🌎 Country: ${country || 'All countries'}`);
  console.log(`📍 Type: ${type}\n`);

  try {
    console.log('📖 Parsing GeoNames file...');
    let entries = await parseGeoNamesFile(filePath, limit);
    
    if (country) {
      entries = entries.filter(e => e.country_code === country);
    }

    console.log(`✅ Parsed ${entries.length} entries\n`);

    if (type === 'cities' || type === 'all') {
      await importCities(entries);
    }

    if (type === 'pois' || type === 'all') {
      await importPOIs(entries);
    }

    console.log('\n✅ Import completed successfully!');
  } catch (error) {
    console.error('❌ Error during import:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
