import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';

interface ImageUploaderProps {
    setImages: React.Dispatch<React.SetStateAction<File[]>>;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ setImages }) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setImages(prevImages => [...prevImages, ...acceptedFiles]);
    }, [setImages]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] }
    });

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <div
                {...getRootProps()}
                className="p-10 border-2 border-dashed rounded-lg text-center cursor-pointer"
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>이미지를 여기에 놓으세요...</p>
                ) : (
                    <p>이미지를 드래그 앤 드롭하거나 클릭하여 선택하세요</p>
                )}
            </div>
        </motion.div>
    );
};

export default ImageUploader;