// Given file titles, fetch the actual upload URL via Commons API
import fs from 'fs';

const titles = [
  ["Michael Jackson", "File:Jackson 5 1972.JPG", "Jackson 5 TV appearance 1972 (MJ age ~14)", 200],
  ["Elvis Presley", "File:Elvis Presley first national television appearance 1956.jpg", "Elvis on TV 1956 (age 21)", 200],
  ["Princess Diana", "File:Princess Diana dancing with John Travolta in Cross Hall at the White House.jpg", "Diana at White House 1985 (age 24)", 400],
  ["Queen Elizabeth II", "File:Philip de László - Princess Elizabeth of York - 1933.jpg", "Princess Elizabeth portrait 1933 (age 7)", 200],
  ["John F. Kennedy", "File:Congressman John F. Kennedy 1947.JPG", "Congressman JFK 1947 (age 30)", 400],
  ["Elizabeth Taylor", "File:Elizabeth Taylor-1945.JPG", "Elizabeth Taylor 1945 (age 13, National Velvet era)", 400],
  ["Shirley Temple", "File:Shirley Temple in \"Bright Eyes\" with James Dunn.jpg", "Shirley Temple 1934 Bright Eyes (age 6)", 200],
  ["Britney Spears", "File:Britney Spears 1999.jpg", "Britney Spears 1999 era (age ~17)", 400],
  ["Michael Jordan", "File:Michael Jordan - 1984 (2).jpg", "Michael Jordan 1984 rookie year", 400],
  ["Muhammad Ali", "File:Cassius Clay (1960, JO).jpg", "Cassius Clay 1960 Olympics (age 18)", 400],
  ["Frank Sinatra", "File:Frank Sinatra (1944 World-Telegram file photo).jpg", "Frank Sinatra 1944 (age ~28)", 600],
  ["Marilyn Monroe", "File:Marilyn Monroe as Norma Jean Dougherty.jpg", "Norma Jean 1945 (Marilyn age 19)", 400],
  ["Audrey Hepburn", "File:Audrey Hepburn 1953.jpg", "Audrey Hepburn 1953 (age 24)", 400],
  ["Lionel Messi", "File:Leo messi barce 2005.jpg", "Messi at Barcelona 2005 (age 18)", 600],
  ["Taylor Swift", "File:Taylor Swift (2007) retouched.jpg", "Taylor Swift 2007 country era (age 17)", 400],
  ["Miley Cyrus", "File:Miley Cyrus as Hannah Montana.jpg", "Miley as Hannah Montana 2007 (age 14)", 400],
  ["Emma Watson", "File:Emma Watson GoF Premiere Crop.jpg", "Emma Watson Goblet of Fire premiere 2005 (age 15)", 400],
  ["Rupert Grint", "File:Rupert Grint (cropped).JPG", "Rupert Grint 2007 (age 18)", 600],
  ["Tom Cruise", "File:Tom cruise 1989.jpg", "Tom Cruise 1989 (age 26)", 400],
  ["Paul McCartney", "File:Paul McCartney 1964.jpg", "Paul McCartney 1964 Beatlemania (age 22)", 400],
  ["John Lennon", "File:John Lennon 1964.jpg", "John Lennon 1964 Beatlemania (age 23)", 400],
  ["Mick Jagger", "File:Mick-Jagger-1965-Turku.jpg", "Mick Jagger 1965 Finland (age 22)", 600],
  ["Freddie Mercury", "File:Freddie Mercury performing in New Haven, CT, November 1977.jpg", "Freddie Mercury 1977 concert (age 31)", 600],
  ["David Bowie", "File:David Bowie 1974.JPG", "David Bowie 1974 Young Americans era (age 27)", 600],
  ["Stevie Wonder", "File:Stevie Wonder 1967 (1).jpg", "Stevie Wonder 1967 (age 17)", 600],
  ["Aretha Franklin", "File:Aretha franklin 1960s cropped retouched.jpg", "Aretha Franklin 1967 (age 25)", 600],
  ["Bob Marley", "File:Bob Marley performing in 1976.jpg", "Bob Marley 1976 concert (age 31)", 400],
  ["Bob Dylan", "File:Bob Dylan 1963 promo photo by Don Hunstein.jpg", "Bob Dylan 1963 promo (age 22)", 600],
  ["Jimi Hendrix", "File:Jimi Hendrix (1967) (cropped).jpg", "Jimi Hendrix 1967 (age 24)", 600],
  ["Kurt Cobain", "File:Kurt Cobain 1992.jpg", "Kurt Cobain 1992 (age 25, Nirvana peak)", 600],
  ["Amy Winehouse", "File:Amy winehouse 2007.jpg", "Amy Winehouse 2007 (age 23)", 600],
  ["Prince", "File:Prince from Under the Cherry Moon, 1986.png", "Prince 1986 Under the Cherry Moon (age 28)", 600],
  ["Mariah Carey", "File:Mariah Carey 1990.jpg", "Mariah Carey 1990 debut (age 20)", 400],
  ["Beyonce", "File:Beyonce Knowles at age 19 (cropped).jpeg", "Beyonce age 19, 2001 (Destiny's Child era)", 400],
  ["Jay-Z", "File:Jay-Z-01-mika.jpg", "Jay-Z 2000 (age 30)", 400],
  ["Eminem", "File:Eminem-01-mika.jpg", "Eminem 1999 (age 27)", 400],
  ["Barack Obama", "File:Barack Obama luncheon in Cairo, Illinois (April 15, 2004).jpg", "Obama Illinois Senate campaign 2004 (age 42)", 200],
  ["Bill Clinton", "File:Bill Clinton 1978.jpg", "Bill Clinton 1978 as AR Governor (age 32)", 400],
  ["Donald Trump", "File:Donald Trump in the 1980s (cropped).jpg", "Donald Trump 1980s (age ~35)", 400],
  ["Hillary Clinton", "File:Hillary Rodham Clinton accepts Intrepid Freedom Award.jpg", "Hillary Clinton 2004 receiving award", 400],
  ["Oprah Winfrey", "File:Oprah Winfrey, Akosua Busia and Margaret Avery, 1986.jpg", "Oprah Winfrey 1986 Color Purple era (age 32)", 400],
  ["Steve Jobs", "File:Steve Jobs and Macintosh computer, January 1984, by Bernard Gotfryd - edited.jpg", "Steve Jobs 1984 Macintosh launch (age 28)", 200],
  ["Bill Gates", "File:Bill Gates 1977.png", "Bill Gates 1977 mugshot (age 22)", 400],
  ["Mark Zuckerberg", "File:MarkZuckerberg-crop.jpg", "Mark Zuckerberg 2005 (age 21)", 400],
  ["Keith Richards", "File:Keith Richards (1965).jpg", "Keith Richards 1965 (age 21)", 600],
  ["Janis Joplin", "File:Janis Joplin 1969.JPG", "Janis Joplin 1969 (age 26)", 600],
  ["Ellen DeGeneres", "File:Ellen DeGeneres at Emmys.jpg", "Ellen DeGeneres 1995 Emmys (age 37)", 600],
];

const UA = { 'User-Agent': 'TriviaResearch/1.0 (thememesofdoom@gmail.com)' };

async function getInfo(title) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|mime|size|extmetadata&format=json`;
  const res = await fetch(url, { headers: UA });
  return res.json();
}

const out = [];
for (const [name, title, desc, tier] of titles) {
  const info = await getInfo(title);
  const page = Object.values(info.query.pages)[0];
  const ii = page?.imageinfo?.[0];
  if (!ii) {
    console.log(`MISS ${name}: ${title}`);
    continue;
  }
  const license = ii.extmetadata?.LicenseShortName?.value || '?';
  out.push({ name, title, url: ii.url, desc, tier, dims: `${ii.width}x${ii.height}`, license });
  console.log(`OK ${name} -> ${ii.url} (${license})`);
  await new Promise(r => setTimeout(r, 300));
}
fs.writeFileSync('audit/young-celeb-urls-resolved.json', JSON.stringify(out, null, 2));
console.log('\nSaved to audit/young-celeb-urls-resolved.json');
