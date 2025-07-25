import { Eraser, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL =
  import.meta.env.VITE_BASE_URL;
const RemoveBackground = () => {
  const [inputFile, setInputFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", inputFile);
      const { data } = await axios.post(
        "/v1/api/ai/revome-image-background",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message || "Failed to remove background");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to remove background"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* left com */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 shadow-sm "
      >
        <div className="flex items-center gap-4 mb-6">
          <Sparkles className="w-6 text-[#FF4938]" />
          <h2 className="text-xl font-semibold">Background Removal</h2>
        </div>
        <p className="mt-6 font-semibold text-sm">Uplode Image</p>
        <input
          onChange={(e) => setInputFile(e.target.files[0])}
          type="file"
          accept="image/*"
          className="w-full p-2 px-3  mt-2 border border-gray-300 rounded-md outline-none 
                     mb-4 text-gray-600 "
          required
        />
        <p className="text-xs text-gay-500 font-light mt-1">
          Supports jpg,png and other ingate formate also
        </p>
        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r
          from-[#F6AB41] to-[#FF4938] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer "
        >
          {loading ? (
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
            <Eraser className="w-5" />
          )}
          Remove Background
        </button>
      </form>
      {/* right col. */}
      <div
        className="w-full max-w-lg p-4 bg-white rounnded-lg flex flex-col border border-gray-200 
      min-h-96 max-h-screen"
      >
        <div className=" flex items-center gap-3">
          <Eraser className="w-5 h-5 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">Processad Image</h1>
        </div>
        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Eraser className="w-5 h-5 " />
              <p>
                Uplode a Image and click "Remove Background" to remove image
                background
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full">
            <img src={content} alt="image" className=" w-full h-full " />
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveBackground;
