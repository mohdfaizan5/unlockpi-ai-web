"use client";

import {useState } from "react";
import { ArrayStrip } from "@/components/data-structure/array-strip";
import { Button } from "@/components/ui/button";

// Playground for the data-structure visualizers. Two purposes:
//   1) Give the user knobs to drive push/pop and toggle fixed/dynamic so the
//      animations can be exercised without wiring up a full lesson flow.
//   2) Serve as the reference for how a parent should manage stack state
//      when using StackStrip in Fixed mode (guard pushes against the size).

export default function Page() {
  return (
    <div className="@container/main min-h-screen flex flex-1 flex-col gap-10 p-6">
      <ArraySection />
    </div>
  );
}

function ArraySection() {
  const [arrayData, setArrayData] = useState([1, 2, 3, 4, 5]);
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Array</h2>
      <ArrayStrip
        data={arrayData}
        highlightElements
        highlightIndices
        activeIndex={2}
      />
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setArrayData((prev) => prev.slice(0, Math.max(prev.length - 1, 0)))
          }
        >
          pop
        </Button>
        <Button
          size="sm"
          onClick={() => setArrayData((prev) => [...prev, prev.length + 1])}
        >
          push
        </Button>
      </div>
    </section>
  );
}
