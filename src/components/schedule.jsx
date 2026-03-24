import { CalendarCheck, ChevronLeft, ChevronRight, Repeat, TvMinimalPlay } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchGames } from "../services/api";
import { useNavigate } from "react-router-dom";

/* ===================== */
/* Countdown Hook */
/* ===================== */
function useCountdown(targetMs) {
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(0, targetMs - Date.now())
  );

  useEffect(() => {
    const tick = () => setTimeLeft(Math.max(0, targetMs - Date.now()));
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  const totalSeconds = Math.floor(timeLeft / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return { h, m, s };
}

function CountdownDisplay({ targetMs }) {
  const { h, m, s } = useCountdown(targetMs);
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="flex items-baseline gap-1 font-mongoose">
      <span className="text-red-500 text-7xl font-black leading-none">{h}h</span>
      <span className="text-red-400 text-5xl font-bold leading-none">{pad(m)}m</span>
      <span className="text-red-400 text-3xl font-bold leading-none">{pad(s)}s</span>
    </div>
  );
}

function GameCard({ game }) {
  const navigate = useNavigate();

  const gameDate = new Date(game.date);
  const day = gameDate.toLocaleString("default", { weekday: "short" });
  const formattedDate = gameDate.toLocaleDateString();
  const time = gameDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const countdownTarget = gameDate.getTime();

  const isFinal = game.type === "FINAL";
  const isUpcoming = game.type === "UPCOMING";
  const won = game.result === "W";


  const hoursRemaining = (countdownTarget - Date.now()) / (1000 * 60 * 60);
  const showTimer = hoursRemaining <= 24;

  return (
    <div className="flex-shrink-0  min-w-[150px]  rounded-lg overflow-hidden border border-gray-200 border-3 flex flex-col">
      <div className="px-3 py-1 text-center font-roboto border-gray-200">
        <p className="text-gray-400 text-xl align-center tracking-widest w-xs uppercase">
          {day} {formattedDate} · {time} at {game.venue}, {game.city}
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-2 px-3">
        {isFinal && (
          <>
            <p className="text-gray-500 text-2xl font-black tracking-widest uppercase mb-1">
              Final Score
            </p>
            <div className="flex items-center font-mongoose gap-2">
              <span
                className={`text-5xl font-black font-industry leading-none ${won ? "text-orange-600" : "text-red-600"
                  }`}
              >
                {game.homeScore}
              </span>
              <span className="text-gray-400 text-4xl font-black leading-none">-</span>
              <span className="text-5xl font-black text-black font-industry leading-none">
                {game.awayScore}
              </span>
              <span className="text-black font-black text-2xl uppercase tracking-wider px-2">
                vs.
              </span>
              <img src={game.logo} alt={game.opponent} className="h-40 w-40 object-contain" />
            </div>
          </>
        )}

        {isUpcoming && (
          <>
            <p className="text-gray-500 text-2xl font-black tracking-widest uppercase mb-1">
              Next Game In
            </p>

            <div className="flex items-center gap-2 font-mongoose">
              {showTimer ? (
                <CountdownDisplay targetMs={countdownTarget} />
              ) : (
                <div className="  text-[60px] font-barlow flex flex-row items-center justify-center gap-1">
                  <span className=" font-black text-black  leading-none">
                    {gameDate.getDate()}
                  </span>
                  <span className=" font-black   tracking-tight">
                    {gameDate
                      .toLocaleString("default", { month: "short" })
                      .toUpperCase()}
                  </span>
                </div>
              )}

              <span className="text-black text-4xl px-2 font-black uppercase tracking-wider">
                vs.
              </span>

              <img src={game.logo} alt={game.opponent} className="h-40 w-40 object-contain" />
            </div>
          </>
        )}
      </div>

      <div className="border-t border-gray-200">
        {isFinal && (
          <button onClick={() => navigate(`/game-tracker/${game.id}`)} className="w-full flex items-center justify-center gap-2 py-2 font-zentry text-2xl tracking-widest uppercase text-orange-600 hover:text-white hover:bg-gray-800 transition-colors">
            <Repeat />
            Game Recap
          </button>
        )}

        {isUpcoming && (
          <div className="flex">
            <button className="flex-1 flex items-center font-zentry text-2xl justify-center gap-1.5 py-2 bg-green-700 hover:bg-green-600 transition-colors tracking-widest uppercase text-white">
              <CalendarCheck />
              SCHEDULE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===================== */
/* Schedule */
/* ===================== */
export default function Schedule() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const response = await fetchGames();
        if (response && response.status === 'success') {
          // Map backend SQL rows to UI format
          const mappedGames = response.data.map(g => {
            const isHome = g.our_team === 'HOME' || g.home_team_name?.toLowerCase().includes('urbanville');
            return {
              id: g.id,
              date: g.game_date,
              venue: g.venue,
              city: g.city,
              opponent: isHome ? g.away_team_name : g.home_team_name,
              logo: isHome ? g.away_team_logo : g.home_team_logo,
              status: isHome ? "HOME" : "AWAY",
              type: g.status, // UPCOMING or FINAL
              result: g.status === 'FINAL' ? (
                isHome ? (g.home_score > g.away_score ? 'W' : 'L') : (g.away_score > g.home_score ? 'W' : 'L')
              ) : null,
              homeScore: g.home_score,
              awayScore: g.away_score
            };
          });
          setGames(mappedGames);
        }
      } catch (error) {
        console.error("Error loading games:", error);
      } finally {
        setLoading(false);
      }
    };
    loadGames();
  }, []);

  const sortedGames = [...games].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  if (loading) return <div className="py-20 text-center font-mongoose text-4xl">Loading Schedule...</div>;
  if (sortedGames.length === 0) return null;

  const activeMonth = sortedGames[currentIndex]
    ? new Date(sortedGames[currentIndex].date).toLocaleString("default", { month: "short" }).toUpperCase()
    : "";

  const months = [
    ...new Set(
      sortedGames.map((g) =>
        new Date(g.date)
          .toLocaleString("default", { month: "short" })
          .toUpperCase()
      )
    )
  ];

  const goNext = () => {
    if (currentIndex < sortedGames.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < sortedGames.length - 1;

  return (
    <div className="bg-white p-4 py-8 w-full max-w-full overflow-hidden font-mongoose">
      <div className="text-center  py-4">
        <h1 className="font-zentry text-4xl md:text-6xl"> OUR SCHEDULE</h1>
      </div>

      <div className="overflow-hidden w-full">
        <div
          className="flex gap-2 mb-4 bg-white transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 360}px)`
          }}
        >
          {sortedGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-1 mt-2">
        <button
          onClick={goPrev}
          disabled={!canGoPrev}
          className={`animate-bounce px-1 text-2xl transition-colors ${canGoPrev
            ? "text-gray-600 hover:text-orange-600 cursor-pointer"
            : "text-gray-300 cursor-default"
            }`}
        >
          <ChevronLeft />
        </button>

        {months.map((m) => {
          const isActive = m === activeMonth;

          return (
            <button
              key={m}
              onClick={() => {
                const firstIndex = sortedGames.findIndex(
                  (g) =>
                    new Date(g.date)
                      .toLocaleString("default", { month: "short" })
                      .toUpperCase() === m
                );
                if (firstIndex !== -1) {
                  setCurrentIndex(firstIndex);
                }
              }}
              className={`px-2 py-1 text-sm md:text-xl font-industry tracking-widest uppercase transition-colors ${isActive
                ? "text-blue-800 font-bold"
                : "text-gray-600 hover:text-orange-600 hover:cursor-pointer"
                }`}
            >
              {m}
            </button>
          );
        })}

        <button
          onClick={goNext}
          disabled={!canGoNext}
          className={`animate-bounce px-1 text-2xl transition-colors ${canGoNext
            ? "text-gray-600 hover:text-orange-600 cursor-pointer"
            : "text-gray-300 cursor-default"
            }`}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}