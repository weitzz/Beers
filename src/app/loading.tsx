"use client";
import { useState } from "react";
import BarLoader from "react-spinners/BarLoader";

const Loading = () => {
  let [loading, setLoading] = useState(true);
  return (
    <div className="flex items-center justify-center h-screen">
      <BarLoader loading={loading} color="#eed235" width={100} height={8} />
    </div>
  );
};

export default Loading;
