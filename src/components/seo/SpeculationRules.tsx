const rules = {
  prerender: [
    {
      source: 'document',
      where: {
        and: [
          { href_matches: '/*' },
          { not: { href_matches: '/links*' } },
          { not: { href_matches: '/api*' } },
          { not: { selector_matches: '[rel~="external"]' } },
          { not: { selector_matches: '[target="_blank"]' } },
        ],
      },
      eagerness: 'moderate',
    },
  ],
  prefetch: [
    {
      source: 'document',
      where: {
        and: [
          { href_matches: '/*' },
          { not: { href_matches: '/links*' } },
          { not: { href_matches: '/api*' } },
          { not: { selector_matches: '[rel~="external"]' } },
        ],
      },
      eagerness: 'moderate',
    },
  ],
};

// Static, server-rendered script tag (no hydration on the client).
// React 19 sometimes warns when a <script> is "rendered" client-side; giving
// each script a stable id lets React deduplicate the element instead of
// re-rendering it on hydration.
export default function SpeculationRules() {
  return (
    <script
      id="speculation-rules"
      type="speculationrules"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(rules) }}
    />
  );
}
