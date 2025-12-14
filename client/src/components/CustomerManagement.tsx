import { useState, useEffect } from "react";
import { Customer, fetchCustomers, createCustomer, updateCustomer, deleteCustomer } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function CustomerManagement() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterActive, setFilterActive] = useState<boolean | undefined>(undefined);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);
    const [formData, setFormData] = useState<Partial<Customer> & { password?: string }>({});

    useEffect(() => {
        loadCustomers();
    }, [searchTerm, filterActive]);

    const loadCustomers = async () => {
        setLoading(true);
        try {
            const response = await fetchCustomers(searchTerm || undefined, filterActive, 100, 0);
            setCustomers(response.customers);
        } catch (error) {
            toast.error("Fehler beim Laden der Kunden");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingCustomer(undefined);
        setFormData({
            username: "",
            password: "",
            email: "",
            company_name: "",
            first_name: "",
            last_name: "",
            phone: "",
            address: "",
            city: "",
            postal_code: "",
            country: "",
            is_active: true,
        });
        setIsFormOpen(true);
    };

    const handleEdit = (customer: Customer) => {
        setEditingCustomer(customer);
        setFormData({
            ...customer,
            password: "", // Passwort nicht vorausfüllen
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Möchten Sie diesen Kunden wirklich löschen?")) return;

        try {
            await deleteCustomer(id);
            toast.success("Kunde gelöscht");
            loadCustomers();
        } catch (error: any) {
            toast.error(error.message || "Fehler beim Löschen");
        }
    };

    const handleSave = async () => {
        try {
            if (editingCustomer) {
                await updateCustomer({ ...formData, id: editingCustomer.id } as Customer & { id: string });
                toast.success("Kunde aktualisiert");
            } else {
                if (!formData.password) {
                    toast.error("Passwort ist erforderlich");
                    return;
                }
                await createCustomer(formData as Customer & { password: string });
                toast.success("Kunde erstellt");
            }
            setIsFormOpen(false);
            loadCustomers();
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

    const filteredCustomers = customers.filter((customer) => {
        if (filterActive !== undefined && customer.is_active !== filterActive) {
            return false;
        }
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            return (
                customer.username?.toLowerCase().includes(searchLower) ||
                customer.email?.toLowerCase().includes(searchLower) ||
                customer.company_name?.toLowerCase().includes(searchLower) ||
                customer.first_name?.toLowerCase().includes(searchLower) ||
                customer.last_name?.toLowerCase().includes(searchLower)
            );
        }
        return true;
    });

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="text-xl sm:text-2xl">Kundenverwaltung</CardTitle>
                    <Button onClick={handleAdd} className="w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" /> 
                        <span className="hidden sm:inline">Neuer Kunde</span>
                        <span className="sm:hidden">Neu</span>
                    </Button>
                </CardHeader>
                <CardContent>
                    {/* Such- und Filterbereich */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Suche nach Name, E-Mail, Firma..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="filter-active" className="text-sm">Nur aktive</Label>
                                <Switch
                                    id="filter-active"
                                    checked={filterActive === true}
                                    onCheckedChange={(checked) => setFilterActive(checked ? true : undefined)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Label htmlFor="filter-inactive" className="text-sm">Nur inaktive</Label>
                                <Switch
                                    id="filter-inactive"
                                    checked={filterActive === false}
                                    onCheckedChange={(checked) => setFilterActive(checked ? false : undefined)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Kundenliste */}
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : filteredCustomers.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            Keine Kunden gefunden
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
                                            <TableHead>Firma</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Aktionen</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredCustomers.map((customer) => (
                                            <TableRow key={customer.id}>
                                                <TableCell className="font-medium">{customer.username}</TableCell>
                                                <TableCell>{customer.email || "-"}</TableCell>
                                                <TableCell>{customer.company_name || "-"}</TableCell>
                                                <TableCell>
                                                    {customer.first_name || customer.last_name
                                                        ? `${customer.first_name || ""} ${customer.last_name || ""}`.trim()
                                                        : "-"}
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs ${
                                                            customer.is_active
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}
                                                    >
                                                        {customer.is_active ? "Aktiv" : "Inaktiv"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleEdit(customer)}
                                                            className="h-10 w-10"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDelete(customer.id)}
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
                                {filteredCustomers.map((customer) => (
                                    <div
                                        key={customer.id}
                                        className="border rounded-lg p-4 bg-white shadow-sm"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-base truncate">{customer.username}</h3>
                                                {customer.email && (
                                                    <p className="text-sm text-gray-500 truncate mt-1">{customer.email}</p>
                                                )}
                                            </div>
                                            <span
                                                className={`px-2 py-1 rounded text-xs flex-shrink-0 ml-2 ${
                                                    customer.is_active
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {customer.is_active ? "Aktiv" : "Inaktiv"}
                                            </span>
                                        </div>
                                        <div className="space-y-1 text-sm mb-3">
                                            {customer.company_name && (
                                                <div>
                                                    <span className="text-gray-500">Firma: </span>
                                                    <span className="font-medium">{customer.company_name}</span>
                                                </div>
                                            )}
                                            {(customer.first_name || customer.last_name) && (
                                                <div>
                                                    <span className="text-gray-500">Name: </span>
                                                    <span className="font-medium">
                                                        {`${customer.first_name || ""} ${customer.last_name || ""}`.trim()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2 pt-2 border-t">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(customer)}
                                                className="flex-1"
                                            >
                                                <Pencil className="h-4 w-4 mr-2" />
                                                Bearbeiten
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(customer.id)}
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

            {/* Kunden-Formular */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
                    <DialogHeader>
                        <DialogTitle className="text-lg sm:text-xl">{editingCustomer ? "Kunde bearbeiten" : "Neuer Kunde"}</DialogTitle>
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
                                    Passwort {editingCustomer ? "(leer lassen zum Beibehalten)" : "*"}
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password || ""}
                                    onChange={handleChange}
                                    required={!editingCustomer}
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
                                <Label htmlFor="company_name">Firmenname</Label>
                                <Input
                                    id="company_name"
                                    name="company_name"
                                    value={formData.company_name || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="first_name">Vorname</Label>
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    value={formData.first_name || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_name">Nachname</Label>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    value={formData.last_name || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Telefon</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={formData.phone || ""}
                                    onChange={handleChange}
                                />
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
                        <div className="space-y-2">
                            <Label htmlFor="address">Adresse</Label>
                            <Input
                                id="address"
                                name="address"
                                value={formData.address || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">Stadt</Label>
                                <Input id="city" name="city" value={formData.city || ""} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="postal_code">PLZ</Label>
                                <Input
                                    id="postal_code"
                                    name="postal_code"
                                    value={formData.postal_code || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Land</Label>
                                <Input
                                    id="country"
                                    name="country"
                                    value={formData.country || ""}
                                    onChange={handleChange}
                                />
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

