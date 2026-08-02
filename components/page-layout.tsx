export default function PageLayout({ title, children, extra_classes = ""}: { title: string; children: React.ReactNode, extra_classes?: string }) {
  const extra = extra_classes ? ` ${extra_classes}` : "";

  return (
    <div className={`p-4 pt-4 pb-0 sm:p-12 sm:pt-5 sm:pb-20${extra}`}>
      <h1 className="text-2xl sm:text-4xl">{title}</h1>
      {children}
    </div>
  );
}
