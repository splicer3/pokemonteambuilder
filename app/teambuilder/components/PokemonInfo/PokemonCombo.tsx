"use client"

import { usePokedex } from '@/context/PokedexContext';
import { usePokemonContext } from '@/context/PokemonContext';
import { getGeneration, typeColors } from '@/lib/utils';
import { Combobox } from '@headlessui/react';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MdCatchingPokemon } from "react-icons/md"
import GenerationSelector from '../GenerationSelector';

const PokemonCombo = () => {
    const P = usePokedex();
    const [pokemonList, setPokemonList] = useState(['']);
    const { selectedPokemon, setSelectedPokemon, pokemonData } = usePokemonContext();
    const [selectedGeneration, setSelectedGeneration] = useState(0);
    const [query, setQuery] = useState('');

    useEffect(() => {
        const fetchPokemonList = async () => {
          try {
            const list = (await P.getPokemonsList());
            const names = selectedGeneration === 0 ? list.results.map(item => item.name) : 
              list.results
              .filter((_, i) => getGeneration(i + 1) === selectedGeneration)
              .map(item => item.name);
            setPokemonList(names);
            setSelectedPokemon(names[0]);
          } catch (error) {
            console.error('Error fetching Pokémon list:', error);
          }
        };
        fetchPokemonList();
      }, [P, setSelectedPokemon, selectedGeneration]);
  
    const filteredPokemon =
    query === ''
      ? pokemonList
      : pokemonList.filter((pokemon) => 
            pokemon.toLowerCase().startsWith(query.toLowerCase())
        );

    const handleGenerationChange = useCallback((newGeneration: number) => {
      setSelectedGeneration(newGeneration);
    }, []);
    
        return (
          <div className='relative flex flex-col place-items-center px-10'>
          <Combobox value={selectedPokemon} onChange={setSelectedPokemon}>
            <div className="relative flex flex-col justify-center items-center py-2 text-left rounded-lg cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-orange-500 sm:text-sm">
              <Combobox.Input
                onChange={event => setQuery(event.target.value)}
                className={clsx(`w-full p-2 pl-4 pr-10 capitalize rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:border-transparent focus:shadow-lg`,
                  pokemonData?.types[0].type ? `focus:ring-[${typeColors[pokemonData.types[0].type.name]}]` : "focus:ring-teal-500"
                )}
              />
              <Combobox.Button className="absolute inset-y-0 right-1 flex items-center pr-2 cursor-pointer">
                <MdCatchingPokemon className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"/>
              </Combobox.Button>
            
            </div>
            <Combobox.Options
              className="absolute z-10 mt-1 w-[80%] capitalize bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
            >
              {filteredPokemon.map(pokemon => (
                <Combobox.Option
                  key={pokemon}
                  className={({ active }) =>
                    `${active ? 'text-gray-900 bg-gray-100 dark:text-gray-300 dark:bg-gray-900' : 'text-gray-900 dark:text-gray-400'}
                          cursor-default select-none relative py-2 text-center pr-4`
                  }
                  value={pokemon}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`${
                          selected ? 'font-medium' : 'font-normal'
                        } block truncate`}
                      >
                        {pokemon}
                      </span>
                      {selected ? (
                        <span
                          className={`${
                            active ? 'text-amber-600' : 'text-amber-600'
                          }
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                        >
                          {/* Add your selected icon here */}
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Combobox>
          <GenerationSelector onGenerationChange={handleGenerationChange} selectedGeneration={selectedGeneration}/>
          </div>
        );
      };

export default PokemonCombo;