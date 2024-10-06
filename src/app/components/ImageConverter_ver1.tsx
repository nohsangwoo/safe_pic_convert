import React, { useState, useRef } from 'react';
import { NextPage } from 'next';
import { useDropzone } from 'react-dropzone';
import { saveAs } from 'file-saver';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

    const handleFormatConversion = (id: string, format: string) => {
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
                            saveAs(blob, `converted-image.${format}`);
                        }
                    },
                    `image/${format}`
                );
            };
        };
        reader.readAsDataURL(img.file);
    };

    const handleBulkDownload = () => {
        images.forEach((img) => handleFormatConversion(img.id, 'webp'));
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
        <div>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag & drop some files here, or click to select files</p>
            </div>
            <button onClick={handleBulkDownload}>Download All as WebP</button>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={images.map((img) => img.id)}>
                    <div className="image-previews">
                        {images.map((img) => (
                            <SortableImage
                                key={img.id}
                                image={img}
                                onDelete={handleImageDelete}
                                onResize={handleImageResize}
                                onConvert={handleFormatConversion}
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
    onConvert: (id: string, format: string) => void;
}

const SortableImage: React.FC<SortableImageProps> = ({
    image,
    onDelete,
    onResize,
    onConvert,
}) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: image.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <img src={image.preview} alt="Preview" />
            <div>
                <label>
                    Width:
                    <input
                        type="number"
                        value={image.width}
                        onChange={(e) =>
                            onResize(image.id, parseInt(e.target.value, 10), image.height)
                        }
                    />
                </label>
                <label>
                    Height:
                    <input
                        type="number"
                        value={image.height}
                        onChange={(e) =>
                            onResize(image.id, image.width, parseInt(e.target.value, 10))
                        }
                    />
                </label>
                <button onClick={() => onDelete(image.id)}>Delete</button>
                <label>
                    Convert to:
                    <select
                        onChange={(e) => onConvert(image.id, e.target.value)}
                        defaultValue="webp"
                    >
                        <option value="webp">WebP</option>
                        <option value="png">PNG</option>
                        <option value="jpeg">JPEG</option>
                        <option value="bmp">BMP</option>
                        <option value="gif">GIF</option>
                        <option value="tiff">TIFF</option>
                    </select>
                </label>
            </div>
        </div>
    );
};

export default ImageConverter;