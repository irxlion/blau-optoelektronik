// Skript zum Erstellen eines Admin-Benutzers
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.SUPABASE_URL || 'https://xtuwjizliuthdgytloju.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0dXdqaXpsaXV0aGRneXRsb2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MTIwMjAsImV4cCI6MjA4MDE4ODAyMH0.U5iQhb_rDZedHFfAMl2tA85jn_kvAp2G6m35CyS0do4';

const supabase = createClient(supabaseUrl, supabaseKey);

// Standard-Zugangsdaten (können als Argumente übergeben werden)
const username = process.argv[2] || 'admin';
const password = process.argv[3] || 'admin123';
const email = process.argv[4] || 'admin@blau-optoelektronik.de';

async function createAdmin() {
    try {
        console.log('Erstelle Admin-Benutzer...');
        console.log(`Username: ${username}`);
        console.log(`E-Mail: ${email}`);

        // Passwort hashen
        const passwordHash = await bcrypt.hash(password, 10);
        console.log('Passwort wurde gehasht');

        // Prüfen ob Benutzer bereits existiert
        const { data: existing } = await supabase
            .from('admins')
            .select('id, username')
            .eq('username', username)
            .maybeSingle();

        if (existing) {
            console.log(`⚠️  Admin "${username}" existiert bereits. Aktualisiere Passwort...`);
            
            const { data, error } = await supabase
                .from('admins')
                .update({
                    password_hash: passwordHash,
                    email: email,
                    is_active: true
                })
                .eq('username', username)
                .select()
                .single();

            if (error) {
                console.error('Fehler beim Aktualisieren:', error);
                process.exit(1);
            }

            console.log('✅ Admin-Benutzer erfolgreich aktualisiert!');
            console.log(`   ID: ${data.id}`);
        } else {
            // Neuen Admin erstellen
            const { data, error } = await supabase
                .from('admins')
                .insert({
                    username: username,
                    password_hash: passwordHash,
                    email: email,
                    is_active: true
                })
                .select()
                .single();

            if (error) {
                console.error('Fehler beim Erstellen:', error);
                process.exit(1);
            }

            console.log('✅ Admin-Benutzer erfolgreich erstellt!');
            console.log(`   ID: ${data.id}`);
        }

        console.log('\n📋 Zugangsdaten:');
        console.log(`   Username: ${username}`);
        console.log(`   Passwort: ${password}`);
        console.log(`   E-Mail: ${email}`);
        console.log('\n⚠️  WICHTIG: Ändern Sie das Passwort nach dem ersten Login!');

    } catch (error) {
        console.error('Fehler:', error);
        process.exit(1);
    }
}

createAdmin();

