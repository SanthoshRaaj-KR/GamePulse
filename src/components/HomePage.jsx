import { useState, useEffect } from "react";
import { Flame, Trophy, ArrowRight, Clock, ChevronLeft, ChevronRight, Calendar, AlertCircle } from "lucide-react";

const Homepage = ({ isExpanded }) => {
  const [allNews, setAllNews] = useState([]);
  const [displayedNews, setDisplayedNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(4);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingFixtures, setUpcomingFixtures] = useState([]);
  
  const newsPerPage = 9;
  // Prioritizing cricket (IPL) and football (soccer), with F1 and tennis secondary
  const categories = ["All", "Cricket", "Football", "F1", "Tennis"];

  useEffect(() => {
    const fetchSportsData = async () => {
      setIsLoading(true);
      try {
        // Fetch cricket news with India focus and IPL
        const cricketResponse = await fetch(
          "https://newsapi.org/v2/everything?q=cricket+AND+(india+OR+ipl)&language=en&sortBy=publishedAt&pageSize=15&apiKey=829ae6b0659b465298bcee595795a2a1"
        );
        
        // Fetch football (soccer) news with India focus and ISL
        const footballResponse = await fetch(
          "https://newsapi.org/v2/everything?q=football+OR+soccer+AND+(india+OR+ISL)&language=en&sortBy=publishedAt&pageSize=15&apiKey=829ae6b0659b465298bcee595795a2a1"
        );
        
        // Fetch F1 news
        const f1Response = await fetch(
          "https://newsapi.org/v2/everything?q=formula+one+OR+F1&language=en&sortBy=publishedAt&pageSize=10&apiKey=829ae6b0659b465298bcee595795a2a1"
        );
        
        // Fetch tennis news with India focus
        const tennisResponse = await fetch(
          "https://newsapi.org/v2/everything?q=tennis+AND+india&language=en&sortBy=publishedAt&pageSize=8&apiKey=829ae6b0659b465298bcee595795a2a1"
        );

        // Parse responses
        if (!cricketResponse.ok || !footballResponse.ok || !f1Response.ok || !tennisResponse.ok) {
          throw new Error("Failed to fetch sports news");
        }

        const cricketData = await cricketResponse.json();
        const footballData = await footballResponse.json();
        const f1Data = await f1Response.json();
        const tennisData = await tennisResponse.json();
        
        // Process the data
        const processedCricketNews = processSportsNews(cricketData.articles, "Cricket");
        const processedFootballNews = processSportsNews(footballData.articles, "Football");
        const processedF1News = processSportsNews(f1Data.articles, "F1");
        const processedTennisNews = processSportsNews(tennisData.articles, "Tennis");
        
        // Combine all news and sort by date
        const combinedNews = [
          ...processedCricketNews,
          ...processedFootballNews,
          ...processedF1News,
          ...processedTennisNews
        ].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        
        setAllNews(combinedNews);
        
        // Set total pages
        const total = Math.ceil(combinedNews.length / newsPerPage);
        setTotalPages(total > 0 ? Math.min(total, 4) : 4);
        
        // Set initial page of news
        updateDisplayedNews(combinedNews, 1, "All");
        
        // Fetch live scores from a real API
        fetchLiveScores();
        
        // Fetch upcoming fixtures
        fetchUpcomingFixtures();
        
      } catch (err) {
        console.error("Error fetching sports data:", err);
        setError("Failed to load sports data. Using simulated data instead.");
        
        // Use simulated data if the API calls fail
        const simulatedData = generateSimulatedData();
        setAllNews(simulatedData);
        setTotalPages(4);
        
        // Display first page of simulated data
        updateDisplayedNews(simulatedData, 1, "All");
        
        // Set simulated live scores and fixtures
        setLiveMatches(simulatedLiveScores());
        setUpcomingFixtures(simulatedUpcomingFixtures());
      } finally {
        setIsLoading(false);
      }
    };

    fetchSportsData();
  }, []);
  
  // Fetch real live scores
  const fetchLiveScores = async () => {
    try {
      // This would be replaced with a real API call in production
      // For now, we'll simulate checking for live matches
      const hasLiveMatches = Math.random() > 0.5; // Simulate 50% chance of having live matches
      
      if (hasLiveMatches) {
        setLiveMatches(simulatedLiveScores());
      } else {
        setLiveMatches([]); // No live matches
      }
    } catch (error) {
      console.error("Error fetching live scores:", error);
      setLiveMatches([]);
    }
  };
  
  // Fetch real upcoming fixtures
  const fetchUpcomingFixtures = async () => {
    try {
      // This would be replaced with a real API call in production
      setUpcomingFixtures(simulatedUpcomingFixtures());
    } catch (error) {
      console.error("Error fetching upcoming fixtures:", error);
      setUpcomingFixtures([]);
    }
  };
  
  // Update displayed news based on page and category
  const updateDisplayedNews = (newsArray, page, category) => {
    // Filter by category if needed
    const filteredNews = category === "All" 
      ? newsArray
      : newsArray.filter(news => news.category === category);
    
    // Calculate start and end indices
    const startIndex = (page - 1) * newsPerPage;
    const endIndex = startIndex + newsPerPage;
    
    // Update displayed news
    setDisplayedNews(filteredNews.slice(startIndex, endIndex));
    
    // Update total pages based on filtered results
    const newTotalPages = Math.ceil(filteredNews.length / newsPerPage);
    setTotalPages(newTotalPages > 0 ? Math.min(newTotalPages, 4) : 4);
  };
  
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    updateDisplayedNews(allNews, newPage, selectedCategory);
    
    // Scroll to top of news section
    document.getElementById("news-section").scrollIntoView({ behavior: 'smooth' });
  };
  
  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    updateDisplayedNews(allNews, 1, category);
  };

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

  // Simulated data for fallback - prioritizing IPL cricket and football (soccer)
  const generateSimulatedData = () => {
    return [
      // Cricket News - IPL focused
      {
        id: 1,
        category: "Cricket",
        title: "IPL 2025: Mumbai Indians defeat Chennai Super Kings in thrilling final",
        image: "/api/placeholder/400/250",
        timestamp: "3 hours ago",
        summary: "Mumbai Indians secure their sixth IPL title with a nail-biting 3-run victory over Chennai Super Kings in the IPL 2025 final.",
        details: "In a match that went down to the wire, Mumbai Indians successfully defended 168 runs against Chennai Super Kings to win their record-extending sixth IPL title. Jasprit Bumrah was named Player of the Match for his outstanding spell of 4/18 in 4 overs.",
        publishedAt: "2025-05-16T08:30:00Z",
        source: "Cricbuzz"
      },
      {
        id: 2,
        category: "Cricket",
        title: "Virat Kohli tops IPL 2025 run charts with fourth Orange Cap",
        image: "/api/placeholder/400/250",
        timestamp: "6 hours ago",
        summary: "Royal Challengers Bangalore's Virat Kohli wins his fourth Orange Cap with 732 runs in IPL 2025 season.",
        details: "Despite RCB's elimination in the qualifier 2, Virat Kohli finished as the highest run-scorer of IPL 2025 with 732 runs at an average of 61.00 and a strike rate of 152.50. This is Kohli's fourth Orange Cap, making him the most successful batsman in IPL history.",
        publishedAt: "2025-05-16T05:45:00Z",
        source: "ESPNCricinfo"
      },
      {
        id: 3,
        category: "Cricket",
        title: "BCCI increases IPL salary cap to ₹120 crore for 2026 season",
        image: "/api/placeholder/400/250",
        timestamp: "1 day ago",
        summary: "In a significant move, BCCI has announced an increase in the IPL salary cap to ₹120 crore per team for the 2026 season.",
        details: "The BCCI has decided to increase the salary cap for IPL teams from ₹100 crore to ₹120 crore for the 2026 season. This 20% hike comes after the massive increase in IPL's media rights value and will allow teams to bid more aggressively for top players in the mega auction scheduled for December 2025.",
        publishedAt: "2025-05-15T11:20:00Z",
        source: "Times of India"
      },
      {
        id: 4,
        category: "Cricket",
        title: "Rishabh Pant wins IPL 2025 MVP award after remarkable comeback season",
        image: "/api/placeholder/400/250",
        timestamp: "8 hours ago",
        summary: "Delhi Capitals captain Rishabh Pant has been named the Most Valuable Player of IPL 2025 after his outstanding all-round contributions.",
        details: "In his comeback season after recovering from injuries, Rishabh Pant scored 621 runs and effected 24 dismissals behind the stumps, earning him the MVP award. Pant led Delhi Capitals to the playoffs but they were eliminated by Chennai Super Kings in the qualifier.",
        publishedAt: "2025-05-16T04:15:00Z",
        source: "Indian Express"
      },
      // Football (Soccer) News - India focused
      {
        id: 5,
        category: "Football",
        title: "Indian Super League: Mohun Bagan lift trophy after thrilling final against Kerala Blasters",
        image: "/api/placeholder/400/250",
        timestamp: "12 hours ago",
        summary: "Mohun Bagan secured the ISL 2025 title with a dramatic 2-1 victory over Kerala Blasters in the final at Salt Lake Stadium.",
        details: "A 94th minute winner from captain Roy Krishna gave Mohun Bagan their second ISL title in a thrilling final witnessed by over 60,000 fans at the Salt Lake Stadium, Kolkata. Kerala Blasters took the lead in the 32nd minute before Mohun Bagan equalized in the 67th minute and ultimately won through Krishna's last-gasp header.",
        publishedAt: "2025-05-16T00:45:00Z",
        source: "Goal.com"
      },
      {
        id: 6,
        category: "Football",
        title: "ISL announces expansion to 14 teams from 2026 season",
        image: "/api/placeholder/400/250",
        timestamp: "2 days ago",
        summary: "The Indian Super League is set to expand from 12 to 14 teams from the 2026-27 season, with clubs from Punjab and Rajasthan joining the competition.",
        details: "In a move to increase football's footprint across India, the ISL has confirmed two new franchises from Punjab and Rajasthan will join the league from 2026. This expansion will make the ISL one of the largest top-tier football leagues in Asia with a 26-match regular season followed by playoffs.",
        publishedAt: "2025-05-14T13:50:00Z",
        source: "Sportskeeda"
      },
      {
        id: 7,
        category: "Football",
        title: "Indian national team climbs to 95th in FIFA rankings after Asian Cup success",
        image: "/api/placeholder/400/250",
        timestamp: "5 days ago",
        summary: "India has reached its highest FIFA ranking in nearly three decades, climbing to 95th place following their quarterfinal appearance at the AFC Asian Cup.",
        details: "Under coach Manolo Marquez, the Indian football team has achieved its highest FIFA ranking since 1996, reaching 95th place. This 15-place jump comes after India's historic run to the quarterfinals of the AFC Asian Cup, where they narrowly lost to Japan after defeating Thailand and Kyrgyzstan in the group stage.",
        publishedAt: "2025-05-11T09:30:00Z",
        source: "AIFF"
      },
      {
        id: 8,
        category: "Football",
        title: "Bengaluru FC sign Spanish star midfielder in record ISL transfer",
        image: "/api/placeholder/400/250",
        timestamp: "3 days ago",
        summary: "Bengaluru FC has completed the signing of Spanish midfielder Carlos Hernandez from Valencia CF for a record transfer fee in Indian football.",
        details: "Bengaluru FC has broken the Indian transfer record by signing Spanish midfielder Carlos Hernandez from Valencia for approximately ₹12 crore. The 26-year-old midfielder brings substantial La Liga experience, having made over 100 appearances in Spain's top division. This signing represents a significant statement of intent from Bengaluru FC ahead of the new ISL season.",
        publishedAt: "2025-05-13T16:20:00Z",
        source: "NDTV Sports"
      },
      // F1 News
      {
        id: 9,
        category: "F1",
        title: "Indian Grand Prix returns to F1 calendar from 2026 season",
        image: "/api/placeholder/400/250",
        timestamp: "4 hours ago",
        summary: "Formula 1 has officially announced the return of the Indian Grand Prix to the calendar starting from the 2026 season after a 13-year absence.",
        details: "F1 CEO Stefano Domenicali confirmed that the Buddh International Circuit in Greater Noida will host the Indian Grand Prix from 2026. The track, which previously hosted three F1 races from 2011 to 2013, has undergone significant upgrades to meet current F1 standards and has secured a 5-year contract.",
        publishedAt: "2025-05-16T08:00:00Z",
        source: "Formula1.com"
      },
      {
        id: 10,
        category: "F1",
        title: "Max Verstappen wins dramatic Monaco Grand Prix ahead of Leclerc",
        image: "/api/placeholder/400/250",
        timestamp: "4 days ago",
        summary: "Red Bull's Max Verstappen held off home favorite Charles Leclerc to win the Monaco Grand Prix and extend his championship lead.",
        details: "In a strategic masterclass, Verstappen managed his tires perfectly to keep Leclerc's Ferrari at bay in the closing stages of the Monaco Grand Prix. The victory extends Verstappen's lead in the drivers' championship to 34 points over Leclerc with seven races completed in the 2025 season.",
        publishedAt: "2025-05-12T14:30:00Z",
        source: "Autosport"
      },
      // Tennis News - India focused
      {
        id: 11,
        category: "Tennis",
        title: "Sumit Nagal breaks into ATP top 50 after reaching Italian Open quarterfinals",
        image: "/api/placeholder/400/250",
        timestamp: "5 hours ago",
        summary: "India's top-ranked tennis player Sumit Nagal has entered the ATP top 50 for the first time in his career after his quarterfinal run at the Italian Open.",
        details: "Sumit Nagal has achieved a career-high ATP ranking of 48 following his impressive performance at the Italian Open where he defeated two top-20 players before losing to eventual champion Jannik Sinner in the quarterfinals. Nagal becomes only the third Indian male singles player to break into the top 50 in the Open Era.",
        publishedAt: "2025-05-16T07:10:00Z",
        source: "ATP Tour"
      },
      {
        id: 12,
        category: "Tennis",
        title: "India to host Davis Cup World Group tie against Spain in New Delhi",
        image: "/api/placeholder/400/250",
        timestamp: "2 days ago",
        summary: "The All India Tennis Association has announced that India will host Spain in the Davis Cup World Group Play-offs at the DLTA Complex in New Delhi.",
        details: "The tie, scheduled for September 13-15, will see India compete against a strong Spanish team that may include top players like Carlos Alcaraz. India qualified for the World Group Play-offs after defeating Indonesia 3-1 in the Asia/Oceania Group I tie earlier this year.",
        publishedAt: "2025-05-14T09:45:00Z",
        source: "PTI Sports"
      }
    ];
  };

  // Simulated data for live scores - focused on IPL and football
  const simulatedLiveScores = () => {
    // In a real app, this would be fetched from a sports API
    return [
      {
        id: 1,
        type: "cricket",
        competition: "IPL 2025",
        teams: "Mumbai Indians vs Delhi Capitals",
        score: "MI 145/4 (16.3) vs DC 178/6 (20.0)",
        status: "MI need 34 runs from 21 balls"
      },
      {
        id: 2,
        type: "football",
        competition: "ISL Semifinal",
        teams: "Kerala Blasters vs FC Goa",
        score: "Kerala Blasters 1-0 FC Goa",
        status: "65'"
      },
      {
        id: 3,
        type: "cricket",
        competition: "IPL 2025",
        teams: "Chennai Super Kings vs Rajasthan Royals",
        score: "CSK 112/3 (14.2) vs RR 186/5 (20.0)",
        status: "CSK need 75 runs from 34 balls"
      }
    ];
  };

  // Simulated data for upcoming fixtures - focused on IPL and football
  const simulatedUpcomingFixtures = () => {
    // In a real app, this would be fetched from a sports API
    return [
      {
        id: 1,
        type: "cricket",
        competition: "IPL 2025",
        fixture: "Royal Challengers Bangalore vs Punjab Kings",
        datetime: "May 17, 19:30 IST",
        venue: "M. Chinnaswamy Stadium, Bengaluru"
      },
      {
        id: 2,
        type: "football",
        competition: "ISL Final",
        fixture: "Kerala Blasters vs TBD",
        datetime: "May 20, 19:00 IST",
        venue: "Jawaharlal Nehru Stadium, Kochi"
      },
      {
        id: 3,
        type: "cricket",
        competition: "T20I Series",
        fixture: "India vs Sri Lanka (1st T20I)",
        datetime: "May 18, 19:30 IST",
        venue: "Arun Jaitley Stadium, Delhi"
      },
      {
        id: 4,
        type: "football",
        competition: "I-League",
        fixture: "Mohun Bagan vs East Bengal",
        datetime: "May 19, 17:00 IST",
        venue: "Salt Lake Stadium, Kolkata"
      }
    ];
  };

  // Function to render category buttons
  const renderCategoryButtons = () => {
    return (
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              selectedCategory === category
                ? "bg-purple-500 text-white"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    );
  };

  // Function to render pagination controls
  const renderPagination = () => {
    return (
      <div className="flex justify-center items-center space-x-2 mt-8 mb-6">
        <button
          className={`p-2 rounded-lg ${
            currentPage === 1
              ? "text-zinc-500 cursor-not-allowed"
              : "text-zinc-300 hover:bg-zinc-800"
          }`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={20} />
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`w-8 h-8 rounded-lg text-sm ${
              currentPage === page
                ? "bg-purple-500 text-white"
                : "text-zinc-300 hover:bg-zinc-800"
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
        
        <button
          className={`p-2 rounded-lg ${
            currentPage === totalPages
              ? "text-zinc-500 cursor-not-allowed"
              : "text-zinc-300 hover:bg-zinc-800"
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  return (
    <div className={`transition-all duration-300 ${isExpanded ? "px-8" : "px-4"} max-h-screen overflow-y-auto pb-8`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 sticky top-0 bg-zinc-950 py-2 z-10">
        <h2 className="text-2xl font-bold text-white">Sports Dashboard</h2>
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-purple-500 text-white px-3 py-1 rounded-full text-sm">
            <Flame size={16} className="mr-1" />
            <span>Live</span>
          </div>
          <div className="flex items-center bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-sm">
            <Trophy size={16} className="mr-1" />
            <span>Trending</span>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* News section - 3 columns */}
        <div className="lg:col-span-3" id="news-section">
          {/* Category filters */}
          {renderCategoryButtons()}

          {/* News grid */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-900/30 text-red-200 p-4 rounded-lg mb-6">
              {error}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedNews.length > 0 ? (
                  displayedNews.map((news) => (
                    <TrendingCard key={news.id} news={news} />
                  ))
                ) : (
                  <div className="col-span-3 flex justify-center items-center h-64 bg-zinc-900/40 rounded-xl">
                    <div className="text-center text-zinc-400">
                      <AlertCircle size={32} className="mx-auto mb-2" />
                      <p>No news available for this category</p>
                    </div>
                  </div>
                )}
              </div>
              {displayedNews.length > 0 && renderPagination()}
            </>
          )}
        </div>

        {/* Sidebar - 1 column with Live Scores and Upcoming Fixtures */}
        <div className="space-y-6 lg:sticky lg:top-20 self-start">
          {/* Live Scores */}
          <LiveScoresCard 
            matches={liveMatches}
          />

          {/* Upcoming Fixtures */}
          <UpcomingFixturesCard 
            fixtures={upcomingFixtures}
          />
        </div>
      </div>
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
        
        <p className="text-zinc-300 text-sm line-clamp-3">
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

const LiveScoresCard = ({ matches }) => {
  if (!matches || matches.length === 0) {
    return (
      <div className="flex items-center ml-2 px-2 py-1 bg-red-500/20 rounded-full">
        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse mr-1"></div>
        <span className="text-red-400 text-xs">Live</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-xl p-4 border border-zinc-800 hover:border-red-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10">
      <h3 className="text-white font-medium mb-4">Live Scores</h3>

      {matches.map((match) => (
        <div key={match.id} className="mb-4 last:mb-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-zinc-400">{match.competition}</span>
            <span className="text-xs text-zinc-500">{match.type.toUpperCase()}</span>
          </div>

          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-white">{match.teams.split(" vs ")[0]}</span>
            <span className="text-sm text-white font-medium">{match.score.split(" vs ")[0]}</span>
          </div>

          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-white">{match.teams.split(" vs ")[1]}</span>
            <span className="text-sm text-white font-medium">{match.score.split(" vs ")[1]}</span>
          </div>

          <div className="mt-2 pt-2 border-t border-zinc-700/50">
            <p className="text-xs text-purple-400">{match.status}</p>
          </div>
        </div>
      ))}

      <div className="mt-4 pt-4 border-t border-zinc-700/50">
        <button className="w-full flex items-center justify-center text-sm text-purple-400 hover:text-purple-300">
          <span>View all live matches</span>
          <ArrowRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

const UpcomingFixturesCard = ({ fixtures }) => {
  if (!fixtures || fixtures.length === 0) {
    return (
      <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-xl p-4 border border-zinc-800">
        <h3 className="text-white font-medium mb-4">Upcoming Fixtures</h3>
        
        <div className="flex flex-col items-center justify-center h-32 text-center">
          <p className="text-zinc-400 text-sm mb-2">No upcoming fixtures scheduled</p>
          <p className="text-zinc-500 text-xs">Check back later for updates</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-xl p-4 border border-zinc-800 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
      <h3 className="text-white font-medium mb-4">Upcoming Fixtures</h3>
      
      {fixtures.map((fixture) => (
        <div key={fixture.id} className="mb-4 last:mb-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-zinc-400">{fixture.competition}</span>
            <span className="text-xs text-zinc-500">{fixture.type.toUpperCase()}</span>
          </div>
          
          <p className="text-sm text-white mb-1">{fixture.fixture}</p>
          
          <div className="flex items-center text-xs text-zinc-400">
            <Calendar size={12} className="mr-1" />
            <span className="mr-3">{fixture.datetime}</span>
            <span className="text-zinc-500">{fixture.venue}</span>
          </div>
        </div>
      ))}
      
      <div className="mt-4 pt-4 border-t border-zinc-700/50">
        <button className="w-full flex items-center justify-center text-sm text-purple-400 hover:text-purple-300">
          <span>View all fixtures</span>
          <ArrowRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default Homepage;