import { parseJsonValue } from "@/lib/utils";

export function CarouselPreview({ value }: { value: string }) {
  const slides = parseJsonValue<Array<{ slide: number; title: string; text: string }>>(value, []);

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {slides.map((slide) => (
        <article key={slide.slide} className="soft-border rounded-lg bg-slate-950/50 p-4">
          <span className="text-xs font-bold text-cyan-200">Slide {slide.slide}</span>
          <h3 className="mt-3 text-base font-semibold text-white">{slide.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{slide.text}</p>
        </article>
      ))}
    </div>
  );
}
