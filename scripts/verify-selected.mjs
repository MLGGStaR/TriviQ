// Verify a list of URLs sequentially with delay
import fs from 'fs';

const URLs = [
  ["Michael Jackson", "https://upload.wikimedia.org/wikipedia/commons/c/c4/Jackson_5_1972.JPG"],
  ["Elvis Presley", "https://upload.wikimedia.org/wikipedia/commons/c/cf/Elvis_Presley_first_national_television_appearance_1956.jpg"],
  ["Princess Diana", "https://upload.wikimedia.org/wikipedia/commons/9/94/Princess_Diana_dancing_with_John_Travolta_in_Cross_Hall_at_the_White_House.jpg"],
  ["Queen Elizabeth II", "https://upload.wikimedia.org/wikipedia/commons/6/6d/Philip_de_L%C3%A1szl%C3%B3_-_Princess_Elizabeth_of_York_-_1933.jpg"],
  ["John F. Kennedy", "https://upload.wikimedia.org/wikipedia/commons/d/d5/Congressman_John_F._Kennedy_1947.JPG"],
  ["Elizabeth Taylor", "https://upload.wikimedia.org/wikipedia/commons/5/5d/Elizabeth_Taylor-1945.JPG"],
  ["Shirley Temple", "https://upload.wikimedia.org/wikipedia/commons/f/fd/Shirley_Temple_in_%22Bright_Eyes%22_with_James_Dunn.jpg"],
  ["Britney Spears", "https://upload.wikimedia.org/wikipedia/commons/a/a1/Britney_Spears_1999.jpg"],
  ["Michael Jordan", "https://upload.wikimedia.org/wikipedia/commons/8/8a/Michael_Jordan_-_1984_%282%29.jpg"],
  ["Muhammad Ali", "https://upload.wikimedia.org/wikipedia/commons/8/8b/Cassius_Clay_%281960%2C_JO%29.jpg"],
  ["Frank Sinatra", "https://upload.wikimedia.org/wikipedia/commons/1/12/Frank_Sinatra_%281944_World-Telegram_file_photo%29.jpg"],
  ["Marilyn Monroe", "https://upload.wikimedia.org/wikipedia/commons/f/fc/Marilyn_Monroe_as_Norma_Jean_Dougherty.jpg"],
  ["Audrey Hepburn", "https://upload.wikimedia.org/wikipedia/commons/7/7e/Audrey_Hepburn_1953.jpg"],
  ["Lionel Messi", "https://upload.wikimedia.org/wikipedia/commons/e/e4/Leo_messi_barce_2005.jpg"],
  ["Taylor Swift", "https://upload.wikimedia.org/wikipedia/commons/9/90/Taylor_Swift_%282007%29_retouched.jpg"],
  ["Miley Cyrus", "https://upload.wikimedia.org/wikipedia/commons/4/43/Miley_Cyrus_as_Hannah_Montana.jpg"],
  ["Emma Watson", "https://upload.wikimedia.org/wikipedia/commons/b/be/Emma_Watson_GoF_Premiere_Crop.jpg"],
  ["Rupert Grint", "https://upload.wikimedia.org/wikipedia/commons/0/0a/Rupert_Grint_%28cropped%29.JPG"],
  ["Tom Cruise", "https://upload.wikimedia.org/wikipedia/commons/2/2b/Tom_cruise_1989.jpg"],
  ["Paul McCartney", "https://upload.wikimedia.org/wikipedia/commons/0/03/Paul_McCartney_1964.jpg"],
  ["John Lennon", "https://upload.wikimedia.org/wikipedia/commons/3/3a/John_Lennon_1964.jpg"],
  ["Mick Jagger", "https://upload.wikimedia.org/wikipedia/commons/2/23/Mick-Jagger-1965-Turku.jpg"],
  ["Freddie Mercury", "https://upload.wikimedia.org/wikipedia/commons/7/7e/Freddie_Mercury_performing_in_New_Haven%2C_CT%2C_November_1977.jpg"],
  ["David Bowie", "https://upload.wikimedia.org/wikipedia/commons/a/a3/David_Bowie_1974.JPG"],
  ["Stevie Wonder", "https://upload.wikimedia.org/wikipedia/commons/c/cd/Stevie_Wonder_1967_%281%29.jpg"],
  ["Aretha Franklin", "https://upload.wikimedia.org/wikipedia/commons/4/47/Aretha_franklin_1960s_cropped_retouched.jpg"],
  ["Bob Marley", "https://upload.wikimedia.org/wikipedia/commons/4/41/Bob_Marley_performing_in_1976.jpg"],
  ["Bob Dylan", "https://upload.wikimedia.org/wikipedia/commons/5/53/Bob_Dylan_1963_promo_photo_by_Don_Hunstein.jpg"],
  ["Jimi Hendrix", "https://upload.wikimedia.org/wikipedia/commons/8/8e/Jimi_Hendrix_%281967%29_%28cropped%29.jpg"],
  ["Kurt Cobain", "https://upload.wikimedia.org/wikipedia/commons/1/13/Kurt_Cobain_1992.jpg"],
  ["Amy Winehouse", "https://upload.wikimedia.org/wikipedia/commons/7/70/Amy_winehouse_2007.jpg"],
  ["Prince", "https://upload.wikimedia.org/wikipedia/commons/6/6b/Prince_from_Under_the_Cherry_Moon%2C_1986.png"],
  ["Mariah Carey", "https://upload.wikimedia.org/wikipedia/commons/1/1f/Mariah_Carey_1990.jpg"],
  ["Beyonce", "https://upload.wikimedia.org/wikipedia/commons/b/ba/Beyonce_Knowles_at_age_19_%28cropped%29.jpeg"],
  ["Jay-Z", "https://upload.wikimedia.org/wikipedia/commons/a/a3/Jay-Z-01-mika.jpg"],
  ["Eminem", "https://upload.wikimedia.org/wikipedia/commons/0/0c/Eminem-01-mika.jpg"],
  ["Barack Obama", "https://upload.wikimedia.org/wikipedia/commons/7/7d/Barack_Obama_luncheon_in_Cairo%2C_Illinois_%28April_15%2C_2004%29.jpg"],
  ["Bill Clinton", "https://upload.wikimedia.org/wikipedia/commons/7/7e/Bill_Clinton_1978.jpg"],
  ["Donald Trump", "https://upload.wikimedia.org/wikipedia/commons/9/91/Donald_Trump_in_the_1980s_%28cropped%29.jpg"],
  ["Hillary Clinton", "https://upload.wikimedia.org/wikipedia/commons/9/9c/Hillary_Rodham_Clinton_accepts_Intrepid_Freedom_Award.jpg"],
  ["Oprah Winfrey", "https://upload.wikimedia.org/wikipedia/commons/f/fd/Oprah_Winfrey%2C_Akosua_Busia_and_Margaret_Avery%2C_1986.jpg"],
  ["Steve Jobs", "https://upload.wikimedia.org/wikipedia/commons/7/7b/Steve_Jobs_and_Macintosh_computer%2C_January_1984%2C_by_Bernard_Gotfryd_-_edited.jpg"],
  ["Bill Gates", "https://upload.wikimedia.org/wikipedia/commons/a/a9/Bill_Gates_1977.png"],
  ["Mark Zuckerberg", "https://upload.wikimedia.org/wikipedia/commons/3/39/MarkZuckerberg-crop.jpg"],
  ["Keith Richards", "https://upload.wikimedia.org/wikipedia/commons/f/f6/Keith_Richards_%281965%29.jpg"],
  ["Janis Joplin", "https://upload.wikimedia.org/wikipedia/commons/1/1c/Janis_Joplin_1969.JPG"],
  ["Ellen DeGeneres", "https://upload.wikimedia.org/wikipedia/commons/6/69/Ellen_DeGeneres_at_Emmys.jpg"],
];

const results = [];
for (const [name, url] of URLs) {
  try {
    const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'TriviaResearch/1.0 (thememesofdoom@gmail.com)' }, redirect: 'follow' });
    const status = res.status;
    const ct = res.headers.get('content-type');
    results.push({ name, url, status, ct });
    console.log(`${status} ${ct} ${name}`);
  } catch (e) {
    results.push({ name, url, status: 'ERR', ct: e.message });
    console.log(`ERR ${e.message} ${name}`);
  }
  await new Promise(r => setTimeout(r, 1200));
}

fs.writeFileSync('audit/young-celeb-verify.json', JSON.stringify(results, null, 2));
console.log('\nSaved to audit/young-celeb-verify.json');
