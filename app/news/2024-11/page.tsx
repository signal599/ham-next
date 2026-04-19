import PageLayout from "@/components/page-layout";

const title = "News and Info: November 2024";

export const metadata = { title };

export default function Page() {
  return (
    <PageLayout title={title}>
      <p>
        Time certainly flies when you’re not looking. This site has been running
        pretty much unattended for over six years. It was well overdue for an
        update to the underlying backend. I’m pleased to report that it’s now
        running on a new server with the latest versions of Ubuntu Linux,
        Drupal, PHP, MySQL etc. This should hopefully last for another few years
        without much attention. Theres no new functionality other than a minor
        reorganization of pages and the menu at the top.
      </p>
      <p>Thanks for the all feedback over this time.</p>
      <p>
        73
        <br />
        Ross KT1F
      </p>
    </PageLayout>
  );
}
