import React from 'react';
import { motion, Reorder } from 'framer-motion';

interface ImageListProps {
    images: File[];
    setImages: React.Dispatch<React.SetStateAction<File[]>>;
}

const ImageList: React.FC<ImageListProps> = ({ images, setImages }) => {
    const removeImage = (file: File) => {
        setImages(images.filter((f) => f !== file));
    };

    return (
        <Reorder.Group axis="y" values={images} onReorder={setImages} className="space-y-2">
            {images.map((file) => (
                <Reorder.Item key={file.name} value={file}>
                    <motion.li
                        layout
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="flex items-center justify-between p-2 bg-gray-100 rounded cursor-move"
                    >
                        <span>{file.name}</span>
                        <button
                            onClick={() => removeImage(file)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                        >
                            Remove
                        </button>
                    </motion.li>
                </Reorder.Item>
            ))}
        </Reorder.Group>
    );
};

export default ImageList;