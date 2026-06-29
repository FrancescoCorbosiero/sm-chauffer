import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/site';

// Dynamic, branded Open Graph card generated at the edge — replaces a static
// og.png. Inherited by every route that doesn't define its own OG image.
export const runtime = 'nodejs';
export const alt = 'SK Luxury Chauffeur — NCC e autista di lusso';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background:
            'linear-gradient(135deg, #060606 0%, #131313 55%, #1d1606 100%)',
          padding: '72px 80px',
          color: '#ffffff',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9999,
              background: '#ffa806',
            }}
          />
          <div
            style={{
              fontSize: 26,
              letterSpacing: 8,
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.72)',
            }}
          >
            Luxury Chauffeur · NCC
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 76, lineHeight: 1.05, fontWeight: 500 }}>
            SK Luxury
          </div>
          <div style={{ fontSize: 76, lineHeight: 1.05, color: '#ffa806' }}>
            Chauffeur
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 32,
              color: 'rgba(255,255,255,0.8)',
              fontFamily: 'sans-serif',
            }}
          >
            Milano · Brianza · Lago di Como · Transfer 24/7
          </div>
        </div>

        <div
          style={{
            fontSize: 26,
            color: 'rgba(255,255,255,0.6)',
            fontFamily: 'sans-serif',
          }}
        >
          {SITE.url.replace('https://', '')}
        </div>
      </div>
    ),
    { ...size },
  );
}
