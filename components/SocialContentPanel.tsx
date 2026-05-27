import { CopyButton } from "./CopyButton";
import { CarouselPreview } from "./CarouselPreview";

export function SocialContentPanel({ socialPost }: { socialPost: any }) {
  if (!socialPost) {
    return <p className="text-slate-400">Social posts will appear after generation.</p>;
  }

  const blocks = [
    ["LinkedIn long post", socialPost.linkedinLong, "Copy LinkedIn post"],
    ["LinkedIn short post", socialPost.linkedinShort, "Copy LinkedIn short post"],
    ["X / Twitter post", socialPost.xPost, "Copy X / Twitter post"],
    ["Instagram caption", socialPost.instagram, "Copy Instagram caption"],
    ["Short video script", socialPost.videoScript, "Copy video script"]
  ];

  return (
    <div className="grid gap-5">
      {blocks.map(([title, text, label]) => (
        <section key={title} className="soft-border rounded-lg bg-black/35 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-semibold text-white">{title}</h3>
            <CopyButton text={text} label={label} />
          </div>
          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">{text}</p>
        </section>
      ))}
      <section className="grid gap-3">
        <h3 className="font-semibold text-cyan-100">Carousel structure</h3>
        <CarouselPreview value={socialPost.carousel} />
      </section>
    </div>
  );
}
