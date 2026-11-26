<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import { causeOf, ticketCause, uniqueById, groupByCause, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  let { ticket = 4471 }: { ticket?: number } = $props();

  const exported = reports.length;
  const merged = $derived(uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket));
  const groups = $derived(groupByCause(merged, tenantOf));
  const owner = $derived(ticketCause(groups, ticket));
  const wrong = $derived(groups.filter((g) => g.cause !== owner));
  const wrongReports = $derived(wrong.reduce((n, g) => n + g.reports.length, 0));
  const misTagged = $derived(
    merged.filter((r) => (causeOf(r, tenantOf(r)) ?? 'unplaced') !== r.meta.intakeTag)
  );
</script>

<p class="sum">
  The export carries <strong>{exported}</strong> rows for <strong>{merged.length}</strong> unique
  reports (overlapping export pages: one id, one report). <code>{owner}</code> owns
  #{ticket}: <strong>{merged.length - wrongReports}</strong> reports.
  <strong>{wrongReports}</strong> reports belong to <code>{wrong.map((g) => g.cause).join(' and ')}</code>
  — until now, no ticket covered them.
</p>

<p>
  A further <strong>{misTagged.length}</strong> of the {merged.length} carry an
  <code>intakeTag</code> that disagrees with their real cause — the guess intake made from the
  reporter's browser. Tags follow subjects; causes follow tenants. The kb's components already
  computed the split; the ticket page said one issue, one fix queued.
</p>

<style>
  .sum { font-size: 1.1rem; }
</style>
