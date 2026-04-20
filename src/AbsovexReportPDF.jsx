import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Plus Jakarta Sans',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/plusjakartasans/v12/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_qU7NSg.ttf', fontWeight: 400, fontStyle: 'normal' },
    { src: 'https://fonts.gstatic.com/s/plusjakartasans/v12/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_d0nNSg.ttf', fontWeight: 600, fontStyle: 'normal' },
    { src: 'https://fonts.gstatic.com/s/plusjakartasans/v12/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_TknNSg.ttf', fontWeight: 700, fontStyle: 'normal' },
  ],
});

const COLORS = {
  teal: '#0D6B67',
  magenta: '#EC008B',
  cream: '#FFFAF3',
  black: '#1A1A1A',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
  white: '#FFFFFF',
  conflictRed: '#FEE2E2',
  conflictRedBorder: '#EF4444',
  fixGreen: '#D1FAE5',
  fixGreenBorder: '#10B981',
  severityHigh: '#EF4444',
  severityMed: '#F59E0B',
  severityLow: '#EAB308',
  tealBg: '#E6F4F3',
};

const DAYPART_LABELS = {
  morning_fasting: 'Morning · Fasting',
  morning_with_breakfast: 'Morning · With Breakfast',
  midday: 'Midday',
  evening_with_dinner: 'Evening · With Dinner',
  bedtime: 'Bedtime',
};

const DAYPART_HINTS = {
  morning_fasting: 'Before food or coffee',
  morning_with_breakfast: 'With your first meal',
  midday: 'Around lunchtime',
  evening_with_dinner: 'With your evening meal',
  bedtime: 'Before sleep',
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    color: COLORS.black,
    backgroundColor: COLORS.white,
    paddingTop: 48,
    paddingBottom: 72,
    paddingHorizontal: 48,
  },
  coverPage: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    color: COLORS.black,
    backgroundColor: COLORS.cream,
    paddingTop: 64,
    paddingBottom: 72,
    paddingHorizontal: 48,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 700,
    color: COLORS.teal,
    marginBottom: 6,
    marginTop: 20,
  },
  subhead: {
    fontSize: 11,
    color: COLORS.gray,
    marginBottom: 14,
  },
  bodyText: {
    fontSize: 11,
    lineHeight: 1.6,
    color: COLORS.black,
  },
  smallText: {
    fontSize: 9,
    color: COLORS.gray,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 9,
    color: COLORS.gray,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 8,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    marginVertical: 14,
  },
  calloutBox: {
    backgroundColor: COLORS.cream,
    borderRadius: 6,
    padding: 14,
    marginVertical: 10,
  },
  tealAccent: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.teal,
    paddingLeft: 12,
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 6,
    padding: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  statBoxLast: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 22,
    fontWeight: 700,
    color: COLORS.teal,
  },
  statLabel: {
    fontSize: 9,
    color: COLORS.gray,
    marginTop: 2,
    textAlign: 'center',
  },
  itemHeader: {
    fontSize: 12,
    fontWeight: 700,
    color: COLORS.black,
    marginBottom: 6,
    marginTop: 14,
  },
  labelSmall: {
    fontSize: 8,
    fontWeight: 700,
    color: COLORS.teal,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  badge: {
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 7,
    marginRight: 5,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: 600,
    color: COLORS.white,
  },
  groupHeader: {
    backgroundColor: COLORS.teal,
    borderRadius: 4,
    padding: 8,
    marginTop: 14,
    marginBottom: 6,
  },
  groupHeaderText: {
    fontSize: 11,
    fontWeight: 700,
    color: COLORS.white,
  },
  groupHint: {
    fontSize: 9,
    color: COLORS.gray,
    marginBottom: 8,
  },
});

// ─── helpers ────────────────────────────────────────────────────────────────

const fmtT = str => {
  if (!str) return str;
  let s = str
    .replace(/(\d)(AM|PM)([a-zA-Z])/gi, '$1 $2 $3')
    .replace(/(\d)([a-zA-Z])/g, '$1 $2');
  s = s.replace(
    /\b(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?\b/g,
    (_, h, m, mer) => {
      const hour = parseInt(h);
      let h12, suf;
      if (mer) { suf = mer.toUpperCase(); h12 = hour; }
      else if (hour === 0) { h12 = 12; suf = 'AM'; }
      else if (hour < 12) { h12 = hour; suf = 'AM'; }
      else if (hour === 12) { h12 = 12; suf = 'PM'; }
      else { h12 = hour - 12; suf = 'PM'; }
      return `${h12}:${m} ${suf}`;
    }
  );
  s = s.replace(
    /(\d{1,2}:\d{2}\s*(?:AM|PM))\s*([a-zA-Z])/gi,
    (_, t, c) => `${t.trim()} · ${c.toUpperCase()}`
  );
  return s;
};

const fmtDate = () => {
  const d = new Date();
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const severityColor = s => {
  const l = (s || '').toLowerCase();
  if (l === 'high') return COLORS.severityHigh;
  if (l === 'medium') return COLORS.severityMed;
  return COLORS.severityLow;
};

// ─── shared components ───────────────────────────────────────────────────────

const PageFooter = () => (
  <View style={styles.footer} fixed>
    <Text>Absovex · absovex.com</Text>
    <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
  </View>
);

const DisclaimerBlock = () => (
  <View style={[styles.calloutBox, { borderLeftWidth: 3, borderLeftColor: COLORS.magenta, marginTop: 16 }]}>
    <Text style={[styles.smallText, { fontWeight: 700, marginBottom: 4, color: COLORS.black }]}>MEDICAL DISCLAIMER</Text>
    <Text style={styles.smallText}>
      This report is for informational and educational purposes only and does not constitute medical advice, diagnosis, treatment, or pharmaceutical advice. It is based solely on user-submitted information and may be incomplete or inaccurate. Always consult a physician, licensed pharmacist, or other qualified healthcare professional before making any changes to your medication, supplement, or health routine. Do not use this report for emergency medical decisions.
    </Text>
  </View>
);

const SectionHeader = ({ num, title, sub }) => (
  <View>
    <Text style={styles.sectionHeader}>{num ? `${num}. ` : ''}{title}</Text>
    {sub ? <Text style={styles.subhead}>{sub}</Text> : null}
  </View>
);

const CalloutBox = ({ children, bg, borderColor }) => (
  <View style={[styles.calloutBox, bg ? { backgroundColor: bg } : {}, borderColor ? { borderLeftWidth: 3, borderLeftColor: borderColor } : {}]}>
    {children}
  </View>
);

const Divider = () => <View style={styles.divider} />;

// ─── PAGE 1 — Cover ──────────────────────────────────────────────────────────

const CoverPage = ({ data, userName }) => {
  const diff = (data.optimizedScore || 0) - (data.currentScore || 0);
  return (
    <Page size="A4" style={styles.coverPage}>
      <View style={{ alignItems: 'center', marginBottom: 40, marginTop: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: 700, color: COLORS.teal, marginBottom: 10 }}>Absovex</Text>
        <Text style={{ fontSize: 22, fontWeight: 700, color: COLORS.black, marginBottom: 8, textAlign: 'center' }}>
          Personalized Health Stack Report
        </Text>
        {userName ? (
          <Text style={{ fontSize: 13, color: COLORS.gray, marginBottom: 6 }}>Prepared for {userName}</Text>
        ) : null}
        <Text style={{ fontSize: 11, color: COLORS.gray }}>Generated {fmtDate()}</Text>
      </View>

      <View style={[styles.row, { marginBottom: 24 }]}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{data.currentScore || '—'}</Text>
          <Text style={styles.statLabel}>Current Score</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{data.optimizedScore || '—'}</Text>
          <Text style={styles.statLabel}>Optimized Score</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: COLORS.magenta }]}>+{diff > 0 ? diff : 0}</Text>
          <Text style={styles.statLabel}>Improvement</Text>
        </View>
        <View style={styles.statBoxLast}>
          <Text style={[styles.statNum, { color: COLORS.severityHigh }]}>{(data.conflicts || []).length}</Text>
          <Text style={styles.statLabel}>Issues Found</Text>
        </View>
      </View>

      <DisclaimerBlock />
      <PageFooter />
    </Page>
  );
};

// ─── PAGE 2 — Summary and Score Snapshot ─────────────────────────────────────

const SummaryPage = ({ data }) => {
  const diff = (data.optimizedScore || 0) - (data.currentScore || 0);
  const scoreTakeaway = data.scoreSummary ||
    `Your score improved by ${diff} points. The biggest gains came from fixing timing conflicts and improving food pairing.`;

  const benefits = data.topBenefits || [];
  const issues = data.topIssues || [];
  const positives = data.positives_already_working || [];

  return (
    <Page size="A4" style={styles.page}>
      <SectionHeader num={1} title="Summary and Score Snapshot" sub="Your personalized timing and absorption analysis" />

      <CalloutBox bg={COLORS.tealBg} borderColor={COLORS.teal}>
        <Text style={styles.bodyText}>{scoreTakeaway}</Text>
      </CalloutBox>

      <View style={[styles.row, { marginTop: 12, marginBottom: 16 }]}>
        <View style={[styles.statBox, { backgroundColor: COLORS.fixGreen, alignItems: 'flex-start' }]}>
          <Text style={[styles.labelSmall, { marginBottom: 6 }]}>Biggest Improvements</Text>
          {benefits.slice(0, 4).map((b, i) => (
            <Text key={i} style={[styles.smallText, { color: COLORS.black, marginBottom: 3 }]}>· {b}</Text>
          ))}
        </View>
        <View style={[styles.statBox, { backgroundColor: COLORS.conflictRed, alignItems: 'flex-start' }]}>
          <Text style={[styles.labelSmall, { marginBottom: 6 }]}>Key Issues Found</Text>
          {issues.slice(0, 4).map((iss, i) => (
            <Text key={i} style={[styles.smallText, { color: COLORS.black, marginBottom: 3 }]}>· {iss.issue}</Text>
          ))}
        </View>
        <View style={[styles.statBoxLast, { backgroundColor: COLORS.cream, alignItems: 'flex-start' }]}>
          <Text style={[styles.labelSmall, { marginBottom: 6 }]}>What Checked Out Well</Text>
          {positives.slice(0, 4).map((p, i) => (
            <Text key={i} style={[styles.smallText, { color: COLORS.black, marginBottom: 3 }]}>· {p.strength}</Text>
          ))}
        </View>
      </View>

      <View style={[styles.row, { backgroundColor: COLORS.lightGray, borderRadius: 6, padding: 10 }]}>
        {['Timing', 'Food Pairing', 'Spacing Conflicts', 'Routine Fit'].map((label, i, arr) => (
          <View key={label} style={{ flex: 1, alignItems: 'center', borderRightWidth: i < arr.length - 1 ? 1 : 0, borderRightColor: COLORS.gray }}>
            <Text style={{ fontSize: 10, fontWeight: 600, color: COLORS.teal }}>{label}</Text>
          </View>
        ))}
      </View>

      <PageFooter />
    </Page>
  );
};

// ─── PAGE 3 — Before vs After Breakdown ──────────────────────────────────────

const BeforeAfterPage = ({ data }) => {
  const logic = data.optimizationLogic || [];
  return (
    <Page size="A4" style={styles.page}>
      <SectionHeader num={2} title="Before vs After Breakdown" sub="Our suggested changes to your routine, and why they matter" />

      {logic.map((o, i) => (
        <View key={i} wrap={false}>
          <Text style={styles.itemHeader}>{o.item}</Text>
          <View style={styles.row}>
            <View style={{ flex: 1, backgroundColor: COLORS.lightGray, borderRadius: 6, padding: 10, marginRight: 6 }}>
              <Text style={[styles.labelSmall, { marginBottom: 4, color: COLORS.gray }]}>BEFORE</Text>
              <Text style={styles.bodyText}>{fmtT(o.oldTiming) || 'Previous timing'}</Text>
            </View>
            <View style={{ justifyContent: 'center', paddingHorizontal: 4 }}>
              <Text style={{ fontSize: 14, color: COLORS.gray }}>→</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: COLORS.tealBg, borderRadius: 6, padding: 10, marginLeft: 6 }}>
              <Text style={[styles.labelSmall, { marginBottom: 4 }]}>AFTER</Text>
              <Text style={styles.bodyText}>{fmtT(o.newTiming) || 'Optimized timing'}</Text>
            </View>
          </View>
          <View style={[styles.tealAccent, { marginTop: 8 }]}>
            <Text style={styles.labelSmall}>WHY WE CHANGED IT</Text>
            <Text style={[styles.bodyText, { marginTop: 3 }]}>{o.reason}</Text>
          </View>
          {i < logic.length - 1 ? <Divider /> : null}
        </View>
      ))}

      <PageFooter />
    </Page>
  );
};

// ─── PAGE 4 — Your Optimized Daily Schedule ───────────────────────────────────

const SchedulePage = ({ data }) => {
  const schedule = data.schedule || {};
  return (
    <Page size="A4" style={styles.page}>
      <SectionHeader num={3} title="Your Optimized Daily Schedule" sub="Your personalized daily timing plan" />
      <Text style={[styles.smallText, { marginBottom: 10 }]}>Built around your meals, coffee habits, and spacing needs.</Text>

      {Object.entries(schedule).map(([key, items]) => (
        <View key={key}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupHeaderText}>{DAYPART_LABELS[key] || key}</Text>
          </View>
          <Text style={styles.groupHint}>{DAYPART_HINTS[key] || ''}</Text>

          {(items || []).map((it, j) => (
            <View key={j} wrap={false} style={{ marginBottom: 12 }}>
              <View style={styles.row}>
                <Text style={{ fontSize: 11, fontWeight: 700, flex: 1 }}>{it.name}</Text>
                <Text style={[styles.smallText, { color: COLORS.gray }]}>{it.dose}</Text>
              </View>

              {it.instruction ? (
                <Text style={[styles.smallText, { marginTop: 2 }]}>{it.instruction}</Text>
              ) : null}

              {it.absorption_profile ? (
                <View style={[styles.calloutBox, { marginTop: 6, padding: 8 }]}>
                  {it.absorption_profile.bestTaken ? (
                    <Text style={styles.smallText}>Best taken: {it.absorption_profile.bestTaken}</Text>
                  ) : null}
                  {it.absorption_profile.preferredSolvent ? (
                    <Text style={styles.smallText}>Take with: {it.absorption_profile.preferredSolvent}</Text>
                  ) : null}
                </View>
              ) : null}

              {(it.real_world_impact || []).length > 0 ? (
                <View style={{ marginTop: 4 }}>
                  <Text style={styles.labelSmall}>What You'll Notice</Text>
                  {it.real_world_impact.map((r, k) => (
                    <Text key={k} style={[styles.smallText, { marginLeft: 8 }]}>· {r}</Text>
                  ))}
                </View>
              ) : null}

              {(it.never_pair_with || []).length > 0 ? (
                <Text style={[styles.smallText, { marginTop: 4, color: COLORS.severityHigh }]}>
                  Don't Pair With: {it.never_pair_with.join(', ')}
                </Text>
              ) : null}

              {it.reason ? (
                <View style={[styles.tealAccent, { marginTop: 6 }]}>
                  <Text style={styles.labelSmall}>Why It's Here</Text>
                  <Text style={[styles.smallText, { color: COLORS.black, marginTop: 2 }]}>{it.reason}</Text>
                </View>
              ) : null}
            </View>
          ))}
        </View>
      ))}

      <PageFooter />
    </Page>
  );
};

// ─── PAGE 5 — Full Stack Timing Audit ────────────────────────────────────────

const AuditPage = ({ data }) => {
  const schedule = data.schedule || {};
  const logic = data.optimizationLogic || [];
  const adjustedNames = new Set(logic.map(o => o.item));

  const allItems = Object.values(schedule).flat();
  const noChange = allItems.filter(it => !adjustedNames.has(it.name));
  const adjusted = allItems.filter(it => adjustedNames.has(it.name));

  const diff = (data.optimizedScore || 0) - (data.currentScore || 0);

  return (
    <Page size="A4" style={styles.page}>
      <SectionHeader num={4} title="Full Stack Timing Audit" sub="Every item reviewed for timing, spacing, and routine fit" />

      <CalloutBox bg={COLORS.tealBg}>
        <Text style={styles.bodyText}>Every item in your stack was reviewed for timing fit, food needs, spacing, and common blockers.</Text>
      </CalloutBox>

      {noChange.length > 0 ? (
        <View>
          <Text style={[styles.itemHeader, { color: COLORS.fixGreenBorder }]}>No Changes Needed</Text>
          {noChange.map((it, i) => (
            <View key={i} style={[styles.row, { marginBottom: 6, alignItems: 'flex-start' }]}>
              <Text style={{ fontSize: 10, fontWeight: 700, flex: 1 }}>{it.name}</Text>
              <Text style={[styles.smallText, { flex: 2 }]}>{it.instruction || 'Timing is solid as-is.'}</Text>
            </View>
          ))}
          <Divider />
        </View>
      ) : null}

      {adjusted.length > 0 ? (
        <View>
          <Text style={[styles.itemHeader, { color: COLORS.teal }]}>Timing Adjusted</Text>
          {adjusted.map((it, i) => {
            const logicItem = logic.find(o => o.item === it.name);
            return (
              <View key={i} wrap={false} style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 10, fontWeight: 700 }}>{it.name}</Text>
                <Text style={styles.labelSmall}>TIMING TIP</Text>
                <Text style={styles.smallText}>{logicItem ? fmtT(logicItem.oldTiming) + ' → ' + fmtT(logicItem.newTiming) : it.instruction || ''}</Text>
              </View>
            );
          })}
        </View>
      ) : null}

      <View style={[styles.row, { marginTop: 16 }]}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{allItems.length}</Text>
          <Text style={styles.statLabel}>Items Reviewed</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{adjusted.length}</Text>
          <Text style={styles.statLabel}>Adjustments Made</Text>
        </View>
        <View style={styles.statBoxLast}>
          <Text style={[styles.statNum, { color: COLORS.magenta }]}>+{diff > 0 ? diff : 0}</Text>
          <Text style={styles.statLabel}>Score Improvement</Text>
        </View>
      </View>

      <PageFooter />
    </Page>
  );
};

// ─── PAGE 6 — Top Conflicts and Why They Matter ───────────────────────────────

const ConflictsPage = ({ data }) => {
  const conflicts = data.conflicts || [];
  return (
    <Page size="A4" style={styles.page}>
      <SectionHeader num={5} title="Top Conflicts and Why They Matter" sub="The biggest timing conflicts we found, and how to fix them" />

      {conflicts.map((c, i) => (
        <View key={i} wrap={false} style={{ marginBottom: 16 }}>
          <View style={[styles.row, { alignItems: 'center', marginBottom: 6 }]}>
            <Text style={[styles.itemHeader, { flex: 1, marginTop: 0, marginBottom: 0 }]}>
              {(c.items || []).join(' + ')}
            </Text>
            <View style={{ backgroundColor: severityColor(c.severity), borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ fontSize: 8, fontWeight: 700, color: COLORS.white, textTransform: 'uppercase' }}>
                {c.severity || 'Medium'}
              </Text>
            </View>
          </View>

          <Text style={[styles.smallText, { marginBottom: 8, color: COLORS.black }]}>
            Based on your entries, these may be taken too close together.
          </Text>

          {c.issue ? (
            <View style={{ marginBottom: 6 }}>
              <Text style={styles.labelSmall}>What's Happening</Text>
              <Text style={styles.bodyText}>{c.issue}</Text>
            </View>
          ) : null}

          <View style={[styles.calloutBox, { backgroundColor: COLORS.conflictRed, borderLeftWidth: 3, borderLeftColor: COLORS.conflictRedBorder, padding: 10 }]}>
            <Text style={[styles.labelSmall, { color: COLORS.conflictRedBorder }]}>ESTIMATED IMPACT</Text>
            <Text style={[styles.bodyText, { marginTop: 4 }]}>
              {c.absorption_loss_percent
                ? `This timing may reduce how much your body can use by up to ${c.absorption_loss_percent}%, which can make the medication less effective than intended.`
                : 'This timing may reduce how much of the dose your body is able to use, which can make the medication less effective than intended.'}
            </Text>
          </View>

          {c.recommendation ? (
            <View style={[styles.calloutBox, { backgroundColor: COLORS.fixGreen, borderLeftWidth: 3, borderLeftColor: COLORS.fixGreenBorder, padding: 10, marginTop: 6 }]}>
              <Text style={[styles.labelSmall, { color: COLORS.fixGreenBorder }]}>THE FIX</Text>
              <Text style={[styles.bodyText, { marginTop: 4 }]}>{c.recommendation}</Text>
            </View>
          ) : null}

          {i < conflicts.length - 1 ? <Divider /> : null}
        </View>
      ))}

      <PageFooter />
    </Page>
  );
};

// ─── PAGE 7 — What Shaped Your Plan ──────────────────────────────────────────

const RoutineInsightsPage = ({ data, routine }) => {
  const insights = data.routineInsights || [];
  const r = routine || {};

  const summaryText = insights[0] ||
    (r.coffeeTea && r.coffeeTime
      ? `Your plan accounts for coffee at ${fmtT(r.coffeeTime)}, your meal windows, and spacing needs across your full stack.`
      : 'Your plan was shaped by your wake time, meal windows, and the spacing needs of your specific stack.');

  const drivers = [
    r.coffeeTea && r.coffeeTime && {
      label: 'Coffee Timing',
      text: `Coffee at ${fmtT(r.coffeeTime)} created spacing windows for items that absorb better without caffeine nearby.`,
    },
    (r.hasBreakfast && r.breakfastStart) && {
      label: 'Meal Timing',
      text: `Breakfast around ${fmtT(r.breakfastStart)} helped anchor items that need food to absorb well.`,
    },
    (data.conflicts || []).length > 0 && {
      label: 'Spacing Rules',
      text: `${(data.conflicts || []).length} item pair${(data.conflicts || []).length !== 1 ? 's' : ''} needed more distance between them to avoid reducing effectiveness.`,
    },
    (data.optimizationLogic || []).some(o => o.reason && o.reason.toLowerCase().includes('fat')) && {
      label: 'Food Pairing',
      text: 'Some items in your stack absorb better with a meal, particularly one containing healthy fat.',
    },
    r.wakeTime && {
      label: 'Routine Fit',
      text: `Your wake time of ${fmtT(r.wakeTime)} set the anchor for your morning window and shaped when fasting items were placed.`,
    },
  ].filter(Boolean);

  return (
    <Page size="A4" style={styles.page}>
      <SectionHeader num={6} title="What Shaped Your Plan" sub="Here is what Absovex looked at when building your schedule" />

      <CalloutBox bg={COLORS.tealBg} borderColor={COLORS.teal}>
        <Text style={styles.bodyText}>{summaryText}</Text>
      </CalloutBox>

      {drivers.map((d, i) => (
        <View key={i} style={[styles.tealAccent, { marginTop: 10 }]}>
          <Text style={styles.labelSmall}>{d.label}</Text>
          <Text style={[styles.bodyText, { marginTop: 3 }]}>{d.text}</Text>
        </View>
      ))}

      {insights.length > 1 ? (
        <View style={{ marginTop: 16 }}>
          <Text style={[styles.itemHeader, { fontSize: 12 }]}>What helped this plan work well</Text>
          {insights.slice(1).map((ins, i) => (
            <Text key={i} style={[styles.bodyText, { marginBottom: 5 }]}>· {ins}</Text>
          ))}
        </View>
      ) : null}

      <PageFooter />
    </Page>
  );
};

// ─── PAGE 8 — Health Stack Score Breakdown ────────────────────────────────────

const ScoreBreakdownPage = ({ data }) => {
  const breakdown = data.scoreBreakdown || [];
  const diff = (data.optimizedScore || 0) - (data.currentScore || 0);
  const logic = data.optimizationLogic || [];
  const conflicts = data.conflicts || [];

  const simplified = [
    {
      label: 'Timing',
      note: logic.length > 0
        ? `${logic.length} item${logic.length !== 1 ? 's' : ''} moved to better time windows.`
        : 'Timing was reviewed across your full stack.',
    },
    {
      label: 'Spacing',
      note: conflicts.length > 0
        ? `${conflicts.length} conflict${conflicts.length !== 1 ? 's' : ''} identified with spacing fixes applied.`
        : 'No major spacing issues found.',
    },
    {
      label: 'Food Pairing',
      note: 'Items that need food or fat for absorption were placed at meal times.',
    },
    {
      label: 'Routine Fit',
      note: 'The schedule was built around your actual meal windows, coffee habit, and bedtime.',
    },
  ];

  const topCats = breakdown.length >= 2
    ? breakdown.sort((a, b) => (b.after - b.before) - (a.after - a.before)).slice(0, 2).map(c => c.category)
    : ['Timing', 'Spacing'];

  return (
    <Page size="A4" style={styles.page}>
      <SectionHeader num={7} title="Health Stack Score Breakdown" sub="See what your score measures and what improved most" />

      <CalloutBox bg={COLORS.tealBg}>
        <Text style={styles.bodyText}>
          Your Health Stack Score reflects how well your routine supports timing, spacing, food pairing, and day-to-day follow-through across your full stack.
        </Text>
      </CalloutBox>

      {breakdown.length > 0 ? (
        breakdown.map((cat, i) => (
          <View key={i} wrap={false} style={{ marginBottom: 10 }}>
            <View style={[styles.row, { alignItems: 'center', marginBottom: 4 }]}>
              <Text style={{ fontSize: 11, fontWeight: 700, flex: 1 }}>{cat.category}</Text>
              <Text style={styles.smallText}>{cat.before} → {cat.after} / {cat.maxPoints}</Text>
            </View>
            {(cat.actions_that_improved_score || []).slice(0, 2).map((act, j) => (
              <Text key={j} style={[styles.smallText, { marginLeft: 8, marginBottom: 2 }]}>· {act}</Text>
            ))}
            {cat.why_not_perfect ? (
              <Text style={[styles.smallText, { color: COLORS.gray, marginTop: 3 }]}>{cat.why_not_perfect}</Text>
            ) : null}
            {i < breakdown.length - 1 ? <Divider /> : null}
          </View>
        ))
      ) : (
        simplified.map((row, i) => (
          <View key={i} style={[styles.tealAccent, { marginTop: 10 }]}>
            <Text style={styles.labelSmall}>{row.label}</Text>
            <Text style={[styles.bodyText, { marginTop: 3 }]}>{row.note}</Text>
          </View>
        ))
      )}

      <View style={[styles.calloutBox, { marginTop: 16, backgroundColor: COLORS.cream }]}>
        <Text style={styles.bodyText}>
          Your score improved most in {topCats.join(' and ')}.
          {diff > 0 ? ` Overall improvement: +${diff} points.` : ''}
        </Text>
      </View>

      <PageFooter />
    </Page>
  );
};

// ─── PAGE 9 — Questions to Bring to Your Doctor or Pharmacist ────────────────

const PHARMACIST_QS = [
  'Are any of the items in this plan known to interact with each other based on my full medication list?',
  'Is the spacing between my supplements and medications enough to prevent any absorption issues?',
  'Are there any items in my stack I should take on an empty stomach even if it feels uncomfortable?',
  'Is there anything in this plan that could interfere with lab results I should know about before my next appointment?',
];

const DOCTOR_QS = [
  'My Absovex report suggests some timing changes — does anything here conflict with how you intended me to take these?',
  'Should I adjust any of these timing recommendations based on my current health conditions?',
  'Are there any items in this stack I should reconsider given my overall treatment goals?',
  'How often should I revisit this schedule as my routine or prescriptions change?',
];

const STAGE_QS = {
  'peri-menopausal': [
    'How might fluctuating hormones affect how I absorb these supplements right now?',
    'Are there items in this plan that may become more or less important as I transition through menopause?',
    'Is my magnesium and vitamin D timing appropriate given peri-menopausal sleep and mood symptoms?',
  ],
  'post-menopausal': [
    'Are my calcium and vitamin D doses and timing appropriate for bone health post-menopause?',
    'Should I adjust any of these supplements now that my hormones have stabilized?',
    'Are there items in this plan that interact with any HRT or bone-density medications I may need?',
  ],
  'on hrt': [
    'How does HRT affect how I absorb the items in this plan, particularly calcium and magnesium?',
    'Are there any supplements here that could affect how my HRT is metabolized?',
    'Should the timing of my HRT be coordinated with any items in this stack?',
  ],
  'pre-menopausal': [
    'Are there items in this plan that should be adjusted based on my cycle phase?',
    'Is iron timing appropriate given my menstrual cycle and any iron-related concerns?',
    'How should I think about this supplement schedule if my health goals change around pregnancy or fertility?',
  ],
};

const DoctorQsPage = ({ data, routine }) => {
  const r = routine || {};
  const stage = (r.hormonalStage || '').toLowerCase().trim();
  const stageQs = STAGE_QS[stage] || null;
  const doctorPrompts = data.doctorPrompts || [];

  return (
    <Page size="A4" style={styles.page}>
      <SectionHeader num={8} title="Questions to Bring to Your Doctor or Pharmacist" sub="Use these prompts to make your next conversation more useful" />

      <Text style={[styles.itemHeader, { fontSize: 12, color: COLORS.teal }]}>Ask Your Pharmacist</Text>
      {PHARMACIST_QS.map((q, i) => (
        <View key={i} style={{ marginBottom: 6, paddingLeft: 8 }}>
          <Text style={styles.bodyText}>{i + 1}. {q}</Text>
        </View>
      ))}

      <Divider />

      <Text style={[styles.itemHeader, { fontSize: 12, color: COLORS.teal }]}>Ask Your Doctor</Text>
      {DOCTOR_QS.map((q, i) => (
        <View key={i} style={{ marginBottom: 6, paddingLeft: 8 }}>
          <Text style={styles.bodyText}>{i + 1}. {q}</Text>
        </View>
      ))}

      {stageQs ? (
        <View>
          <Divider />
          <Text style={[styles.itemHeader, { fontSize: 12, color: COLORS.teal }]}>Ask Based on Your Life Stage</Text>
          {stageQs.map((q, i) => (
            <View key={i} style={{ marginBottom: 6, paddingLeft: 8 }}>
              <Text style={styles.bodyText}>{i + 1}. {q}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {doctorPrompts.length > 0 ? (
        <View>
          <Divider />
          <Text style={[styles.itemHeader, { fontSize: 12, color: COLORS.teal }]}>Additional Questions from Your Analysis</Text>
          {doctorPrompts.slice(0, 4).map((q, i) => (
            <View key={i} style={{ marginBottom: 6, paddingLeft: 8 }}>
              <Text style={styles.bodyText}>{i + 1}. {q}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={{ marginTop: 16 }}>
        <Text style={[styles.itemHeader, { fontSize: 12, color: COLORS.teal }]}>Bring These With You</Text>
        {['This Absovex report', 'Your full medication and supplement list', 'Any recent lab results', 'A short list of symptoms or changes you have noticed'].map((item, i) => (
          <Text key={i} style={[styles.bodyText, { marginBottom: 4, paddingLeft: 8 }]}>· {item}</Text>
        ))}
      </View>

      <View style={{ marginTop: 16 }}>
        <Text style={styles.smallText}>
          This report is for educational purposes only and is not medical advice. Review any medication or supplement changes with your doctor, pharmacist, or other qualified healthcare professional.
        </Text>
      </View>

      <PageFooter />
    </Page>
  );
};

// ─── PAGE 10 — Daily Timing Card ─────────────────────────────────────────────

const BADGE_MAP = {
  'empty stomach': { label: 'Empty stomach only', avoid: false },
  'water only': { label: 'Water only', avoid: false },
  'with food': { label: 'Take with food', avoid: false },
  'with fat': { label: 'Take with fatty food', avoid: false },
  'vitamin c': { label: 'Take with vitamin C', avoid: false },
  'coffee': { label: 'Avoid coffee for 30 min', avoid: true },
  'dairy': { label: 'Avoid dairy nearby', avoid: true },
  'iron': { label: 'Avoid iron nearby', avoid: true },
  'breakfast': { label: 'With breakfast', avoid: false },
  'dinner': { label: 'With dinner', avoid: false },
};

const inferBadges = item => {
  const text = ((item.instruction || '') + ' ' + (item.reason || '')).toLowerCase();
  return Object.entries(BADGE_MAP)
    .filter(([key]) => text.includes(key))
    .map(([, val]) => val);
};

const TimingCardPage = ({ data }) => {
  const quickRef = data.quickReference || [];
  return (
    <Page size="A4" style={styles.page}>
      <View style={{ marginBottom: 4 }}>
        <Text style={{ fontSize: 16, fontWeight: 700, color: COLORS.teal }}>Your Daily Timing Card</Text>
        <Text style={styles.subhead}>A quick reference for your optimized schedule</Text>
        <Text style={[styles.smallText, { marginBottom: 10 }]}>Keep this handy. It covers your full daily schedule with key reminders for each item.</Text>
      </View>

      {quickRef.map((block, i) => (
        <View key={i} wrap={false} style={{ marginBottom: 14 }}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupHeaderText}>{fmtT(block.time) || block.time}</Text>
          </View>
          {(block.items || []).map((itemName, j) => {
            const schedule = data.schedule || {};
            const allItems = Object.values(schedule).flat();
            const itemDetail = allItems.find(it => it.name === itemName) || { name: itemName };
            const badges = inferBadges(itemDetail);

            return (
              <View key={j} style={{ marginBottom: 6 }}>
                <View style={styles.row}>
                  <Text style={{ fontSize: 10, fontWeight: 700, flex: 1 }}>{itemDetail.name}</Text>
                  {itemDetail.dose ? <Text style={styles.smallText}>{itemDetail.dose}</Text> : null}
                </View>
                {badges.length > 0 ? (
                  <View style={[styles.row, { flexWrap: 'wrap', marginTop: 3 }]}>
                    {badges.map((b, k) => (
                      <View key={k} style={[styles.badge, { backgroundColor: b.avoid ? COLORS.magenta : COLORS.teal }]}>
                        <Text style={styles.badgeText}>{b.label}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      ))}

      <DisclaimerBlock />
      <PageFooter />
    </Page>
  );
};

// ─── Main document export ─────────────────────────────────────────────────────

export default function AbsovexReportPDF({ data, userName, routine }) {
  const d = data || {};
  const r = routine || null;

  return (
    <Document title="Absovex Health Stack Report" author="Absovex">
      <CoverPage data={d} userName={userName} />
      <SummaryPage data={d} />
      <BeforeAfterPage data={d} />
      <SchedulePage data={d} />
      <AuditPage data={d} />
      <ConflictsPage data={d} />
      <RoutineInsightsPage data={d} routine={r} />
      <ScoreBreakdownPage data={d} />
      <DoctorQsPage data={d} routine={r} />
      <TimingCardPage data={d} />
    </Document>
  );
}
