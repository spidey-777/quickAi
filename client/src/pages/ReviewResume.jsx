import { FileText, Sparkles } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import React, { useState } from "react";
import Markdown from "react-markdown";

axios.defaults.baseURL =
  import.meta.env.VITE_BASE_URL ;

const ReviewResume = () => {
  const [inputFile, setInputFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", inputFile);
      const { data } = await axios.post("/v1/api/ai/resume-review", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message || "Failed to review resume");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to review resume");
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
          <Sparkles className="w-6 text-[#00DA83]" />
          <h2 className="text-xl font-semibold">Resume Review</h2>
        </div>
        <p className="mt-6 font-semibold text-sm">Uplode Resume</p>
        <input
          onChange={(e) => setInputFile(e.target.files[0])}
          type="file"
          accept="application/pdf"
          className="w-full p-2 px-3  mt-2 border border-gray-300 rounded-md outline-none 
                     mb-4 text-gray-600 "
          required
        />
        <p className="text-xs text-gay-500 font-light mt-1">
          Supports pdf resume only
        </p>
        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r
          from-[#00DA83] to-[#009BB3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer "
        >
          {loading ? (
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
            <FileText className="w-5" />
          )}
          Review Resume
        </button>
      </form>
      {/* right col. */}
      <div
        className="w-full max-w-lg p-4 bg-white rounnded-lg flex flex-col border border-gray-200 
      min-h-96 max-h-screen"
      >
        <div className=" flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#00DA83]" />
          <h1 className="text-xl font-semibold">Analysis Result</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <FileText className="w-5 h-5 " />
              <p>Upload a Resume and Click "Review Resume" to Get Started</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-700 whitespace-pre-line">
            <div >
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewResume;
