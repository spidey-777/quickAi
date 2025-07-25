import { Edit, Hash, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

// Set default base URL
axios.defaults.baseURL =
  import.meta.env.VITE_BASE_URL || "http://localhost:3001";

const BlogTitles = () => {
  const blogCategories = [
    "General",
    "Technology",
    "Travel",
    "Business",
    "Health",
    "lifestyle",
    "Education",
    "Food",
  ];
  const [selectCategories, setSelectCategories] = useState("General");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = input;
      const { data } = await axios.post(
        "/v1/api/ai/generate-blog-title",
        { prompt, category: selectCategories },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message || "Failed to generate blog title");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to generate blog title"
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
          <Sparkles className="w-6 text-[#8E37EB]" />
          <h2 className="text-xl font-semibold">AI Title Generator</h2>
        </div>
        <p className="mt-6 font-semibold text-sm">Keyword</p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2
           focus:ring-purple-500 mb-4"
          placeholder="eg: Future of AI in Healthcare"
          required
        />

        <p className="mt-6 font-semibold text-sm">Category</p>
        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/12">
          {blogCategories.map((item) => (
            <span
              onClick={() => setSelectCategories(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer 
                ${
                  selectCategories === item
                    ? "bg-purple-50 text-purple-700 "
                    : "text-gray-500 border-gray-300"
                }`}
              key={item}
            >
              {item}
            </span>
          ))}
        </div>
        <br />
        <button
          disabled={loading}
          type="submit"
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r
          from-[#226BFF] to-[#C341F6] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer "
        >
          {
            loading ? (
             <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              <Hash className="w-5" />
            )
          }
          Generate Title
        </button>
      </form>
      {/* right col. */}
      <div
        className="w-full max-w-lg p-4 bg-white rounnded-lg flex flex-col border border-gray-200 
      min-h-96 max-h-screen"
      >
        <div className=" flex items-center gap-3">
          <Hash className="w-5 h-5 text-[#C341F6]" />
          <h1 className="text-xl font-semibold">Generated Titles</h1>
        </div>
        {!content ?(
        <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Hash className="w-5 h-5 " />
            <p>Enter a Topic and click "Generate Title" to get started</p>
          </div>
        </div>
        ):(
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-700 whitespace-pre-line">
            <div>
              <Markdown >{content}</Markdown>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogTitles;
