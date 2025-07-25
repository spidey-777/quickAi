import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import CreationItem from "../components/CreationItem";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
axios.defaults.baseURL =
  import.meta.env.VITE_BASE_URL || "http://localhost:3001";
const Dashboard = () => {
  const [creaions, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const getCreations = async () => {
    try {
      const { data } = await axios.get("/v1/api/user/get-user-creations", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message || "Failed to fetch creations");
      }  
    } catch (error) {
      toast.error(error.message || "Failed to fetch creations");
    } finally {   
      setLoading(false);
    }
  };
  useEffect(() => {
    getCreations();
  }, []);
  if(loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }
  return (
    <div className="h-full overflow-y-scroll p-6 ">
      <div className="flex justify-startgap-4 flex-wrap">
        <div
          className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl 
        border border-gray-200 shadow-sm"
        >
          <div className="text-slate-600">
            <p className="text-sm">Total Creations</p>
            <h2 className="text-xl font-semibold">{creaions.length}</h2>
          </div>
          <div
            className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] 
          flex items-center justify-center  text-white"
          >
            <Sparkles className="w-5 text-white" />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <p className="mt-6 mb-4">Recent Creations</p>
        {
          creaions.map((item)=><CreationItem key={item.id} item = {item}/>)
        }

      </div>
    </div>
  );
};

export default Dashboard;
