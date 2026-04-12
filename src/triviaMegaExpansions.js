const qa = (items) => items.map(([q, a]) => ({ q, a }));
const who = (items) => items.map(([q, a, wiki]) => ({ q, a, wiki }));
const charades = (items, prompt = "Scan the QR and act it out") =>
  items.map((a) => ({ q: prompt, a }));
const guess = (q, a) => ({ q, a });

const TRIVIA_MEGA_EXPANSIONS = {
  general: {
    200: qa([
      ["What instrument tells you which direction is north?", "A compass"],
      ["What shape has three sides?", "Triangle"],
    ]),
    400: qa([
      ["What is the Roman numeral for 50?", "L"],
      ["Which chess piece moves only diagonally?", "Bishop"],
    ]),
    600: qa([
      ["What number does XC represent in Roman numerals?", "90"],
      ["What is a seven-sided shape called?", "Heptagon"],
      ["What do you call animals most active at dawn and dusk?", "Crepuscular"],
    ]),
  },
  geography: {
    200: qa([
      ["Capital of Sweden?", "Stockholm"],
      ["What river flows through London?", "The Thames"],
      ["Capital of Poland?", "Warsaw"],
    ]),
    400: qa([
      ["Capital of Vietnam?", "Hanoi"],
      ["Which mountain range runs along western South America?", "The Andes"],
      ["What African country has the capital Accra?", "Ghana"],
    ]),
    600: qa([
      ["What country has the capital Bishkek?", "Kyrgyzstan"],
      ["Capital of Slovenia?", "Ljubljana"],
      ["What sea borders Jordan to the west?", "The Dead Sea"],
    ]),
  },
  science: {
    200: qa([
      ["What process lets plants lose water through their leaves?", "Transpiration"],
      ["What is the hardest part of the human tooth?", "Enamel"],
    ]),
    400: qa([
      ["What cell structure contains chlorophyll?", "Chloroplast"],
      ["What acid is found in the stomach?", "Hydrochloric acid"],
      ["What scale is commonly used to rate tornado strength?", "The Enhanced Fujita scale"],
    ]),
    600: qa([
      ["What law links gas pressure and volume inversely?", "Boyle's law"],
      ["What is the SI unit of frequency?", "Hertz"],
      ["What branch of science studies the atmosphere and weather?", "Meteorology"],
    ]),
  },
  history: {
    200: qa([
      ["Which English king had six wives?", "Henry VIII"],
      ["What year did the Western Roman Empire fall?", "476 AD"],
      ["Which wall divided Berlin during the Cold War?", "The Berlin Wall"],
    ]),
    400: qa([
      ["Which civilization built Chichen Itza?", "The Maya"],
      ["Which city was hit by the first atomic bomb in war?", "Hiroshima"],
    ]),
    600: qa([
      ["Which 1783 treaty ended the American Revolutionary War?", "The Treaty of Paris"],
      ["Which English king was executed in 1649?", "Charles I"],
      ["What Newton book laid the foundation of classical mechanics in 1687?", "Principia Mathematica"],
    ]),
  },
  sports: {
    200: qa([
      ["What sport uses a scrum?", "Rugby"],
      ["How many points is a safety in American football?", "2"],
      ["Which country invented judo?", "Japan"],
    ]),
    400: qa([
      ["What golf tournament awards the green jacket?", "The Masters"],
      ["Which country won the first Cricket World Cup in 1975?", "West Indies"],
      ["What city hosts the Indy 500?", "Indianapolis"],
    ]),
    600: qa([
      ["Which race is the final leg of the US Triple Crown?", "The Belmont Stakes"],
      ["In fencing sabre, what is the target area?", "Everything above the waist"],
      ["What does VAR stand for in soccer?", "Video Assistant Referee"],
    ]),
  },
  music: {
    200: qa([
      ["What symbol raises a note by a semitone?", "A sharp"],
      ["Who is known as the Boss in rock music?", "Bruce Springsteen"],
      ["What family of instruments does the clarinet belong to?", "Woodwind"],
    ]),
    400: qa([
      ["What does legato mean in music?", "Smooth and connected"],
      ["Who composed The Nutcracker?", "Tchaikovsky"],
      ["What does BPM measure in music?", "Tempo"],
    ]),
    600: qa([
      ["What is a diminished fifth also called?", "A tritone"],
      ["Which composer wrote the Ring cycle?", "Richard Wagner"],
      ["What Miles Davis album includes So What?", "Kind of Blue"],
    ]),
  },
  movies: {
    200: qa([
      ["What color pill does Neo take in The Matrix?", "Red"],
      ["Who directed E.T. the Extra-Terrestrial?", "Steven Spielberg"],
    ]),
    400: qa([
      ["What film features the line Here's Johnny!?", "The Shining"],
      ["What is the name of the spaceship in Alien?", "The Nostromo"],
    ]),
    600: qa([
      ["What is a dolly zoom also nicknamed?", "The Vertigo effect"],
      ["Which film features the Odessa Steps sequence?", "Battleship Potemkin"],
      ["Who directed 8½?", "Federico Fellini"],
    ]),
  },
  country_facts: {
    200: qa([
      ["This country is famous for tulips, windmills, and Amsterdam", "The Netherlands"],
      ["This country is known for maple syrup and provinces like Ontario and Quebec", "Canada"],
    ]),
    400: qa([
      ["This country is famous for gorilla trekking and has capital Kigali", "Rwanda"],
      ["This Balkan country has capital Podgorica", "Montenegro"],
      ["This country is home to Angkor Wat and has capital Phnom Penh", "Cambodia"],
    ]),
    600: qa([
      ["This country is home to the Namib Desert and has capital Windhoek", "Namibia"],
      ["This South American country has capital Paramaribo", "Suriname"],
      ["This Balkan country has capital Skopje", "North Macedonia"],
    ]),
  },
  marvel: {
    200: qa([
      ["What is Wanda Maximoff's brother's name in the MCU?", "Pietro Maximoff"],
      ["What is the name of Peter Parker's classmate best friend?", "Ned Leeds"],
    ]),
    400: qa([
      ["What song plays during Peter Quill's opening dance in Guardians of the Galaxy?", "Come and Get Your Love"],
      ["What realm traps Janet van Dyne for decades?", "The Quantum Realm"],
      ["What agency monitors enhanced damage in Ms. Marvel and No Way Home?", "Damage Control"],
    ]),
    600: qa([
      ["What is the name of the Celestial emerging from Earth in Eternals?", "Tiamut"],
      ["What phrase does Captain America finally say before the Endgame charge?", "Avengers, assemble"],
      ["What artificial intelligence becomes Vision after being uploaded from Tony's system?", "J.A.R.V.I.S."],
    ]),
  },
  dc: {
    200: qa([
      ["What city does Clark Kent work in for the Daily Planet?", "Metropolis"],
      ["What kingdom does Aquaman rule?", "Atlantis"],
      ["What word does Billy Batson say to transform?", "Shazam"],
    ]),
    400: qa([
      ["What is the name of Batman's armored vehicle in The Dark Knight trilogy?", "The Tumbler"],
      ["What planet does Darkseid rule in DC films and shows?", "Apokolips"],
      ["What 1984 artifact grants wishes in Wonder Woman 1984?", "The Dreamstone"],
    ]),
    600: qa([
      ["What prison holds the captured metahumans in Arrow season 7?", "Slabside"],
      ["What island is Oliver Queen stranded on after the Queen's Gambit sinks?", "Lian Yu"],
      ["What event unites the Justice League against Steppenwolf in Zack Snyder's Justice League?", "The Unity"],
    ]),
  },
  star_wars: {
    200: qa([
      ["What planet is Princess Leia from?", "Alderaan"],
    ]),
    400: qa([
      ["Who trained Qui-Gon Jinn before Obi-Wan trained under him?", "Count Dooku"],
      ["What superweapon appears in The Force Awakens?", "Starkiller Base"],
    ]),
    600: qa([
      ["What city floats above Bespin?", "Cloud City"],
      ["What powers a lightsaber blade?", "Kyber crystal"],
      ["What clone captain serves beside Anakin in The Clone Wars?", "Captain Rex"],
    ]),
  },
  harry_potter: {
    200: qa([
      ["What is Hagrid's three-headed dog called?", "Fluffy"],
    ]),
    400: qa([
      ["What is Hermione's cat named?", "Crookshanks"],
      ["What is the hidden map used by Harry and his friends?", "The Marauder's Map"],
    ]),
    600: qa([
      ["What is Snape's mother's maiden name?", "Prince"],
      ["What Gringotts vault temporarily held the Philosopher's Stone?", "Vault 713"],
      ["What is the motto of the Black family?", "Toujours Pur"],
    ]),
  },
  breaking_bad: {
    200: qa([
      ["What is Jesse's last name?", "Pinkman"],
    ]),
    400: qa([
      ["What is Hank's famous mineral hobby?", "Minerals"],
    ]),
    600: qa([
      ["What machine gun does Walt use in the final showdown?", "An M60"],
      ["What company did Walt help found before teaching?", "Gray Matter"],
      ["Who kills Gus Fring?", "Hector Salamanca"],
    ]),
  },
  game_thrones: {
    200: qa([
      ["What is Jon Snow's direwolf named?", "Ghost"],
      ["Who owns the sword Needle?", "Arya Stark"],
    ]),
    400: qa([
      ["What is Brienne's full title after she is knighted?", "Ser Brienne of Tarth"],
      ["What city is the seat of House Tyrell?", "Highgarden"],
      ["Which dragon is Daenerys's largest and fiercest?", "Drogon"],
    ]),
    600: qa([
      ["What is Hodor's real name?", "Wylis"],
      ["What island seat belongs to House Greyjoy?", "Pyke"],
      ["What Valyrian steel blade kills the Night King?", "The catspaw dagger"],
    ]),
  },
  friends: {
    200: qa([
      ["What is Joey's soap opera doctor name?", "Dr. Drake Ramoray"],
    ]),
    400: qa([
      ["Who officiates Monica and Chandler's wedding?", "Joey"],
      ["What is the name of the building superintendent?", "Treeger"],
    ]),
    600: qa([
      ["What is Rachel's hairless cat called?", "Mrs. Whiskerson"],
      ["What country does David move to for research?", "Minsk"],
    ]),
  },
  the_office: {
    200: qa([
      ["What is Creed's last name?", "Bratton"],
      ["Who grows beets on a farm?", "Dwight"],
      ["What is Meredith's last name?", "Palmer"],
    ]),
    400: qa([
      ["What is Jan's candle business called?", "Serenity by Jan"],
      ["What city does Pam attend art school in?", "New York"],
    ]),
    600: qa([
      ["What is Robert California's real first name?", "Bob"],
      ["What food does Kevin spill in a famous cold open?", "Chili"],
    ]),
  },
  stranger_things: {
    200: qa([
      ["Who runs the Hellfire Club?", "Eddie Munson"],
      ["What is Dustin's pet creature called?", "Dart"],
    ]),
    400: qa([
      ["What number is tattooed on Kali?", "008"],
      ["What giant radio tower does Dustin build?", "Cerebro"],
    ]),
    600: qa([
      ["What is Victor Creel's son's full name?", "Henry Creel"],
      ["What pizza place helps restore Eleven's strength?", "Surfer Boy Pizza"],
      ["What element repeatedly weakens creatures from the Upside Down?", "Fire"],
    ]),
  },
  disney: {
    200: qa([
      ["What is Ariel's fish friend named?", "Flounder"],
      ["Who is the wooden puppet who wants to be a real boy?", "Pinocchio"],
      ["What kind of animal is Bambi?", "A deer"],
    ]),
    400: qa([
      ["What city is Big Hero 6 set in?", "San Fransokyo"],
    ]),
    600: qa([
      ["What is Mirabel's family surname in Encanto?", "Madrigal"],
      ["What Disney film features Judge Frollo?", "The Hunchback of Notre Dame"],
      ["What starship do the heroes sail on in Treasure Planet?", "The RLS Legacy"],
    ]),
  },
  lord_rings: {
    200: qa([
      ["What creature bites off Frodo's finger?", "Gollum"],
      ["What forest is home to the Ents?", "Fangorn Forest"],
      ["What inn do the hobbits reach in Bree?", "The Prancing Pony"],
    ]),
    400: qa([
      ["What is Aragorn's reforged sword called?", "Anduril"],
      ["What glowing gift helps Frodo against Shelob?", "The Phial of Galadriel"],
      ["Who is the Steward of Gondor during the war?", "Denethor"],
    ]),
    600: qa([
      ["What alias does Aragorn use in Bree?", "Strider"],
      ["What city do the Ring-bearers leave from to sail west?", "The Grey Havens"],
      ["What creature attacks the Fellowship outside Moria's doors?", "The Watcher in the Water"],
    ]),
  },
  video_games: {
    200: qa([
      ["Which princess does Mario usually rescue?", "Princess Peach"],
      ["What explosive Minecraft mob hisses before blowing up?", "Creeper"],
    ]),
    400: qa([
      ["Which company created Sonic the Hedgehog?", "Sega"],
      ["What city is Grand Theft Auto V set in?", "Los Santos"],
    ]),
    600: qa([
      ["What roguelike game stars Zagreus escaping the Underworld?", "Hades"],
      ["What city is the setting of BioShock Infinite?", "Columbia"],
    ]),
  },
  anime: {
    200: qa([
      ["What anime follows Tanjiro Kamado fighting demons?", "Demon Slayer"],
      ["What anime centers on giant mechs fighting Angels?", "Neon Genesis Evangelion"],
      ["What volleyball anime stars Hinata Shoyo?", "Haikyuu!!"],
    ]),
    400: qa([
      ["What anime follows Edward and Alphonse Elric?", "Fullmetal Alchemist"],
      ["What space western follows the Bebop crew?", "Cowboy Bebop"],
      ["What anime features cursed sorcerers and Sukuna?", "Jujutsu Kaisen"],
    ]),
    600: qa([
      ["What anime follows Johan Liebert as its central villain?", "Monster"],
      ["What dark fantasy anime features Guts and Griffith?", "Berserk"],
      ["What anime takes place in Academy City with Index and espers?", "A Certain Magical Index"],
    ]),
  },
  fortnite: {
    200: qa([
      ["What tool do players use to harvest materials?", "A pickaxe"],
      ["What item restores shield in blue liquid form?", "Shield Potion"],
    ]),
    400: qa([
      ["What editor did Epic release for advanced creators?", "Unreal Editor for Fortnite"],
    ]),
    600: qa([
      ["What annual top competition crowns elite teams and players?", "FNCS"],
      ["What music-focused rhythm mode launched inside Fortnite?", "Fortnite Festival"],
      ["What LEGO survival mode was added inside Fortnite?", "LEGO Fortnite"],
    ]),
  },
  valorant: {
    200: qa([
      ["What device must attackers plant to win a round?", "The Spike"],
    ]),
    400: qa([
      ["Which agent can revive teammates?", "Sage"],
      ["Which explosive duelist shouts Here comes the party!?", "Raze"],
      ["What rank comes after Platinum?", "Diamond"],
    ]),
    600: qa([
      ["What role is Omen classified as?", "Controller"],
      ["What is Viper's ultimate ability called?", "Viper's Pit"],
      ["What is the name of the secret group operating across the maps?", "The VALORANT Protocol"],
    ]),
  },
  prison_break: {
    200: qa([
      ["What is Michael's brother's name?", "Lincoln Burrows"],
      ["What is Sara's last name?", "Tancredi"],
    ]),
    400: qa([
      ["What shadow organization hunts the escapees?", "The Company"],
      ["What nickname is Theodore Bagwell known by?", "T-Bag"],
      ["Which country is Sona prison in?", "Panama"],
    ]),
    600: qa([
      ["What is Mahone's first name?", "Alexander"],
      ["What is Whistler's first name?", "James"],
      ["What is the General's real name?", "Jonathan Krantz"],
    ]),
  },
  big_bang_theory: {
    200: qa([
      ["What university do the main characters work at?", "Caltech"],
      ["What is Howard's last name?", "Wolowitz"],
      ["What job does Penny have at The Cheesecake Factory early on?", "Waitress"],
    ]),
    400: qa([
      ["What is Bernadette's profession?", "Microbiologist"],
      ["What is Amy's field of study?", "Neurobiology"],
      ["What is Sheldon's favorite number?", "73"],
    ]),
    600: qa([
      ["What is Raj's dog named?", "Cinnamon"],
      ["What city is Penny from?", "Omaha"],
      ["What is Howard and Bernadette's first child named?", "Halley"],
    ]),
  },
  brooklyn_99: {
    200: qa([
      ["What is Amy's last name?", "Santiago"],
      ["What number is the precinct?", "99"],
    ]),
    400: qa([
      ["What is the title of the annual competition among the squad?", "Halloween Heist"],
      ["What is Gina's last name?", "Linetti"],
      ["What is Holt's husband's name?", "Kevin"],
    ]),
    600: qa([
      ["What is Amy and Jake's son named?", "Mac"],
      ["What is Holt's longtime rival's full name?", "Madeline Wuntch"],
      ["What nickname does Jake use for Doug Judy?", "The Pontiac Bandit"],
    ]),
  },
  pokemon: {
    200: qa([
      ["What number in the Pokedex is Pikachu?", "25"],
      ["What type is Squirtle?", "Water"],
      ["What device stores most Pokemon?", "A Poke Ball"],
    ]),
    400: qa([
      ["Which Eeveelution is Water-type?", "Vaporeon"],
      ["Which professor gives the Kanto starters?", "Professor Oak"],
      ["What item fully heals HP and status conditions?", "Full Restore"],
    ]),
    600: qa([
      ["What move leaves a target with at least 1 HP?", "False Swipe"],
      ["What item evolves Onix into Steelix when traded?", "Metal Coat"],
      ["What trio includes Raikou, Entei, and Suicune?", "The legendary beasts"],
    ]),
  },
  invincible: {
    200: qa([
      ["What is Mark Grayson's superhero name?", "Invincible"],
      ["What color is Atom Eve's energy?", "Pink"],
    ]),
    400: qa([
      ["What alien race is Nolan really from?", "Viltrumite"],
      ["What young hero group does Mark join early on?", "Teen Team"],
      ["What fast-aging aliens keep attacking Earth from another dimension?", "The Flaxans"],
    ]),
    600: qa([
      ["What blue-skinned scientist creates the ReAnimen?", "D.A. Sinclair"],
      ["What crime boss has a giant cybernetic jaw?", "Machine Head"],
      ["What alien ally repeatedly checks on Earth and Mark?", "Allen the Alien"],
    ]),
  },
  the_boys: {
    200: qa([
      ["What company manages The Seven?", "Vought"],
      ["Who kills Hughie's girlfriend in the first episode?", "A-Train"],
      ["What is Starlight's real name?", "Annie January"],
    ]),
    400: qa([
      ["What is Billy Butcher's dog named?", "Terror"],
    ]),
    600: qa([
      ["What temporary version of Compound V grants powers to adults?", "Temp V"],
      ["What is Homelander's son's name?", "Ryan"],
      ["What church-like group does The Deep join?", "The Church of the Collective"],
    ]),
  },
  the_flash: {
    200: qa([
      ["What police department does Joe West work for?", "CCPD"],
      ["What lab is Barry's team based in?", "STAR Labs"],
      ["What villain name does Cisco give Eobard Thawne?", "Reverse-Flash"],
    ]),
    400: qa([
      ["What Earth is Harry Wells from?", "Earth-2"],
      ["What scientist becomes Killer Frost?", "Caitlin Snow"],
    ]),
    600: qa([
      ["What is Cicada's real name?", "Orlin Dwyer"],
      ["What is the mirror villain's name in season 6?", "Eva McCulloch"],
      ["What does Savitar turn out to be?", "A time remnant of Barry Allen"],
    ]),
  },
  the_walking_dead: {
    200: qa([
      ["What weapon is Daryl best known for using?", "A crossbow"],
      ["What is Rick's son's name?", "Carl"],
      ["What safe community is led by Deanna Monroe?", "Alexandria"],
    ]),
    400: qa([
      ["What is Ezekiel's tiger named?", "Shiva"],
      ["What villain group uses Lucille as its symbol of fear?", "The Saviors"],
      ["What is Maggie's family surname?", "Greene"],
    ]),
    600: qa([
      ["What is the junkyard leader called before joining the Whisperers arc?", "Jadis"],
      ["What is the armored mega-community introduced late in the show?", "The Commonwealth"],
    ]),
  },
  solo_leveling: {
    200: qa([
      ["What mysterious interface appears only to Jin-Woo?", "The System"],
      ["What is the name of Jin-Woo's knight-like shadow soldier?", "Igris"],
    ]),
    400: qa([
      ["What class path does Jin-Woo first receive from the System?", "Necromancer"],
      ["What is the name of Korea's strongest female hunter who notices Jin-Woo?", "Cha Hae-In"],
    ]),
    600: qa([
      ["Who created the System to train Jin-Woo?", "The Architect"],
      ["What is the true name of the Shadow Monarch before Jin-Woo inherits it?", "Ashborn"],
      ["What country is National Level Hunter Thomas Andre from?", "The United States"],
    ]),
  },
  suits: {
    200: qa([
      ["What law school does Mike Ross pretend he attended?", "Harvard"],
      ["What is Harvey Specter's secretary named?", "Donna"],
      ["What is Louis's last name?", "Litt"],
    ]),
    400: qa([
      ["What is Jessica's last name?", "Pearson"],
      ["What career does Rachel Zane want most?", "Lawyer"],
      ["What test can Mike ace for other people?", "The LSAT"],
    ]),
    600: qa([
      ["What is Harvey's therapist's first name?", "Paula"],
      ["What rival attorney keeps returning to challenge Harvey?", "Travis Tanner"],
      ["What is Donna's AI assistant product called?", "The Donna"],
    ]),
  },
  dexter: {
    200: qa([
      ["What is Dexter's job?", "Blood spatter analyst"],
      ["What is Dexter's sister named?", "Debra Morgan"],
    ]),
    400: qa([
      ["What does Dexter keep from his victims as trophies?", "Blood slides"],
      ["What is Dexter's son's name?", "Harrison"],
      ["What killer nickname belongs to Dexter's brother Brian?", "The Ice Truck Killer"],
    ]),
    600: qa([
      ["What is the Trinity Killer's real name?", "Arthur Mitchell"],
      ["What is Miguel's last name?", "Prado"],
      ["What is Harrison's last name?", "Morgan"],
    ]),
  },
  vikings: {
    200: qa([
      ["What monastery is raided at the start of the series?", "Lindisfarne"],
      ["What cave-dwelling prophet advises Kattegat's rulers?", "The Seer"],
    ]),
    400: qa([
      ["Which brother of Ragnar becomes ruler in Frankia?", "Rollo"],
      ["Which son of Ragnar is known as Boneless?", "Ivar"],
      ["What priest becomes Ragnar's close friend?", "Athelstan"],
    ]),
    600: qa([
      ["What land does Floki discover in the west?", "Iceland"],
      ["Which king of Wessex becomes Ragnar's uneasy ally?", "King Ecbert"],
      ["What epithet is Bjorn known by?", "Ironside"],
    ]),
  },
  one_piece_show: {
    200: qa([
      ["What fruit gives Luffy his rubber powers in the live-action show?", "The Gum-Gum Fruit"],
      ["Which swordsman joins Luffy first?", "Zoro"],
      ["Which chef joins the crew from the Baratie?", "Sanji"],
    ]),
    400: qa([
      ["What village is Nami from?", "Cocoyasi Village"],
      ["Which marine hero is revealed as Luffy's grandfather?", "Garp"],
      ["Which clown pirate rules Orange Town?", "Buggy"],
    ]),
    600: qa([
      ["What restaurant does Zeff run?", "The Baratie"],
      ["Who gifts the Going Merry to the Straw Hats?", "Kaya"],
      ["Which fish-man terrorizes Nami's home?", "Arlong"],
    ]),
  },
  dragon_ball: {
    200: qa([
      ["What is Goku's Saiyan name?", "Kakarot"],
      ["What dragon grants wishes on Earth?", "Shenron"],
    ]),
    400: qa([
      ["What fusion of Goku and Vegeta uses Potara earrings?", "Vegito"],
      ["What android absorbs 17 and 18?", "Cell"],
      ["What planet was Vegeta prince of?", "Planet Vegeta"],
    ]),
    600: qa([
      ["What technique boosts Goku's power after King Kai's training?", "Kaioken"],
      ["What is Beerus's divine title?", "God of Destruction"],
      ["What is the fusion of Goten and Trunks called?", "Gotenks"],
    ]),
  },
  spider_man: {
    200: qa([
      ["What is MJ's full first name in the MCU?", "Michelle"],
      ["Which villain has mechanical arms in Spider-Man 2?", "Doctor Octopus"],
    ]),
    400: qa([
      ["Which villain says The power of the sun in the palm of my hand?", "Doctor Octopus"],
      ["Who is Miles Morales's uncle in Into the Spider-Verse?", "Aaron Davis"],
      ["What police department does Gwen Stacy's father work for in The Amazing Spider-Man?", "The NYPD"],
    ]),
    600: qa([
      ["What antidote cures Norman Osborn in No Way Home?", "The Goblin serum antidote"],
      ["What is the name of the villain who tears holes across space in Across the Spider-Verse?", "The Spot"],
      ["What scientist mentor becomes the Spot?", "Jonathan Ohnn"],
    ]),
  },
  charades_general: {
    200: charades([
      "walk on a tightrope",
      "juggle invisible balls",
      "ride a mechanical bull",
      "escape quicksand",
      "catch a huge fish",
      "break a pinata",
    ]),
    400: charades([
      "win a spelling bee",
      "open a secret vault",
      "freeze in a spotlight",
      "argue with a mirror",
      "hide from a dinosaur",
      "race a shopping cart",
    ]),
  },
  charades_movies: {
    200: charades(
      ["The Mask", "Up", "Speed", "Twister", "Coco", "Moana"],
      "Act this movie or show",
    ),
    400: charades(
      ["True Detective", "Breaking Bad", "Blade Runner", "La La Land", "Mad Max", "Interstellar"],
      "Act this movie or show",
    ),
  },
  movie_show_emoji: {
    200: [
      guess("🧛‍♂️ 🧄 🌙", "Twilight"),
      guess("❄️ 👭 👑", "Frozen"),
      guess("🦇 🃏 🌃", "The Dark Knight"),
    ],
    400: [
      guess("💼 ⚖️ 👔", "Suits"),
      guess("🕵️‍♂️ 🎻 🔎", "Sherlock"),
      guess("🍗 🧪 💀", "Breaking Bad"),
    ],
    600: [
      guess("🧠 📺 🚪", "The Truman Show"),
      guess("🏨 🍰 🔔", "The Grand Budapest Hotel"),
      guess("🚚 🔥 🏜️", "Mad Max: Fury Road"),
    ],
  },
  country_emoji: {
    200: [
      guess("🌷 🚲 🧀", "The Netherlands"),
      guess("🍁 🏒 ❄️", "Canada"),
      guess("🍕 🍝 🛵", "Italy"),
    ],
    400: [
      guess("🧀 ⌚ 🏔️", "Switzerland"),
      guess("🕌 🛢️ 🏜️", "Saudi Arabia"),
      guess("🗿 🌶️ ⛰️", "Chile"),
    ],
    600: [
      guess("🏔️ 🙏 🥾", "Nepal"),
      guess("🌲 💻 ❄️", "Estonia"),
      guess("🏜️ 🦊 📜", "Jordan"),
    ],
  },
  general_emoji: {
    200: [
      guess("🍿 🎬", "Movie night"),
      guess("📚 🧠", "Studying"),
      guess("✈️ 🧳", "Travel"),
    ],
    400: [
      guess("🧠 ⚡ 💡", "Brainstorm"),
      guess("⏰ 💥 😵", "Wake-up call"),
      guess("📉 😬 💸", "Bad investment"),
    ],
    600: [
      guess("🧊 🧠 😎", "Keep your cool"),
      guess("🪞 😬", "Self-conscious"),
      guess("🚪 🐘", "Elephant in the room"),
    ],
  },
  who_footballer: {
    200: who([
      ["Brazilian winger, Real Madrid star, dances after goals, often called Vini", "Vinicius Junior", "Vin%C3%ADcius_J%C3%BAnior"],
      ["English midfielder, teenage superstar who played for Dortmund then Real Madrid", "Jude Bellingham", "Jude_Bellingham"],
      ["South Korean forward, Tottenham captain, famous for two-footed finishing", "Son Heung-min", "Son_Heung-min"],
    ]),
    400: who([
      ["Dutch winger with a devastating left-foot cut inside, famous at Bayern and Real Madrid", "Arjen Robben", "Arjen_Robben"],
      ["Italian deep-lying playmaker with elegance and long passes, nicknamed The Architect", "Andrea Pirlo", "Andrea_Pirlo"],
      ["Italian defender who spent almost his whole career with Milan and captained them for years", "Paolo Maldini", "Paolo_Maldini"],
    ]),
    600: who([
      ["Soviet goalkeeper in black, the only keeper to win the Ballon d'Or", "Lev Yashin", "Lev_Yashin"],
      ["Brazilian icon nicknamed the White Pele and famed for Flamengo and flair", "Zico", "Zico"],
      ["German midfielder who won the 1990 World Cup and the Ballon d'Or in the same year", "Lothar Matthaus", "Lothar_Matth%C3%A4us"],
    ]),
  },
  who_tv_character: {
    200: who([
      ["I'm the chemistry student turned meth cook's loyal partner, and I say Yeah science!", "Jesse Pinkman", "Jesse_Pinkman"],
      ["I solve strange murders in Nevermore with a deadpan stare and braids", "Wednesday Addams", "Wednesday_Addams"],
      ["I track walkers with a crossbow and barely waste words doing it", "Daryl Dixon", "Daryl_Dixon"],
    ]),
    400: who([
      ["I'm the ambitious lawyer who becomes Saul's most important partner and moral test", "Kim Wexler", "Kim_Wexler"],
      ["I'm the fashion-obsessed queen bee of Manhattan's Upper East Side", "Blair Waldorf", "Blair_Waldorf"],
      ["I am the terrifying hitman from Killing Eve who turns every scene into a game", "Villanelle", "Villanelle_(Killing_Eve)"],
    ]),
    600: who([
      ["I'm the cynical detective from True Detective season 1 who talks about time as a flat circle", "Rust Cohle", "Rust_Cohle"],
      ["I'm the ruthless media heir who keeps crashing upward inside Waystar Royco", "Kendall Roy", "Kendall_Roy"],
      ["I'm the vice president turned president whose insults are legendary in Veep", "Selina Meyer", "Selina_Meyer"],
    ]),
  },
  who_anime_character: {
    200: who([
      ["I inherit One For All, study at U.A., and dream of becoming the greatest hero", "Izuku Midoriya", "Izuku_Midoriya"],
      ["I'm a telepathic little girl who loves peanuts and chaos", "Anya Forger", "Anya_Forger"],
      ["I sleep to unlock my power and scream constantly in Demon Slayer", "Zenitsu Agatsuma", "Zenitsu_Agatsuma"],
    ]),
    400: who([
      ["I'm a white-haired sorcerer with Six Eyes and overwhelming confidence", "Satoru Gojo", "Satoru_Gojo"],
      ["I'm a deadly assassin-mother in Spy x Family, balancing family life with secret missions", "Yor Forger", "Yor_Forger"],
      ["I'm the fire-and-ice student from My Hero Academia", "Shoto Todoroki", "Shoto_Todoroki"],
    ]),
    600: who([
      ["I'm the smiling monster behind countless tragedies in Monster", "Johan Liebert", "Johan_Liebert"],
      ["I'm the loud believer in Spiral Power from Gurren Lagann", "Kamina", "Kamina"],
      ["I endlessly rewind time for one friend in Madoka Magica", "Homura Akemi", "Homura_Akemi"],
    ]),
  },
  who_movie_character: {
    200: who([
      ["I'm the space ranger toy who arrives believing I can really fly", "Buzz Lightyear", "Buzz_Lightyear"],
      ["I'm the princess-turned-ogre who falls in love with Shrek", "Princess Fiona", "Princess_Fiona"],
      ["I hide as a man to save China in Disney's Mulan", "Mulan", "Mulan_(Disney_character)"],
    ]),
    400: who([
      ["I'm the road warrior of a post-apocalyptic wasteland", "Max Rockatansky", "Max_Rockatansky"],
      ["I'm the anarchic alter ego behind soap, fights, and mayhem", "Tyler Durden", "Tyler_Durden"],
      ["I rule over Halloweentown and sing about it dramatically", "Jack Skellington", "Jack_Skellington"],
    ]),
    600: who([
      ["I'm the blade runner hunting replicants through rain and neon", "Rick Deckard", "Rick_Deckard"],
      ["I'm the isolated writer slowly going mad at the Overlook Hotel", "Jack Torrance", "Jack_Torrance"],
      ["I drink milkshakes and crush rivals in There Will Be Blood", "Daniel Plainview", "Daniel_Plainview"],
    ]),
  },
};

export default TRIVIA_MEGA_EXPANSIONS;
