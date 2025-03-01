import React, { JSX } from "react";
import { pokemonImagesMap } from "../assets";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Pokemon } from "../utils/types";
import Badge from "@mui/material/Badge";

export interface ICardProps {
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

export class PokemonCard extends React.Component<ICardProps> {
  override render() {
    const { pokemon, height, onClick,  disabled, showOverlay, overlayIcon, badgeContent } = this.props;

    const imageSource = pokemonImagesMap.get(pokemon.id);

    const cardContent = imageSource ?
      <CardMedia component="img" height={height} src={imageSource} alt={pokemon.name} sx={{ objectFit: "contain"}} /> :
      <CardContent sx={{
        height: height,
        width: height / 683 * 490,
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
      }}>
        <Typography variant="subtitle1" textAlign='center'>{pokemon.name}{pokemon.pokemonPostfix ? ` ${pokemon.pokemonPostfix.name}` : ``}</Typography>
        <Typography variant="caption" textAlign='center'>{pokemon.expansion.code} #{pokemon.dexId}</Typography>
        <Typography variant="caption" textAlign='center'>{pokemon.pokemonCardRarity.name}</Typography>
      </CardContent>

    const card = <Card sx={{ p: 0 }}>
      <CardActionArea disabled={disabled} onClick={onClick}>
        {cardContent}
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
  }
}