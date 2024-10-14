import { Box, Skeleton, SxProps, Theme, Typography, useTheme } from "@mui/material";

export const SkeletonThemeCard: React.FC = () => {
    const theme = useTheme();
    
    const skeletonStyles: SxProps<Theme> = {
        border: theme.borders.primary,
        borderRadius: theme.borderRadius.medium,
        px: 1,
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '4px',
        cursor: 'pointer',
        position: 'relative',
    };

    return (
        <Box sx={skeletonStyles}>
            <Skeleton variant="circular" width={24} height={24} sx={{mb: '5.5px'}} />
            <Skeleton variant="text" width="4rem" height="1rem" />
        </Box>
    );
};

export const iconsPath = {
    technology: '/src/assets/icons/technology-icon.svg',
    trip: '/src/assets/icons/trip-icon.svg',
    programming: '/src/assets/icons/programming-icon.svg',
    cooking: '/src/assets/icons/cooking-icon.svg',
    art: '/src/assets/icons/art-icon.svg',
    politics: '/src/assets/icons/politic-icon.svg',
    sport: '/src/assets/icons/sport-icon.svg',
    history: '/src/assets/icons/history-icon.svg',
    music: '/src/assets/icons/music-icon.svg',
} as const;

interface IOptionThemeCard {
    label: keyof typeof iconsPath;
    variant: 'outlined' | 'contained';
    onClick: () => void;
    isSelected: boolean
}

export const OptionThemeCard:React.FC<IOptionThemeCard> = ({
    label,
    variant,
    onClick,
    isSelected = false
}) => {
    const theme = useTheme();

    const baseStyles:SxProps<Theme> = {
        border: theme.borders.primary, 
        borderRadius: theme.borderRadius.medium, 
        px: 1,
        py: 4, 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '4px',
        margin: 'none', 
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s',
        ":hover": {
            '&::after': {
                content: '""', 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(124, 124, 124, 0.425)',
            }
        },
        ...(isSelected ? {
            transform: 'scale(1.05)',
            '&::after': {
                content: '""', 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(124, 124, 124, 0.425)',
            }
        } : {}) 
    }; 

    const variantStyles = 
        variant === 'outlined' ? 
        {
            background: theme.palette.secondary.main,
            color: theme.palette.primary.main,
        }
        : 
        {
            background: theme.palette.primary.main,
            color: theme.palette.secondary.main,
        };


    return (
        <Box  sx={{ ...baseStyles, ...variantStyles }} onClick={onClick}>
            <img style={{
                width: '1.5rem',
                filter: variant === 'outlined' ? 
                    'brightness(0) saturate(100%) invert(13%) sepia(75%) saturate(5186%) hue-rotate(271deg) brightness(89%) contrast(105%)' 
                    : 
                    'invert(0%)'
                
                }} src={iconsPath[label]} alt={`icon ${label}`} />
            <Typography variant='body2'>{label}</Typography>
        </Box>
    )
}