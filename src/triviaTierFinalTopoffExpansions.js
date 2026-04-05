const qa = (pairs) => pairs.map(([q, a]) => ({ q, a }));
const who = (pairs) => pairs.map(([a, wiki, q = "Guess from the image"]) => ({ q, a, wiki }));

const TRIVIA_TIER_FINAL_TOPOFF_EXPANSIONS = {
  disney: {
    200: qa([
      ["What kind of fish is Nemo?", "Clownfish"],
    ]),
    400: qa([
      ["What pet chameleon belongs to Rapunzel?", "Pascal"],
    ]),
    600: qa([
      ["What is Mirabel's family name in Encanto?", "Madrigal"],
    ]),
  },
  lord_rings: {
    200: qa([
      ["What race are Frodo and Sam?", "Hobbits"],
    ]),
    600: qa([
      ["What elven bread do the travelers carry?", "Lembas"],
    ]),
  },
  brooklyn_99: {
    400: qa([
      ["What is Pimento's first name?", "Adrian"],
      ["What subject does Kevin Cozner teach?", "Classics"],
    ]),
    600: qa([
      ["What is Jake's middle name?", "Sherlock"],
      ["What is Gina's daughter's name?", "Iggy"],
    ]),
  },
  pokemon: {
    200: qa([
      ["What type is Eevee?", "Normal"],
    ]),
  },
  invincible: {
    400: qa([
      ["What alien race is Omni-Man from?", "Viltrumite"],
    ]),
  },
  the_boys: {
    400: qa([
      ["What company created Compound V?", "Vought"],
      ["What is Kimiko's brother called?", "Kenji"],
    ]),
    600: qa([
      ["What drug do Butcher and Hughie inject for temporary powers?", "Temp V"],
      ["What is Queen Maeve's first name?", "Maggie"],
      ["What Russian nerve agent is used to subdue Soldier Boy?", "Novichok"],
      ["What facility secretly creates super terrorists in season 2?", "Sage Grove Center"],
    ]),
  },
  the_walking_dead: {
    400: qa([
      ["What walled community does Rick first settle in after the road years?", "Alexandria"],
    ]),
  },
  solo_leveling: {
    600: qa([
      ["What was Tusk's original name before becoming a shadow?", "Kargalgan"],
    ]),
  },
  dexter: {
    400: qa([
      ["What is Dexter's boat called?", "Slice of Life"],
      ["What is Arthur Mitchell's killer nickname?", "Trinity Killer"],
    ]),
  },
  one_piece_show: {
    400: qa([
      ["What Devil Fruit lets Buggy split apart?", "Chop-Chop Fruit"],
    ]),
  },
  dragon_ball: {
    400: qa([
      ["Who created Earth's Dragon Balls?", "Kami"],
      ["What fusion uses Potara earrings?", "Vegito"],
    ]),
  },
  spider_man: {
    600: qa([
      ["What school does Miles attend in Into the Spider-Verse?", "Brooklyn Visions Academy"],
    ]),
  },
  charades_movies: {
    200: qa([
      ["Act this movie or show", "Jumanji"],
      ["Act this movie or show", "Finding Dory"],
    ]),
  },
  who_footballer: {
    400: who([
      ["Antoine Griezmann", "Antoine_Griezmann"],
      ["Riyad Mahrez", "Riyad_Mahrez"],
      ["Casemiro", "Casemiro"],
      ["Thomas Muller", "Thomas_M%C3%BCller"],
      ["Nemanja Vidic", "Nemanja_Vidi%C4%87"],
    ]),
    600: who([
      ["Davor Suker", "Davor_%C5%A0uker"],
      ["Fernando Redondo", "Fernando_Redondo"],
      ["Michael Ballack", "Michael_Ballack"],
      ["Henrik Larsson", "Henrik_Larsson"],
      ["Alessandro Nesta", "Alessandro_Nesta"],
      ["Patrick Vieira", "Patrick_Vieira"],
      ["Rivaldo", "Rivaldo"],
      ["David Trezeguet", "David_Trezeguet"],
      ["Miroslav Klose", "Miroslav_Klose"],
    ]),
  },
  who_tv_character: {
    400: who([
      ["Ted Lasso", "Ted_Lasso"],
    ]),
    600: who([
      ["Jack Bauer", "Jack_Bauer"],
      ["Carrie Mathison", "Carrie_Mathison"],
      ["Nandor the Relentless", "Nandor_the_Relentless"],
      ["BoJack Horseman", "BoJack_Horseman"],
      ["Malcolm", "Malcolm_(Malcolm_in_the_Middle)"],
      ["Annalise Keating", "Annalise_Keating"],
      ["Alicia Florrick", "Alicia_Florrick"],
      ["Rebecca Pearson", "Rebecca_Pearson"],
      ["Jax Teller", "Jax_Teller"],
    ]),
  },
  who_anime_character: {
    200: who([
      ["Goku", "Goku"],
      ["Nezuko Kamado", "Nezuko_Kamado"],
      ["Inosuke Hashibira", "Inosuke_Hashibira"],
      ["Kurapika", "Kurapika"],
      ["Tony Tony Chopper", "Tony_Tony_Chopper"],
      ["Trafalgar Law", "Trafalgar_D._Water_Law"],
      ["Gaara", "Gaara"],
      ["Megumi Fushiguro", "Megumi_Fushiguro"],
      ["Nobara Kugisaki", "Nobara_Kugisaki"],
    ]),
    600: who([
      ["Ken Kaneki", "Ken_Kaneki"],
      ["Thorfinn", "Thorfinn_(Vinland_Saga)"],
      ["Revy", "Revy_(Black_Lagoon)"],
      ["Baki Hanma", "Baki_Hanma"],
      ["Hiei", "Hiei"],
      ["Chrollo Lucilfer", "Chrollo_Lucilfer"],
      ["Yoko Littner", "Yoko_Littner"],
      ["Riza Hawkeye", "Riza_Hawkeye"],
      ["Kaori Miyazono", "Kaori_Miyazono"],
      ["Olivier Mira Armstrong", "Olivier_Mira_Armstrong"],
      ["Kallen Stadtfeld", "Kallen_Stadtfeld"],
      ["Kenpachi Zaraki", "Kenpachi_Zaraki"],
      ["Korosensei", "Korosensei"],
      ["Maka Albarn", "Maka_Albarn"],
      ["Asta", "Asta_(Black_Clover)"],
    ]),
  },
  who_movie_character: {
    600: who([
      ["Andy Dufresne", "Andy_Dufresne"],
      ["Leon", "L%C3%A9on_(character)"],
      ["Marge Gunderson", "Marge_Gunderson"],
      ["Chihiro Ogino", "Chihiro_Ogino"],
      ["Norman Bates", "Norman_Bates"],
      ["Juno MacGuff", "Juno_MacGuff"],
    ]),
  },
};

export default TRIVIA_TIER_FINAL_TOPOFF_EXPANSIONS;
