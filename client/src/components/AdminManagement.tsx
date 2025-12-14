import { useState, useEffect } from "react";
import { fetchAdmins, createAdmin, updateAdmin, deleteAdmin } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, Loader2, Shield, User } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export interface Admin {
    id: string;
    username: string;
    email?: string;
    role: 'admin' | 'mitarbeiter';
    created_at?: string;
    updated_at?: string;
    last_login?: string;
    is_active: boolean;
}

export function AdminManagement() {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<Admin | undefined>(undefined);
    const [formData, setFormData] = useState<Partial<Admin> & { password?: string }>({});

    useEffect(() => {
        loadAdmins();
    }, [searchTerm]);

    const loadAdmins = async () => {
        setLoading(true);
        try {
            const response = await fetchAdmins(searchTerm || undefined);
            setAdmins(response.admins);
        } catch (error) {
            toast.error("Fehler beim Laden der Admins");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingAdmin(undefined);
        setFormData({
            username: "",
            password: "",
            email: "",
            role: "mitarbeiter",
            is_active: true,
        });
        setIsFormOpen(true);
    };

    const handleEdit = (admin: Admin) => {
        setEditingAdmin(admin);
        setFormData({
            ...admin,
            password: "", // Passwort nicht vorausfüllen
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Möchten Sie diesen Admin wirklich löschen?")) return;

        try {
            await deleteAdmin(id);
            toast.success("Admin gelöscht");
            loadAdmins();
        } catch (error: any) {
            toast.error(error.message || "Fehler beim Löschen");
        }
    };

    const handleSave = async () => {
        try {
            if (editingAdmin) {
                await updateAdmin({ ...formData, id: editingAdmin.id } as Admin & { id: string });
                toast.success("Admin aktualisiert");
            } else {
                if (!formData.password) {
                    toast.error("Passwort ist erforderlich");
                    return;
                }
                await createAdmin(formData as Admin & { password: string });
                toast.success("Admin erstellt");
            }
            setIsFormOpen(false);
            loadAdmins();
        } catch (error: any) {
            toast.error(error.message || "Fehler beim Speichern");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const filteredAdmins = admins.filter((admin) => {
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            return (
                admin.username?.toLowerCase().includes(searchLower) ||
                admin.email?.toLowerCase().includes(searchLower)
            );
        }
        return true;
    });

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="text-xl sm:text-2xl">Admin-Verwaltung</CardTitle>
                    <Button onClick={handleAdd} className="w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" /> 
                        <span className="hidden sm:inline">Neuer Admin</span>
                        <span className="sm:hidden">Neu</span>
                    </Button>
                </CardHeader>
                <CardContent>
                    {/* Suchbereich */}
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Suche nach Benutzername oder E-Mail..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>

                    {/* Admin-Liste */}
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : filteredAdmins.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            Keine Admins gefunden
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden md:block border rounded-lg overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Benutzername</TableHead>
                                            <TableHead>E-Mail</TableHead>
                                            <TableHead>Rolle</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Aktionen</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredAdmins.map((admin) => (
                                            <TableRow key={admin.id}>
                                                <TableCell className="font-medium">{admin.username}</TableCell>
                                                <TableCell>{admin.email || "-"}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {admin.role === 'admin' ? (
                                                            <>
                                                                <Shield className="h-4 w-4 text-blue-500" />
                                                                <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                                                                    Admin
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <User className="h-4 w-4 text-green-500" />
                                                                <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                                                                    Mitarbeiter
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs ${
                                                            admin.is_active
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}
                                                    >
                                                        {admin.is_active ? "Aktiv" : "Inaktiv"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleEdit(admin)}
                                                            className="h-10 w-10"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDelete(admin.id)}
                                                            className="h-10 w-10"
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden space-y-3">
                                {filteredAdmins.map((admin) => (
                                    <div
                                        key={admin.id}
                                        className="border rounded-lg p-4 bg-white shadow-sm"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-base truncate">{admin.username}</h3>
                                                {admin.email && (
                                                    <p className="text-sm text-gray-500 truncate mt-1">{admin.email}</p>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-2 items-end ml-2">
                                                <div className="flex items-center gap-2">
                                                    {admin.role === 'admin' ? (
                                                        <>
                                                            <Shield className="h-4 w-4 text-blue-500" />
                                                            <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                                                                Admin
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <User className="h-4 w-4 text-green-500" />
                                                            <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                                                                Mitarbeiter
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                                <span
                                                    className={`px-2 py-1 rounded text-xs ${
                                                        admin.is_active
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {admin.is_active ? "Aktiv" : "Inaktiv"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 pt-2 border-t">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(admin)}
                                                className="flex-1"
                                            >
                                                <Pencil className="h-4 w-4 mr-2" />
                                                Bearbeiten
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(admin.id)}
                                                className="flex-1 text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Löschen
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Admin-Formular */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
                    <DialogHeader>
                        <DialogTitle className="text-lg sm:text-xl">{editingAdmin ? "Admin bearbeiten" : "Neuer Admin"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Benutzername *</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    value={formData.username || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    Passwort {editingAdmin ? "(leer lassen zum Beibehalten)" : "*"}
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password || ""}
                                    onChange={handleChange}
                                    required={!editingAdmin}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">E-Mail</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Rolle *</Label>
                                <Select
                                    value={formData.role || "mitarbeiter"}
                                    onValueChange={(value: 'admin' | 'mitarbeiter') =>
                                        setFormData((prev) => ({ ...prev, role: value }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">
                                            <div className="flex items-center gap-2">
                                                <Shield className="h-4 w-4" /> Admin
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="mitarbeiter">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4" /> Mitarbeiter
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-gray-500">
                                    {formData.role === 'admin' 
                                        ? "Vollständiger Zugriff auf alle Funktionen"
                                        : "Kann Kunden und Produkte verwalten"}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="is_active">Status</Label>
                                <div className="flex items-center gap-2 pt-2">
                                    <Switch
                                        id="is_active"
                                        checked={formData.is_active !== false}
                                        onCheckedChange={(checked) =>
                                            setFormData((prev) => ({ ...prev, is_active: checked }))
                                        }
                                    />
                                    <Label htmlFor="is_active" className="cursor-pointer">
                                        {formData.is_active ? "Aktiv" : "Inaktiv"}
                                    </Label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                            Abbrechen
                        </Button>
                        <Button type="button" onClick={handleSave}>
                            Speichern
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

