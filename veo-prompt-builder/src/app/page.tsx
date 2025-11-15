import PromptBuilder from "@/components/PromptBuilder";

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f4f4f5,_#ffffff)] pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PromptBuilder />
      </div>
    </div>
  );
}
