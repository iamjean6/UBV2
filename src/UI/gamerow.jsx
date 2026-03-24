import { Repeat, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useMemo, useState } from "react";

const GamesRow = ({ games }) => {
  const [selectedMonth, setSelectedMonth] = useState(null);

  /* ===============================
     Filter By Month
  =============================== */
  const filteredGames = useMemo(() => {
    if (!selectedMonth) return games;

    return games.filter((game) => {
      const gameDate = new Date(game.dateItem);
      const month = gameDate.toLocaleString("default", { month: "short" }).toUpperCase();
      return month === selectedMonth;
    });
  }, [games, selectedMonth]);

  return (
    <div className="space-y-6">

      {/* Games (Scrollbar Removed) */}
      <div className="flex gap-6 flex-wrap pb-4">
        {filteredGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      {/* Month Navigation */}
      <MonthNavigation
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />

    </div>
  );
};

export default GamesRow;

/* ===============================
   Game Card
   =============================== */

const GameCard = ({ game }) => {
  const gameDate = new Date(game.dateItem);
  const now = new Date();
  const diffMs = gameDate - now;
  const diffHours = diffMs / (1000 * 60 * 60);

  const isUpcoming = diffMs > 0;
  const isWithin24Hours = diffHours <= 24 && diffHours > 0;

  /* ===============================
     Time Calculation
  =============================== */
  const calculatedTime = isWithin24Hours
    ? `${Math.floor(diffHours)}h ${Math.floor((diffHours % 1) * 60)}m`
    : gameDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }).toUpperCase();

  /* ===============================
     Score Result Highlight
  =============================== */
  const homeWon = game.homeScore > game.awayScore;
  const awayWon = game.awayScore > game.homeScore;

  return (
    <div className="min-w-[350px] bg-white rounded-lg shadow-sm border border-gray-200 border-3 flex flex-col justify-between">

      <GameMeta 
        dateText={calculatedTime}
        subtitle={game.subtitle}
      />

      <GameMain
        homeLogo={game.homeLogo}
        awayLogo={game.awayLogo}
        homeScore={game.homeScore}
        awayScore={game.awayScore}
        isUpcoming={isUpcoming}
        homeWon={homeWon}
        awayWon={awayWon}
      />

      <GameActions actions={game.actions} />

    </div>
  );
};

const GameMeta = ({ dateText, subtitle }) => {
  return (
    <div className="px-4 pt-4 text-xs text-gray-500 space-y-1">
      <p className="uppercase tracking-wide">{dateText}</p>
      {subtitle && (
        <p className="text-center font-medium text-gray-400">
          {subtitle}
        </p>
      )}
    </div>
  );
};

const GameMain = ({
  homeLogo,
  awayLogo,
  homeScore,
  awayScore,
  isUpcoming,
  homeWon,
  awayWon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">

      <div className="flex items-center gap-4">

        {/* Home Score */}
        {!isUpcoming && (
          <h2
            className={`text-5xl font-bold ${
              homeWon ? "text-orange-500" : "text-red-500"
            }`}
          >
            {homeScore}
          </h2>
        )}

        {/* VS */}
        {isUpcoming && (
          <h2 className="text-5xl font-bold text-gray-800">
            VS
          </h2>
        )}

        <span className="text-sm font-semibold text-gray-600">
          VS.
        </span>

        <img
          src={awayLogo}
          alt="Away Team"
          className="w-30 h-30 object-contain"
        />

        {/* Away Score */}
        {!isUpcoming && (
          <h2
            className={`text-5xl font-bold ${
              awayWon ? "text-orange-500" : "text-red-500"
            }`}
          >
            {awayScore}
          </h2>
        )}

      </div>
    </div>
  );
};

const GameActions = ({ actions }) => {
  return (
    <div className="flex items-center justify-center bg-gray-200 ">
      {actions.includes("recap") && (
        <button className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold hover:bg-gray-50 hover:text-orange-600 hover:cursor-pointer transition">
          <Repeat size={24} className="font-black text-blue-800" />
          <span className="font-black text-blue-800"> GAME RECAP</span>
        </button>
      )}

      {actions.includes("schedule") && (
        <button className="w-full py-3 text-sm font-semibold hover:bg-gray-50 transition">
          SCHEDULE
        </button>
      )}
    </div>
  );
};

/* ===============================
   Month Navigation
   =============================== */

const months = ["OCT", "NOV", "DEC", "JAN", "FEB", "MAR", "APR"];

const MonthNavigation = ({ selectedMonth, setSelectedMonth }) => {
  return (
    <div className="flex items-center justify-center gap-6 text-sm font-semibold text-gray-500">

      <button className="p-2 hover:text-black transition">
        <ChevronLeft size={18} />
      </button>

      <div className="flex items-center gap-5">
        {months.map((month) => (
          <button
            key={month}
            onClick={() => setSelectedMonth(month)}
            className={`hover:text-black transition ${
              selectedMonth === month ? "text-black underline" : ""
            }`}
          >
            {month}
          </button>
        ))}
      </div>

      <button className="p-2 hover:text-black transition">
        <ChevronRight size={18} />
      </button>

    </div>
  );
};