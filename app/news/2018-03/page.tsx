import PageLayout from "@/components/page-layout";

const title = "News and Info: March 2018";

export const metadata = { title };

export default function Page() {
  return (
    <PageLayout title={title} extra_classes="prose">
      <p>
        Welcome to my little spare time project. I’ve been working on this on
        and off for about a year as time and motivation allows.
      </p>
      <p>
        This is more of an excuse to have some fun with Maps and Geocoding than
        anything else but it hopefully provides something interesting to play
        with. “Geocoding” means to convert physical addresses into
        longitude and latitude coordinates. Behind the scenes, this site has
        been slowly geocoding all active amateur radio addresses in the FCC
        license data. The FCC data includes all licenses which have a status of
        “active”.
      </p>
      <p>
        I’ve found it an interesting project with lots of little challenges.
        Some of this is because of the wide variation of population and
        therefore “ham density” throughout the country. I’ve had to balance
        that with performance issues both at the database query level and
        practical limitations of Google Maps. The data is also kind of messy
        with multiple licensees at one address and multiple addresses at the
        same location. This last issue is mostly due to spelling variations. In
        general, one marker appears on the map for each unique latitude /
        longitude point.
      </p>
      <p>
        The performance / data quantity compromise I’ve come up with is that it
        searches within a 20 mile radius of the map center and has a limit of
        200 location markers. The results are sorted by distance which means
        that the circle is complete until it hits the 200 markers. I haven’t
        found a gridsquare that has more than 200 so if you center on a
        gridsquare, I think we always get all in that square.
      </p>
      <p>
        The initial geocoding was done in bulk using{" "}
        <a href="http://www.nominatim.org">Nominatim</a>&nbsp;/&nbsp;
        <a href="https://www.openstreetmap.org">OpenStreetMap.</a> This
        succeeded in finding about half of all addresses. Then over a long
        period of time the rest were processed using{" "}
        <a href="https://www.geocod.io">Geocodio</a>.
      </p>
      <p>
        Geocoding continues using Geocodio at a rate of 125 per hour or a total
        of 2500 per day which keeps it within the free limit. Every hour
        it selects 125 addresses from the database to geocode. These are chosen
        with the following priority.
      </p>
      <ol>
        <li>
          New addresses that have not be geocoded before.
        </li>
        <li>
          Those that previously succeeded on OpenStreetMap. Reprocessing these
          with Geocodio seems to be improving the results.
        </li>
        <li>
          Those that previously failed. Some now succeed because of better data.
        </li>
      </ol>
      <p>
        A weekly import from the FCC usually happens early Wednesday morning
        eastern time. Only those stations with a status of “active” are
        retained. About 1000 addresses are added and deleted each week.
        Geocoding the new addresses is usually completed by late Wednesday.
      </p>
      <p>
        Of course some addresses are PO Boxes and other mailing services.
        Addresses starting with “PO Box” are simply excluded. Also, many
        licensees are not active in the hobby. Be that as it may, it can be fun
        to play with the Street View feature of the maps to look for
        antennas.
      </p>
      <p>
        Although I’ve only considered data from the USA, it’s written in a
        generalized way so it can handle data from other countries but I'm not
        aware of any other countries who make their data publicly available.
      </p>
      <p>
        It’s built with <a href="https://www.drupal.org">Drupal</a>. The code is
        all on Github <a href="https://github.com/signal599/haminfo">here</a>.
      </p>
      <p>
        Anyway… I think it’s pretty much “done” in terms of new features unless
        someone comes up with a good idea. I’ve probably spent way too much
        spare time on this already and it’s time to get my antenna up again and
        do some QRP construction. Feedback is welcome. The easiest way is by
        email to ross (at) earthbubble.com
      </p>
      <p>
        73
        <br />
        Ross KT1F
      </p>
    </PageLayout>
  );
}
