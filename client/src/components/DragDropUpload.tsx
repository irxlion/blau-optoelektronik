import { useState, useRef, useCallback } from "react";
import { Upload, X, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DragDropUploadProps {
    onImageUpload?: (file: File) => Promise<void>;
    onPDFUpload?: (file: File) => Promise<void>;
    acceptImages?: boolean;
    acceptPDFs?: boolean;
    maxImageSize?: number; // in MB
    maxPDFSize?: number; // in MB
    disabled?: boolean;
    className?: string;
    multiple?: boolean;
}

export function DragDropUpload({
    onImageUpload,
    onPDFUpload,
    acceptImages = true,
    acceptPDFs = true,
    maxImageSize = 5,
    maxPDFSize = 10,
    disabled = false,
    className,
    multiple = false,
}: DragDropUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): { valid: boolean; error?: string } => {
        const isImage = file.type.match(/^image\/(png|jpeg|jpg)$/);
        const isPDF = file.type === "application/pdf";

        if (!isImage && !isPDF) {
            return { valid: false, error: "Nur PNG, JPG und PDF Dateien sind erlaubt" };
        }

        if (isImage && !acceptImages) {
            return { valid: false, error: "Bilder sind hier nicht erlaubt" };
        }

        if (isPDF && !acceptPDFs) {
            return { valid: false, error: "PDFs sind hier nicht erlaubt" };
        }

        const maxSize = isImage ? maxImageSize : maxPDFSize;
        const fileSizeMB = file.size / (1024 * 1024);

        if (fileSizeMB > maxSize) {
            return {
                valid: false,
                error: `Datei ist zu groß. Maximum: ${maxSize} MB`,
            };
        }

        return { valid: true };
    };

    const handleFiles = useCallback(
        async (files: FileList | null) => {
            if (!files || files.length === 0) return;

            const fileArray = Array.from(files);
            const filesToProcess = multiple ? fileArray : [fileArray[0]];

            for (const file of filesToProcess) {
                const validation = validateFile(file);
                if (!validation.valid) {
                    toast.error(validation.error || "Ungültige Datei");
                    continue;
                }

                setUploading(true);
                try {
                    const isImage = file.type.match(/^image\/(png|jpeg|jpg)$/);
                    const isPDF = file.type === "application/pdf";

                    if (isImage && onImageUpload) {
                        await onImageUpload(file);
                    } else if (isPDF && onPDFUpload) {
                        await onPDFUpload(file);
                    } else {
                        toast.error("Kein Upload-Handler für diesen Dateityp konfiguriert");
                    }
                } catch (error) {
                    console.error("Upload error:", error);
                    toast.error("Fehler beim Upload");
                } finally {
                    setUploading(false);
                }
            }
        },
        [onImageUpload, onPDFUpload, multiple, maxImageSize, maxPDFSize, acceptImages, acceptPDFs]
    );

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) {
            setIsDragging(true);
        }
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            if (disabled) return;

            const files = e.dataTransfer.files;
            handleFiles(files);
        },
        [disabled, handleFiles]
    );

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            handleFiles(e.target.files);
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        },
        [handleFiles]
    );

    const handleClick = () => {
        if (!disabled) {
            fileInputRef.current?.click();
        }
    };

    const acceptTypes = [];
    if (acceptImages) acceptTypes.push("image/png", "image/jpeg", "image/jpg");
    if (acceptPDFs) acceptTypes.push("application/pdf");

    return (
        <div
            className={cn(
                "relative border-2 border-dashed rounded-lg p-6 transition-colors",
                isDragging && !disabled
                    ? "border-primary bg-primary/5"
                    : "border-gray-300 hover:border-gray-400",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept={acceptTypes.join(",")}
                onChange={handleFileInput}
                disabled={disabled || uploading}
                multiple={multiple}
                className="hidden"
            />

            <div className="flex flex-col items-center justify-center text-center space-y-4">
                {uploading ? (
                    <>
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="text-sm text-gray-600">Upload läuft...</p>
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-4">
                            {acceptImages && (
                                <div className="flex flex-col items-center">
                                    <ImageIcon className="h-8 w-8 text-gray-400" />
                                    <span className="text-xs text-gray-500 mt-1">Bilder</span>
                                </div>
                            )}
                            {acceptPDFs && (
                                <div className="flex flex-col items-center">
                                    <FileText className="h-8 w-8 text-gray-400" />
                                    <span className="text-xs text-gray-500 mt-1">PDFs</span>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">
                                Dateien per Drag & Drop hier ablegen
                            </p>
                            <p className="text-xs text-gray-500">
                                oder klicken Sie zum Auswählen
                            </p>
                            {acceptImages && (
                                <p className="text-xs text-gray-400">
                                    Bilder: PNG, JPG (max. {maxImageSize} MB)
                                </p>
                            )}
                            {acceptPDFs && (
                                <p className="text-xs text-gray-400">
                                    PDFs: max. {maxPDFSize} MB
                                </p>
                            )}
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClick}
                            disabled={disabled || uploading}
                            className="mt-2"
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Dateien auswählen
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
