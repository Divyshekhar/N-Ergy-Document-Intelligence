import { FileSearch } from "lucide-react";
import UploadPanel from "@/components/UploadPanel";
import ChatPanel from "@/components/ChatPanel";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-2 border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <FileSearch className="h-5 w-5" />
        <h1 className="text-sm font-semibold">N-ERGY Document Intelligence</h1>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 shrink-0 overflow-y-auto border-r border-zinc-200 dark:border-zinc-800">
          <UploadPanel />
        </aside>
        <main className="flex-1 overflow-hidden">
          <ChatPanel />
        </main>
      </div>
    </div>
  );
}
