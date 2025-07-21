import { Image, Sparkles } from "lucide-react";
import React, { useState } from "react";

const GenerateImages = () => {
  const imageStyle = [
    "realisic",
    "Ghibli style",
    "Anime style",
    "Cartoon style",
    " Fantasy Style",
    "3D style",
    "Portrait style",
  ];
  const [selectedImage, setSelectedImage] = useState("realisic");
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const onSubmitHandler = async (e) => {
    e.preventDefault();
  };
  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* left com */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 shadow-sm "
      >
        <div className="flex items-center gap-4 mb-6">
          <Sparkles className="w-6 text-[#00AD25]" />
          <h2 className="text-xl font-semibold">AI Image Generator</h2>
        </div>
        <p className="mt-6 font-semibold text-sm">Describe your Image</p>
        <textarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          rows={4}
          className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2
           focus:ring-green-500 mb-4"
          placeholder="describe what you want to see in the image"
          required
        />

        <p className="mt-6 font-semibold text-sm">Style</p>
        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/12">
          {imageStyle.map((item) => (
            <span
              onClick={() => setSelectedImage(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer 
                ${
                  selectedImage === item
                    ? "bg-green-50 text-green-700 "
                    : "text-gray-500 border-gray-300"
                }`}
              key={item}
            >
              {item}
            </span>
          ))}
        </div>
        <div className="my-6 flex items-center gap-2">
          <label className="relative inline-block w-9 h-5">
            <input
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className="sr-only peer"
            />
            <div className="w-full h-full bg-slate-300 rounded-full peer-checked:bg-green-500 transition-colors"></div>
            <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
          </label>
          <p className="text-sm">Make this image Public</p>
        </div>

        <button
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r
          from-[#00AD25] to-[#04FF50] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer "
        >
          <Image className="w-5" />
          Generate Image
        </button>
      </form>
      {/* right col. */}
      <div
        className="w-full max-w-lg p-4 bg-white rounnded-lg flex flex-col border border-gray-200 
      min-h-96 max-h-screen"
      >
        <div className=" flex items-center gap-3">
          <Image className="w-5 h-5 text-[#00AD25]" />
          <h1 className="text-xl font-semibold">Generated Image</h1>
        </div>

        <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Image className="w-5 h-5 " />
            <p>
              Enter a whatyou want to see and click "Generate Image" to get
              started
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateImages;
