import React from "react";
import { ClimbingBoxLoader } from "react-spinners";
function Loading() {
  return (
    <section className="w-svw h-svh flex items-center justify-center bg-gray-950 text-white font-extrabold">
      {/* <h1 className="text-5xl">LOADING...</h1> */}
      <ClimbingBoxLoader color="#fff" size={36} />
    </section>
  );
}

export default Loading;
