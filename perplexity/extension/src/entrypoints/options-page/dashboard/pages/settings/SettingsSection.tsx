type SettingsSectionProps = {
  title: string;
  children: React.ReactNode;
};

export default function SettingsSection({
  title,
  children,
}: SettingsSectionProps) {
  return (
    <section>
      <h2 className="x:mb-4 x:text-base x:font-medium">{title}</h2>
      <div className="x:divide-y x:divide-border/50 x:overflow-hidden x:rounded-md x:bg-secondary x:px-4">
        {children}
      </div>
    </section>
  );
}
