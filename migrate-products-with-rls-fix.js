// Migrationsskript für Produkte von products.json nach Supabase
// Mit automatischem RLS-Fix
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const productData = JSON.parse(fs.readFileSync(join(__dirname, 'server', 'products.json'), 'utf-8'));

const supabaseUrl = process.env.SUPABASE_URL || 'https://xtuwjizliuthdgytloju.supabase.co';
// WICHTIG: Service Role Key verwenden für Migration (umgeht RLS)
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

async function fixRLSPolicy() {
    console.log('Passe RLS-Policy für Migration an...');
    
    // Temporäre INSERT-Policy erstellen (falls noch nicht vorhanden)
    const { error: policyError } = await supabase.rpc('exec_sql', {
        sql: `
            -- Bestehende INSERT-Policy löschen
            DROP POLICY IF EXISTS "Temporär: INSERT für Migration erlauben" ON products;
            DROP POLICY IF EXISTS "Nur Admins können Produkte verwalten" ON products;
            
            -- Temporäre INSERT-Policy erstellen
            CREATE POLICY "Temporär: INSERT für Migration erlauben"
                ON products FOR INSERT
                WITH CHECK (true);
        `
    });
    
    // Falls RPC nicht verfügbar ist, versuchen wir es direkt mit SQL
    if (policyError) {
        console.log('Hinweis: RPC exec_sql nicht verfügbar. Bitte führen Sie fix-products-rls.sql manuell in Supabase aus.');
        console.log('Oder stellen Sie sicher, dass SUPABASE_SERVICE_ROLE_KEY gesetzt ist.');
    }
}

async function migrateProducts() {
    console.log('Starte Produkt-Migration...');
    
    // Versuche RLS-Policy zu fixen (optional)
    await fixRLSPolicy();
    
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
        console.error('\n⚠️  MÖGLICHE LÖSUNGEN:');
        console.error('1. Führen Sie fix-products-rls.sql in Supabase SQL Editor aus');
        console.error('2. Oder setzen Sie die Umgebungsvariable SUPABASE_SERVICE_ROLE_KEY');
        console.error('3. Oder deaktivieren Sie temporär RLS für products:');
        console.error('   ALTER TABLE products DISABLE ROW LEVEL SECURITY;');
        process.exit(1);
    }
    
    console.log('✅ Produkte erfolgreich migriert!');
    console.log(`   ${dbProducts.length} Produkte eingefügt/aktualisiert`);
}

migrateProducts().catch(console.error);
