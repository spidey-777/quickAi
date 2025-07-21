import { Scissors, Sparkles } from 'lucide-react';
import React, { useState } from 'react'

const RemoveObject = () => {
  const [inputFile, setInputFile] = useState("");
  const [object,setObject] = useState("");
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
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h2 className="text-xl font-semibold">Object Removal</h2>
        </div>
        <p className="mt-6 font-semibold text-sm">Uplode Image</p>
        <input
          onChange={(e) => setInputFile(e.target.files[0])}
          type="file"
          accept='image/*'
          className="w-full p-2 px-3  mt-2 border border-gray-300 rounded-md outline-none 
                     mb-4 text-gray-600 "
          required
        />
         <p className="mt-6 font-semibold text-sm">Describe What to Remove</p>
        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          rows={4}
          className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2
           focus:ring-blue-500 mb-4"
          placeholder="describe what you want to remove"
          required
        />


        <button
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r
          from-[#417DF6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer "
        >
          <Scissors className="w-5" />
            Remove Object
        </button>
      </form>
      {/* right col. */}
      <div
        className="w-full max-w-lg p-4 bg-white rounnded-lg flex flex-col border border-gray-200 
      min-h-96 max-h-screen"
      >
        <div className=" flex items-center gap-3">
          <Scissors className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Processad Image</h1>
        </div>

        <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Scissors className="w-5 h-5 " />
            <p>Uplode a Image and click "Remove Obect" to Get Started</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RemoveObject