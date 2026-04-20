// Batch research: query multiple celebrity young photos on Commons
import fs from 'fs';

const QUERIES = [
  // name, search terms, tier, expected description
  ['Michael Jackson', ['Jackson 5 1972', 'Michael Jackson 1972', 'Jackson 5 1971'], 200],
  ['Elvis Presley', ['Elvis Presley 1956', 'Elvis Presley 1954', 'Elvis Presley Sun Records'], 200],
  ['Princess Diana', ['Diana Spencer 1980', 'Lady Diana Spencer young', 'Princess Diana 1981'], 200],
  ['Queen Elizabeth II', ['Princess Elizabeth 1940', 'Princess Elizabeth 1936', 'Queen Elizabeth 1953'], 200],
  ['John F. Kennedy', ['John F Kennedy young', 'John Kennedy 1940', 'John Kennedy Navy'], 200],
  ['Elizabeth Taylor', ['Elizabeth Taylor 1945', 'Elizabeth Taylor National Velvet', 'Elizabeth Taylor 1947'], 400],
  ['Shirley Temple', ['Shirley Temple 1934', 'Shirley Temple 1936', 'Shirley Temple child'], 200],
  ['Macaulay Culkin', ['Macaulay Culkin 1990', 'Macaulay Culkin young'], 400],
  ['Britney Spears', ['Britney Spears 1999', 'Britney Spears 2000', 'Britney Spears young'], 400],
  ['Justin Timberlake', ['Justin Timberlake 2000', 'Justin Timberlake NSYNC', 'NSYNC 1999'], 400],
  ['Michael Jordan', ['Michael Jordan North Carolina', 'Michael Jordan 1984', 'Michael Jordan rookie'], 400],
  ['Muhammad Ali', ['Cassius Clay 1960', 'Muhammad Ali 1963', 'Muhammad Ali 1967'], 400],
  ['Frank Sinatra', ['Frank Sinatra 1944', 'Frank Sinatra 1947', 'Frank Sinatra young'], 600],
  ['Marilyn Monroe', ['Norma Jeane', 'Marilyn Monroe 1945', 'Marilyn Monroe 1946'], 400],
  ['Audrey Hepburn', ['Audrey Hepburn 1953', 'Audrey Hepburn Roman Holiday', 'Audrey Hepburn 1956'], 400],
  ['Elton John', ['Elton John 1971', 'Elton John 1975', 'Elton John young'], 400],
  ['David Beckham', ['David Beckham 1996', 'David Beckham Manchester United young'], 600],
  ['Lionel Messi', ['Lionel Messi 2005', 'Lionel Messi 2006', 'Messi Barcelona 2005'], 600],
  ['Cristiano Ronaldo', ['Cristiano Ronaldo 2003', 'Cristiano Ronaldo 2004', 'Ronaldo Sporting'], 600],
  ['Taylor Swift', ['Taylor Swift 2007', 'Taylor Swift 2008', 'Taylor Swift country'], 400],
  ['Miley Cyrus', ['Miley Cyrus 2007', 'Miley Cyrus 2008', 'Hannah Montana Miley'], 400],
  ['Emma Watson', ['Emma Watson 2002', 'Emma Watson 2004', 'Emma Watson Harry Potter'], 400],
  ['Daniel Radcliffe', ['Daniel Radcliffe 2002', 'Daniel Radcliffe 2004', 'Daniel Radcliffe young'], 400],
  ['Rupert Grint', ['Rupert Grint 2005', 'Rupert Grint 2007', 'Rupert Grint young'], 600],
  ['Leonardo DiCaprio', ['Leonardo DiCaprio 1994', 'Leonardo DiCaprio young', 'Leonardo DiCaprio 1997'], 400],
  ['Brad Pitt', ['Brad Pitt 1988', 'Brad Pitt young', 'Brad Pitt 1994'], 400],
  ['Jennifer Aniston', ['Jennifer Aniston 1994', 'Jennifer Aniston young', 'Jennifer Aniston 1990'], 400],
  ['Julia Roberts', ['Julia Roberts 1990', 'Julia Roberts Pretty Woman', 'Julia Roberts young'], 400],
  ['Tom Cruise', ['Tom Cruise 1986', 'Tom Cruise young', 'Tom Cruise 1989'], 400],
  ['Paul McCartney', ['Paul McCartney 1964', 'Paul McCartney Beatles 1964'], 400],
  ['John Lennon', ['John Lennon 1964', 'John Lennon Beatles 1965', 'John Lennon young'], 400],
  ['Mick Jagger', ['Mick Jagger 1965', 'Mick Jagger 1969', 'Rolling Stones 1965'], 600],
  ['Freddie Mercury', ['Freddie Mercury 1977', 'Freddie Mercury Queen 1977', 'Freddie Mercury young'], 600],
  ['David Bowie', ['David Bowie 1974', 'David Bowie 1973', 'David Bowie young'], 600],
  ['Stevie Wonder', ['Stevie Wonder 1967', 'Stevie Wonder 1973', 'Stevie Wonder young'], 600],
  ['Aretha Franklin', ['Aretha Franklin 1967', 'Aretha Franklin 1968', 'Aretha Franklin young'], 600],
  ['Bob Marley', ['Bob Marley 1976', 'Bob Marley 1977', 'Bob Marley young'], 400],
  ['Bob Dylan', ['Bob Dylan 1963', 'Bob Dylan 1965', 'Bob Dylan young'], 600],
  ['Jimi Hendrix', ['Jimi Hendrix 1967', 'Jimi Hendrix 1968', 'Jimi Hendrix young'], 600],
  ['Kurt Cobain', ['Kurt Cobain 1992', 'Kurt Cobain Nirvana'], 600],
  ['Amy Winehouse', ['Amy Winehouse 2007', 'Amy Winehouse young', 'Amy Winehouse 2004'], 600],
  ['Whitney Houston', ['Whitney Houston 1988', 'Whitney Houston young', 'Whitney Houston 1991'], 400],
  ['Prince', ['Prince 1986', 'Prince musician 1985', 'Prince Rogers Nelson young'], 600],
  ['Mariah Carey', ['Mariah Carey 1990', 'Mariah Carey 1993', 'Mariah Carey young'], 400],
  ['Rihanna', ['Rihanna 2005', 'Rihanna 2007', 'Rihanna young'], 400],
  ['Beyonce', ['Beyonce 2003', 'Beyonce Destinys Child', 'Beyonce 2001'], 400],
  ['Jay-Z', ['Jay-Z 2000', 'Jay-Z young', 'Jay Z 2003'], 400],
  ['Drake', ['Drake 2009', 'Drake rapper 2010', 'Drake Degrassi'], 400],
  ['Kanye West', ['Kanye West 2004', 'Kanye West 2005', 'Kanye West young'], 400],
  ['Eminem', ['Eminem 1999', 'Eminem 2000', 'Eminem young'], 400],
  ['Barack Obama', ['Barack Obama young', 'Barack Obama Harvard', 'Obama 1990'], 200],
  ['Bill Clinton', ['Bill Clinton young', 'Bill Clinton 1978', 'Bill Clinton governor'], 400],
  ['Donald Trump', ['Donald Trump 1980', 'Donald Trump young', 'Donald Trump 1985'], 400],
  ['Hillary Clinton', ['Hillary Clinton young', 'Hillary Rodham', 'Hillary Clinton 1978'], 400],
  ['Ellen DeGeneres', ['Ellen DeGeneres 1997', 'Ellen DeGeneres 1995'], 600],
  ['Oprah Winfrey', ['Oprah Winfrey 1986', 'Oprah Winfrey 1987', 'Oprah Winfrey young'], 400],
  ['Steve Jobs', ['Steve Jobs 1984', 'Steve Jobs young', 'Steve Jobs 1977'], 200],
  ['Bill Gates', ['Bill Gates 1977', 'Bill Gates young', 'Bill Gates 1980'], 400],
  ['Mark Zuckerberg', ['Mark Zuckerberg 2005', 'Mark Zuckerberg young', 'Mark Zuckerberg 2007'], 400],
  ['Keith Richards', ['Keith Richards 1965', 'Keith Richards 1972', 'Keith Richards young'], 600],
  ['Janis Joplin', ['Janis Joplin 1969', 'Janis Joplin 1970', 'Janis Joplin young'], 600],
];

const UA = { 'User-Agent': 'TriviaResearch/1.0 (contact: thememesofdoom@gmail.com)' };

async function search(q, limit = 8) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&srnamespace=6&format=json&srlimit=${limit}`;
  const res = await fetch(url, { headers: UA });
  return res.json();
}

async function getInfo(title) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|mime|size|extmetadata&format=json`;
  const res = await fetch(url, { headers: UA });
  return res.json();
}

const results = {};

for (const [name, terms, tier] of QUERIES) {
  const found = [];
  for (const t of terms) {
    try {
      const data = await search(t, 6);
      const hits = data?.query?.search || [];
      for (const h of hits.slice(0, 4)) {
        // Only consider images (not PDFs)
        if (!/\.(jpg|jpeg|png|webp|gif)$/i.test(h.title)) continue;
        const info = await getInfo(h.title);
        const page = Object.values(info.query.pages)[0];
        const ii = page.imageinfo?.[0];
        if (!ii) continue;
        const license = ii.extmetadata?.LicenseShortName?.value || '?';
        const date = ii.extmetadata?.DateTimeOriginal?.value || ii.extmetadata?.DateTime?.value || '?';
        found.push({
          title: h.title,
          url: ii.url,
          dims: `${ii.width}x${ii.height}`,
          mime: ii.mime,
          date,
          license,
          searchTerm: t,
        });
      }
    } catch (e) {
      console.error(`Error for ${name}/${t}: ${e.message}`);
    }
  }
  results[name] = { tier, candidates: found };
  console.log(`\n=== ${name} (tier ${tier}) ===`);
  for (const f of found) {
    console.log(`  [${f.searchTerm}] ${f.title}`);
    console.log(`     ${f.url}`);
    console.log(`     date=${f.date} license=${f.license}`);
  }
}

fs.writeFileSync('audit/young-celeb-candidates.json', JSON.stringify(results, null, 2));
console.log('\nSaved candidates to audit/young-celeb-candidates.json');
