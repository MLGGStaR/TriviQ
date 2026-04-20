const logo = (rows) => rows.map(([q, a]) => ({ q, a }));

const LOGO_CATEGORIES_BANK = {
  logos: {
    label: "Logos",
    icon: "\u{1F3AF}",
    color: "#F59E0B",
    isLogoGuess: true,
    200: logo([
      ["apple","Apple"],["google","Google"],["youtube","YouTube"],["netflix","Netflix"],
      ["instagram","Instagram"],["tiktok","TikTok"],["facebook","Facebook"],["whatsapp","WhatsApp"],
      ["snapchat","Snapchat"],["x","X"],["spotify","Spotify"],["nike","Nike"],
      ["adidas","Adidas"],["mcdonald-s","McDonald's"],["tesla","Tesla"],["ferrari","Ferrari"],
      ["paypal","PayPal"],["playstation","PlayStation"],["discord","Discord"],["twitch","Twitch"],
      ["reddit","Reddit"],["pinterest","Pinterest"],["airbnb","Airbnb"],["android","Android"],
      ["firefox","Firefox"],["puma","Puma"],["jordan","Jordan"],["nba","NBA"],
      ["mlb","MLB"],["telegram","Telegram"],
    ]),
    400: logo([
      ["chevrolet","Chevrolet"],["mitsubishi","Mitsubishi"],["suzuki","Suzuki"],["renault","Renault"],
      ["under-armour","Under Armour"],["wwe","WWE"],["premier-league","Premier League"],["tumblr","Tumblr"],
      ["threads","Threads"],["dropbox","Dropbox"],["github","GitHub"],["steam","Steam"],
      ["roblox","Roblox"],["fortnite","Fortnite"],["valorant","Valorant"],["shazam","Shazam"],
      ["crunchyroll","Crunchyroll"],["vimeo","Vimeo"],["pandora","Pandora"],["letterboxd","Letterboxd"],
      ["metacritic","Metacritic"],["rotten-tomatoes","Rotten Tomatoes"],["fandom","Fandom"],["rockstar-games","Rockstar Games"],
      ["riot-games","Riot Games"],["doordash","DoorDash"],["kickstarter","Kickstarter"],["stripe","Stripe"],
      ["bluesky","Bluesky"],["square-enix","Square Enix"],
    ]),
    600: logo([
      ["american-airlines","American Airlines"],["southwest-airlines","Southwest Airlines"],["british-airways","British Airways"],["lufthansa","Lufthansa"],
      ["air-france","Air France"],["turkish-airlines","Turkish Airlines"],["singapore-airlines","Singapore Airlines"],["qantas","Qantas"],
      ["patreon","Patreon"],["substack","Substack"],["cloudflare","Cloudflare"],["vercel","Vercel"],
      ["flickr","Flickr"],["deviantart","DeviantArt"],["giphy","GIPHY"],["bandcamp","Bandcamp"],
      ["genius","Genius"],["myanimelist","MyAnimeList"],["infiniti","INFINITI"],["polestar","Polestar"],
      ["strava","Strava"],["tidal","TIDAL"],["cbs","CBS"],["deliveroo","Deliveroo"],
      ["humble-bundle","Humble Bundle"],["rumble","Rumble"],["kick","Kick"],["quora","Quora"],
      ["glassdoor","Glassdoor"],["linktree","Linktree"],
    ]),
  },
};

export default LOGO_CATEGORIES_BANK;
