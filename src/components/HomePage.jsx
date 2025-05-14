import { useState } from "react";
import { Flame, Trophy, User, ArrowRight, Calendar, Clock, Star } from "lucide-react";

const Homepage = ({ isExpanded }) => {
  // Sample data for sports news
  const trendingNews = [
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
  ];

  const playerNews = [
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
  ];

  return (
    <div className={`flex-1 bg-zinc-900 p-6 overflow-y-auto transition-all duration-300 ${isExpanded ? "ml-64" : "ml-20"}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Welcome to GamePulse</h1>
        <p className="text-zinc-400 mt-1">Stay updated with the latest sports news and highlights</p>
      </div>

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
            updates={[
              "ICC announces new T20 tournament format starting 2026",
              "England announces squad for upcoming test series against South Africa",
              "BCCI implements new fitness standards for national team selection"
            ]}
          />
          <SportsUpdateCard 
            title="Football"
            updates={[
              "Champions League to expand to 36 teams from next season",
              "FIFA announces host cities for 2026 World Cup",
              "Premier League introduces semi-automated offside technology"
            ]}
          />
          <SportsUpdateCard 
            title="Basketball"
            updates={[
              "NBA approves in-season tournament starting next season",
              "G-League expansion adds three new teams for upcoming season",
              "FIBA World Cup qualifiers schedule announced for 2025"
            ]}
          />
          <SportsUpdateCard 
            title="Upcoming Fixtures"
            updates={[
              "IPL 2025: Mumbai Indians vs Chennai Super Kings - May 16",
              "Premier League: Liverpool vs Manchester United - May 18",
              "NBA Playoffs: Celtics vs 76ers - May 15"
            ]}
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
          <li key={index} className="flex items-center">
            <div className="h-1.5 w-1.5 rounded-full bg-purple-400 mr-2"></div>
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