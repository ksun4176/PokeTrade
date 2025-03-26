import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import { GroupBy } from "./PokemonList";
import SortIcon from '@mui/icons-material/Sort';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

type GroupPokemonButtonProps = {
  initialValue: GroupBy;
  onGroupByChange?: (newGroupBy: GroupBy) => void;
}
export default function GroupPokemonButton(props: GroupPokemonButtonProps) {
  const { initialValue, onGroupByChange } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [groupBy, setGroupBy] = useState<GroupBy>(initialValue);
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuItemClick = (_event: React.MouseEvent<HTMLElement>, newGroupBy: GroupBy) => {
    setGroupBy(newGroupBy);
    setAnchorEl(null);
    if (onGroupByChange) onGroupByChange(newGroupBy);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return <>
    <IconButton
      size='small'
      id='grouppokemon-button'
      aria-controls={!!anchorEl ? 'grouppokemon-menu' : undefined}
      aria-haspopup="true"
      aria-expanded={!!anchorEl ? 'true' : undefined}
      onClick={handleOpen}
    >
      <SortIcon />
    </IconButton>
    <Menu
      id='grouppokemon-menu'
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'grouppokemon-button',
      }}
    >
      {Object.entries(GroupBy).filter(([key]) => isNaN(Number(key))).map(([key, value]) =>
        <MenuItem
          key={value}
          disabled={value === groupBy}
          selected={value === groupBy}
          onClick={(event) => handleMenuItemClick(event, value as GroupBy)}
        >
          {key}
        </MenuItem>
      )}
    </Menu>
  </>
}