import React, { useState, useRef } from 'react';
import { NextPage } from 'next';
import { useDropzone } from 'react-dropzone';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import 'tailwindcss/tailwind.css';

interface ImageFile {
    id: string;
    file: File;
    preview: string;
    width: number;
    height: number;
}

const ImageConverter: NextPage = () => {
    const [images, setImages] = useState<ImageFile[]>([]);
    const idCounter = useRef(0);

    const onDrop = (acceptedFiles: File[]) => {
        const newImages = acceptedFiles.map((file) => {
            const id = (idCounter.current++).toString();
            const preview = URL.createObjectURL(file);
            const img = new Image();
            img.src = preview;
            return new Promise<ImageFile>((resolve) => {
                img.onload = () => {
                    resolve({
                        id,
                        file,
                        preview,
                        width: img.width,
                        height: img.height,
                    });
                };
            });
        });
        Promise.all(newImages).then((resolvedImages) => {
            setImages((prevImages) => [...prevImages, ...resolvedImages]);
        });
    };

    const handleImageResize = (id: string, width: number, height: number) => {
        setImages((prevImages) =>
            prevImages.map((img) =>
                img.id === id ? { ...img, width: width, height: height } : img
            )
        );
    };

    const handleImageDelete = (id: string) => {
        setImages((prevImages) => prevImages.filter((img) => img.id !== id));
    };

    const handleFormatConversion = (id: string, format: string, callback: (blob: Blob) => void) => {
        const img = images.find((img) => img.id === id);
        if (!img) return;

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            const src = e.target?.result as string;
            const canvas = document.createElement('canvas');
            const image = new Image();
            image.src = src;
            image.onload = () => {
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                canvas.width = img.width || image.width;
                canvas.height = img.height || image.height;
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            callback(blob);
                        }
                    },
                    `image/${format}`
                );
            };
        };
        reader.readAsDataURL(img.file);
    };

    const handleDownload = (id: string, format: string) => {
        handleFormatConversion(id, format, (blob) => {
            saveAs(blob, `converted-image-${id}.${format}`);
        });
    };

    const handleBulkDownload = () => {
        const zip = new JSZip();
        const folder = zip.folder('converted-images');

        if (!folder) return;

        const conversionPromises = images.map((img) => {
            return new Promise<void>((resolve) => {
                handleFormatConversion(img.id, 'webp', (blob) => {
                    folder.file(`converted-image-${img.id}.webp`, blob);
                    resolve();
                });
            });
        });

        Promise.all(conversionPromises).then(() => {
            zip.generateAsync({ type: 'blob' }).then((content) => {
                saveAs(content, 'converted-images.zip');
            });
        });
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/webp': ['.webp'],
            'image/gif': ['.gif'],
            'image/bmp': ['.bmp'],
            'image/tiff': ['.tiff', '.tif'],
        },
        onDrop,
    });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setImages((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    return (
        <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
            <div {...getRootProps()} className="w-full md:w-2/3 lg:w-1/2">
                <motion.div
                    className="p-8 mb-4 border-2 border-dashed border-gray-400 rounded-lg bg-white shadow-md cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <input {...getInputProps()} />
                    <p className="text-center text-gray-500">Drag & drop some files here, or click to select files</p>
                </motion.div>
            </div>
            <motion.button
                onClick={handleBulkDownload}
                className="mb-6 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Download All as ZIP
            </motion.button>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={images.map((img) => img.id)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full md:w-2/3 lg:w-1/2">
                        {images.map((img) => (
                            <SortableImage
                                key={img.id}
                                image={img}
                                onDelete={handleImageDelete}
                                onResize={handleImageResize}
                                onDownload={handleDownload}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
};

interface SortableImageProps {
    image: ImageFile;
    onDelete: (id: string) => void;
    onResize: (id: string, width: number, height: number) => void;
    onDownload: (id: string, format: string) => void;
}

const SortableImage: React.FC<SortableImageProps> = ({
    image,
    onDelete,
    onResize,
    onDownload,
}) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: image.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: 'manipulation',
    };

    const [aspectRatio, setAspectRatio] = useState(image.width / image.height);

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newWidth = parseInt(e.target.value, 10);
        const newHeight = Math.round(newWidth / aspectRatio);
        onResize(image.id, newWidth, newHeight);
    };

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newHeight = parseInt(e.target.value, 10);
        const newWidth = Math.round(newHeight * aspectRatio);
        onResize(image.id, newWidth, newHeight);
    };

    const handleDownloadClick = () => {
        const formatSelect = document.getElementById(
            `format-select-${image.id}`
        ) as HTMLSelectElement;
        const format = formatSelect?.value || 'webp';
        onDownload(image.id, format);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-xl flex flex-col items-center"
        >
            <div {...listeners} style={{ cursor: 'grab', width: '100%' }}>
                <motion.img
                    src={image.preview}
                    alt="Preview"
                    className="rounded-lg w-full h-auto"
                    whileHover={{ scale: 1.02 }}
                />
            </div>
            <div className="w-full mt-4">
                <label className="block text-sm text-gray-600 mb-2">
                    너비:
                    <input
                        type="number"
                        value={image.width}
                        onChange={handleWidthChange}
                        className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                </label>
                <label className="block text-sm text-gray-600 mb-2">
                    높이:
                    <input
                        type="number"
                        value={image.height}
                        onChange={handleHeightChange}
                        className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                </label>
                <motion.button
                    onClick={() => onDelete(image.id)}
                    className="w-full mb-2 px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-75"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Delete
                </motion.button>
                <label className="block text-sm text-gray-600 mb-2">
                    Convert to:
                    <select
                        id={`format-select-${image.id}`}
                        defaultValue="webp"
                        className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    >
                        <option value="webp">WebP</option>
                        <option value="png">PNG</option>
                        <option value="jpeg">JPEG</option>
                        <option value="bmp">BMP</option>
                        <option value="gif">GIF</option>
                        <option value="tiff">TIFF</option>
                    </select>
                </label>
                <motion.button
                    onClick={handleDownloadClick}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-75"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Download
                </motion.button>
            </div>
        </div>
    );
};

export default ImageConverter;