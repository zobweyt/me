import { Button } from "@/components/ui";
import { getTranslator } from "@/lib/i18n";

export function ProjectsSection({
  children,
  locale,
}: React.PropsWithChildren<{ locale: string | undefined }>) {
  const t = getTranslator(locale);

  return (
    <>
      <header className="flex items-center justify-between">
        <div className="w-full flex max-sm:flex-col sm:items-center gap-2 justify-between sm:py-6 py-4 px-4 lg:px-8 border-b border-foreground/5">
          <hgroup>
            <h2 className="text-xl font-(serif medium)">
              {t("projects.recent")}
            </h2>
            <p className="text-current/75 mt-1">{t("projects.description")}</p>
          </hgroup>
          <Button
            nativeButton={false}
            render={<a href={`/${locale}/projects`} />}
            className="max-sm:w-full py-2"
          >
            {t("projects.all")}
            <span className="i-f7:chevron-right" />
          </Button>
        </div>
      </header>
      {children}
    </>
  );
}
