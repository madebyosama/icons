'use client';

interface Icon {
  title: string;
  code: string;
  type: string;
}

import { useEffect, useState } from 'react';
import { downloadSvg } from './utils/download';

export default function Home() {
  const [icons, setIcons] = useState<Icon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const response = await fetch(
          'https://opensheet.elk.sh/1gJdgS9vawxEVNmISvPsaNKTkChTGEQwwOMIQiyH_NdM/huge'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch icons');
        }
        const data: Icon[] = await response.json();
        setIcons(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchIcons();
  }, []);

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
  };

  const handleDownload = (code: string, title: string) => {
    downloadSvg(code, title);
  };

  if (loading) {
    return <div style={{ fontWeight: 600 }}>Loading...</div>;
  }

  if (error) {
    return <div className='error'>Error: {error}</div>;
  }

  return (
    <main className='container'>
      <div className='icons'>
        {icons.map((icon, index) => (
          <div
            key={`${icon.title}-${index}`}
            className='icon'
            onClick={() => handleCopy(icon.code)}
            onDoubleClick={(e) => {
              e.preventDefault();
              handleDownload(icon.code, icon.title);
            }}
          >
            <div
              className='code'
              dangerouslySetInnerHTML={{ __html: icon.code }}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
