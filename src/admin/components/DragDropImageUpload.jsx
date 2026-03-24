import { useState } from 'react';
import { UploadCloud, X } from 'lucide-react';

export default function DragDropImageUpload({ onImageUpload, multiple = true }) {
    const [dragActive, setDragActive] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const processFiles = (files) => {
        if (!files) return;

        const validFiles = Array.from(files).filter(file =>
            file.type.startsWith('image/')
        );

        if (validFiles.length === 0) return;
        const filesToUse = multiple ? validFiles : [validFiles[0]];
        const newImages = filesToUse.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        if (multiple) {
            const updatedImages = [...imagePreviews, ...newImages];
            setImagePreviews(updatedImages);
            if (onImageUpload) onImageUpload(updatedImages.map(img => img.file));
        } else {
            setImagePreviews(newImages);
            if (onImageUpload) onImageUpload(filesToUse[0]);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files) {
            processFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e) => {
        if (e.target.files) {
            processFiles(e.target.files);
        }
    };

    const handleRemove = (index) => {
        const updated = imagePreviews.filter((_, i) => i !== index);
        setImagePreviews(updated);

        // Send updated file list back to parent
        if (onImageUpload) {
            onImageUpload(updated.map(item => item.file));
        }
    };

    return (
        <div className="mt-2">
            <div
                className={`flex justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors ${dragActive
                    ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                    : 'border-[var(--border)] hover:border-[var(--muted-foreground)]'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {imagePreviews.length === 0 ? (
                    <div className="text-center">
                        <UploadCloud
                            className="mx-auto h-12 w-12 text-[var(--muted-foreground)] opacity-50"
                            aria-hidden="true"
                        />

                        <div className="mt-4 flex text-sm leading-6 text-[var(--muted-foreground)] justify-center">
                            <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md bg-transparent font-semibold text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors"
                            >
                                <span>Upload files</span>
                                <input
                                    id="file-upload"
                                    type="file"
                                    className="sr-only"
                                    accept="image/*"
                                    multiple={multiple}
                                    onChange={handleChange}
                                />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>

                        <p className="text-xs leading-5 text-[var(--muted-foreground)]">
                            PNG, JPG, GIF up to 10MB
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {imagePreviews.map((item, index) => (
                            <div
                                key={index}
                                className="relative group rounded-md overflow-hidden"
                            >
                                <img
                                    src={item.preview}
                                    alt="Preview"
                                    className="max-h-40 w-full object-cover rounded-md"
                                />

                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(index)}
                                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-sm"
                                    >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Remove image</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}