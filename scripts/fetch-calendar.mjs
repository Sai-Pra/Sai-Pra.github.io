// Fetch a PUBLIC Google Calendar via its .ics feed, strip every title/attendee
// down to an anonymous busy block, and write assets/calendar-data.json.
//
// Runs at build time (GitHub Actions) — the raw calendar is never shipped to
// the client, only {start,end} instants. No OAuth / secrets needed because the
// source calendar is public (same one used by the embed).

import ical from 'node-ical';
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const CALENDAR_ID =
  '077cbb42fff74a8a61e516df0ac2f3a5de1a325cb24a9002d30305f3df2ed68c@group.calendar.google.com';
const TIME_ZONE = 'America/Chicago';

const ICS_URL = `https://calendar.google.com/calendar/ical/${encodeURIComponent(
  CALENDAR_ID
)}/public/basic.ics`;

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(__dirname, '..', 'assets', 'calendar-data.json');

// Window: one week back (so "previous week" has data) through 4 weeks ahead.
const now = new Date();
const rangeStart = new Date(now.getTime() - 7 * 864e5);
const rangeEnd = new Date(now.getTime() + 28 * 864e5);

// Timezone offset (ms) for a given instant in an IANA zone. Used to correct the
// well-known DST drift in rrule expansion (rrule assumes the dtstart offset for
// every occurrence; across a DST boundary that is off by an hour).
function tzOffsetMs(date, tz) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const p = Object.fromEntries(
    dtf
      .formatToParts(date)
      .filter((x) => x.type !== 'literal')
      .map((x) => [x.type, Number(x.value)])
  );
  // Intl renders hour 24 for midnight in some engines; normalize.
  const hour = p.hour === 24 ? 0 : p.hour;
  const asUTC = Date.UTC(p.year, p.month - 1, p.day, hour, p.minute, p.second);
  return asUTC - date.getTime();
}

function overlapsWindow(start, end) {
  return end > rangeStart && start < rangeEnd;
}

async function main() {
  const data = await ical.async.fromURL(ICS_URL);
  const blocks = [];

  for (const key of Object.keys(data)) {
    const ev = data[key];
    if (!ev || ev.type !== 'VEVENT' || !ev.start || !ev.end) continue;

    // Skip events the owner marked as Free / transparent.
    if (ev.transparency === 'TRANSPARENT') continue;

    const duration = ev.end.getTime() - ev.start.getTime();

    if (!ev.rrule) {
      if (overlapsWindow(ev.start, ev.end)) {
        blocks.push({ start: ev.start.toISOString(), end: ev.end.toISOString() });
      }
      continue;
    }

    // Recurring event: expand occurrences inside the window.
    const tzid = ev.rrule.origOptions && ev.rrule.origOptions.tzid;
    const baseOffset = tzid ? tzOffsetMs(ev.start, tzid) : 0;
    const occurrences = ev.rrule.between(rangeStart, rangeEnd, true);

    for (const occ of occurrences) {
      const lookup = occ.toISOString().slice(0, 10);

      // EXDATE: this occurrence was cancelled.
      if (ev.exdate && ev.exdate[lookup]) continue;

      // A single occurrence was moved/edited (RECURRENCE-ID override).
      if (ev.recurrences && ev.recurrences[lookup]) {
        const r = ev.recurrences[lookup];
        if (r.transparency === 'TRANSPARENT') continue;
        if (overlapsWindow(r.start, r.end)) {
          blocks.push({ start: r.start.toISOString(), end: r.end.toISOString() });
        }
        continue;
      }

      let start = occ;
      if (tzid) {
        const diff = baseOffset - tzOffsetMs(occ, tzid);
        start = new Date(occ.getTime() + diff);
      }
      const end = new Date(start.getTime() + duration);
      if (overlapsWindow(start, end)) {
        blocks.push({ start: start.toISOString(), end: end.toISOString() });
      }
    }
  }

  blocks.sort((a, b) => a.start.localeCompare(b.start));

  const payload = {
    generatedAt: new Date().toISOString(),
    timeZone: TIME_ZONE,
    windowStart: rangeStart.toISOString(),
    windowEnd: rangeEnd.toISOString(),
    events: blocks,
  };

  await mkdir(dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${blocks.length} busy block(s) to ${OUT_PATH}`);
}

main().catch((err) => {
  console.error('Calendar fetch failed:', err);
  process.exit(1);
});
