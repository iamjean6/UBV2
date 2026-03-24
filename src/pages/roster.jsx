import PlayerCard from "../UI/playercard";
import { management, coaches } from "../../constants";
import { useEffect, useState } from "react";
import Coachescard from "../UI/coachescard";
import { fetchPlayers, fetchTeams, fetchPlayerAverages } from "../services/api";
import Managementcard from "../UI/managementcard";
import { RotateLoader } from "react-spinners";
const Roster = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teams, setTeams] = useState([]);
  const [teamFilter, setTeamFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('ubv')

  useEffect(() => {
    loadPlayers()
  }, [])

  const loadPlayers = async () => {
    try {
      setLoading(true)
      const [playersRes, teamsRes] = await Promise.all([
        fetchPlayers(),
        fetchTeams()
      ])
      if (playersRes.status === 'success') {
        const playersWithStats = await Promise.all(playersRes.data.map(async (player) => {
          try {
            const statsRes = await fetchPlayerAverages(player.id);
            // statsRes is an array of averages per league, we'll take the first one or a summary
            const stats = statsRes.data && statsRes.data.length > 0 ? statsRes.data[0] : {};
            return {
              ...player,
              team: player.team_name, // Map team_name to team for PlayerCard
              stats: {
                gp: stats.games_played || 0,
                ppg: stats.ppg || 0,
                apg: stats.apg || 0,
                rpg: stats.rpg || 0
              }
            };
          } catch (err) {
            console.error(`Error fetching stats for player ${player.id}:`, err);
            return { ...player, team: player.team_name, stats: {} };
          }
        }));
        setPlayers(playersWithStats)
      }
      if (teamsRes.status === 'success') {
        const allowedTeams = teamsRes.data.filter(t =>
          ['UBV', 'Tritons'].includes(t.name)
        )
        setTeams(allowedTeams)
      }
    } catch (err) {
      console.error('Error fetching players:', err)
      setError('Failed to load players.')
    } finally {
      setLoading(false)
    }
  }

  const filteredPlayers = players.filter(player => {
    const matchesTeam = teamFilter === 'All' || player.team_id === teamFilter;
    return matchesTeam;
  });
  if (loading && players.length === 0) return <div className="flex items-center justify-center h-screen"><RotateLoader /></div>;
  if (error) return <div className="flex items-center justify-center h-screen">Error: {error}</div>;
  return (
    <section className="w-full py-16 px-4">
      <div className="border-t  border-gray-200"></div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 py-6 border-v border-gray-200 gap-4">

        <div>
          <h1 className="text-3xl font-bold text-orange-600 tracking-tight">
            ROSTER
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => {
                setTeamFilter(team.id);
                setActiveTab(team.name.toLowerCase());
              }}
              className={`px-4 py-2 rounded-full hover:cursor-pointer transition-colors ${teamFilter === team.id
                ? "bg-blue-600 text-white"
                : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                }`}
            >
              {team.name}
            </button>
          ))}

          <div className="h-8 w-px bg-gray-300"></div>
          <button className="px-8 py-3 md:px-8 md:py-3 text-xs md:text-lg border-2 border-orange-600 text-orange-600 font-semibold rounded-full hover:bg-blue-600 hover:text-white hover:border-white hover:cursor-pointer transition-colors">
            TEAM PROFILE
          </button>
        </div>
      </div>
      <div className="border-t border-gray-200"></div>
      <div className="px-6 py-6">
        <h2 className="text-2xl uppercase font-semibold ">Players</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
        {filteredPlayers.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
      <div className="border-t  border-gray-200 "></div>
      <div>
        <h1 className="text-3xl py-4 font-bold text-orange-600 tracking-tight">
          Coaching Staff
        </h1>
      </div>
      <div className="border-t  border-gray-200 pb-16"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-4">
        {coaches.map((coach, index) => (
          <Managementcard key={index} coach={coach} />
        ))}
      </div>
      <div className="border-t  border-gray-200 "></div>
      <div>
        <h1 className="text-3xl py-4 font-bold text-orange-600 tracking-tight">
          MANAGEMENT
        </h1>
      </div>
      <div className="border-t  border-gray-200 pb-16"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-4">
        {management.map((staff, index) => (
          <Coachescard key={index} staff={staff} />
        ))}
      </div>

    </section>
  );
};

export default Roster;
