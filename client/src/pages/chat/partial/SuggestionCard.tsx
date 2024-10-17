import { Box, Grid2 as Grid, Skeleton, Typography } from "@mui/material";
import { iconsPath } from "../../components/Icons";
import { theme } from "../../../App";

export type SuggestionThemes = 
        'trip' |
        'cooking' |
        'art' |
        'technology' |
        'programming' |
        'politics' |
        'sport' |
        'history' |
        'music';

export type IUserSuggestion = {
    [key in SuggestionThemes]?: string;
};

export const SuggestionCardSkeleton: React.FC<IUserSuggestion> = () => {
  
    return (
        <Grid container spacing={2} sx={{justifyContent: 'center'}}>
            {Array.from({ length: 4 }).map((_, index) => (
                <Grid size={{ xs: 12, sm: 6 }} key={index} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',  
                    maxWidth: {lg: '28rem'}, 
                    p: '0.5rem'
                }}>
                    
                     <Skeleton variant="circular" sx={{
                        width: '1.2rem', 
                        height: '1.2rem',
                     }} />
                     <Skeleton
                        width={'100%'}
                        animation="wave"
                        height={24}
                    />

                </Grid>
            ))}
        </Grid>
    );
};

export const SuggestionCard: React.FC<IUserSuggestion> = (suggestionTheme) => {
    const iconTypes = Object.keys(suggestionTheme) as SuggestionThemes[];

    return (
        <Grid container spacing={2} sx={{justifyContent: 'center'}}>
            {iconTypes.map((iconType) => (
                
                <Grid size={{ xs: 12, sm: 6 }} key={iconType} sx={{
                    maxWidth:{lg: '28rem'},
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    p: '0.5rem',
                    bgcolor: '#FFFFFF',
                    borderRadius: '10rem',
                    boxShadow: '0px 1px 1px #818181',
                    color: theme.palette.primary.main
                }}>
                    <Box
                        sx={{
                            width: '1.2rem', 
                            height: '1.2rem', 
                            background: 'linear-gradient(147deg, rgba(151,0,209,1) 0%, rgba(157,0,200,1) 26%, rgba(222,0,105,1) 100%)',
                            WebkitMaskImage: `url(${iconsPath[iconType]})`,
                            WebkitMaskSize: 'cover',
                            maskImage: `url(${iconsPath[iconType]})`,
                            maskSize: 'cover',
                        }}
                    />
                    <Typography variant="body1">{suggestionTheme[iconType]}</Typography>
                </Grid>
            ))}
        </Grid>
    );
};