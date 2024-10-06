"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ImageUploader from "./components/ImageUploader";
import ImageList from "./components/ImageList";
import FormatSelector from "./components/FormatSelector";
import SizeSelector from "./components/SizeSelector";
import ConvertButton from "./components/ConvertButton";
import ImageConverter from "./components/ImageConverter";

export default function Home() {
  const [images, setImages] = useState<File[]>([]);
  const [selectedFormat, setSelectedFormat] = useState("png");
  const [selectedSize, setSelectedSize] = useState({ width: 0, height: 0 });

  return (
    // <motion.div
    //   initial={{ opacity: 0 }}
    //   animate={{ opacity: 1 }}
    //   transition={{ duration: 0.5 }}
    //   className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"
    // >
    //   <h1 className="text-4xl font-bold text-center">Image Converter</h1>

    //   <div className="w-full max-w-4xl space-y-8">
    //     <ImageUploader setImages={setImages} />
    //     <ImageList images={images} setImages={setImages} />
    //     <div className="flex flex-wrap gap-4">
    //       <FormatSelector setSelectedFormat={setSelectedFormat} />
    //       <SizeSelector setSelectedSize={setSelectedSize} />
    //     </div>
    //     <button onClick={() => console.log(selectedFormat, selectedSize)}>asdfasdfasdf</button>
    //     <ConvertButton
    //       images={images}
    //       selectedFormat={selectedFormat}
    //       selectedSize={selectedSize}
    //     />
    //   </div>

    //   <footer className="text-center text-sm text-gray-500">
    //     © 2023 Image Converter. All rights reserved.
    //   </footer>
    // </motion.div>
    <div>
      <ImageConverter />
    </div>
  );
}
