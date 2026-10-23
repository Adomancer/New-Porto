/** Editorial section rule: "(01) Title ——— meta" on a hairline. */
export function SectionHeader({ index, title, meta }: { index: string; title: string; meta: string }) {
  return (
    <div className="label mx-4 grid grid-cols-2 gap-4 border-t border-line pt-3 sm:mx-8 md:grid-cols-12">
      <p className="md:col-span-3">
        ({index}) <span className="md:hidden">{title}</span>
      </p>
      <p className="hidden md:col-span-6 md:block">{title}</p>
      <p className="text-right text-muted md:col-span-3">{meta}</p>
    </div>
  );
}
