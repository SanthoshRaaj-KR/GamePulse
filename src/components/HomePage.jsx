import { useState, useEffect } from "react";
import { Flame, Trophy, User, ArrowRight, Calendar, Clock, Star } from "lucide-react";

const Homepage = ({ isExpanded }) => {
  const [trendingNews, setTrendingNews] = useState([]);
  const [cricketNews, setCricketNews] = useState([]);
  const [footballNews, setFootballNews] = useState([]);
  const [basketballNews, setBasketballNews] = useState([]);
  const [upcomingFixtures, setUpcomingFixtures] = useState([]);
  const [playerNews, setPlayerNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSportsData = async () => {
      setIsLoading(true);
      try {
        // Fetch cricket news from News API
        const cricketResponse = await fetch(
          "https://newsapi.org/v2/everything?q=cricket&language=en&sortBy=publishedAt&pageSize=5&apiKey=829ae6b0659b465298bcee595795a2a1"
        );
        
        // Fetch football news from News API
        const footballResponse = await fetch(
          "https://newsapi.org/v2/everything?q=football+OR+soccer&language=en&sortBy=publishedAt&pageSize=5&apiKey=829ae6b0659b465298bcee595795a2a1"
        );
        
        // Fetch basketball news from News API
        const basketballResponse = await fetch(
          "https://newsapi.org/v2/everything?q=basketball+OR+NBA&language=en&sortBy=publishedAt&pageSize=5&apiKey=829ae6b0659b465298bcee595795a2a1"
        );
        
        // Fetch upcoming fixtures from API-Football
        const fixturesResponse = await fetch(
          "https://v3.football.api-sports.io/fixtures?next=3",
          {
            headers: {
              "x-apisports-key": "YOUR_API_FOOTBALL_KEY",
            },
          }
        );

        // Parse responses
        if (!cricketResponse.ok || !footballResponse.ok || !basketballResponse.ok) {
          throw new Error("Failed to fetch sports news");
        }

        const cricketData = await cricketResponse.json();
        const footballData = await footballResponse.json();
        const basketballData = await basketballResponse.json();
        
        // For demo purposes, if API calls fail, use simulated data
        const fixturesData = fixturesResponse.ok ? 
          await fixturesResponse.json() : 
          { response: simulatedFixtures };

        // Process the data
        const processedCricketNews = processSportsNews(cricketData.articles, "Cricket");
        const processedFootballNews = processSportsNews(footballData.articles, "Football");
        const processedBasketballNews = processSportsNews(basketballData.articles, "Basketball");
        
        // Set trending news (top news from all categories)
        const allNews = [
          ...processedCricketNews,
          ...processedFootballNews,
          ...processedBasketballNews
        ].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).slice(0, 3);
        
        setCricketNews(processedCricketNews.slice(0, 3));
        setFootballNews(processedFootballNews.slice(0, 3));
        setBasketballNews(processedBasketballNews.slice(0, 3));
        setTrendingNews(allNews);
        
        // Process upcoming fixtures
        const processedFixtures = fixturesData.response.map(fixture => {
          const date = new Date(fixture.fixture.date);
          return `${fixture.teams.home.name} vs ${fixture.teams.away.name} - ${date.toLocaleDateString()}`;
        });
        setUpcomingFixtures(processedFixtures);
        
        // Set player news based on trending stories
        const processedPlayerNews = generatePlayerNews(allNews);
        setPlayerNews(processedPlayerNews);
        
      } catch (err) {
        console.error("Error fetching sports data:", err);
        setError("Failed to load sports data. Using simulated data instead.");
        
        // Use simulated data if the API calls fail
        const simulatedData = generateSimulatedData();
        setCricketNews(simulatedData.cricket);
        setFootballNews(simulatedData.football);
        setBasketballNews(simulatedData.basketball);
        setTrendingNews(simulatedData.trending);
        setUpcomingFixtures(simulatedData.fixtures);
        setPlayerNews(simulatedData.players);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSportsData();
  }, []);

  // Helper function to process sports news
  const processSportsNews = (articles, category) => {
    return articles.map(article => ({
      id: article.url,
      category,
      title: article.title,
      image: article.urlToImage || "/api/placeholder/400/250",
      timestamp: formatTimestamp(article.publishedAt),
      summary: article.description || "No summary available",
      details: article.content || article.description,
      publishedAt: article.publishedAt,
      source: article.source.name
    }));
  };

  // Helper function to format timestamps
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  // Helper function to generate player news based on trending stories
  const generatePlayerNews = (news) => {
    // Extract player names from headlines (simplified approach)
    const playerNames = [
      { sport: "Cricket", players: ["Kohli", "Rohit", "Root", "Smith", "Williamson"] },
      { sport: "Football", players: ["Messi", "Ronaldo", "Haaland", "Mbappé", "Salah"] },
      { sport: "Basketball", players: ["LeBron", "Durant", "Curry", "Jokić", "Antetokounmpo"] }
    ];
    
    const playerNews = [];
    
    news.forEach(article => {
      const sportObj = playerNames.find(s => s.sport === article.category);
      if (!sportObj) return;
      
      const matchedPlayer = sportObj.players.find(player => 
        article.title.includes(player) || article.summary.includes(player)
      );
      
      if (matchedPlayer) {
        playerNews.push({
          id: `player-${article.id}`,
          sport: article.category,
          player: matchedPlayer,
          title: article.title,
          image: article.image,
          timestamp: article.timestamp
        });
      }
    });
    
    // If we couldn't extract players from news, generate some
    if (playerNews.length < 3) {
      const simulatedPlayers = generateSimulatedData().players;
      return [...playerNews, ...simulatedPlayers].slice(0, 3);
    }
    
    return playerNews.slice(0, 3);
  };

  // Simulated data for fallback
  const generateSimulatedData = () => {
    return {
      trending: [
        {
          id: 1,
          category: "Cricket",
          title: "India defeats Australia in thrilling T20 final",
          image: "/api/placeholder/400/250",
          timestamp: "3 hours ago",
          summary: "In a nail-biting finish, India clinched victory against Australia by 4 runs in the T20 World Cup final.",
          details: "Chasing 176, Australia needed 18 runs in the final over but fell short as Bumrah defended brilliantly. Kohli was named Player of the Match for his quickfire 82 off 51 balls. This marks India's second T20 World Cup triumph."
        },
        {
          id: 2,
          category: "Football",
          title: "Manchester City extends lead at top of Premier League",
          image: "/api/placeholder/400/250",
          timestamp: "6 hours ago",
          summary: "Manchester City secured a dominant 3-0 victory against Arsenal to extend their lead at the top of the table.",
          details: "Goals from De Bruyne, Haaland, and Foden sealed the win as City maintained their impressive form. With just 5 games remaining, they are now 7 points clear at the top, putting them in prime position to secure another Premier League title."
        },
        {
          id: 3,
          category: "Basketball",
          title: "Lakers stun Celtics with last-second buzzer beater",
          image: "/api/placeholder/400/250",
          timestamp: "12 hours ago",
          summary: "LeBron James hit a dramatic three-pointer at the buzzer to give the Lakers a 108-105 win over the Celtics.",
          details: "With 2.1 seconds remaining and the Lakers down by 2, James received the inbound pass, took one dribble to his left and launched a deep three-pointer that found nothing but net as time expired. He finished with 37 points, 12 rebounds, and 8 assists in a vintage performance."
        },
      ],
      cricket: [
        "ICC announces new T20 tournament format starting 2026",
        "England announces squad for upcoming test series against South Africa",
        "BCCI implements new fitness standards for national team selection"
      ],
      football: [
        "Champions League to expand to 36 teams from next season",
        "FIFA announces host cities for 2026 World Cup",
        "Premier League introduces semi-automated offside technology"
      ],
      basketball: [
        "NBA approves in-season tournament starting next season",
        "G-League expansion adds three new teams for upcoming season",
        "FIBA World Cup qualifiers schedule announced for 2025"
      ],
      fixtures: [
        "IPL 2025: Mumbai Indians vs Chennai Super Kings - May 16",
        "Premier League: Liverpool vs Manchester United - May 18",
        "NBA Playoffs: Celtics vs 76ers - May 15"
      ],
      players: [
        {
          id: 1,
          sport: "Cricket",
          player: "Virat Kohli",
          title: "Kohli breaks Tendulkar's record with 50th ODI century",
          image: "/api/placeholder/150/150",
          timestamp: "1 day ago"
        },
        {
          id: 2,
          sport: "Football",
          player: "Erling Haaland",
          title: "Haaland scores five in single match, breaks season record",
          image: "/api/placeholder/150/150",
          timestamp: "2 days ago"
        },
        {
          id: 3,
          sport: "Basketball",
          player: "Nikola Jokić",
          title: "Jokić secures third straight MVP award in unanimous decision",
          image: "/api/placeholder/150/150",
          timestamp: "3 days ago"
        },
      ]
    };
  };

  // Simulated fixtures data
  const simulatedFixtures = [
    {
      fixture: {
        date: "2025-05-16T14:30:00+00:00"
      },
      teams: {
        home: { name: "Mumbai Indians" },
        away: { name: "Chennai Super Kings" }
      }
    },
    {
      fixture: {
        date: "2025-05-18T16:00:00+00:00"
      },
      teams: {
        home: { name: "Liverpool" },
        away: { name: "Manchester United" }
      }
    },
    {
      fixture: {
        date: "2025-05-15T00:00:00+00:00"
      },
      teams: {
        home: { name: "Boston Celtics" },
        away: { name: "Philadelphia 76ers" }
      }
    }
  ];

  return (
    <div className={`flex-1 bg-zinc-900 p-6 overflow-y-auto transition-all duration-300 ${isExpanded ? "ml-64" : "ml-20"}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Welcome to GamePulse</h1>
        <p className="text-zinc-400 mt-1">Stay updated with the latest sports news and highlights</p>
      </div>

      {/* Loading and Error State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64 text-zinc-400">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>Loading sports data...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      ) : (
        <>
          {/* Trending Section */}
          <section className="mb-10">
            <div className="flex items-center mb-4">
              <Flame className="text-purple-400 mr-2" size={20} />
              <h2 className="text-xl font-semibold text-white">Trending Now</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingNews.map((news) => (
                <TrendingCard key={news.id} news={news} />
              ))}
            </div>
          </section>

          {/* Sports News Section */}
          <section className="mb-10">
            <div className="flex items-center mb-4">
              <Trophy className="text-purple-400 mr-2" size={20} />
              <h2 className="text-xl font-semibold text-white">Latest Sports Updates</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SportsUpdateCard 
                title="Cricket"
                updates={typeof cricketNews[0] === 'string' 
                  ? cricketNews 
                  : cricketNews.map(news => news.title)}
              />
              <SportsUpdateCard 
                title="Football"
                updates={typeof footballNews[0] === 'string' 
                  ? footballNews 
                  : footballNews.map(news => news.title)}
              />
              <SportsUpdateCard 
                title="Basketball"
                updates={typeof basketballNews[0] === 'string' 
                  ? basketballNews 
                  : basketballNews.map(news => news.title)}
              />
              <SportsUpdateCard 
                title="Upcoming Fixtures"
                updates={upcomingFixtures}
                isFixture={true}
              />
            </div>
          </section>

          {/* Famous Players News */}
          <section>
            <div className="flex items-center mb-4">
              <User className="text-purple-400 mr-2" size={20} />
              <h2 className="text-xl font-semibold text-white">Player Spotlight</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {playerNews.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

const TrendingCard = ({ news }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-xl overflow-hidden transition-all duration-300 border border-zinc-800 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img src={news.image} alt={news.title} className="w-full h-48 object-cover" />
        <div className="absolute top-3 left-3 bg-purple-500/80 text-white text-xs py-1 px-2 rounded-md backdrop-blur-sm">
          {news.category}
        </div>
        {news.source && (
          <div className="absolute bottom-3 right-3 bg-zinc-900/80 text-white text-xs py-1 px-2 rounded-md backdrop-blur-sm">
            {news.source}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-white font-medium text-lg mb-2 line-clamp-2">{news.title}</h3>
        
        <div className="flex items-center text-zinc-400 text-sm mb-3">
          <Clock size={14} className="mr-1" />
          <span>{news.timestamp}</span>
        </div>
        
        <p className="text-zinc-300 text-sm">
          {isHovered ? news.details : news.summary}
        </p>
        
        <div className={`flex items-center mt-4 text-purple-400 text-sm font-medium transition-all duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}>
          <span>Read full story</span>
          <ArrowRight size={16} className="ml-1" />
        </div>
      </div>
    </div>
  );
};

const SportsUpdateCard = ({ title, updates, isFixture = false }) => {
  return (
    <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-xl p-4 border border-zinc-800 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
      <div className="flex items-center mb-4">
        <h3 className="text-white font-medium">{title}</h3>
        {isFixture && <Calendar size={16} className="text-purple-400 ml-2" />}
      </div>
      
      <ul className="space-y-3">
        {updates.map((update, index) => (
          <li key={index} className="flex items-start">
            <div className="h-1.5 w-1.5 rounded-full bg-purple-400 mr-2 mt-1.5"></div>
            <span className="text-zinc-300 text-sm">{update}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const PlayerCard = ({ player }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="flex items-center bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-xl p-3 border border-zinc-800 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img src={player.image} alt={player.player} className="w-16 h-16 rounded-lg object-cover" />
        <div className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs p-1 rounded-full">
          <Star size={10} />
        </div>
      </div>
      
      <div className="ml-3 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-purple-400 font-medium">{player.sport}</span>
          <span className="text-xs text-zinc-500">{player.timestamp}</span>
        </div>
        <h4 className="text-white font-medium mt-1">{player.player}</h4>
        <p className={`text-xs text-zinc-300 mt-1 transition-all duration-300 ${isHovered ? "line-clamp-none" : "line-clamp-1"}`}>
          {player.title}
        </p>
      </div>
    </div>
  );
};

export default Homepage;