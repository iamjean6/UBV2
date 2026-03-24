import { ExternalLink, ShoppingCart, Volume, Volume2, VolumeIcon } from 'lucide-react';
import { useState } from 'react';
import { POSITION_MAP } from '../../constants/index'

const PlayerCard = ({ player }) => {
  const handlePlayAudio = () => {
    const audio = new Audio(player.audio_url);
    audio.play();
  };

  const formatPosition = (pos) => {
    if (!pos) return '-';
    const upperPos = pos.toString().toUpperCase();

    // Check direct mapping first (e.g. PG, SF, POINT GUARD)
    if (POSITION_MAP[upperPos]) {
      return POSITION_MAP[upperPos];
    }

    // Special case for combined abbreviations like PGSG if NOT in map
    // The POSITION_MAP I added doesn't have PGSG, but let's see.
    // I'll add common combinations to the map in index.js too just in case.

    // Split by common delimiters
    const parts = pos.toString().split(/[\/\s,]+/).filter(Boolean);
    if (parts.length > 1) {
      return parts
        .map(p => POSITION_MAP[p.toUpperCase()] || p)
        .join(' / ');
    }

    return pos;
  };

  return (
    <div className='w-full bg-white font-industry rounded-xl shadow-md overflow-hidden border border-gray-200'>
      <div className='flex justify-between items-start font-medium px-4 py-4'>
        <div className='leading-tight'>
          <p className='text-xl font-extrabold '>{player.first_name}</p>
          <p className='text-3xl  font-bold ' >{player.last_name}</p>
        </div>
        <div>
          <span className='text-7xl font-extrabold text-orange-600 tracking-wider'>{player.jersey_number}</span>
        </div>
      </div>

      <div className="flex px-6 pt-4">

        <div className="w-1/2 text-sm">
          <p className="uppercase text-lg font-semibold text-gray-600 mb-4">
            {formatPosition(player.position)}
          </p>

          <div className="space-y-3">
            <div className="flex justify-between border-b border-gray-600 pb-1">
              <span className="font-semibold">HEIGHT</span>
              <span className='text-gray-600'>{player.height}</span>
            </div>

            <div className="flex justify-between border-b border-gray-600 pb-1">
              <span className="font-semibold">WEIGHT (KG)</span>
              <span className='text-gray-600'>{player.weight_kg}</span>
            </div>

            <div className="flex justify-between border-b border-gray-600 pb-1">
              <span className="font-semibold">AGE</span>
              <span className='text-gray-600'>{player.age}</span>
            </div>

            <div className="flex justify-between border-b border-gray-600 pb-1">
              <span className="font-semibold">NICKNAME</span>
              <span className='text-gray-600 uppercase'>{player.nickname}</span>
            </div>

            <div className="flex justify-between border-b  border-gray-600 pb-1">
              <span className="font-semibold">TEAM</span>
              <span className='text-gray-600 uppercase'>{player.team}</span>
            </div>
          </div>
        </div>


        <div className="w-1/2 flex justify-end items-end">
          <img
            src={player.image_url || '/img/picture.avif'}
            alt={player.first_name}
            className="h-64 object-contain"
          />
        </div>
      </div>


      <div className="bg-gray-200 grid grid-cols-5 text-center text-sm py-4">
        <div>
          <p className="text-xs text-gray-600">SEASON</p>
        </div>

        <div>
          <p className="font-semibold">GP</p>
          <p className="text-lg text-gray-600 font-bold">{player.stats?.gp || '-'}</p>
        </div>

        <div>
          <p className="font-semibold">PPG</p>
          <p className="text-lg text-gray-600 font-bold">{player.stats?.ppg || '-'}</p>
        </div>

        <div>
          <p className="font-semibold">APG</p>
          <p className="text-lg text-gray-600 font-bold">{player.stats?.apg || '-'}</p>
        </div>

        <div>
          <p className="font-semibold">RPG</p>
          <p className="text-lg text-gray-600 font-bold">{player.stats?.rpg || '-'}</p>
        </div>
      </div>
      <div className='flex justify-between items-center px-6 py-4 border-t border-gray-200 '>
        <div className='flex items-center gap-2 text-orange-600 hover:cursor-pointer'>
          <button className='text-sm hover:cursor-pointer font-medium hover:underline'>
            Bio
          </button>
          <ExternalLink className='text-sm ' />
        </div>
        <div className='flex items-center gap-2 text-orange-600 hover:cursor-pointer'>
          <button className='hover:cursor-pointer' onClick={handlePlayAudio}>
            <Volume2 className='text-sm ' />
          </button>

        </div>
        <div className='flex items-center gap-2 text-orange-600 hover:cursor-pointer'>
          <button className='text-sm font-medium hover:underline hover:cursor-pointer'>
            Shop
          </button>
          <ShoppingCart className='text-sm ' />
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
