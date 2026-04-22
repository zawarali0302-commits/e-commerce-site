import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-[#f0ebe3] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* <div className="text-center mb-8">
          <h1 className="font-serif text-4xl font-light tracking-[0.2em] uppercase text-[#2a1f18]">
            Éclat
          </h1>
          <p className="text-sm text-stone-500 font-light mt-2">
            Create your account
          </p>
        </div> */}
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none border border-stone-200 rounded-none bg-white",
              headerTitle: "font-serif font-light text-[#2a1f18]",
              headerSubtitle: "text-stone-400 font-light",
              formButtonPrimary:
                "bg-[#2a1f18] hover:bg-[#3d2f25] text-[#f0ebe3] rounded-none text-xs tracking-[0.2em] uppercase font-normal",
              formFieldInput:
                "rounded-none border-stone-200 focus:border-stone-400 text-sm font-light",
              footerActionLink: "text-[#2a1f18] hover:text-[#3d2f25]",
            },
          }}
        />
      </div>
    </main>
  );
}