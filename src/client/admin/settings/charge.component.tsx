import { css } from "@emotion/react"
import { Button, TextField, Theme } from "@mui/material"
import { ChangeEvent, useCallback, useState } from "react"
import { useChargeSearch } from "@/client/admin/settings/charge-search.hook"
import { ChargeEditDialog } from "@/client/admin/settings/dialog/charge.component"
import { ProductType } from "@/common/db.type"

export function SettingsCharge({ className, productTypes }: { className?: string; productTypes: ProductType[] }) {
  const { chargeId, setChargeId, search, result } = useChargeSearch()
  const changeChargeId = useCallback((event: ChangeEvent<HTMLInputElement>) => setChargeId(event.target.value), [])

  const [searched, setSearched] = useState(false)
  const [open, setOpen] = useState(false)
  const onClose = useCallback(() => setOpen(false), [])

  const onClick = useCallback(() => {
    setSearched(true)
    setOpen(true)
    search()
  }, [search])

  return (
    <>
      {result.charge && (
        <ChargeEditDialog
          open={open}
          onClose={onClose}
          charge={result.charge}
          product={result.product}
          productTypes={productTypes}
        />
      )}
      <section className={className} css={settingsChargeStyles}>
        <h2 className="SettingsCharge-Title">Charge</h2>
        <div className="SettingsCharge-Search">
          <TextField
            className="SettingsCharge-Text"
            label="Charge ID"
            size="small"
            value={chargeId}
            onChange={changeChargeId}
          />
          <Button className="SettingsCharge-Button" onClick={onClick}>
            Search
          </Button>
        </div>
        {result.errored && <p className="SettingsCharge-Error">An error occurred while checking that charge ID</p>}
        {searched && !result.pending && !result.charge && !result.errored && (
          <p className="SettingsCharge-Error">The specified charge ID does not exist</p>
        )}
      </section>
    </>
  )
}

function settingsChargeStyles(theme: Theme) {
  return css`
    & .SettingsCharge-Title {
      margin: 8px 0;
    }

    & .SettingsCharge-Search {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    & .SettingsCharge-Text {
      flex: 1;
      margin-top: 4px;
    }

    & .SettingsCharge-Button {
      color: white;
      padding-left: 12px;
      padding-right: 12px;
      background-color: ${theme.palette.primary.dark};
    }

    & .SettingsCharge-Error {
      margin-top: 2px;
      color: ${theme.palette.error.main};
    }
  `
}
