import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCharsPaginated } from "./api/characters";
import { TbArrowsDownUp } from "react-icons/tb";

import "./App.css";

interface ICharacter {
  id: number;
  image: string;
  name: string;
  status: string;
  species: string;
  url: string;
}

interface IData {
  previousPage: string | null;
  nextPage: string | null;
  chars: ICharacter[];
}

function App() {
  const [page, setPage] = useState(1);
  const [name, setName] = useState("");
  const { isLoading, isError, data, isFetching } = useQuery({
    queryKey: ["posts", { page, name }],
    keepPreviousData: true,
    queryFn: () => getCharsPaginated(page, name),
  });

  const [input, setInput] = useState("");

  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedData, setSortedData] = useState(data);

  useEffect(() => {
    setSortedData(data);
  }, [data]);

  const handleSort = (column: string) => {
    const newSortOrder =
      sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(newSortOrder);

    const sortedChars = data?.chars.sort((a: ICharacter, b: ICharacter) => {
      if (sortOrder === "asc") {
        return a[sortColumn as keyof ICharacter] >
          b[sortColumn as keyof ICharacter]
          ? 1
          : -1;
      } else {
        return a[sortColumn as keyof ICharacter] <
          b[sortColumn as keyof ICharacter]
          ? 1
          : -1;
      }
    });
    setSortedData({ ...data, chars: sortedChars } as IData);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setName(input);
    setPage(1);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center h-screen max-h-[10vh]">
          <div className="search-bar">
            <form onSubmit={handleSubmit}>
              <label htmlFor="search-input">Search Name:</label>
              <input
                className="bg-white p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
                type="text"
                id="search-input"
                onChange={(e) => setInput(e.target.value)}
              ></input>
              <button
                disabled={isFetching}
                type="submit"
                className={
                  isFetching
                    ? "bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed ml-2"
                    : "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded ml-2"
                }
              >
                GO
              </button>
            </form>
          </div>
        </div>
        {isLoading ? (
          <h1>Loading...</h1>
        ) : isError ? (
          <h1>Character not found</h1>
        ) : (
          <table className="table-fixed border border-black">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2" onClick={() => handleSort("name")}>
                  <div className="flex flex-row justify-center items-center">
                    <h3>Name:</h3>
                    <TbArrowsDownUp />
                  </div>
                </th>
                <th className="py-2" onClick={() => handleSort("status")}>
                  <div className="flex flex-row justify-center items-center">
                    <h3>Status:</h3>
                    <TbArrowsDownUp />
                  </div>
                </th>
                <th className="py-2" onClick={() => handleSort("species")}>
                  <div className="flex flex-row justify-center items-center">
                    <h3>Species:</h3>
                    <TbArrowsDownUp />
                  </div>
                </th>
                <th className="py-2">
                  <div className="flex flex-row justify-center items-center">
                    <h3>URL:</h3>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData &&
                sortedData.chars.map((el: ICharacter) => (
                  <tr className="bg-white text-center" key={el.id}>
                    <td className="py-2">{el.name}</td>
                    <td className="py-2">{el.status}</td>
                    <td className="py-2">{el.species}</td>
                    <td className="py-2">
                      <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline" href={el.url}>{el.url}</a>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
        <div>
          {data && data.previousPage ? (
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded m-3" onClick={() => setPage((old) => Math.max(old - 1, 0))}>
              Previous Page
            </button>
          ) : null}
          {data && data.nextPage ? (
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded m-3" onClick={() => setPage((old) => old + 1)}>Next Page</button>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default App;
