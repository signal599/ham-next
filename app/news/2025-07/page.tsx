import PageLayout from "@/components/page-layout";

const title = "News and Info: July 2025";

export const metadata = { title };

export default function Page() {
  return (
    <PageLayout title={title} extra_classes="prose">
      <p>
        I’ve refactored the{" "}
        <a href="https://github.com/signal599/haminfo/blob/main/web/modules/custom/ham_station/js/hamstation.js">
          frontend Javascript
        </a>{" "}
        into more modern code. It was kind of old style and hard to follow
        before and I’ve learned a lot since I wrote it originally. It’s also
        been updated to the latest Google Maps components which needed a few
        code changes.
      </p>
      <p>
        Nothing much has changed for the end user but I did make a few tweaks
        along the way.
      </p>
      <ul>
        <li>
          When a location marker has multiple stations at that location, the
          callsign shown on the marker is the first on the list which is
          displayed in the popup when you click on the marker. They are now
          sorted by license class with the higher classes at the top. e.g.,
          Extra comes before General. This is an attempt at making the callsign
          on the marker be the most likely active ham. I know it’s making an
          unproven sweeping assumption but if there is an extra and a technician
          class at the same address, I think the chances are pretty good that
          the extra is likely to be the most active and have the more
          recognizable callsign.
        </li>
        <li>
          I’ve made some attempt at cleaning up multiple addresses at the same
          location and therefore shown on the same popup. Some addresses in the
          FCC data are in all upper case letters and some are in nicer proper
          case. When there are two or more hams at a location with both types of
          addresses, they were listed as multiple different addresses. It now
          detects this and shows only the proper case version.
        </li>
        <li>
          It normalizes the common abbreviations so “Street” becomes “St” etc
          when they are at the end of the address line.
        </li>
        <li>The popup only shows 5 digit zip codes.</li>
      </ul>
      <p>
        Those last three enhancements will hopefully make many multi-ham popups
        smaller by eliminating a lot of multiple “different” addresses which are
        really the same. There are still plenty that at first sight look like
        duplicates but if you look closely they always have a minor variation.
        It’s often a spelling typo.
      </p>

      <p>
        73
        <br />
        Ross KT1F
      </p>
    </PageLayout>
  );
}
