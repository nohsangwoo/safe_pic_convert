import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SizeSelectorProps {
    setSelectedSize: React.Dispatch<React.SetStateAction<{ width: number; height: number }>>;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({ setSelectedSize }) => {
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');

    const handleSizeChange = () => {
        const newWidth = parseInt(width) || 0;
        const newHeight = parseInt(height) || 0;
        setSelectedSize({ width: newWidth, height: newHeight });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            <label className="block mb-2 font-bold">Resize Images</label>
            <div className="flex space-x-2">
                <input
                    type="number"
                    placeholder="Width"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="w-1/2 p-2 border rounded"
                />
                <input
                    type="number"
                    placeholder="Height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-1/2 p-2 border rounded"
                />
            </div>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSizeChange}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
                Apply Size
            </motion.button>
        </motion.div>
    );
};

export default SizeSelector;