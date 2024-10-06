import React, { useState } from 'react';

const ImageConverter: React.FC = () => {
    const [convertedImage, setConvertedImage] = useState<string | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            const img = new Image();
            img.src = e.target?.result as string;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                ctx.drawImage(img, 0, 0);

                // Convert image to WebP format
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const newImageUrl = URL.createObjectURL(blob);
                            setConvertedImage(newImageUrl);
                        }
                    },
                    'image/webp', // You can change this to 'image/png' or 'image/jpeg' if needed
                    0.8 // Quality parameter for WebP conversion (0 to 1)
                );
            };
        };

        reader.readAsDataURL(file);
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {convertedImage && (
                <div>
                    <h3>Converted Image:</h3>
                    <img src={convertedImage} alt="Converted" />
                </div>
            )}
        </div>
    );
};

export default ImageConverter;
