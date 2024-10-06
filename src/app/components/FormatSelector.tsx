import React from 'react';
import { motion } from 'framer-motion';

interface FormatSelectorProps {
    setSelectedFormat: React.Dispatch<React.SetStateAction<string>>;
}

const formats = ['png', 'jpg', 'webp', 'gif'];

const FormatSelector: React.FC<FormatSelectorProps> = ({ setSelectedFormat }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            <label htmlFor="format-select" className="block mb-2 font-bold">Select Format</label>
            <select
                id="format-select"
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full p-2 border rounded"
            >
                {formats.map((format) => (
                    <option key={format} value={format}>
                        {format.toUpperCase()}
                    </option>
                ))}
            </select>
        </motion.div>
    );
};

export default FormatSelector;