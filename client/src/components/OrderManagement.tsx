import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { fetchOrders, updateOrder, deleteOrder, Order } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, Search, Package, Eye, Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-purple-100 text-purple-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
};

export function OrderManagement() {
    const { language } = useLanguage();
    const isEnglish = language === "en";
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        loadOrders();
    }, [statusFilter]);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const params: any = {
                limit: 100,
                offset: 0,
                order_by: "created_at",
                order_direction: "desc",
            };
            if (statusFilter !== "all") {
                params.status = statusFilter;
            }
            const data = await fetchOrders(params);
            setOrders(data.orders);
            setTotal(data.total);
        } catch (error) {
            console.error("Error loading orders:", error);
            toast.error(isEnglish ? "Failed to load orders" : "Fehler beim Laden der Bestellungen");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            await updateOrder({ id: orderId, status: newStatus });
            toast.success(isEnglish ? "Order status updated" : "Bestellstatus aktualisiert");
            loadOrders();
        } catch (error) {
            console.error("Error updating order status:", error);
            toast.error(isEnglish ? "Failed to update order status" : "Fehler beim Aktualisieren des Bestellstatus");
        }
    };

    const handleDeleteClick = (order: Order) => {
        setOrderToDelete(order);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!orderToDelete) return;

        try {
            await deleteOrder(orderToDelete.id);
            toast.success(isEnglish ? "Order deleted successfully" : "Bestellung erfolgreich gelöscht");
            setIsDeleteDialogOpen(false);
            setOrderToDelete(null);
            loadOrders();
        } catch (error) {
            console.error("Error deleting order:", error);
            toast.error(isEnglish ? "Failed to delete order" : "Fehler beim Löschen der Bestellung");
        }
    };

    const filteredOrders = orders.filter((order) => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                order.order_number.toLowerCase().includes(query) ||
                order.company_name.toLowerCase().includes(query) ||
                order.contact_person.toLowerCase().includes(query) ||
                order.email.toLowerCase().includes(query)
            );
        }
        return true;
    });

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString(isEnglish ? "en-US" : "de-DE", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat(isEnglish ? "en-US" : "de-DE", {
            style: "currency",
            currency: "EUR",
        }).format(amount);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        {isEnglish ? "Orders" : "Bestellungen"} ({total})
                    </CardTitle>
                    <Button onClick={loadOrders} variant="outline" size="sm">
                        <Loader2 className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                        {isEnglish ? "Refresh" : "Aktualisieren"}
                    </Button>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={isEnglish ? "Search orders..." : "Bestellungen durchsuchen..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder={isEnglish ? "All statuses" : "Alle Status"} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{isEnglish ? "All statuses" : "Alle Status"}</SelectItem>
                            <SelectItem value="pending">{isEnglish ? "Pending" : "Ausstehend"}</SelectItem>
                            <SelectItem value="confirmed">{isEnglish ? "Confirmed" : "Bestätigt"}</SelectItem>
                            <SelectItem value="processing">{isEnglish ? "Processing" : "In Bearbeitung"}</SelectItem>
                            <SelectItem value="shipped">{isEnglish ? "Shipped" : "Versandt"}</SelectItem>
                            <SelectItem value="delivered">{isEnglish ? "Delivered" : "Geliefert"}</SelectItem>
                            <SelectItem value="cancelled">{isEnglish ? "Cancelled" : "Storniert"}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-muted-foreground">
                            {isEnglish ? "No orders found" : "Keine Bestellungen gefunden"}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[120px]">{isEnglish ? "Order #" : "Bestell-Nr."}</TableHead>
                                    <TableHead className="min-w-[150px]">{isEnglish ? "Company" : "Firma"}</TableHead>
                                    <TableHead className="min-w-[120px]">{isEnglish ? "Contact" : "Kontakt"}</TableHead>
                                    <TableHead className="min-w-[100px]">{isEnglish ? "Total" : "Gesamt"}</TableHead>
                                    <TableHead className="min-w-[120px]">{isEnglish ? "Status" : "Status"}</TableHead>
                                    <TableHead className="min-w-[150px]">{isEnglish ? "Date" : "Datum"}</TableHead>
                                    <TableHead className="min-w-[100px]">{isEnglish ? "Actions" : "Aktionen"}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">{order.order_number}</TableCell>
                                        <TableCell>{order.company_name}</TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div>{order.contact_person}</div>
                                                <div className="text-muted-foreground">{order.email}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            {formatCurrency(order.total_amount)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800"}>
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {formatDate(order.created_at)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2 items-center">
                                                <Dialog open={isDetailOpen && selectedOrder?.id === order.id} onOpenChange={(open) => {
                                                    setIsDetailOpen(open);
                                                    if (!open) setSelectedOrder(null);
                                                }}>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                setSelectedOrder(order);
                                                                setIsDetailOpen(true);
                                                            }}
                                                            title={isEnglish ? "View details" : "Details anzeigen"}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-[98vw] w-[98vw] max-h-[90vh] overflow-y-auto overflow-x-hidden">
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                {isEnglish ? "Order Details" : "Bestelldetails"} - {order.order_number}
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                {isEnglish ? "View and manage order information" : "Bestellinformationen anzeigen und verwalten"}
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        {selectedOrder && (
                                                            <div className="space-y-6 mt-4">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div>
                                                                        <h3 className="font-semibold mb-2">{isEnglish ? "Company Information" : "Firmeninformationen"}</h3>
                                                                        <div className="space-y-1 text-sm">
                                                                            <p><strong>{isEnglish ? "Company:" : "Firma:"}</strong> {selectedOrder.company_name}</p>
                                                                            <p><strong>{isEnglish ? "Contact:" : "Kontakt:"}</strong> {selectedOrder.contact_person}</p>
                                                                            <p><strong>{isEnglish ? "Email:" : "E-Mail:"}</strong> {selectedOrder.email}</p>
                                                                            {selectedOrder.phone && (
                                                                                <p><strong>{isEnglish ? "Phone:" : "Telefon:"}</strong> {selectedOrder.phone}</p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <h3 className="font-semibold mb-2">{isEnglish ? "Order Summary" : "Bestellübersicht"}</h3>
                                                                        <div className="space-y-1 text-sm">
                                                                            <p className="whitespace-nowrap"><strong>{isEnglish ? "Subtotal (net):" : "Zwischensumme (netto):"}</strong> {formatCurrency(selectedOrder.subtotal_net)}</p>
                                                                            <p className="whitespace-nowrap"><strong>{isEnglish ? "Tax (19%):" : "MwSt. (19%):"}</strong> {formatCurrency(selectedOrder.tax_amount)}</p>
                                                                            <p className="whitespace-nowrap"><strong>{isEnglish ? "Total:" : "Gesamt:"}</strong> {formatCurrency(selectedOrder.total_amount)}</p>
                                                                            <p className="whitespace-nowrap"><strong>{isEnglish ? "Payment:" : "Zahlung:"}</strong> {selectedOrder.payment_method}</p>
                                                                            <p className="whitespace-nowrap"><strong>{isEnglish ? "Shipping:" : "Versand:"}</strong> {selectedOrder.shipping_method}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div>
                                                                        <h3 className="font-semibold mb-2">{isEnglish ? "Billing Address" : "Rechnungsadresse"}</h3>
                                                                        <div className="text-sm">
                                                                            <p>{selectedOrder.billing_street}</p>
                                                                            <p>{selectedOrder.billing_postal_code} {selectedOrder.billing_city}</p>
                                                                            <p>{selectedOrder.billing_country}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="font-semibold mb-2">{isEnglish ? "Shipping Address" : "Lieferadresse"}</h3>
                                                                        <div className="text-sm">
                                                                            <p>{selectedOrder.shipping_street}</p>
                                                                            <p>{selectedOrder.shipping_postal_code} {selectedOrder.shipping_city}</p>
                                                                            <p>{selectedOrder.shipping_country}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-semibold mb-2">{isEnglish ? "Order Items" : "Bestellpositionen"}</h3>
                                                                    <div className="border rounded-lg overflow-x-auto">
                                                                        <Table className="w-full table-fixed">
                                                                            <TableHeader>
                                                                                <TableRow>
                                                                                    <TableHead className="w-[30%]">{isEnglish ? "Product" : "Produkt"}</TableHead>
                                                                                    <TableHead className="w-[15%]">{isEnglish ? "SKU" : "SKU"}</TableHead>
                                                                                    <TableHead className="text-right w-[10%]">{isEnglish ? "Quantity" : "Menge"}</TableHead>
                                                                                    <TableHead className="text-right w-[22%]">{isEnglish ? "Unit Price" : "Einzelpreis"}</TableHead>
                                                                                    <TableHead className="text-right w-[23%]">{isEnglish ? "Total" : "Gesamt"}</TableHead>
                                                                                </TableRow>
                                                                            </TableHeader>
                                                                            <TableBody>
                                                                                {selectedOrder.items.map((item: any, index: number) => (
                                                                                    <TableRow key={index}>
                                                                                        <TableCell className="w-[30%] break-words">{item.product_name}</TableCell>
                                                                                        <TableCell className="w-[15%]">{item.product_sku}</TableCell>
                                                                                        <TableCell className="text-right w-[10%]">{item.quantity}</TableCell>
                                                                                        <TableCell className="text-right w-[22%] whitespace-nowrap">{formatCurrency(item.unit_price)}</TableCell>
                                                                                        <TableCell className="text-right w-[23%] whitespace-nowrap">{formatCurrency(item.total_price)}</TableCell>
                                                                                    </TableRow>
                                                                                ))}
                                                                            </TableBody>
                                                                        </Table>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-semibold mb-2">{isEnglish ? "Update Status" : "Status aktualisieren"}</h3>
                                                                    <Select
                                                                        value={selectedOrder.status}
                                                                        onValueChange={(value) => {
                                                                            handleStatusChange(selectedOrder.id, value);
                                                                            setSelectedOrder({ ...selectedOrder, status: value });
                                                                        }}
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="pending">{isEnglish ? "Pending" : "Ausstehend"}</SelectItem>
                                                                            <SelectItem value="confirmed">{isEnglish ? "Confirmed" : "Bestätigt"}</SelectItem>
                                                                            <SelectItem value="processing">{isEnglish ? "Processing" : "In Bearbeitung"}</SelectItem>
                                                                            <SelectItem value="shipped">{isEnglish ? "Shipped" : "Versandt"}</SelectItem>
                                                                            <SelectItem value="delivered">{isEnglish ? "Delivered" : "Geliefert"}</SelectItem>
                                                                            <SelectItem value="cancelled">{isEnglish ? "Cancelled" : "Storniert"}</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </DialogContent>
                                                </Dialog>
                                                <Select
                                                    value={order.status}
                                                    onValueChange={(value) => handleStatusChange(order.id, value)}
                                                >
                                                    <SelectTrigger className="w-[140px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">{isEnglish ? "Pending" : "Ausstehend"}</SelectItem>
                                                        <SelectItem value="confirmed">{isEnglish ? "Confirmed" : "Bestätigt"}</SelectItem>
                                                        <SelectItem value="processing">{isEnglish ? "Processing" : "In Bearbeitung"}</SelectItem>
                                                        <SelectItem value="shipped">{isEnglish ? "Shipped" : "Versandt"}</SelectItem>
                                                        <SelectItem value="delivered">{isEnglish ? "Delivered" : "Geliefert"}</SelectItem>
                                                        <SelectItem value="cancelled">{isEnglish ? "Cancelled" : "Storniert"}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteClick(order)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    title={isEnglish ? "Delete order" : "Bestellung löschen"}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {isEnglish ? "Delete Order?" : "Bestellung löschen?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {isEnglish 
                                ? `Are you sure you want to delete order ${orderToDelete?.order_number}? This action cannot be undone.`
                                : `Möchten Sie die Bestellung ${orderToDelete?.order_number} wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {isEnglish ? "Cancel" : "Abbrechen"}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isEnglish ? "Delete" : "Löschen"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}
