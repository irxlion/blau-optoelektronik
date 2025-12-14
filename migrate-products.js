// Migrationsskript für Produkte von products.json nach Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const productData = JSON.parse(fs.readFileSync(join(__dirname, 'server', 'products.json'), 'utf-8'));

const supabaseUrl = process.env.SUPABASE_URL || 'https://xtuwjizliuthdgytloju.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0dXdqaXpsaXV0aGRneXRsb2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MTIwMjAsImV4cCI6MjA4MDE4ODAyMH0.U5iQhb_rDZedHFfAMl2tA85jn_kvAp2G6m35CyS0do4';

const supabase = createClient(supabaseUrl, supabaseKey);

function frontendProductToDbProduct(product, language) {
    return {
        product_id: product.id,
        language: language,
        name: product.name,
        category: product.category,
        description: product.description,
        long_description: product.longDescription,
        image: product.image,
        images: product.images || [],
        features: product.features || [],
        specifications: product.specifications || {},
        applications: product.applications || [],
        downloads: product.downloads || [],
        is_active: true
    };
}

async function migrateProducts() {
    console.log('Starte Produkt-Migration...');
    
    const dbProducts = [];
    
    // Deutsche Produkte
    productData.de.forEach(product => {
        dbProducts.push(frontendProductToDbProduct(product, 'de'));
    });
    
    // Englische Produkte
    productData.en.forEach(product => {
        dbProducts.push(frontendProductToDbProduct(product, 'en'));
    });
    
    console.log(`Migriere ${dbProducts.length} Produkte...`);
    
    // Upsert alle Produkte
    const { data, error } = await supabase
        .from('products')
        .upsert(dbProducts, {
            onConflict: 'product_id,language',
            ignoreDuplicates: false
        });
    
    if (error) {
        console.error('Fehler beim Migrieren:', error);
        process.exit(1);
    }
    
    console.log('✅ Produkte erfolgreich migriert!');
    console.log(`   ${dbProducts.length} Produkte eingefügt/aktualisiert`);
}

migrateProducts().catch(console.error);

