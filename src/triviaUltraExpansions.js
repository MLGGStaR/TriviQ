const qa = (pairs) => pairs.map(([q, a]) => ({ q, a }));

const TRIVIA_ULTRA_EXPANSIONS = {
  friends: {
    200: qa([]),
    400: qa([
      ["What game do the friends play for Monica and Rachel's apartment?", "Trivia"],
    ]),
    600: qa([
      ["What is Monica and Rachel's apartment number after the switch?", "20"],
      ["What is Chandler's job field by the end of the series?", "Advertising"],
      ["Who ends up keeping the chicken and duck?", "Joey and Chandler"],
    ]),
  },
  the_office: {
    400: qa([]),
    600: qa([
      ["What is the name of Michael's action hero alter ego?", "Michael Scarn"],
      ["What is Creed's real first name?", "William"],
      ["What is Pam's maiden name?", "Beesly"],
      ["What is Angela's cat called that Dwight kills?", "Sprinkles"],
      ["What is Jan's assistant's name in her music story line?", "Hunter"],
    ]),
  },
  breaking_bad: {
    200: qa([]),
    400: qa([
      ["What is Saul Goodman's real surname?", "McGill"],
    ]),
    600: qa([
      ["What is the name of the vacuum repairman who disappears people?", "Ed Galbraith"],
      ["Who poisons Brock Cantillo?", "Walter White"],
    ]),
  },
  game_thrones: {
    200: qa([]),
    400: qa([]),
    600: qa([
      ["What are House Greyjoy's words?", "We Do Not Sow"],
      ["What is the ancestral Stark sword called?", "Ice"],
      ["What island fortress becomes Daenerys's base in season 7?", "Dragonstone"],
    ]),
  },
  stranger_things: {
    200: qa([
      ["What game inspires the show's monster names?", "Dungeons & Dragons"],
    ]),
    400: qa([
      ["What song helps Max escape Vecna?", "Running Up That Hill"],
    ]),
    600: qa([
      ["What number is tattooed on Eleven's arm?", "011"],
      ["What lab nickname is given to Henry Creel?", "One"],
      ["What video store does Robin work at?", "Family Video"],
      ["What name does Hopper use for his Russian prison ally?", "Enzo"],
    ]),
  },
  prison_break: {
    200: qa([]),
    400: qa([
      ["What agent becomes Michael's rival and later ally?", "Alexander Mahone"],
    ]),
    600: qa([
      ["What prison is season 3 set in?", "Sona"],
      ["What is C-Note's first name?", "Benjamin"],
      ["Who is the prison doctor Michael falls in love with?", "Sara Tancredi"],
      ["What is T-Bag's real surname?", "Bagwell"],
      ["What is Sucre's first name?", "Fernando"],
    ]),
  },
  big_bang_theory: {
    200: qa([
      ["What is Penny's surname after marriage?", "Hofstadter"],
    ]),
    400: qa([
      ["What instrument does Sheldon sometimes play?", "Theremin"],
      ["What is Raj's dog called?", "Cinnamon"],
    ]),
    600: qa([
      ["What is Bernadette's field of science?", "Microbiology"],
      ["What card game does Wil Wheaton use to torment Sheldon?", "Mystic Warlords of Ka'a"],
      ["What is Sheldon's apartment number?", "4A"],
    ]),
  },
  brooklyn_99: {
    200: qa([
      ["What is Rosa's surname?", "Diaz"],
    ]),
    400: qa([
      ["Who is Jake's best criminal frenemy?", "Doug Judy"],
      ["What food does Terry obsess over?", "Yogurt"],
    ]),
    600: qa([
      ["What is Rosa's real first name?", "Alicia"],
      ["What is Boyle's first name?", "Charles"],
      ["What is Amy's maiden surname?", "Santiago"],
    ]),
  },
  the_walking_dead: {
    200: qa([]),
    400: qa([
      ["What is Michonne's signature weapon?", "Katana"],
      ["What is Negan's bat called?", "Lucille"],
    ]),
    600: qa([
      ["What is Carol's daughter called?", "Sophia"],
      ["What prison do the survivors occupy in season 3?", "West Georgia Correctional Facility"],
      ["Who leads Alexandria when Rick arrives?", "Deanna Monroe"],
      ["What is Maggie and Glenn's son called?", "Hershel"],
    ]),
  },
  suits: {
    200: qa([]),
    400: qa([
      ["What firm does Jessica lead at the start?", "Pearson Hardman"],
      ["What exam does Mike pretend to have passed?", "The bar"],
      ["What is Rachel's surname?", "Zane"],
    ]),
    600: qa([
      ["What investment banker mentors Mike later on?", "Jonathan Sidwell"],
      ["What is Louis obsessed with outside the office?", "Mudding"],
      ["What is Mike's key mental ability called?", "Photographic memory"],
    ]),
  },
  dexter: {
    200: qa([
      ["What city does Dexter work in?", "Miami"],
    ]),
    400: qa([
      ["What is Dexter's sister's name?", "Debra"],
      ["What is the name of Dexter's adoptive father?", "Harry"],
    ]),
    600: qa([
      ["What is the Ice Truck Killer's real name?", "Brian Moser"],
      ["What blood analyst tries to expose Dexter in season 2?", "James Doakes"],
      ["What is Dexter's mother's first name?", "Laura"],
      ["What code guides Dexter's kills?", "Harry's Code"],
    ]),
  },
  vikings: {
    200: qa([]),
    400: qa([
      ["What city becomes the show's main Norse stronghold?", "Kattegat"],
    ]),
    600: qa([
      ["What is Ivar's nickname?", "The Boneless"],
      ["What is Ragnar's second wife called?", "Aslaug"],
      ["What is Floki's trade?", "Boat builder"],
      ["What is the name of Lagertha's earldom?", "Hedeby"],
      ["What English king becomes Ragnar's uneasy ally?", "Ecbert"],
    ]),
  },
  the_flash: {
    200: qa([
      ["What company built the particle accelerator?", "STAR Labs"],
    ]),
    400: qa([
      ["What nickname does Cisco give Barry?", "The Scarlet Speedster"],
      ["What metahuman prison sits beneath STAR Labs?", "The Pipeline"],
    ]),
    600: qa([
      ["What is Zoom's real name?", "Hunter Zolomon"],
      ["What is Reverse-Flash's real name?", "Eobard Thawne"],
      ["What does Savitar turn out to be?", "Barry's time remnant"],
      ["What future headline haunts Barry for years?", "Flash Vanishes in Crisis"],
      ["What force powers Nora and Bart?", "Speed Force"],
    ]),
  },
  marvel: {
    200: qa([]),
    400: qa([
      ["What fake town traps Wanda in WandaVision?", "Westview"],
      ["What is Shang-Chi's sister called?", "Xialing"],
    ]),
    600: qa([
      ["What ocean kingdom does Namor rule in the MCU?", "Talokan"],
      ["What is the hidden training refuge in Doctor Strange called?", "Kamar-Taj"],
      ["What is the villain's name in Thor: Love and Thunder?", "Gorr"],
      ["What is the High Evolutionary obsessed with creating?", "The perfect species"],
      ["What agency arrests variants in Loki?", "TVA"],
    ]),
  },
  dc: {
    200: qa([]),
    400: qa([
      ["What is Harley Quinn's real first name?", "Harleen"],
    ]),
    600: qa([
      ["What is Peacemaker's surname?", "Smith"],
      ["What nation does Black Adam rule?", "Kahndaq"],
      ["What body is Doomsday created from in Batman v Superman?", "General Zod"],
    ]),
  },
  star_wars: {
    200: qa([]),
    400: qa([
      ["What planet is Rey from?", "Jakku"],
      ["What is Kylo Ren's birth name?", "Ben Solo"],
    ]),
    600: qa([
      ["What species is Ahsoka Tano?", "Togruta"],
      ["What are the raiders on Tatooine called?", "Tusken Raiders"],
      ["What is Obi-Wan's Jedi master called?", "Qui-Gon Jinn"],
      ["What prison world is central to Andor?", "Narkina 5"],
      ["What metal defines Mandalorian armor?", "Beskar"],
    ]),
  },
  spider_man: {
    200: qa([]),
    400: qa([
      ["What company builds the collider in Spider-Verse?", "Alchemax"],
      ["What university does Peter hope to attend in No Way Home?", "MIT"],
      ["What alias does Gwen Stacy use in Spider-Verse?", "Spider-Woman"],
    ]),
    600: qa([
      ["Who casts the memory spell in No Way Home?", "Doctor Strange"],
      ["What building hosts the final battle in No Way Home?", "Statue of Liberty"],
      ["What Stark tech glasses does Peter inherit?", "E.D.I.T.H."],
      ["What group recruits Miles in Across the Spider-Verse?", "Spider Society"],
    ]),
  },
  invincible: {
    200: qa([]),
    400: qa([
      ["What is Atom Eve's real first name?", "Samantha"],
      ["What agency does Cecil run?", "GDA"],
    ]),
    600: qa([
      ["What is Omni-Man's human name?", "Nolan Grayson"],
      ["What is Robot's human clone called?", "Rudy"],
      ["What alien planet does Mark visit with Nolan?", "Thraxa"],
      ["What is Allen the Alien's species?", "Unopan"],
      ["What is Cecil's full surname?", "Stedman"],
      ["What is the immortal ruler of Atlantis called?", "Aquarus"],
    ]),
  },
  the_boys: {
    200: qa([]),
    400: qa([
      ["What is Starlight's real first name?", "Annie"],
      ["What is Mother's Milk usually called?", "M.M."],
      ["What team was Soldier Boy part of before the Seven era?", "Payback"],
    ]),
    600: qa([
      ["What is Queen Maeve's first name?", "Maggie"],
      ["What temporary super-drug do the Boys use?", "Temp V"],
      ["What is Kimiko's brother called?", "Kenji"],
      ["What job does Victoria Neuman hold before running for vice president?", "Congresswoman"],
    ]),
  },
  harry_potter: {
    200: qa([]),
    400: qa([
      ["What map shows everyone at Hogwarts?", "Marauder's Map"],
      ["What giant spider belongs to Hagrid?", "Aragog"],
    ]),
    600: qa([
      ["What spell unlocks doors?", "Alohomora"],
      ["What is Dumbledore's phoenix called?", "Fawkes"],
      ["What charm summons objects?", "Accio"],
      ["What helps Harry breathe underwater in the Triwizard Tournament?", "Gillyweed"],
    ]),
  },
  lord_rings: {
    200: qa([
      ["What creature calls the Ring 'my precious'?", "Gollum"],
    ]),
    400: qa([
      ["What city does Gondor defend in Return of the King?", "Minas Tirith"],
      ["What race is Gimli?", "Dwarf"],
      ["What mountain pass does the Fellowship fail to cross before Moria?", "Caradhras"],
    ]),
    600: qa([
      ["What mountain must the Ring be destroyed in?", "Mount Doom"],
      ["What light does Galadriel give Frodo?", "Phial of Galadriel"],
      ["What is Saruman's tower called?", "Orthanc"],
      ["What forest do the Ents live in?", "Fangorn"],
    ]),
  },
  disney: {
    200: qa([]),
    400: qa([
      ["What is Moana's rooster called?", "Heihei"],
    ]),
    600: qa([
      ["What is Rapunzel's chameleon called?", "Pascal"],
      ["What is the toy store in Toy Story 2 called?", "Al's Toy Barn"],
      ["What city do the monsters live in in Monsters, Inc.?", "Monstropolis"],
    ]),
  },
  anime: {
    200: qa([
      ["What village is Naruto from?", "Hidden Leaf"],
    ]),
    400: qa([
      ["What notebook does Light Yagami use?", "Death Note"],
      ["What breathing style does Tanjiro first master?", "Water Breathing"],
      ["What is Luffy's pirate crew called?", "Straw Hat Pirates"],
    ]),
    600: qa([
      ["What district lies outside Wall Maria in Attack on Titan?", "Shiganshina"],
      ["What is Spike Spiegel's ship called?", "Swordfish II"],
      ["What division protects Soul Society in Bleach?", "Gotei 13"],
      ["What exam defines Naruto's early arc?", "Chunin Exams"],
    ]),
  },
  dragon_ball: {
    200: qa([
      ["What planet was Goku sent from?", "Planet Vegeta"],
    ]),
    400: qa([
      ["What device measures power levels?", "Scouter"],
      ["What red-haired god form does Goku achieve first?", "Super Saiyan God"],
    ]),
    600: qa([
      ["What is Goku's father's name?", "Bardock"],
      ["What is Future Trunks's mentor's name in his timeline?", "Gohan"],
      ["What angel trains Goku and Vegeta?", "Whis"],
      ["What is Vegeta's younger brother called?", "Tarble"],
    ]),
  },
  one_piece_show: {
    400: qa([
      ["What pirate inspires Luffy to set sail?", "Shanks"],
      ["What sea does Sanji dream of finding?", "All Blue"],
      ["What is Nami's role on the crew?", "Navigator"],
    ]),
    600: qa([
      ["What is Usopp's home village called?", "Syrup Village"],
      ["What restaurant ship does Sanji work on?", "Baratie"],
      ["What title does Mihawk hold?", "World's Greatest Swordsman"],
      ["What species is Arlong?", "Fish-Man"],
      ["What does the Going Merry figurehead resemble?", "Sheep"],
    ]),
  },
  solo_leveling: {
    200: qa([]),
    400: qa([
      ["What title does Jin-Woo inherit from Ashborn?", "Shadow Monarch"],
      ["What island raid changes Korea's hunter world?", "Jeju Island Raid"],
    ]),
    600: qa([
      ["What is Jin-Woo's sister's name?", "Jin-Ah"],
      ["Which ant king later serves Jin-Woo?", "Beru"],
      ["What monarch attacks using ice powers?", "Frost Monarch"],
    ]),
  },
  pokemon: {
    200: qa([
      ["What item catches Pokémon?", "Poké Ball"],
    ]),
    400: qa([
      ["What city does Ash begin in?", "Pallet Town"],
      ["What device records Pokémon data?", "Pokédex"],
      ["What trio constantly hunts Pikachu?", "Team Rocket"],
    ]),
    600: qa([
      ["What region is Scarlet and Violet set in?", "Paldea"],
      ["What ghost Pokémon is known for its purple grin?", "Gengar"],
      ["What Eevee evolution uses a Water Stone?", "Vaporeon"],
    ]),
  },
  video_games: {
    200: qa([]),
    400: qa([
      ["What green-clad hero stars in Hyrule?", "Link"],
      ["What handheld monster-catching series has Gym Leaders?", "Pokémon"],
    ]),
    600: qa([
      ["What franchise uses hidden blades and Animus memories?", "Assassin's Creed"],
      ["What fantasy game stars the Dragonborn?", "Skyrim"],
      ["What console line is made by Sony?", "PlayStation"],
    ]),
  },
  fortnite: {
    200: qa([]),
    400: qa([
      ["What in-game currency buys skins?", "V-Bucks"],
      ["What editor lets creators build custom islands?", "UEFN"],
    ]),
    600: qa([
      ["What machine revives teammates using their cards?", "Reboot Van"],
      ["What is the name of Fortnite's victory banner?", "Victory Royale"],
      ["What healing item is often nicknamed a big pot?", "Shield Potion"],
      ["What purple movement weapon was tied to Mega City?", "Kinetic Blade"],
    ]),
  },
  valorant: {
    200: qa([]),
    400: qa([
      ["What role is Jett classed as?", "Duelist"],
      ["What role is Sage classed as?", "Sentinel"],
    ]),
    600: qa([
      ["What is Omen's ultimate called?", "From the Shadows"],
      ["What is Sova's scouting arrow called?", "Recon Bolt"],
      ["What initiator sends out a Tasmanian tiger?", "Skye"],
    ]),
  },
};

export default TRIVIA_ULTRA_EXPANSIONS;
