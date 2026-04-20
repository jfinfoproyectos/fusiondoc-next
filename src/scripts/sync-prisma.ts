import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const provider = process.env.DATABASE_PROVIDER || 'postgresql';
const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');

function syncPrismaProvider() {
  if (!fs.existsSync(schemaPath)) {
    console.error(`❌ No se encontró el archivo de esquema en: ${schemaPath}`);
    process.exit(1);
  }

  let content = fs.readFileSync(schemaPath, 'utf8');

  // Regex para encontrar el bloque datasource y su provider
  const datasourceRegex = /(datasource\s+db\s*{[\s\S]*?provider\s*=\s*")([^"]+)("\s*[\s\S]*?})/;
  
  const match = content.match(datasourceRegex);
  
  if (!match) {
    console.error('❌ No se pudo encontrar el bloque "datasource db" o el campo "provider" en schema.prisma');
    process.exit(1);
  }

  const currentProvider = match[2];

  if (currentProvider === provider) {
    console.log(`✅ El proveedor de Prisma ya está sincronizado (${provider}).`);
    return;
  }

  console.log(`🔄 Sincronizando proveedor de Prisma: ${currentProvider} -> ${provider}`);
  
  const newContent = content.replace(datasourceRegex, `$1${provider}$3`);
  
  fs.writeFileSync(schemaPath, newContent, 'utf8');
  console.log('✨ schema.prisma actualizado correctamente.');
}

syncPrismaProvider();
