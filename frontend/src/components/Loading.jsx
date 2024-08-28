import React from "react";
import { ScaleLoader } from "react-spinners";
function Loading() {
  return (
    <section className="w-svw h-svh flex items-center justify-center bg-[#f9f9f9] text-white font-extrabold">
      {/* <h1 className="text-5xl">LOADING...</h1> */}
      <ScaleLoader color="#000" size={36} />
    </section>
  );
}

export default Loading;
