import { JSX, memo } from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import { Pokemon } from "../utils/types";
import Badge from "@mui/material/Badge";
import { getPokemonFullName } from "../utils/utils";

interface ICardProps {
  /**
   * Pokemon toshow
   */
  pokemon: Pokemon;
  /**
   * Height of card. We use this to calculate width to keep proportion
   */
  height: number;
  /**
   * Action to take when card is clicked
   */
  onClick?: () => void;
  /**
   * Whether the action is disabled
   */
  disabled?: boolean;
  /**
   * Whether we should show a dark overlay over the card
   */
  showOverlay?: boolean;
  /**
   * An icon to show in overlay
   */
  overlayIcon?: JSX.Element,
  /**
   * Content to show in a badge. The badge won't show if there is no content
   */
  badgeContent?: string|number
}
export const PokemonCard = memo((props: ICardProps) => {
  const { pokemon, height, onClick,  disabled, showOverlay, overlayIcon, badgeContent } = props;

  const imgSrc = `${process.env.PUBLIC_URL}/images/${pokemon.expansion.code}-${pokemon.dexId}.webp`.toLowerCase();
  const card = <Card sx={{
    p: 0,
  }}>
    <CardActionArea disabled={disabled} onClick={onClick} sx={{
      height: height,
      width: height / 683 * 490,
    }}>
      <CardMedia
        component="img"
        src={imgSrc}
        alt={getPokemonFullName(pokemon)}
      />
      { showOverlay &&
        <>
          <Box sx={{
            overflow: 'hidden',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            borderRadius: 'inherit',
            opacity: .5,
            backgroundColor: '#000',
          }} />
          { !!overlayIcon &&
            <Box sx={{
              overflow: 'hidden',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent'
            }}>
              {overlayIcon}
            </Box>
          }
        </>
      }
    </CardActionArea>
  </Card>;

  if (badgeContent !== undefined) {
    return <Badge badgeContent={badgeContent} showZero color='primary'>
      {card}
    </Badge>
  }
  return card;
});