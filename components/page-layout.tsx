export default function PageLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 pt-4 pb-0 sm:p-12 sm:pt-5 sm:pb-20">
      <h1 className="text-2xl sm:text-4xl">{title}</h1>
      {children}
    </div>
  );
}
