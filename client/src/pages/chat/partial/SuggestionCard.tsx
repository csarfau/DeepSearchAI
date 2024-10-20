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

export interface IUserSuggestion {
    usersSuggestions: {
        [key in SuggestionThemes]?: string
    };
    setterPromptChoice: React.Dispatch<React.SetStateAction<string>>;
    setterTriggerResponse: React.Dispatch<React.SetStateAction<boolean>>
}


export const SuggestionCardSkeleton: React.FC = () => {
    return (
        <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
            {Array.from({ length: 4 }).map((_, index) => (
                <Grid size={{ xs: 12, sm: 6 }} key={index} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',  
                    maxWidth: { lg: '28rem' }, 
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

export const SuggestionCard: React.FC<IUserSuggestion> = ({ setterPromptChoice, setterTriggerResponse, usersSuggestions }) => {
    const iconTypes = Object.keys(usersSuggestions) as SuggestionThemes[];
    
    return (
        <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
            {iconTypes.map((iconType) => (
                <Grid size={{ xs: 12, sm: 6 }} key={iconType} sx={{
                    maxWidth: { lg: '28rem' },
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    p: '0.5rem',
                    bgcolor: '#FFFFFF',
                    borderRadius: '10rem',
                    boxShadow: '0px 1px 1px #818181',
                    color: theme.palette.primary.main
                }}
                onClick={() => {
                    console.log(usersSuggestions[iconType]);
                    
                    setterPromptChoice(usersSuggestions[iconType] || '');
                    setterTriggerResponse(true);
                }}
                >
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
                    <Typography variant="body1">{usersSuggestions[iconType]}</Typography>
                </Grid>
            ))}
        </Grid>
    );
};
