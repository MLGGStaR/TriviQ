// Expansion file — hits the 30/30/30 minimum per tier for every category.
// Rules: fact-checked, no answer leaks, no trivial questions, tier-appropriate.
const qa = (pairs) => pairs.map(([q, a]) => ({ q, a }));

const MORE_TRIVIA_EXPANSIONS = {
  country_facts: {
    200: qa([
      ["Which country is shaped like a boot?", "Italy"],
      ["Which country is famous for the Great Barrier Reef?", "Australia"],
      ["Which country is home to the pyramids at Giza?", "Egypt"],
      ["Which country is famous for its tango music and dance?", "Argentina"],
      ["Which country is known for the Eiffel Tower?", "France"],
      ["Which country uses the yen as its currency?", "Japan"],
      ["Which country is the world's largest producer of coffee beans?", "Brazil"],
      ["Which country is known for tulips, windmills, and wooden clogs?", "Netherlands"],
      ["Which country is home to the Inca ruins of Machu Picchu?", "Peru"],
      ["Which country gave the world sushi and anime?", "Japan"],
      ["Which country is known for the Sphinx and hieroglyphs?", "Egypt"],
      ["Which country is the world's largest by land area?", "Russia"],
      ["Which country has the most natural lakes?", "Canada"],
      ["Which country is famous for cheese and wine and has the Alps to the east?", "France"],
      ["Which country is home to Bollywood?", "India"],
      ["Which country's flag is a red circle on white?", "Japan"],
      ["Which country gave the world tacos and tequila?", "Mexico"],
      ["Which country shares the longest border with the United States?", "Canada"],
      ["Which country is home to the Amazon rainforest (mostly)?", "Brazil"],
      ["Which country is known for the Acropolis and democracy's origins?", "Greece"],
      ["Which country is famous for flamenco dancing?", "Spain"],
      ["Which country is home to the Maasai Mara reserve?", "Kenya"],
      ["Which country is known for Oktoberfest?", "Germany"],
      ["Which country is the world's smallest independent state by area?", "Vatican City"],
      ["Which country has the world's longest coastline?", "Canada"],
      ["Which country is famous for fjords and midnight sun?", "Norway"],
      ["Which country hosts the annual Rio Carnival?", "Brazil"],
      ["Which country is famous for mozzarella and Vespa scooters?", "Italy"],
      ["Which country's flag bears a red maple leaf?", "Canada"],
      ["Which country is home to the Taj Mahal?", "India"],
      ["Which country is known as the Land of a Thousand Lakes?", "Finland"],
      ["Which country is famous for its vodka and matryoshka dolls?", "Russia"],
    ]),
    400: qa([
      ["Which European country has the euro but is not in the EU?", "Montenegro"],
      ["Which African country was formerly known as Abyssinia?", "Ethiopia"],
      ["Which country is home to the Great Barrier Reef?", "Australia"],
      ["Which Southeast Asian country is shaped like an S?", "Vietnam"],
      ["Which country has two landlocked enclaves inside South Africa?", "Eswatini and Lesotho"],
      ["Which country is both in Europe and Asia with capital Istanbul (historically)?", "Turkey"],
      ["Which country is home to Mount Kilimanjaro?", "Tanzania"],
      ["Which country is known for the Dead Sea on its coast?", "Jordan"],
      ["Which country produces the most cocoa beans worldwide?", "Ivory Coast"],
      ["Which country is famous for the film industry called Nollywood?", "Nigeria"],
      ["Which country is home to the ancient city of Petra?", "Jordan"],
      ["Which country's flag has a cedar tree on it?", "Lebanon"],
      ["Which country gave the world origami and sumo wrestling?", "Japan"],
      ["Which country has the city of Havana as its capital?", "Cuba"],
      ["Which country is famous for the Atacama Desert?", "Chile"],
      ["Which country is landlocked and known for yodeling and chocolate?", "Switzerland"],
      ["Which country is known for sauna culture and Angry Birds?", "Finland"],
      ["Which country has the city of Marrakech?", "Morocco"],
      ["Which country is home to Angkor Wat temples?", "Cambodia"],
      ["Which country's people are famous for flamenco and paella?", "Spain"],
      ["Which country is the most populous in Africa?", "Nigeria"],
      ["Which country hosts Wimbledon tennis?", "United Kingdom"],
      ["Which country was formed from the breakup of Yugoslavia and has capital Zagreb?", "Croatia"],
      ["Which country is home to the Moai statues?", "Chile"],
    ]),
    600: qa([
      ["Which Pacific island nation has the ISO code NR?", "Nauru"],
      ["Which country has the most spoken languages in the world?", "Papua New Guinea"],
      ["Which country has three capital cities?", "South Africa"],
      ["Which country is the only one named after a woman?", "Saint Lucia"],
      ["Which country has the oldest continuously operating parliament (the Althing)?", "Iceland"],
      ["Which country is the only one whose flag is not rectangular?", "Nepal"],
      ["Which country has the highest number of Nobel Prize winners per capita?", "Sweden"],
      ["Which country straddles the Caucasus with capital Tbilisi?", "Georgia"],
      ["Which country's currency is the tugrik?", "Mongolia"],
      ["Which country was formerly British Honduras?", "Belize"],
      ["Which country is home to the Rano Raraku volcano?", "Chile"],
      ["Which country has the most UNESCO World Heritage Sites?", "Italy"],
      ["Which country is the smallest in mainland Africa?", "Gambia"],
      ["Which country has a dragon on its national flag?", "Bhutan"],
      ["Which landlocked country is completely surrounded by Italy other than San Marino?", "Vatican City"],
      ["Which country consumes the most coffee per capita?", "Finland"],
      ["Which country is the world's longest from north to south?", "Chile"],
      ["Which country has the lowest point on dry land (Dead Sea)?", "Jordan (and Israel)"],
      ["Which country owns Easter Island?", "Chile"],
      ["Which tiny country is doubly landlocked with Switzerland and Austria?", "Liechtenstein"],
      ["Which African country is the most linguistically diverse?", "Nigeria"],
      ["Which country is known for kava ceremonies and bungee jumping's origin?", "Vanuatu"],
      ["Which country has the world's highest life expectancy?", "Monaco"],
      ["Which country's name means 'equator' in Spanish?", "Ecuador"],
      ["Which country is famous for blue city Chefchaouen?", "Morocco"],
    ]),
  },

  blacklist: {
    200: qa([
      ["Who turns himself in to the FBI in the pilot episode?", "Raymond 'Red' Reddington"],
      ["Who plays the lead criminal informant?", "James Spader"],
      ["Who is the rookie FBI profiler Red demands to work with?", "Elizabeth Keen"],
      ["What is Aram's role on the task force?", "Cyber/tech specialist"],
      ["Who leads the FBI task force?", "Harold Cooper"],
      ["What is the first name of Liz's secretive husband?", "Tom"],
    ]),
    400: qa([
      ["Who is Dembe to Red?", "His loyal bodyguard and confidant"],
      ["Which task force member is a former Mossad agent?", "Samar Navabi"],
      ["What Cold War-era agent is Liz's biological mother?", "Katarina Rostova"],
      ["What is the name of the mysterious list Red brings to the FBI?", "The Blacklist"],
      ["What does Red's cleaner 'Mr. Kaplan' specialize in?", "Disposing of evidence and bodies"],
    ]),
    600: qa([
      ["What does Red's fulcrum file contain?", "Blackmail on the Cabal's leaders"],
      ["Who orchestrates Tom Keen's marriage to Liz?", "Red"],
    ]),
  },

  family_guy: {
    200: qa([
      ["What town is the show set in?", "Quahog, Rhode Island"],
      ["Who is the mayor in the show?", "Mayor Adam West"],
      ["Who plays most male voices and created the show?", "Seth MacFarlane"],
      ["What is Stewie's primary catchphrase target?", "Lois (his mother)"],
      ["Who is Peter's African-American best friend with a spinoff?", "Cleveland Brown"],
      ["Who is Peter's wheelchair-using cop friend?", "Joe Swanson"],
    ]),
    400: qa([
      ["What is Peter's wife's maiden name?", "Lois Pewterschmidt"],
      ["What college did Brian attend?", "Brown University"],
      ["Who is Peter's gravelly-voiced Jewish friend?", "Mort Goldman"],
      ["What is the name of Quagmire's catchphrase?", "Giggity"],
    ]),
    600: qa([
      ["What year did Family Guy originally debut?", "1999"],
      ["Which character is introduced as Brian's girlfriend played by Cate Blanchett's-type actress?", "Jillian"],
      ["What is the name of the Giant Chicken recurring rival?", "Ernie the Giant Chicken"],
      ["Who is Peter's mentally disabled brother-in-law?", "Patrick Pewterschmidt"],
      ["Who is Quagmire's sister who had an abusive boyfriend arc?", "Brenda Quagmire"],
    ]),
  },

  brooklyn_99: {
    200: qa([
      ["What precinct does the show take place in?", "99th precinct of the NYPD"],
      ["Who is the serious captain who joins in the pilot?", "Raymond Holt"],
      ["Who is the sarcastic assistant obsessed with herself?", "Gina Linetti"],
      ["What food does Charles Boyle obsess over?", "Gourmet and exotic food"],
      ["What rank is Terry Jeffords?", "Sergeant"],
      ["Who plays Amy Santiago?", "Melissa Fumero"],
      ["Who plays Raymond Holt?", "Andre Braugher"],
      ["Who plays Rosa Diaz?", "Stephanie Beatriz"],
      ["What is Amy Santiago's biggest professional fear?", "Disappointing Holt"],
      ["What is the name of the title TV show parodied in the pilot?", "Serpico"],
      ["Who is Boyle's best friend besides Jake?", "Hitchcock and Scully"],
      ["What iconic NYC borough is the show named after?", "Brooklyn"],
    ]),
    400: qa([
      ["What pet does Captain Holt own?", "A corgi named Cheddar"],
      ["What is Jake's go-to three-word catchphrase?", "Cool cool cool"],
      ["What is Hitchcock and Scully's favorite food?", "Anything free / sandwiches"],
      ["What is Terry's wife's name?", "Sharon"],
      ["What are Terry's three daughters' names?", "Cagney, Lacey, and Ava"],
      ["What recurring holiday event does the squad compete in?", "The Halloween Heist"],
      ["Who plays Boyle?", "Joe Lo Truglio"],
      ["Who plays Terry?", "Terry Crews"],
      ["What board game does Jake steal from a criminal?", "A rare comic book"],
      ["Who is the food truck guy always at the precinct?", "Scully's brother-in-law"],
      ["What is Jake's father's profession?", "Airline pilot"],
      ["What holiday does the squad also compete on starting in later seasons?", "The Jimmy Jab Games"],
      ["What is Amy's sister called?", "Maria"],
    ]),
    600: qa([
      ["What is the Disco Strangler's gimmick?", "Killing to 1970s disco music"],
      ["Who plays Adrian Pimento?", "Jason Mantzoukas"],
      ["What network first aired the show?", "Fox"],
      ["What rival bar does the precinct visit?", "Shaw's Bar"],
      ["What is the name of Rosa's girlfriend in later seasons?", "Jocelyn"],
      ["What is Jake's nickname for his corgi gag?", "Cheddar"],
      ["What was Jake's undercover mafia family?", "The Iannucci family"],
      ["What is the name of the former captain before Holt?", "Captain McGintley"],
      ["Who is Jake's childhood idol he gets to work with in season 2?", "John McClane-style detective"],
      ["What opera does Holt famously enjoy?", "Madama Butterfly"],
      ["What is the nickname for Boyle's ex-wife Eleanor?", "The Vulture of Boyle"],
    ]),
  },

  arrow: {
    200: qa([
      ["What city does Oliver Queen protect?", "Star City"],
      ["What weapon is Oliver most famous for?", "Bow and arrow"],
      ["Who plays the title vigilante?", "Stephen Amell"],
      ["Who is Oliver's computer-genius sidekick?", "Felicity Smoak"],
      ["Who is Oliver's bodyguard turned partner?", "John Diggle"],
      ["What catchphrase does Oliver say about failing his city?", "You have failed this city"],
      ["What is Oliver's younger sister's name?", "Thea Queen"],
    ]),
    400: qa([
      ["Who does Oliver eventually marry?", "Felicity Smoak"],
      ["What was Oliver's first vigilante hideout called?", "The Foundry"],
      ["Who is Oliver's first mentor on Lian Yu?", "Yao Fei"],
      ["What is Slade Wilson's villain alias?", "Deathstroke"],
      ["Who plays Malcolm Merlyn?", "John Barrowman"],
    ]),
    600: qa([
      ["What alias does Oliver take in later seasons?", "Green Arrow"],
      ["What is Malcolm Merlyn's vigilante alias?", "Dark Archer"],
      ["What is the name of Ra's al Ghul's healing pool?", "Lazarus Pit"],
      ["Who sacrifices himself in the Crisis crossover?", "Oliver Queen"],
      ["What spinoff show features time-traveling heroes?", "Legends of Tomorrow"],
    ]),
  },

  modern_family: {
    200: qa([
      ["Who is the patriarch of the blended Pritchett family?", "Jay Pritchett"],
      ["Who plays Jay's Colombian wife?", "Sofía Vergara"],
      ["What dog does Jay adore?", "Stella (French bulldog)"],
      ["Who plays Phil Dunphy?", "Ty Burrell"],
      ["What is Phil Dunphy's profession?", "Real estate agent"],
      ["What is Claire Dunphy's maiden name?", "Pritchett"],
      ["How many Dunphy children are there?", "Three"],
    ]),
    400: qa([
      ["What instrument does Manny famously play?", "Accordion"],
      ["What is Haley's job in later seasons?", "Lifestyle blogger / assistant"],
      ["What show-within-a-show career does Mitchell pursue?", "Environmental lawyer"],
    ]),
    600: qa([
      ["What country is Gloria originally from?", "Colombia"],
      ["What state is Cam's farm from?", "Missouri"],
      ["Who is Jay's closet-business partner?", "Shorty"],
      ["What is the Pritchett family business?", "Pritchett's Closets & Blinds"],
      ["What university does Alex Dunphy attend?", "Caltech"],
    ]),
  },

  himym: {
    200: qa([
      ["Who is narrating the story to his kids?", "Future Ted Mosby"],
      ["What bar does the group always meet at?", "MacLaren's Pub"],
      ["Who is the womanizing suit-lover?", "Barney Stinson"],
      ["Who plays Barney Stinson?", "Neil Patrick Harris"],
      ["Who does Marshall marry?", "Lily Aldrin"],
      ["What is Ted looking for throughout the show?", "The Mother of his children"],
    ]),
    400: qa([
      ["What embarrassing teen pop persona did Robin have?", "Robin Sparkles"],
      ["What is the Mother's real name?", "Tracy McConnell"],
      ["What instrument does the Mother play?", "Bass guitar"],
    ]),
    600: qa([
      ["Who does Robin end up with in the finale?", "Ted"],
      ["What year does the show's narrator begin telling the story?", "2030"],
      ["What is Barney's slang book called?", "The Bro Code"],
      ["What hand-gesture game does Marshall constantly initiate?", "Slap Bet"],
    ]),
  },

  lord_rings: {
    200: qa([
      ["Who is the ring-bearer of the One Ring?", "Frodo Baggins"],
    ]),
    400: qa([
      ["Who is Frodo's most loyal companion?", "Samwise Gamgee"],
      ["Who is the wizard who sends Frodo on his quest?", "Gandalf"],
      ["What is the name of the dwarf in the Fellowship?", "Gimli"],
      ["What is the name of the elf archer in the Fellowship?", "Legolas"],
    ]),
    600: qa([
      ["What is the original name of Gollum?", "Sméagol"],
      ["Where was the One Ring forged?", "Mount Doom"],
      ["What is the name of Aragorn's sword reforged?", "Andúril"],
      ["What is Bilbo's original name for his elven blade?", "Sting"],
      ["What Ent leads the assault on Isengard?", "Treebeard"],
      ["What is the name of Gandalf's sword?", "Glamdring"],
      ["Who is the Witch-king of Angmar's greatest fear?", "No man can kill him (killed by Éowyn)"],
    ]),
  },

  game_thrones: {
    200: qa([
      ["What noble house has the direwolf as its sigil?", "House Stark"],
      ["What is Daenerys's house sigil?", "A three-headed dragon"],
    ]),
    600: qa([
      ["What free city is famous for its canals and Faceless Men?", "Braavos"],
      ["What mercenary company does Daario Naharis lead?", "Second Sons"],
      ["Who is revealed as the Kingslayer?", "Jaime Lannister"],
      ["What is the name of Bran Stark's direwolf?", "Summer"],
      ["What Valyrian steel dagger triggers many plotlines?", "The catspaw dagger"],
      ["What is the name of Arya Stark's sword?", "Needle"],
      ["What poisonous substance kills Joffrey?", "The Strangler"],
    ]),
  },

  stranger_things: {
    400: qa([
      ["Who is the police chief of Hawkins?", "Jim Hopper"],
      ["What government lab created Eleven's powers?", "Hawkins National Laboratory"],
      ["What shopping mall is central to Season 3?", "Starcourt Mall"],
      ["What is Jonathan Byers's hobby?", "Photography"],
      ["What state is Hawkins located in?", "Indiana"],
    ]),
    600: qa([
      ["What song helps Max escape Vecna?", "Running Up That Hill"],
      ["What was Vecna's original human designation?", "One"],
      ["What D&D club does Eddie Munson lead?", "Hellfire Club"],
    ]),
  },

  suits: {
    200: qa([
      ["What is Mike Ross pretending to have from Harvard?", "A law degree"],
      ["What is Donna's surname?", "Paulsen"],
      ["What is Louis's surname?", "Litt"],
      ["Who is the managing partner at the start?", "Jessica Pearson"],
    ]),
    400: qa([
      ["What is the firm's original name?", "Pearson Hardman"],
      ["What unique memory ability does Mike have?", "Photographic memory"],
      ["What is Rachel's profession at the firm initially?", "Paralegal"],
      ["Who plays Harvey Specter?", "Gabriel Macht"],
    ]),
    600: qa([
      ["What does Louis shout when excited?", "You just got Litt up"],
      ["What is Harvey's mother's first name?", "Lily"],
      ["Who plays Louis Litt?", "Rick Hoffman"],
      ["What investment banker mentors Mike later?", "Jonathan Sidwell"],
      ["Who plays Donna Paulsen?", "Sarah Rafferty"],
      ["Who plays Jessica Pearson?", "Gina Torres"],
      ["What Chicago firm does the finale move to?", "Pearson Specter Litt (Chicago)"],
    ]),
  },

  invincible: {
    400: qa([
      ["What alien empire does Omni-Man secretly serve?", "Viltrum Empire"],
      ["What is Atom Eve's first name?", "Samantha"],
      ["What government agency does Cecil run?", "The Global Defense Agency"],
      ["What teen heroine can duplicate herself?", "Dupli-Kate"],
      ["What blue-skinned alien repeatedly returns to Earth?", "Allen the Alien"],
      ["What demon detective investigates Omni-Man?", "Damien Darkblood"],
      ["What alien species repeatedly invades Earth with time distortion?", "The Flaxans"],
    ]),
    600: qa([
      ["What is the name of Cecil's predecessor hero leader's team?", "The Guardians of the Globe"],
      ["What scientist creates Reanimen from corpses?", "D.A. Sinclair"],
    ]),
  },

  vikings: {
    200: qa([
      ["What Norse god does Ragnar claim descent from?", "Odin"],
      ["Who plays Ragnar Lothbrok?", "Travis Fimmel"],
    ]),
    400: qa([
      ["What is Lagertha's role in the early seasons?", "Shieldmaiden and Ragnar's first wife"],
      ["What is Ragnar's eldest son called?", "Björn Ironside"],
      ["What English monk becomes Ragnar's close friend?", "Athelstan"],
      ["What kingdom do the Vikings repeatedly raid early on?", "Wessex"],
      ["What Norse settlement serves as Ragnar's home base?", "Kattegat"],
    ]),
    600: qa([
      ["What is Ivar the Boneless's disability?", "Brittle bone disease"],
      ["What English king is Ragnar's complex ally?", "King Ecbert"],
      ["What boat builder joins Ragnar's early raids?", "Floki"],
      ["What is the name of Ragnar's second wife?", "Aslaug"],
      ["What ritual execution is used on captives?", "The Blood Eagle"],
    ]),
  },

  dexter: {
    200: qa([
      ["What is Dexter's surname?", "Morgan"],
      ["What is Dexter's profession at Miami Metro?", "Blood spatter analyst"],
    ]),
    400: qa([]),
    600: qa([]),
  },

  dragon_ball: {
    200: qa([
      ["What is Goku's Saiyan birth name?", "Kakarot"],
      ["What planet are Goku and Vegeta from?", "Planet Vegeta"],
      ["Who is Goku's best friend since childhood?", "Krillin"],
      ["Who raises Goku on Earth?", "Grandpa Gohan"],
      ["What color is Piccolo's skin?", "Green"],
      ["Who is Goku's wife?", "Chi-Chi"],
    ]),
    400: qa([
      ["What are the magical orbs that grant wishes called?", "Dragon Balls"],
      ["Who is the wish-granting dragon on Earth?", "Shenron"],
      ["What room accelerates training a year per day?", "The Hyperbolic Time Chamber"],
      ["What fusion dance creates Gogeta?", "Metamoran Fusion"],
      ["Who is Goku's martial arts master?", "Master Roshi"],
      ["What island does Master Roshi live on?", "Kame Island"],
      ["Who is Goku's first son?", "Gohan"],
    ]),
    600: qa([
      ["What earring method creates Vegito?", "Potara fusion"],
      ["Who is the Namekian wish dragon?", "Porunga"],
      ["What is the race that Frieza rules over?", "The Frieza Force / Cold Empire"],
      ["What Z Fighter trains Gohan through the early Z saga?", "Piccolo"],
      ["What is Trunks's mother's profession?", "Scientist / CEO of Capsule Corp"],
      ["What is Goku's signature defensive stance?", "Turtle School martial arts"],
    ]),
  },

  one_piece_show: {
    200: qa([
      ["What is Luffy's favorite food?", "Meat"],
      ["What is the name of Luffy's crew?", "The Straw Hat Pirates"],
    ]),
    400: qa([
      ["What does Luffy's rubber body come from?", "The Gum-Gum Fruit"],
      ["Who is the Straw Hats' cook?", "Sanji"],
    ]),
    600: qa([
      ["What title is given to the four most powerful pirates?", "The Yonko"],
    ]),
  },

  pokemon: {
    400: qa([
      ["What region is Pokémon Ruby and Sapphire set in?", "Hoenn"],
      ["What Pokémon type is super-effective against water?", "Grass or Electric"],
      ["Who is Ash Ketchum's main rival in the original series?", "Gary Oak"],
    ]),
    600: qa([
      ["Which Pokémon is number 150 in the Kanto Pokédex?", "Mewtwo"],
      ["What is the name of Giovanni's team?", "Team Rocket"],
    ]),
  },

  solo_leveling: {
    600: qa([
      ["What true title does Jin-Woo inherit from Ashborn?", "Shadow Monarch"],
      ["What is the island raid that changes everything?", "Jeju Island"],
      ["Who is the architect that designed the System?", "The Architect of the System"],
      ["What is the name of Jin-Woo's first elite shadow knight?", "Igris"],
    ]),
  },

  the_boys: {
    400: qa([
      ["What is the superhero team in the show called?", "The Seven"],
      ["What company manufactures and controls the supes?", "Vought International"],
      ["What secret chemical gives supes their powers?", "Compound V"],
    ]),
  },

  the_walking_dead: {
    200: qa([
      ["What is Rick Grimes's profession before the apocalypse?", "Sheriff's deputy"],
      ["What weapon does Daryl primarily use?", "A crossbow"],
      ["What is Carl's hat famously described as?", "A sheriff's hat"],
    ]),
    600: qa([
      ["What barbed-wire baseball bat does Negan carry?", "Lucille"],
      ["What is Rick's horse-loving son called?", "Carl"],
    ]),
  },

  general_emoji: {
    200: [{ q: "🧠 💡", a: "Brainstorm" }],
  },

  prison_break: {
    400: qa([
      ["What is Michael Scofield's profession before prison?", "Structural engineer"],
      ["What state is Fox River located in?", "Illinois"],
      ["What FBI agent hunts the escapees?", "Alexander Mahone"],
      ["What Panamanian prison houses Michael in season 3?", "Sona"],
      ["What is the name of Michael's Russian contact in season 5?", "Poseidon"],
    ]),
  },

  the_flash: {
    400: qa([
      ["What is the source of Barry Allen's powers?", "The Speed Force"],
      ["What company built the particle accelerator?", "STAR Labs"],
    ]),
    600: qa([
      ["What is Reverse-Flash's real name?", "Eobard Thawne"],
      ["What is Zoom's real name?", "Hunter Zolomon"],
      ["What alternate Earth is Harrison Wells from originally?", "Earth-2"],
    ]),
  },

  who_country_landmark: {
    200: [
      { q: "Guess the country from the landmark", a: "Germany", wiki: "Cologne_Cathedral" },
      { q: "Guess the country from the landmark", a: "Russia", wiki: "Moscow_Kremlin" },
      { q: "Guess the country from the landmark", a: "United States", wiki: "Mount_Rushmore" },
      { q: "Guess the country from the landmark", a: "France", wiki: "Palace_of_Versailles" },
      { q: "Guess the country from the landmark", a: "Italy", wiki: "Piazza_San_Marco" },
      { q: "Guess the country from the landmark", a: "United Kingdom", wiki: "Buckingham_Palace" },
      { q: "Guess the country from the landmark", a: "Netherlands", wiki: "Amsterdam" },
      { q: "Guess the country from the landmark", a: "Austria", wiki: "St._Stephen%27s_Cathedral,_Vienna" },
      { q: "Guess the country from the landmark", a: "Japan", wiki: "Tokyo_Tower" },
      { q: "Guess the country from the landmark", a: "South Korea", wiki: "Gyeongbokgung" },
      { q: "Guess the country from the landmark", a: "Thailand", wiki: "Wat_Phra_Kaew" },
      { q: "Guess the country from the landmark", a: "India", wiki: "Gateway_of_India" },
    ],
    400: [
      { q: "Guess the country from the landmark", a: "Greece", wiki: "Mykonos" },
      { q: "Guess the country from the landmark", a: "Portugal", wiki: "Pena_Palace" },
      { q: "Guess the country from the landmark", a: "Hungary", wiki: "Chain_Bridge,_Budapest" },
      { q: "Guess the country from the landmark", a: "Czech Republic", wiki: "Prague_Castle" },
      { q: "Guess the country from the landmark", a: "Poland", wiki: "Wawel_Castle" },
      { q: "Guess the country from the landmark", a: "Belgium", wiki: "Grand_Place,_Brussels" },
      { q: "Guess the country from the landmark", a: "Denmark", wiki: "Nyhavn" },
      { q: "Guess the country from the landmark", a: "Sweden", wiki: "Gamla_stan" },
    ],
    600: [
      { q: "Guess the country from the landmark", a: "Turkmenistan", wiki: "Door_to_Hell" },
      { q: "Guess the country from the landmark", a: "Iraq", wiki: "Ziggurat_of_Ur" },
      { q: "Guess the country from the landmark", a: "Colombia", wiki: "Cartagena,_Colombia" },
      { q: "Guess the country from the landmark", a: "Panama", wiki: "Panama_Canal" },
    ],
  },
};

export default MORE_TRIVIA_EXPANSIONS;
