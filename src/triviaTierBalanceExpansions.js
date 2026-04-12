const qa = (pairs) => pairs.map(([q, a]) => ({ q, a }));
const charades = (items, prompt = "Scan the QR and act it out") =>
  items.map((a) => ({ q: prompt, a }));

const TRIVIA_TIER_BALANCE_EXPANSIONS = {
  friends: {
    400: qa([
      ["What is Ross's son's name?", "Ben"],
      ["What is Janice's signature phrase?", "Oh. My. God."],
      ["What is Phoebe's husband's first name?", "Mike"],
      ["What is Monica's first serious boyfriend on the show nicknamed?", "Fun Bobby"],
    ]),
    600: qa([
      ["What is Chandler's roommate before Joey?", "Kip"],
      ["What is the name of Joey's soap opera character's evil twin?", "Hans Ramoray"],
      ["What is Rachel's first job in fashion?", "Personal shopper"],
    ]),
  },
  the_office: {
    400: qa([
      ["What office game does Jim put Dwight's things in Jell-O over?", "Prank"],
      ["What is Angela's husband's first name?", "Robert"],
      ["What branch manager replaces Michael after his departure?", "Andy Bernard"],
      ["What company buys Dunder Mifflin?", "Sabre"],
    ]),
    600: qa([
      ["What is the documentary crew filming called within the show?", "PBS documentary crew"],
      ["What is Dwight's volunteer sheriff title?", "Volunteer sheriff's deputy"],
      ["What game does Michael invent at the office Olympics?", "Flonkerton"],
      ["What is Erin's real first name?", "Kelly"],
      ["What is the name of Jim and Pam's daughter?", "Cecelia"],
    ]),
  },
  breaking_bad: {
    400: qa([
      ["What is Walter White's car at the start of the series?", "Pontiac Aztek"],
      ["What company extermination front does Walt use to cook in houses?", "Vamonos Pest"],
      ["What is Skyler and Walt's daughter named?", "Holly"],
    ]),
    600: qa([
      ["What is the underground lab chemist Walt replaces named?", "Gale"],
      ["What is the model of the RV used for early cooks?", "Fleetwood Bounder"],
      ["What song plays during the prison hit montage?", "Pick Yourself Up"],
    ]),
  },
  game_thrones: {
    400: qa([
      ["What castle is the ancestral seat of House Arryn?", "The Eyrie"],
      ["What metal can kill White Walkers as discovered by Sam?", "Dragonglass"],
      ["What title does Tyrion hold under Daenerys?", "Hand of the Queen"],
      ["What is the name of Arya's Faceless Man trainer?", "Jaqen H'ghar"],
    ]),
    600: qa([
      ["What is the Valyrian steel dagger used against Bran later known for killing?", "The Night King"],
      ["What family holds the Twins?", "House Frey"],
      ["What is the name of Sansa's direwolf?", "Lady"],
      ["What order protects the Wall?", "Night's Watch"],
      ["What is the Hound's real first name?", "Sandor"],
    ]),
  },
  stranger_things: {
    400: qa([
      ["What club does Eddie Munson lead?", "Hellfire Club"],
      ["What arcade game tops season 2?", "Dragon's Lair"],
      ["What is Lucas's sister called?", "Erica"],
      ["What psychic project restores Eleven's powers?", "Nina Project"],
    ]),
    600: qa([
      ["What is Eleven's birth name?", "Jane"],
      ["What newspaper does Nancy work for in season 3?", "Hawkins Post"],
      ["What alias does Murray pretend to be at Yuri's warehouse?", "Yakov"],
      ["What is the high school basketball team called?", "Hawkins Tigers"],
      ["What cheerleader is Vecna's first season 4 victim?", "Chrissy Cunningham"],
    ]),
  },
  prison_break: {
    400: qa([
      ["What object contains The Company's data in later seasons?", "Scylla"],
      ["What is Bellick's first name?", "Brad"],
      ["What doctor is Lincoln and Michael's father figure connected to?", "Sara Tancredi"],
    ]),
    600: qa([
      ["What secret service man leads the hunt for Scylla?", "Don Self"],
      ["What is Gretchen Morgan's alias in season 3?", "Susan B. Anthony"],
      ["What is Michael's mother called?", "Christina Rose Scofield"],
      ["What is the name of Lincoln's son?", "L.J."],
      ["What tattoo artist skill helps Michael plan escapes?", "Structural design"],
    ]),
  },
  big_bang_theory: {
    400: qa([
      ["What card game does the group play with fantasy decks?", "Magic: The Gathering"],
      ["What song does Sheldon want when sick?", "Soft Kitty"],
      ["What is Sheldon's favorite superhero?", "The Flash"],
    ]),
    600: qa([
      ["What is Sheldon's online game alter ego called?", "Sheldon the Conqueror"],
      ["What does Howard go to space in?", "Space Shuttle"],
      ["What comic store owner often hangs out with the group?", "Stuart"],
      ["What is Sheldon's sister named?", "Missy"],
      ["What Nobel category do Sheldon and Amy win?", "Physics"],
    ]),
  },
  brooklyn_99: {
    400: qa([
      ["What annual contest do the detectives obsess over?", "Halloween Heist"],
      ["What is Boyle's son's name?", "Nikolaj"],
    ]),
    600: qa([
      ["What is Gina's dance group called?", "Floorgasm"],
      ["What is Scully's first name?", "Norm"],
      ["What is Hitchcock's first name?", "Michael"],
    ]),
  },
  the_walking_dead: {
    400: qa([
      ["What masked group uses walker skins as camouflage?", "The Whisperers"],
      ["What is the Hilltop's blacksmith called?", "Earl"],
      ["What is Rick's wife called?", "Lori"],
      ["What scientist tries to reach Washington in early seasons?", "Eugene Porter"],
    ]),
    600: qa([
      ["What is Alpha's daughter called?", "Lydia"],
      ["What is the Savior compound called?", "The Sanctuary"],
      ["What is Hershel Greene's profession?", "Farmer"],
      ["What is Carol's abusive husband called?", "Ed"],
      ["What is the spin-off city for Maggie and Negan?", "Manhattan"],
    ]),
  },
  suits: {
    400: qa([
      ["What is Harvey's surname?", "Specter"],
      ["What title does Jessica hold at the start?", "Managing partner"],
      ["What wall object does Harvey love throwing a ball at?", "Painting"],
    ]),
    600: qa([
      ["What does Louis shout when he's excited about victory?", "You just got Litt up"],
      ["What is Harvey's mother first name?", "Lily"],
      ["What New York district is the firm's office set in?", "Manhattan"],
      ["What business titan becomes Harvey's client and rival friend?", "Charles Forstman"],
    ]),
  },
  dexter: {
    400: qa([
      ["What is the nickname of Dexter's serial killer identity's urge?", "Dark Passenger"],
      ["What is Rita's last name before marrying Dexter?", "Bennett"],
      ["What job does Debra eventually rise to hold?", "Lieutenant"],
      ["What is the Trinity Killer's real surname?", "Mitchell"],
    ]),
    600: qa([
      ["What is the name of Dexter's first major mentor target in season 3?", "Miguel Prado"],
      ["What is the Ice Truck Killer's relationship to Dexter?", "Brother"],
      ["What killer is nicknamed the Bay Harbor Butcher?", "Dexter Morgan"],
      ["What woman poisons Dexter's life in season 5 with Jordan Chase's group?", "Lumen Pierce"],
    ]),
  },
  vikings: {
    400: qa([
      ["What city do the Vikings repeatedly raid in England?", "Wessex"],
      ["What is Ivar's mother called?", "Aslaug"],
    ]),
    600: qa([
      ["What son of Ragnar explores and settles Iceland?", "Floki"],
      ["What bishop becomes Lagertha's lover and ally?", "Heahmund"],
      ["What Rus prince invades Scandinavia in later seasons?", "Oleg"],
      ["What kingdom does Ubbe dream of settling in?", "North America"],
    ]),
  },
  the_flash: {
    400: qa([
      ["What villain controls the city from the shadows using dark matter and mind games in season 6A?", "Bloodwork"],
      ["What codename does Nora West-Allen use?", "XS"],
      ["What alias does Cisco use as a hero?", "Vibe"],
      ["What giant psychic gorilla becomes one of Barry's enemies?", "Grodd"],
    ]),
    600: qa([
      ["What is Caitlin's mother's surname?", "Snow"],
      ["What speedster villain is Barry's daughter from the future hunted by?", "Cicada"],
      ["What prison does Eobard Thawne manipulate events from in season 5?", "Iron Heights"],
      ["What force counterpart opposes the Speed Force in season 7?", "Still Force"],
    ]),
  },
  marvel: {
    400: qa([
      ["What is the name of Peter Quill's team?", "Guardians of the Galaxy"],
      ["What is Monica Rambeau's first MCU hero codename?", "Photon"],
      ["What is the magical book Wanda studies?", "Darkhold"],
    ]),
    600: qa([
      ["What restaurant chain does Scott Lang work at after prison?", "Baskin-Robbins"],
      ["What is the Black Widow training program called?", "Red Room"],
      ["What planet imprisons Thor in Ragnarok?", "Sakaar"],
      ["What organization hunts Skrulls in Secret Invasion?", "SABER"],
    ]),
  },
  dc: {
    400: qa([
      ["What prison houses dangerous criminals in The Dark Knight?", "Arkham Asylum"],
      ["What weapon does Harley Quinn famously use?", "Baseball bat"],
      ["What is Black Adam's human title in Kahndaq?", "Champion"],
      ["What is Wonder Woman's civilian name?", "Diana Prince"],
    ]),
    600: qa([
      ["What codename does Billy Batson's foster brother Freddy admire?", "Captain Every Power"],
      ["What prison island holds villains in The Suicide Squad?", "Corto Maltese"],
      ["What creature kills Superman in Batman v Superman?", "Doomsday"],
      ["What is the shark-headed squad member called?", "King Shark"],
    ]),
  },
  star_wars: {
    400: qa([
      ["What armored bounty hunter protects Grogu?", "The Mandalorian"],
      ["What is Obi-Wan's birth surname?", "Kenobi"],
      ["What is Princess Leia's adoptive surname?", "Organa"],
    ]),
    600: qa([
      ["What droid says 'Never tell me the odds' to C-3PO's worry?", "Han Solo"],
      ["What rebel pilot later becomes a spice runner in Andor?", "Cassian Andor"],
      ["What criminal runs Cloud City operations before Lando goes legit?", "Lando Calrissian"],
      ["What Jedi temple world do Luke's final lessons happen on in The Last Jedi?", "Ahch-To"],
    ]),
  },
  spider_man: {
    400: qa([
      ["What villain in Homecoming is also Liz's father?", "Vulture"],
      ["What newspaper does Peter work for in Raimi's films?", "Daily Bugle"],
      ["What is Miles Morales's father's name?", "Jefferson Davis"],
      ["What does Gwen call Miles in Across the Spider-Verse at the Guggenheim spot?", "A mistake"],
      ["What green villain fights Tobey Maguire's Spider-Man first?", "Green Goblin"],
    ]),
    600: qa([
      ["What scientist creates The Lizard in The Amazing Spider-Man?", "Curt Connors"],
      ["What is the symbiote newspaper photographer rival to Peter called?", "Eddie Brock"],
    ]),
  },
  invincible: {
    400: qa([
      ["What fish-headed hero is on the Guardians of the Globe?", "Aquarus"],
      ["What speedster hero dies in Omni-Man's massacre?", "Red Rush"],
      ["What teen team member shrinks and grows?", "Dupli-Kate"],
      ["What blue alien ally keeps returning to Earth?", "Allen"],
    ]),
    600: qa([
      ["What is Monster Girl's curse side effect?", "She gets younger"],
      ["What is Omni-Man's mission on Earth?", "Prepare it for Viltrum"],
    ]),
  },
  the_boys: {
    400: qa([
      ["What speedster of the Seven kills Robin?", "A-Train"],
      ["What is Billy Butcher's wife called?", "Becca"],
      ["What giant sea creature-themed Seven member loves Deep Sea fame?", "The Deep"],
      ["What fake patriotic slogan is tied to Homelander?", "America's greatest superhero"],
    ]),
    600: qa([
      ["What supe manipulates minds through touch and suggestion in season 4?", "Sister Sage"],
      ["What is Frenchie's first name?", "Serge"],
      ["What is Kimiko's surname?", "Miyashiro"],
      ["What company scientist creates Compound V?", "Vought"],
      ["What superhero reality show launches new heroes?", "American Hero"],
    ]),
  },
  harry_potter: {
    400: qa([
      ["What broom model does Harry receive from McGonagall?", "Nimbus 2000"],
      ["What map reveals secret passages at Hogwarts?", "Marauder's Map"],
      ["What village sits beside Hogwarts?", "Hogsmeade"],
      ["What creature guards the Chamber of Secrets?", "Basilisk"],
    ]),
    600: qa([
      ["What is the room that appears when needed called?", "Room of Requirement"],
      ["What object stores Slughorn's altered memory?", "Pensieve memory"],
      ["What spell destroys a Horcrux with a fang in the Chamber?", "Basilisk venom"],
      ["What dragon does Harry face in the first Triwizard task?", "Hungarian Horntail"],
      ["What station does Harry return to after death in Deathly Hallows Part 2?", "King's Cross"],
    ]),
  },
  lord_rings: {
    400: qa([
      ["What river separates the Fellowship before Boromir's fall?", "Anduin"],
      ["What rider race serves Rohan?", "Rohirrim"],
      ["What city do Frodo and Sam try to reach inside Mordor?", "Mount Doom"],
      ["What title does Galadriel hold in Lothlorien?", "Lady of the Wood"],
      ["What creature attacks the Fellowship outside Moria's gate?", "Watcher in the Water"],
    ]),
    600: qa([
      ["What king of Rohan is under Saruman's influence?", "Theoden"],
      ["What signal lights call Gondor for aid?", "Beacons of Gondor"],
      ["What is the name of Aragorn's horse?", "Brego"],
      ["What tower holds Sauron's eye?", "Barad-dur"],
    ]),
  },
  disney: {
    400: qa([
      ["What is the magic house in Encanto called?", "Casita"],
      ["What is the name of Aladdin's monkey?", "Abu"],
      ["What toy belongs to Sid in Toy Story?", "Mutant toys"],
    ]),
    600: qa([
      ["What is the name of Miguel's dog in Coco?", "Dante"],
      ["What fish tank city does Nemo end up in?", "Sydney"],
      ["What is Baymax built to be?", "Healthcare companion"],
      ["What surname does Lightning McQueen's rival Chick use?", "Hicks"],
    ]),
  },
  anime: {
    400: qa([
      ["What is the profession of Light Yagami's rival L?", "Detective"],
      ["What organization hunts tailed beasts in Naruto?", "Akatsuki"],
      ["What mask-wearing teacher trains Team 7?", "Kakashi"],
    ]),
    600: qa([
      ["What is Eren's hometown district?", "Shiganshina"],
      ["What title is given to humanity's strongest soldier in Attack on Titan?", "Levi Ackerman"],
      ["What is Tanjiro's sister called?", "Nezuko"],
      ["What title does Naruto dream of becoming?", "Hokage"],
    ]),
  },
  dragon_ball: {
    400: qa([
      ["What race is Frieza?", "Alien"],
      ["What martial arts tournament recurs through the series?", "World Tournament"],
      ["What is Piccolo originally connected to?", "King Piccolo"],
    ]),
    600: qa([
      ["What object stores Master Roshi's sealing technique?", "Mafuba container"],
      ["What android pair are siblings?", "Android 17 and 18"],
      ["What is Gohan's scholarly profession later in life?", "Researcher"],
      ["What move does Vegeta often shout before firing a beam?", "Final Flash"],
    ]),
  },
  one_piece_show: {
    400: qa([
      ["What fruit gives Luffy his rubber powers?", "Gum-Gum Fruit"],
      ["What body part defines Sanji's fighting style?", "Legs"],
      ["What chef owns the Baratie?", "Zeff"],
    ]),
    600: qa([
      ["What tyrant rules the Fish-Man area in East Blue?", "Arlong"],
      ["What clown-faced pirate is one of Luffy's earliest enemies?", "Buggy"],
      ["What map does Nami dream of drawing?", "A map of the world"],
      ["What marine officer chases the Straw Hats in the live action early on?", "Garp"],
      ["What food part does Sanji refuse to waste under Zeff's teachings?", "Any food"],
    ]),
  },
  solo_leveling: {
    400: qa([
      ["What is Sung Jin-Woo's job at the start?", "Hunter"],
      ["What color rank is Jin-Woo first classified as?", "E-rank"],
      ["What is Jin-Woo's mother's condition called in the series?", "Eternal slumber"],
      ["What hidden stat lets Jin-Woo keep leveling?", "The System"],
    ]),
    600: qa([
      ["What monarch opposes Jin-Woo with icy power?", "Frost Monarch"],
      ["What class upgrade does Jin-Woo receive after a job change?", "Shadow Monarch"],
    ]),
  },
  pokemon: {
    400: qa([
      ["What electric mouse is Ash's partner?", "Pikachu"],
      ["What item heals a fainted Pokémon completely?", "Max Revive"],
      ["What evolution stone changes Eevee into Jolteon?", "Thunder Stone"],
      ["What professor begins Ash's journey?", "Professor Oak"],
    ]),
    600: qa([
      ["What final evolution follows Bulbasaur and Ivysaur?", "Venusaur"],
      ["What fire starter evolves into Charmeleon?", "Charmander"],
      ["What dragon-like pseudo-legendary starts as Dratini?", "Dragonite"],
      ["What item stores captured Pokémon digitally?", "PC"],
    ]),
  },
  video_games: {
    400: qa([
      ["What block game uses creepers and redstone?", "Minecraft"],
      ["What stealth series stars Solid Snake?", "Metal Gear"],
      ["What console family uses Joy-Con controllers?", "Nintendo Switch"],
      ["What battle royale features a gulag comeback mechanic?", "Call of Duty: Warzone"],
    ]),
    600: qa([
      ["What racing series is known for Horizon festivals?", "Forza Horizon"],
      ["What sandbox series features creepers, Endermen, and the Nether?", "Minecraft"],
    ]),
  },
  charades_general: {
    400: charades([
      "pilot emergency landing",
      "chef on fire",
      "ghost in mirror",
      "robot low battery",
      "detective finds clue",
      "villain escapes prison",
    ]),
    600: charades([
      "spy in disguise",
      "alien at school",
      "pirate reads map",
      "wizard loses wand",
      "ninja in traffic",
      "vampire at dentist",
      "astronaut on beach",
      "time traveler confused",
      "superhero with cold",
      "cowboy at casino",
      "mime misses bus",
      "chef wins contest",
      "ghost hates sunlight",
      "scientist spills potion",
      "king forgets crown",
      "teacher breaks desk",
      "gamer finds treasure",
      "pilot sees UFO",
      "artist paints wall",
      "doctor in panic",
    ]),
  },
  charades_movies: {
    400: charades([
      "Kill Bill",
      "The Matrix",
      "The Batman",
      "John Wick",
      "Top Gun",
      "The Mask",
    ], "Act this movie or show"),
    600: charades([
      "Mad Men",
      "Whiplash",
      "Shutter Island",
      "Donnie Darko",
      "Ford v Ferrari",
      "Prisoners",
      "The Prestige",
      "Arrival",
      "Dune",
      "The Revenant",
      "Nightcrawler",
      "Ex Machina",
      "Moneyball",
      "The Bear",
      "Succession",
      "Andor",
      "House of the Dragon",
      "The White Lotus",
      "Mindhunter",
      "Peaky Blinders",
    ], "Act this movie or show"),
  },
};

export default TRIVIA_TIER_BALANCE_EXPANSIONS;
