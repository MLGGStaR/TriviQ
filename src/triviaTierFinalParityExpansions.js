const qa = (pairs) => pairs.map(([q, a]) => ({ q, a }));
const who = (pairs) => pairs.map(([a, wiki, q = "Guess from the image"]) => ({ q, a, wiki }));
const charades = (items, prompt = "Scan the QR and act it out") =>
  items.map((a) => ({ q: prompt, a }));

const TRIVIA_TIER_FINAL_PARITY_EXPANSIONS = {
  movie_show_emoji: {
    200: qa([
      ["\u{1F468}\u200D\u{1F680}\u{1F30C}\u{1F9D0}", "Interstellar"],
      ["\u{1F9D4}\u26A1\u{1F529}", "Thor"],
      ["\u{1F981}\u{1F451}\u{1F305}", "The Lion King"],
    ]),
    600: qa([
      ["\u{1F5A4}\u{1F4FA}\u{1F9E0}", "Black Mirror"],
    ]),
  },
  country_emoji: {
    200: qa([
      ["\u2618\uFE0F\u{1F37A}\u{1F3BB}", "Ireland"],
    ]),
  },
  general_emoji: {
    200: qa([
      ["\u{1F382}\u{1F973}\u{1F39A}", "Birthday party"],
    ]),
    600: qa([
      ["\u{1F9F2}\u26A1\u{1F52C}", "Electromagnetism"],
    ]),
  },
  history: {
    200: qa([
      ["Who discovered the tomb of Tutankhamun?", "Howard Carter"],
    ]),
    600: qa([
      ["Which dynasty ruled China during Zheng He's voyages?", "Ming dynasty"],
    ]),
  },
  marvel: {
    600: qa([
      ["What hidden stronghold trains Doctor Strange and Wong?", "Kamar-Taj"],
    ]),
  },
  dc: {
    600: qa([
      ["What island homeland does Diana leave in Wonder Woman?", "Themyscira"],
    ]),
  },
  star_wars: {
    600: qa([
      ["What floating city belongs to Lando in The Empire Strikes Back?", "Cloud City"],
    ]),
  },
  breaking_bad: {
    200: qa([
      ["What nickname is Walter White Jr. often called?", "Walt Jr."],
      ["What restaurant chain is owned by Gus Fring?", "Los Pollos Hermanos"],
      ["What color is Walt's signature meth?", "Blue"],
    ]),
    600: qa([
      ["What laundry front hides Gus Fring's superlab?", "Lavanderia Brillante"],
      ["What junkyard owner helps Walt and Jesse destroy evidence?", "Old Joe"],
      ["What name does Saul give the laser tag owner he recommends?", "Danny"],
    ]),
  },
  friends: {
    400: qa([
      ["What surname do Ross and Monica share?", "Geller"],
    ]),
  },
  stranger_things: {
    200: qa([
      ["What tabletop game do the boys obsess over in season 1?", "Dungeons and Dragons"],
    ]),
    600: qa([
      ["What name does Eleven use while hiding with Hopper?", "Jane Hopper"],
      ["What region of Russia is Hopper imprisoned in?", "Kamchatka"],
    ]),
  },
  lord_rings: {
    200: qa([
      ["What race is Legolas?", "Elf"],
      ["What is Aragorn's sword called after it is reforged?", "Anduril"],
    ]),
    600: qa([
      ["What race is Gimli?", "Dwarf"],
      ["What event do Treebeard and the ents launch against Isengard?", "The Last March of the Ents"],
    ]),
  },
  video_games: {
    200: qa([
      ["What series features the hero Link?", "The Legend of Zelda"],
    ]),
  },
  fortnite: {
    200: qa([
      ["What is Fortnite's no-building mode called?", "Zero Build"],
      ["What is the shrinking zone in a match called?", "The Storm"],
    ]),
  },
  valorant: {
    200: qa([
      ["What device do attackers try to plant?", "Spike"],
      ["Which side tries to plant the Spike?", "Attackers"],
      ["What rank comes after Diamond?", "Ascendant"],
      ["Which controller agent is from Oman?", "Omen"],
    ]),
    400: qa([
      ["Which healer can revive teammates?", "Sage"],
    ]),
  },
  anime: {
    400: qa([
      ["Which anime follows Tanjiro Kamado?", "Demon Slayer"],
    ]),
    600: qa([
      ["Which anime features Spike Spiegel and Jet Black?", "Cowboy Bebop"],
    ]),
  },
  charades_general: {
    600: charades([
      "astronaut drops flag",
      "detective loses badge",
      "pirate finds mermaid",
      "chef drops pasta",
      "robot needs charging",
      "vampire misses coffin",
      "ninja loses sword",
      "ghost scares lifeguard",
      "cowboy hates horses",
      "wizard sneezes sparks",
      "doctor forgets patient",
      "alien eats pizza",
      "surfer sees shark",
      "teacher fails quiz",
      "king fears mouse",
      "gamer breaks controller",
      "spy loses earpiece",
      "mime trapped outside",
      "pilot spills coffee",
      "thief hears sirens",
      "runner trips finish",
      "magician loses rabbit",
      "mermaid learns walking",
      "farmer chases chicken",
      "artist paints ceiling",
      "judge drops hammer",
      "boxer dodges punch",
      "lifeguard spots jellyfish",
      "tourist misses train",
      "archer misses target",
      "camper sees bear",
      "scientist freezes potion",
      "driver misses exit",
      "clown loses balloon",
    ]),
  },
  charades_movies: {
    200: charades([
      "Cars",
      "Home Alone",
      "The Lion King",
    ], "Act this movie or show"),
    600: charades([
      "Oppenheimer",
      "Gladiator",
      "Titanic",
      "The Departed",
      "Casino Royale",
      "La La Land",
      "The Social Network",
      "Spotlight",
      "Her",
      "Birdman",
      "Zodiac",
      "Heat",
      "Collateral",
      "Sicario",
      "Drive",
      "Joker",
      "Inside Man",
      "The Fighter",
      "Little Women",
      "The Martian",
      "Logan",
      "District 9",
      "Baby Driver",
      "Gone Baby Gone",
      "The Holdovers",
      "Knives Out",
      "John Wick Chapter 4",
      "Mission Impossible Fallout",
      "Dead Poets Society",
      "A Few Good Men",
      "Skyfall",
      "The Town",
      "The Bourne Ultimatum",
      "The Imitation Game",
      "The Batman",
      "The Nice Guys",
      "Hacksaw Ridge",
      "Ford v Ferrari",
      "The Truman Show",
    ], "Act this movie or show"),
  },
  prison_break: {
    400: qa([
      ["What alias is Michael using in season 5?", "Kaniel Outis"],
      ["What inmate is Michael's closest friend from the start?", "Sucre"],
    ]),
    600: qa([
      ["What data set drives the season 4 conspiracy?", "Scylla"],
      ["What Panamanian prison traps Michael in season 3?", "Sona"],
      ["What is Lincoln's son usually called?", "L.J."],
    ]),
  },
  big_bang_theory: {
    400: qa([
      ["What board game does Sheldon famously over-explain?", "Settlers of Catan"],
    ]),
    600: qa([
      ["What document controls Sheldon's apartment rules?", "Roommate Agreement"],
      ["What number does Sheldon call his favorite?", "73"],
      ["What is Bernadette's field?", "Microbiology"],
      ["What is Amy's profession?", "Neuroscientist"],
    ]),
  },
  brooklyn_99: {
    400: qa([
      ["What is Gina's surname?", "Linetti"],
      ["What is Terry's surname?", "Jeffords"],
    ]),
    600: qa([
      ["What is the Pontiac Bandit's real name?", "Doug Judy"],
      ["What is Hitchcock's first name?", "Michael"],
      ["What is Scully's first name?", "Norm"],
      ["What movie franchise does Jake constantly quote?", "Die Hard"],
    ]),
  },
  pokemon: {
    200: qa([
      ["What type is Pikachu?", "Electric"],
    ]),
    600: qa([
      ["Who is Ash's first professor?", "Professor Oak"],
      ["Which starter evolves into Charmeleon?", "Charmander"],
    ]),
  },
  invincible: {
    400: qa([
      ["What is Atom Eve's first name?", "Samantha"],
      ["What is Mark's superhero name?", "Invincible"],
      ["What is Omni-Man's human first name?", "Nolan"],
    ]),
    600: qa([
      ["What undersea Guardian dies in the massacre?", "Aquarus"],
    ]),
  },
  the_boys: {
    400: qa([
      ["What is Hughie's surname?", "Campbell"],
      ["What is Starlight's first name?", "Annie"],
      ["What is Mother's Milk usually called?", "M.M."],
    ]),
    600: qa([
      ["What speedster kills Robin in the pilot?", "A-Train"],
      ["What is Frenchie's first name?", "Serge"],
    ]),
  },
  the_flash: {
    400: qa([
      ["What icy alter ego does Caitlin become?", "Killer Frost"],
    ]),
    600: qa([
      ["Which Earth is Zoom originally from?", "Earth-2"],
    ]),
  },
  the_walking_dead: {
    400: qa([
      ["What is Negan's bat called?", "Lucille"],
    ]),
    600: qa([
      ["What is Carol's missing daughter called?", "Sophia"],
      ["Who leads the Saviors?", "Negan"],
    ]),
  },
  solo_leveling: {
    600: qa([
      ["What is Sung Jin-Woo's father called?", "Sung Il-Hwan"],
      ["What shadow ant king serves Jin-Woo?", "Beru"],
      ["What is Jin-Woo's sister called?", "Jin-Ah"],
    ]),
  },
  suits: {
    600: qa([
      ["What therapist briefly dates Harvey?", "Paula Agard"],
      ["What city is Pearson Specter Litt based in?", "New York City"],
    ]),
  },
  dexter: {
    400: qa([
      ["What city does Dexter work in?", "Miami"],
      ["What is Dexter's son's name?", "Harrison"],
    ]),
  },
  vikings: {
    400: qa([
      ["What monk becomes Ragnar's closest friend?", "Athelstan"],
      ["Who is Ivar's mother?", "Aslaug"],
    ]),
    600: qa([
      ["What nickname is Ivar known by?", "The Boneless"],
      ["What new land does Ubbe seek at the end?", "North America"],
    ]),
  },
  one_piece_show: {
    400: qa([
      ["What is Nami's crew role?", "Navigator"],
      ["What sea does Sanji dream of finding?", "All Blue"],
    ]),
    600: qa([
      ["What village is Usopp from?", "Syrup Village"],
    ]),
  },
  dragon_ball: {
    400: qa([
      ["What is Goku's Saiyan name?", "Kakarot"],
      ["What race are Goku and Vegeta?", "Saiyans"],
    ]),
  },
  spider_man: {
    600: qa([
      ["What is MJ's full first name in the MCU?", "Michelle"],
    ]),
  },
  country_facts: {
    600: qa([
      ["This Caucasus nation has the capital Tbilisi", "Georgia"],
    ]),
  },
  who_footballer: {
    400: who([
      ["Andres Iniesta", "Andr%C3%A9s_Iniesta"],
      ["Luis Suarez", "Luis_Su%C3%A1rez"],
      ["Robert Lewandowski", "Robert_Lewandowski"],
      ["Franck Ribery", "Franck_Rib%C3%A9ry"],
      ["David Villa", "David_Villa"],
    ]),
    600: who([
      ["Robin van Persie", "Robin_van_Persie"],
      ["Mesut Ozil", "Mesut_%C3%96zil"],
      ["Javier Mascherano", "Javier_Mascherano"],
      ["Carlos Tevez", "Carlos_T%C3%A9vez"],
      ["Edinson Cavani", "Edinson_Cavani"],
      ["Gianluigi Buffon", "Gianluigi_Buffon"],
      ["Clarence Seedorf", "Clarence_Seedorf"],
      ["Javier Zanetti", "Javier_Zanetti"],
      ["Samuel Eto'o", "Samuel_Eto%27o"],
    ]),
  },
  who_tv_character: {
    400: who([
      ["Frasier Crane", "Frasier_Crane"],
    ]),
    600: who([
      ["Don Draper", "Don_Draper"],
      ["Olivia Benson", "Olivia_Benson"],
      ["Gregory House", "Gregory_House"],
      ["Peggy Olson", "Peggy_Olson"],
      ["Kendall Roy", "Kendall_Roy"],
      ["Selina Meyer", "Selina_Meyer"],
      ["Wednesday Addams", "Wednesday_Addams"],
      ["Kim Wexler", "Kim_Wexler"],
      ["Lorelai Gilmore", "Lorelai_Gilmore"],
    ]),
  },
  who_anime_character: {
    200: who([
      ["Bulma", "Bulma"],
      ["Sanji", "Sanji_(One_Piece)"],
      ["Natsu Dragneel", "Natsu_Dragneel"],
      ["Yugi Muto", "Yugi_Muto"],
      ["Gohan", "Gohan"],
      ["Anya Forger", "Anya_Forger"],
      ["Izuku Midoriya", "Izuku_Midoriya"],
      ["Sailor Mars", "Sailor_Mars"],
      ["Asuka Langley Soryu", "Asuka_Langley_Soryu"],
    ]),
    600: who([
      ["Kenshiro", "Kenshiro"],
      ["Alucard", "Alucard_(Hellsing)"],
      ["Yusuke Urameshi", "Yusuke_Urameshi"],
      ["Rimuru Tempest", "Rimuru_Tempest"],
      ["Guts", "Guts_(Berserk)"],
      ["Griffith", "Griffith_(Berserk)"],
      ["Denji", "Denji_(Chainsaw_Man)"],
      ["Mikasa Ackerman", "Mikasa_Ackerman"],
      ["Rei Ayanami", "Rei_Ayanami"],
      ["Johan Liebert", "Johan_Liebert"],
      ["Kamina", "Kamina"],
      ["Homura Akemi", "Homura_Akemi"],
      ["Sakura Kinomoto", "Sakura_Kinomoto"],
      ["Ranma Saotome", "Ranma_Saotome"],
      ["Saber", "Saber_(Fate)"],
    ]),
  },
  who_movie_character: {
    600: who([
      ["Forrest Gump", "Forrest_Gump"],
      ["Captain Jack Sparrow", "Captain_Jack_Sparrow"],
      ["Maximus Decimus Meridius", "Maximus_Decimus_Meridius"],
      ["Tony Montana", "Tony_Montana"],
      ["Rick Deckard", "Rick_Deckard"],
      ["Marty McFly", "Marty_McFly"],
    ]),
  },
};

export default TRIVIA_TIER_FINAL_PARITY_EXPANSIONS;
