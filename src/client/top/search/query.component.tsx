import { useSearchInputStore } from "@/client/top/search-input.store"
import { ChangeEvent, useCallback } from "react"
import { css } from "@emotion/react"
import { CircularProgress, Theme } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import { useIsFetching } from "@tanstack/react-query"

export function SearchQuery({ className }: { className?: string }) {
  const [query, setQuery] = useSearchInputStore((state) => [state.query, state.setQuery])
  const isFetching = useIsFetching()

  const updateQuery = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value)
    },
    [setQuery]
  )

  return (
    <div css={searchQueryStyles} className={className}>
      <input className="SearchQuery-Input" type="text" placeholder="Search" value={query} onChange={updateQuery} />
      {isFetching ? (
        <CircularProgress size={20} className="SearchQuery-Icon" />
      ) : (
        <SearchIcon className="SearchQuery-Icon" />
      )}
    </div>
  )
}

function searchQueryStyles(theme: Theme) {
  return css`
    display: flex;
    width: 80%;
    justify-content: center;
    align-items: center;
    border: 1px solid ${theme.palette.border.paper};
    border-radius: 3px;

    @media (min-width: 768px) {
      width: 400px;
    }

    & .SearchQuery-Input {
      flex: 1;
      background-color: transparent;
      padding: 10px 20px;
      border: none;
      color: white;
      font-size: 1.1rem;
      outline: none;
      min-width: 0;

      &::placeholder {
        color: #bdbdbd;
        text-align: center;
      }
    }

    & .SearchQuery-Icon {
      font-size: 1.6rem;
      margin-right: 10px;
    }
  `
}
