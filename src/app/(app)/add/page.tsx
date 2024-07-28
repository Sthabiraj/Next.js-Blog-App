"use client";

import Editor from "@/components/editor/advanced-editor";
import { JSONContent } from "novel";
import { useState } from "react";
import { defaultValue } from "./default-value";

export default function AddBlogPage() {
  const [value, setValue] = useState<JSONContent>(defaultValue);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex w-full max-w-xl flex-col gap-6 rounded-md border bg-card p-6">
        <div className="flex justify-between">
          <h1 className="text-4xl font-semibold"> Novel Example</h1>
        </div>
        <Editor initialValue={value} onChange={setValue} />
      </div>
    </main>
  );
}
