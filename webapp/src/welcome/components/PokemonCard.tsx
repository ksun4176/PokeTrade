import React from "react";
import { pokemonImagesMap } from "../../assets";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import { gray } from "../../sharedTheme/themePrimitives";
import Typography from "@mui/material/Typography";
import { Pokemon } from "../../utils/types";

export interface ICardProps {
  pokemon: Pokemon;
  height: number;
  onClick?: () => void;
  disabled?: boolean;
}

export class PokemonCard extends React.Component<ICardProps> {
  override render() {
    const { pokemon, height, disabled, onClick } = this.props;

    const imageSource = pokemonImagesMap.get(pokemon.id);

    let cardContent = imageSource ?
      <CardMedia component="img" height={height} src={imageSource} alt={pokemon.name} sx={{ objectFit: "contain"}} /> :
      <CardContent sx={{
        height: height,
        width: height / 683 * 490,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <Typography variant="subtitle1" textAlign='center'>{pokemon.name}{pokemon.pokemon_postfixes ? ` ${pokemon.pokemon_postfixes.name}` : ``}</Typography>
        <Typography variant="body2" textAlign='center'>{pokemon.expansions.name}</Typography>
        <Typography variant="body2" textAlign='center'>#{pokemon.dex_id}</Typography>
        <Typography variant="body2" textAlign='center'>{pokemon.pokemon_card_rarities.name}</Typography>
      </CardContent>

    return <Card sx={{ p: 0 }}>
      <CardActionArea disabled={disabled} onClick={onClick}>
        {cardContent}
        { !disabled ? null :
          <Box sx={{
            overflow: 'hidden',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            borderRadius: 'inherit',
            opacity: .7,
            backgroundColor: gray[900]
          }} />
        }
      </CardActionArea>
    </Card>
  }
}