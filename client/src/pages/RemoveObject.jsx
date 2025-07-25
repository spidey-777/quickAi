import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { Scissors, Sparkles } from "lucide-react";
import React, { useState } from "react";

axios.defaults.baseURL =
  import.meta.env.VITE_BASE_URL ;

const RemoveObject = () => {
  const [inputFile, setInputFile] = useState("");
  const [object, setObject] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const cleanedObject = object.trim();
      if (cleanedObject.split(/\s+/).length > 1) {
        return toast.error("Please enter a single object to remove");
      }

      const formData = new FormData();
      formData.append("image", inputFile);
      formData.append("object", cleanedObject);

      const token = await getToken();
      const { data } = await axios.post(
        "/v1/api/ai/remove-image-object",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message || "Failed to remove object");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to remove object");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left Column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-4 mb-6">
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h2 className="text-xl font-semibold">Object Removal</h2>
        </div>

        <p className="mt-6 font-semibold text-sm">Upload Image</p>
        <input
          onChange={(e) => {
            setInputFile(e.target.files[0]);
            setContent(""); // Clear output on new file
          }}
          type="file"
          accept="image/*"
          className="w-full p-2 px-3 mt-2 border border-gray-300 rounded-md outline-none mb-4 text-gray-600"
          required
        />

        <p className="mt-6 font-semibold text-sm">Describe What to Remove</p>
        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          rows={4}
          className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="Describe the object to remove (e.g., chair)"
          required
        />

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
        >
          {loading ? (
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
            <Scissors className="w-5" />
          )}
          Remove Object
        </button>
      </form>

      {/* Right Column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-screen">
        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Scissors className="w-5 h-5" />
              <p>Upload an image and click "Remove Object" to get started.</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full">
            <img src={content} alt="processed" className="w-full h-full object-contain" />
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveObject;
