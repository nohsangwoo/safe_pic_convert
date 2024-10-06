import React from 'react';
import { motion } from 'framer-motion';

const ProjectIntro: React.FC = () => {
    return (
        <motion.div
            className="w-full md:w-2/3 lg:w-1/2 mb-6 p-4 bg-gray-800 rounded-lg shadow-lg text-center"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h1
                className="text-xl md:text-2xl font-bold mb-2 text-blue-400"
                whileHover={{ scale: 1.05 }}
            >
                Secure Image Converter
            </motion.h1>
            <motion.p className="text-gray-300 text-xs md:text-sm mb-3">
                Safe and efficient local image conversion
            </motion.p>
            <motion.div
                className="flex justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
            >
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Privacy-First</span>
                <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">Client-Side</span>
                <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">Multiple Formats</span>
            </motion.div>
        </motion.div>
    );
};

export default ProjectIntro;