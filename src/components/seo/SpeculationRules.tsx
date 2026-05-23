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

export default function SpeculationRules() {
  return (
    <script
      type="speculationrules"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(rules) }}
    />
  );
}
