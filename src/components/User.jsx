import React, { useState } from "react";

function User({ onSubmit }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit?.(name);
    }
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Colorful Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-500 via-black-500 to-zinc-500 animate-gradient-xy blur-3xl opacity-70"></div>

      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md"></div>

      {/* Centered Card */}
      <form
        onSubmit={handleSubmit}
        className="form-padding relative z-10 bg-zinc-900/70 backdrop-blur-xl border border-zinc-700 rounded h-[300px] flex flex-col items-center justify-center w-[90%] sm:w-[400px] shadow-2xl"
      >
        <h1 className="text-xl font-bold text-white flex items-center">
  Welcome to <img src="sofi.png" className="h-[100px]" alt="Sofi Logo" />
</h1>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name..."
          className="w-full padding border-b border-b-zinc-500 bg-transparent margin text-white outline-none focus:border-pink-400 text-lg placeholder-gray-400"
        />
        <button
          type="submit"
          className="margin padding bg-zinc-700 hover:bg-zinc-800 text-white rounded text-lg font-medium transition-all shadow-md"
        >
          Continue
        </button>
      </form>
    </div>
  );
}

export default User;
