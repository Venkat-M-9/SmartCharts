"use client";

export function BackgroundAnimation() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden">
      <div
        className="animation-blob h-[400px] w-[400px] bg-[hsl(var(--animation-blob-1))] top-1/4 left-1/4"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="animation-blob h-[300px] w-[300px] bg-[hsl(var(--animation-blob-2))] top-1/2 left-1/2"
        style={{ animationDelay: "4s", animationDirection: "reverse" }}
      ></div>
      <div
        className="animation-blob h-[200px] w-[200px] bg-[hsl(var(--animation-blob-3))] bottom-1/4 right-1/4"
        style={{ animationDuration: "15s" }}
      ></div>
    </div>
  );
}
