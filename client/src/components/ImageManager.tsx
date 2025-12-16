import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X, GripVertical, Star, StarOff, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageItem {
    id: string;
    url: string;
    path: string;
}

interface ImageManagerProps {
    images: ImageItem[];
    mainImage?: string;
    onImagesChange: (images: ImageItem[]) => void;
    onMainImageChange: (url: string) => void;
    onDelete: (path: string) => void;
    disabled?: boolean;
    isEnglish?: boolean;
}

export function ImageManager({
    images,
    mainImage,
    onImagesChange,
    onMainImageChange,
    onDelete,
    disabled = false,
    isEnglish = false,
}: ImageManagerProps) {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const handleDragStart = (index: number) => {
        if (disabled) return;
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        if (disabled || draggedIndex === null) return;
        e.preventDefault();
        setDragOverIndex(index);
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        if (disabled || draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }

        e.preventDefault();
        const newImages = [...images];
        const [draggedItem] = newImages.splice(draggedIndex, 1);
        newImages.splice(dropIndex, 0, draggedItem);
        
        onImagesChange(newImages);
        setDraggedIndex(null);
        setDragOverIndex(null);
        toast.success(isEnglish ? "Image order updated" : "Bildreihenfolge aktualisiert");
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const setAsMain = (url: string) => {
        onMainImageChange(url);
        toast.success(isEnglish ? "Main image set" : "Hauptbild gesetzt");
    };

    const removeMain = () => {
        onMainImageChange("");
        toast.success(isEnglish ? "Main image removed" : "Hauptbild entfernt");
    };

    if (images.length === 0) {
        return (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                    {isEnglish ? "No images uploaded" : "Keine Bilder hochgeladen"}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((img, index) => {
                    const isMain = mainImage === img.url;
                    const isDragging = draggedIndex === index;
                    const isDragOver = dragOverIndex === index;

                    return (
                        <div
                            key={img.id || index}
                            draggable={!disabled}
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                            className={cn(
                                "relative group cursor-move rounded-lg border-2 overflow-hidden transition-all",
                                isMain && "border-primary ring-2 ring-primary ring-offset-2",
                                isDragging && "opacity-50 scale-95",
                                isDragOver && "border-primary scale-105",
                                !disabled && "hover:shadow-lg"
                            )}
                        >
                            <div className="aspect-square relative">
                                <img
                                    src={img.url}
                                    alt={`Image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                
                                {/* Drag Handle */}
                                {!disabled && (
                                    <div className="absolute top-1 left-1 bg-black/50 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <GripVertical className="h-3 w-3 text-white" />
                                    </div>
                                )}

                                {/* Main Image Badge */}
                                {isMain && (
                                    <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1">
                                        <Star className="h-3 w-3 fill-current" />
                                    </div>
                                )}

                                {/* Overlay mit Aktionen */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <div className="flex flex-col gap-1">
                                        {!isMain ? (
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => setAsMain(img.url)}
                                                className="h-8 text-xs"
                                                title={isEnglish ? "Set as main image" : "Als Hauptbild setzen"}
                                            >
                                                <Star className="h-3 w-3 mr-1" />
                                                {isEnglish ? "Main" : "Haupt"}
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                onClick={removeMain}
                                                className="h-8 text-xs"
                                                title={isEnglish ? "Remove main image" : "Hauptbild entfernen"}
                                            >
                                                <StarOff className="h-3 w-3 mr-1" />
                                                {isEnglish ? "Remove" : "Entfernen"}
                                            </Button>
                                        )}
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => onDelete(img.path)}
                                            className="h-8 text-xs"
                                            title={isEnglish ? "Delete image" : "Bild löschen"}
                                        >
                                            <X className="h-3 w-3 mr-1" />
                                            {isEnglish ? "Delete" : "Löschen"}
                                        </Button>
                                    </div>
                                </div>

                                {/* Index Badge */}
                                <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                                    #{index + 1}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Info Text */}
            <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                    <GripVertical className="h-3 w-3" />
                    {isEnglish ? "Drag to reorder" : "Ziehen zum Sortieren"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {isEnglish ? "Click star to set main image" : "Stern klicken für Hauptbild"}
                </span>
            </div>
        </div>
    );
}
