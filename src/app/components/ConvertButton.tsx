import React, { useState } from 'react';
import { motion } from 'framer-motion';
import imageCompression from 'browser-image-compression';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

interface ConvertButtonProps {
    images: File[];
    selectedFormat: string;
    selectedSize: { width: number; height: number };
}

const ConvertButton: React.FC<ConvertButtonProps> = ({ images, selectedFormat, selectedSize }) => {
    const [isConverting, setIsConverting] = useState(false);

    const convertImage = async (file: File): Promise<Blob> => {



        const options = {
            maxWidthOrHeight: 300,
            useWebWorker: true,
        };
        console.log("file: ", file)
        console.log("selectedFormat: ", selectedFormat)
        console.log("selectedSize: ", selectedSize)
        console.log("options: ", options)

        const compressedFile = await imageCompression(file, options);



        // Canvas를 사용하여 이미지 크기 조정 및 포맷 변경
        const img = await createImageBitmap(compressedFile);
        const canvas = document.createElement('canvas');
        canvas.width = selectedSize.width;
        canvas.height = selectedSize.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Failed to get canvas context');

        ctx.drawImage(img, 0, 0, selectedSize.width, selectedSize.height);

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (blob) resolve(blob);
                else throw new Error('Failed to convert image');
            }, `image/${selectedFormat}`);
        });
    };

    const handleConvert = async () => {
        setIsConverting(true);
        const zip = new JSZip();

        try {
            for (const image of images) {
                const convertedBlob = await convertImage(image);
                zip.file(`${image.name.split('.')[0]}.${selectedFormat}`, convertedBlob);
            }

            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, 'converted_images.zip');
        } catch (error) {
            console.error('Error converting images:', error);
            alert('이미지 변환 중 오류가 발생했습니다.');
        } finally {
            setIsConverting(false);
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleConvert}
            className="w-full px-4 py-2 bg-green-500 text-white rounded font-bold"
            disabled={images.length === 0 || isConverting}
        >
            {isConverting ? 'Converting...' : 'Convert Images'}
        </motion.button>
    );
};

export default ConvertButton;