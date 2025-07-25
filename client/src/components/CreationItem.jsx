import React, { useState } from "react";
import Markdown from "react-markdown";
const CreationItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="p-4 max-w-5xl border border-gray-200 rounded-lg shadow-sm bg-white cursor-pointer"
    >
      {/* Main row */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex gap-4">
          <div>
            <h2 className="font-medium text-gray-800">{item.prompt}</h2>
            <p className="text-gray-500">
              {item.type} - {new Date(item.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <button className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] px-4 py-1 rounded-full">
          {item.type}
        </button>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="mt-4">
          {item.type === "image" ? (
            <div>
              <img
                src={item.content}
                alt="generated"
                className="w-full max-w-md rounded"
              />
            </div>
          ) : (
            <div className=" mt-2 max-h-64 overflow-y-auto text-sm text-slate-700 whitespace-pre-wrap">
              <div className="">
              <Markdown>{item.content}</Markdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreationItem;
