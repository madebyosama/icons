'use client';

import { useEffect, useState } from 'react';
import { downloadSvg } from './utils/download';
import Loading from './components/Loading/Loading';

interface Icon {
  title: string;
  code: string;
  type: string;
}

export default function Home() {
  const [icons, setIcons] = useState<Icon[]>([]);
  const [filteredIcons, setFilteredIcons] = useState<Icon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

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
        setFilteredIcons(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchIcons();
  }, []);

  useEffect(() => {
    // Filter icons based on search term
    const filtered = icons.filter((icon) =>
      icon.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredIcons(filtered);
  }, [searchTerm, icons]);

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
  };

  const handleDownload = (code: string, title: string) => {
    downloadSvg(code, title);
  };

  if (error) {
    return <div className='error'>Error: {error}</div>;
  }

  return (
    <main className='container'>
      <div className='title'>
        <div className='sub' style={{ textAlign: 'center' }}>
          Insanely useful icons
        </div>
        <div className='heading'>
          {icons.length ? icons.length + ' ' : ''}Icons
        </div>
        {/* <div className='description'>Made with ❤️ madebyosama.com</div> */}
      </div>
      <div className='search-container'>
        <input
          type='text'
          placeholder='Search Icons'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='search-input'
        />
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className='icons'>
          {filteredIcons.map((icon, index) => (
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
      )}
    </main>
  );
}
