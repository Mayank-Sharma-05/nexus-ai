import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#08090C] p-6">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="flex items-center gap-2 mb-8 font-black text-2xl">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 flex items-center justify-center text-black font-extrabold text-sm shadow-glow-cyan">
            ⚡
          </div>
          <span>NEXUS<span className="text-cyan-400">AI</span></span>
        </div>
        <SignUp />
      </div>
    </div>
  );
}
