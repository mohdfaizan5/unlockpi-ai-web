"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRightIcon, MoveRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import Image from "next/image";

type LinkedListStripProps = {
  nodes: Array<{ value: string }>;
  activeIndex?: number;
  visitedIndices?: number[];
  traversalTarget?: number;
  className?: string;
};

const EMPTY_VISITED_INDICES: number[] = [];

// Matches ArrayStrip / StackStrip / QueueStrip.
const CELL_SPRING = {
  type: "spring" as const,
  stiffness: 240,
  damping: 22,
  mass: 0.8,
};
const VALUE_SPRING = {
  type: "spring" as const,
  stiffness: 200,
  damping: 18,
  mass: 0.5,
};

export function LinkedListStrip({
  nodes,
  activeIndex,
  visitedIndices = EMPTY_VISITED_INDICES,
  traversalTarget,
  className,
}: LinkedListStripProps) {
  const isTraversing = traversalTarget !== undefined;

  return (
    <motion.div
      layout
      transition={CELL_SPRING}
      className={cn(
        // No enclosing rail here, unlike the array/queue: a linked list has
        // no contiguous block of memory to draw a box around — the pointers
        // ARE the structure. Nodes get the same plate treatment though.
        "flex min-w-max items-center gap-0",
        className,
      )}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {nodes.map((node, index) => {
          const isActive = activeIndex === index;
          const isVisited = visitedIndices.includes(index) || isActive;
          const isTargetHit =
            isTraversing && isVisited && index === traversalTarget;
          const isTraversalMiss = isTraversing && isVisited && !isTargetHit;
          const isPlainActive = !isTraversing && isActive;
          const isLast = index === nodes.length - 1;

          return (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              transition={CELL_SPRING}
              className={cn("flex items-center ", index !== 0 && "-ml-2")}
            >
              <section className="flex items-center -gap-1">
                <motion.div
                  layout
                  transition={CELL_SPRING}
                  className={cn(
                    // Same plate as the other visualisers, just wider — a node
                    // holds a label rather than a single value.
                    "relative grid  min-w-24 place-items-center rounded-l-sm border border-border bg-[#4C4C4C] px-4 text-base tracking-tight text-white -shadow-[0_10px_24px_rgba(0,0,0,0.24)] transition-colors duration-300 sm:h-12  h-10 md:h-12 ",
                    isTraversalMiss &&
                      "border-border bg-muted/50 text-muted-foreground opacity-40",
                    isTargetHit &&
                      "border-emerald-500/60 bg-emerald-500 text-white",
                    isPlainActive &&
                      "border-primary/50 bg-primary text-primary-foreground",
                      isLast && "rounded-r-sm"  
                  )}
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={node.value}
                      initial={{ opacity: 0, scale: 0.7, filter: "blur(2px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.7, filter: "blur(2px)" }}
                      transition={VALUE_SPRING}
                      className="pointer-events-none select-none whitespace-nowrap"
                    >
                      {node.value}
                    </motion.span>
                  </AnimatePresence>
                </motion.div>
                {isLast ? null : (
                  <div className="bg-white! border h-[38px] -ml-0.5 rounded-r-sm sm:h-12 w-8"></div>
                )}
                {/* <div className="relative">
                  <span className="w-4 absolute h-0.5 bg-black"/>
                </div> */}
              </section>

              {/* Pointer to the next node. The tail has none — that null
                  pointer is the thing that ends the list. */}
              {!isLast ? (
                <motion.span
                  layout
                  transition={CELL_SPRING}
                  aria-hidden="true"
                  className="text-muted-foreground"
                >
                  <Image
                    src="/linkedlist-arrow.svg"
                    alt="Arrow Right"
                    width={48}
                    className="-ml-4 "
                    height={48}
                  />
                  {/* <MoveRightIcon className="size-5" /> */}
                </motion.span>
              ) : null}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
