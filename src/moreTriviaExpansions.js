// Additional trivia questions to bring low-count categories up to the
// 34/33/33 (100 total) minimum per tier.
const qa = (pairs) => pairs.map(([q, a]) => ({ q, a }));

const MORE_TRIVIA_EXPANSIONS = {
  country_facts: {
    200: qa([
      ["What is the capital of Thailand?", "Bangkok"],
      ["What country is home to Machu Picchu?", "Peru"],
      ["What is the largest country in South America?", "Brazil"],
      ["Which country is known as the Land of the Rising Sun?", "Japan"],
      ["What is the capital of Canada?", "Ottawa"],
      ["Which country has the longest coastline in the world?", "Canada"],
      ["What country does the Nile river primarily flow through?", "Egypt"],
    ]),
    400: qa([
      ["Which African country was formerly known as Abyssinia?", "Ethiopia"],
      ["What is the official language of Brazil?", "Portuguese"],
      ["Which country has the Great Barrier Reef off its coast?", "Australia"],
      ["What is the smallest country in the world by area?", "Vatican City"],
      ["Which European country has the euro but is not in the EU?", "Montenegro"],
      ["What country is the Amazon rainforest mostly located in?", "Brazil"],
    ]),
    600: qa([
      ["Which landlocked country is entirely surrounded by South Africa?", "Lesotho"],
      ["What is the only country that is also a continent?", "Australia"],
      ["Which country was formerly known as Siam?", "Thailand"],
      ["What is the capital of Kazakhstan?", "Astana (Nur-Sultan)"],
      ["Which Pacific island nation has the ISO code NR?", "Nauru"],
    ]),
  },

  blacklist: {
    200: qa([
      ["Who turns himself in to the FBI in the pilot episode?", "Raymond 'Red' Reddington"],
      ["What is the name of Red's luxury hotel suite lifestyle known for?", "High-end dining, tailored suits, fine wines"],
      ["What is Aram's role on the task force?", "Cyber/tech specialist"],
      ["Who becomes task force leader after early seasons?", "Harold Cooper"],
      ["What is the first name of Liz's husband who turns out to be a plant?", "Tom"],
      ["What organization originally sent Tom to infiltrate Liz's life?", "Berlin / Major's network"],
      ["What color suit is Red most often seen wearing?", "Dark pinstripe / three-piece"],
      ["What does Red's initials R.R. stand for?", "Raymond Reddington"],
      ["Who plays James Spader's character on the show?", "James Spader"],
    ]),
    400: qa([
      ["What does Red reveal to be his real identity in the finale arc?", "Katarina Rostova (the original)"],
      ["What is Dembe's former profession before serving Red?", "Slave / later FBI agent"],
      ["Which task force member is Russian Mossad liaison?", "Samar Navabi"],
      ["What Cold War-era agent is Liz's biological mother?", "Katarina Rostova"],
      ["Who is Red's longtime rival from his past, operating out of Berlin?", "Milos Kirchoff"],
      ["What is the name of Red's personal jet captain?", "Edward"],
      ["What does Red use to clean up after crime scenes?", "Mr. Kaplan's team"],
    ]),
    600: qa([
      ["What does Red's fulcrum file contain?", "Blackmail on the Cabal's leaders"],
      ["Who is revealed to have orchestrated Tom's marriage to Liz?", "Red himself"],
      ["What is the name of Red's Bulgarian arms-dealing alias?", "Kaplan's clients"],
      ["In which country is Liz born according to the show?", "Russia"],
    ]),
  },

  family_guy: {
    200: qa([
      ["What is the name of Peter's workplace in early seasons?", "Happy-Go-Lucky Toy Factory"],
      ["What town is Family Guy set in?", "Quahog, Rhode Island"],
      ["Who is the mayor of Quahog?", "Mayor Adam West"],
      ["What is Stewie's primary enemy?", "His mother Lois"],
      ["Who is Peter's African-American best friend?", "Cleveland Brown"],
      ["Who is Peter's boozy/disabled friend who is a police officer?", "Joe Swanson"],
      ["What is the name of the dog who acts as Peter's friend?", "Brian"],
    ]),
    400: qa([
      ["What is Peter's father-in-law's name?", "Carter Pewterschmidt"],
      ["What college did Brian attend?", "Brown University (didn't finish)"],
      ["What is the name of Lois's father's company?", "Pewterschmidt Industries"],
      ["Who voices most of the male characters (creator)?", "Seth MacFarlane"],
    ]),
    600: qa([
      ["What is Peter's mentally disabled brother-in-law in-universe called?", "Patrick Pewterschmidt"],
      ["What year did Family Guy originally debut?", "1999"],
      ["Who is Herbert the Pervert's love interest?", "Chris Griffin"],
      ["Which character has appeared as a giant chicken rival to Peter?", "Ernie the Giant Chicken"],
      ["What was the name of the cancelled-then-revived arc?", "Family Guy cancellation (2002-2005)"],
      ["Who is Quagmire's sister?", "Brenda Quagmire"],
      ["What is Peter's evil twin brother's name?", "Thaddeus Griffin"],
    ]),
  },

  brooklyn_99: {
    200: qa([
      ["What precinct does the show take place in?", "99th precinct of the NYPD"],
      ["What borough is the precinct located in?", "Brooklyn"],
      ["Who is the serious captain who joins in the pilot?", "Raymond Holt"],
      ["Who is Jake's childhood best friend on the squad?", "Gina Linetti"],
      ["What food does Charles Boyle love to talk about?", "Gourmet and exotic food"],
      ["What rank is Terry Jeffords?", "Sergeant"],
      ["Who is Amy Santiago's biggest fear?", "Failure / disappointing Captain Holt"],
    ]),
    400: qa([
      ["What is Rosa's last name?", "Diaz"],
      ["Who does Jake marry during the series?", "Amy Santiago"],
      ["What pet does Captain Holt own?", "A corgi named Cheddar"],
      ["What is Jake's go-to catchphrase referencing a title?", "Cool cool cool"],
      ["What is Hitchcock and Scully's favorite food?", "Anything free / sandwiches"],
    ]),
    600: qa([
      ["What is Kevin's profession (Holt's husband)?", "Classics professor at Columbia"],
      ["Who plays Doug Judy, the Pontiac Bandit?", "Craig Robinson"],
      ["What is the name of Jake and Amy's baby?", "Mac (McClane)"],
    ]),
  },

  arrow: {
    200: qa([
      ["What city does Oliver Queen protect?", "Star City (originally Starling City)"],
      ["What weapon is Oliver most famous for?", "Bow and arrow"],
      ["What island was Oliver stranded on for 5 years?", "Lian Yu"],
      ["Who plays Oliver Queen?", "Stephen Amell"],
      ["Who is Oliver's computer-genius sidekick?", "Felicity Smoak"],
      ["Who is Oliver's bodyguard turned partner?", "John Diggle"],
      ["What is Oliver's younger sister's name?", "Thea Queen"],
      ["What catchphrase does Oliver say about failing the city?", "You have failed this city"],
    ]),
    400: qa([
      ["Who does Oliver eventually marry?", "Felicity Smoak"],
      ["What is the name of the first Arrow Cave?", "The Foundry"],
      ["Who is Oliver's first mentor on the island?", "Yao Fei"],
    ]),
    600: qa([
      ["What alias does Oliver take in later seasons?", "Green Arrow"],
      ["What is Merlyn's vigilante alias?", "Dark Archer"],
      ["What is the name of Ra's al Ghul's healing pool?", "Lazarus Pit"],
      ["Who sacrifices themselves in the Crisis crossover?", "Oliver Queen"],
      ["What spinoff show features the time-traveling team?", "Legends of Tomorrow"],
    ]),
  },

  modern_family: {
    200: qa([
      ["Who is the patriarch of the Pritchett family?", "Jay Pritchett"],
      ["Who is Jay's much younger Colombian wife?", "Gloria"],
      ["Who plays Gloria Delgado-Pritchett?", "Sofía Vergara"],
      ["What dog does Jay own?", "Stella (French bulldog)"],
      ["Who is the gay couple in the family?", "Mitchell Pritchett and Cameron Tucker"],
      ["What is Phil Dunphy's profession?", "Real estate agent"],
      ["What is Claire Dunphy's maiden name?", "Pritchett"],
      ["How many children do Phil and Claire have?", "Three (Haley, Alex, Luke)"],
    ]),
    400: qa([
      ["Who plays Phil Dunphy?", "Ty Burrell"],
      ["What is Haley Dunphy's job in later seasons?", "Assistant / lifestyle blogger"],
      ["What instrument does Manny famously play?", "Accordion / piano"],
    ]),
    600: qa([
      ["What country is Gloria originally from?", "Colombia"],
      ["What is the name of Cam's farm hometown?", "Missouri"],
      ["Who is Jay's business partner?", "Shorty"],
      ["What is the Pritchett family closet business?", "Pritchett's Closets & Blinds"],
      ["What college does Alex Dunphy attend?", "Caltech"],
    ]),
  },

  himym: {
    200: qa([
      ["Who is narrating the story to his kids?", "Future Ted Mosby"],
      ["What bar does the group always meet at?", "MacLaren's Pub"],
      ["Who is the womanizing suit-lover of the group?", "Barney Stinson"],
      ["Who plays Barney Stinson?", "Neil Patrick Harris"],
      ["What is Marshall's profession?", "Lawyer"],
      ["Who does Marshall marry?", "Lily Aldrin"],
      ["What is Ted looking for throughout the show?", "The Mother of his children"],
    ]),
    400: qa([
      ["What is Robin's homeland?", "Canada"],
      ["What TV persona did Robin have in Canada?", "Robin Sparkles (pop singer)"],
      ["What is the name of the Mother?", "Tracy McConnell"],
      ["What instrument does the Mother play?", "Bass guitar"],
    ]),
    600: qa([
      ["Who does Robin end up with in the finale?", "Ted (after the Mother dies)"],
      ["What is Barney's catchphrase about suits?", "Suit up!"],
      ["What year does the show's narrator begin telling the story?", "2030"],
      ["What is the name of Barney's 'Bro Code'?", "The Bro Code"],
    ]),
  },

  lord_rings: {
    200: qa([
      ["Who is the ring-bearer of the One Ring?", "Frodo Baggins"],
    ]),
    400: qa([
      ["Who is Frodo's most loyal companion?", "Samwise Gamgee"],
      ["Who is the wizard who first gives Frodo the ring's true nature?", "Gandalf"],
      ["What is the name of the dwarf in the Fellowship?", "Gimli"],
      ["What is the name of the elf archer in the Fellowship?", "Legolas"],
    ]),
    600: qa([
      ["What is the original name of Gollum?", "Sméagol"],
      ["What forge is the One Ring created in?", "Mount Doom (Orodruin)"],
      ["Who is the Steward of Gondor who burns himself alive?", "Denethor"],
      ["What is the name of Aragorn's sword reforged in Return of the King?", "Andúril"],
      ["Who are the three hunters chasing after the orcs who took Merry and Pippin?", "Aragorn, Legolas, Gimli"],
      ["What is Bilbo's original name for his sword?", "Sting"],
    ]),
  },

  game_thrones: {
    200: qa([
      ["What noble house has the direwolf as its sigil?", "House Stark"],
      ["What is Daenerys's House sigil?", "A three-headed dragon (House Targaryen)"],
    ]),
    600: qa([
      ["What city is known as the city of love/canals in Essos?", "Braavos"],
      ["What is the name of the mercenary company Daario leads?", "Second Sons"],
      ["Who is the last Lord Commander of the Kingsguard under Cersei?", "Gregor 'The Mountain' Clegane"],
      ["What is the name of Bran's direwolf?", "Summer"],
      ["What is the name of Sansa's direwolf killed early in the series?", "Lady"],
      ["Who is the Kingslayer?", "Jaime Lannister"],
      ["What is the name of Arya's sword?", "Needle"],
    ]),
  },

  stranger_things: {
    400: qa([
      ["What is the alternate dimension called?", "The Upside Down"],
      ["Who is the police chief of Hawkins?", "Jim Hopper"],
      ["What government lab is responsible for Eleven's creation?", "Hawkins National Laboratory"],
    ]),
    600: qa([
      ["What year does season 1 take place?", "1983"],
      ["Who is Eleven's 'papa'?", "Dr. Martin Brenner"],
    ]),
  },

  suits: {
    600: qa([
      ["What is the name of the law firm at the start?", "Pearson Hardman"],
    ]),
  },

  invincible: {
    600: qa([
      ["What is the name of Cecil's wife who is also a hero?", "War Woman (deceased predecessor)"],
      ["What planet do the Flaxans invade from with time dilation?", "Flaxa"],
    ]),
  },

  vikings: {
    600: qa([
      ["What is the name of Ragnar's first wife?", "Lagertha"],
      ["What river do Ragnar's forces famously sail up to reach Paris?", "Seine"],
      ["What city in England do the Vikings raid in Season 1?", "Lindisfarne"],
      ["What language do the Vikings speak in the show?", "Old Norse"],
    ]),
  },
};

export default MORE_TRIVIA_EXPANSIONS;
