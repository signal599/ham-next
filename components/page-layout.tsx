export default function PageLayout({ title, children, extra_classes = ""}: { title: string; children: React.ReactNode, extra_classes?: string }) {
  const extra = extra_classes ? ` ${extra_classes}` : "";

  return (
    <div className={`p-8 pt-5 sm:p-12 sm:pt-5${extra}`}>
      <h1>{title}</h1>
      {children}
    </div>
  );
}
