import React, { useCallback } from 'react';
import { Box, InputBase, InputAdornment, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import debounce from 'lodash/debounce';

interface SearchInputProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    defaultValue?: string
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, placeholder = 'Search...', defaultValue }) => {
    const theme = useTheme();

    const debouncedSearch = useCallback(
        debounce((query: string) => {
        onSearch(query);
        }, 300),
        [onSearch]
    );

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = event.target.value;
        debouncedSearch(newSearchTerm);
    };

    return (
        <Box
        sx={{
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: theme.palette.mode === 'light' 
            ? 'rgba(0, 0, 0, 0.04)' 
            : 'rgba(255, 255, 255, 0.103)',
            '&:hover': {
            backgroundColor: theme.palette.mode === 'light' 
                ? 'rgba(0, 0, 0, 0.08)' 
                : 'rgba(255, 255, 255, 0.13)',
            },
            marginLeft: 0,
            minWidth: '20rem',
            width: '100%',
            [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
            },
        }}
        >
        <InputBase
            value={defaultValue}
            onChange={handleSearchChange}
            placeholder={placeholder}
            sx={{
            color: 'inherit',
            width: '100%',
            '& .MuiInputBase-input': {
                padding: theme.spacing(1, 1, 1, 0),
                paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                transition: theme.transitions.create('width'),
                width: '100%',
                [theme.breakpoints.up('sm')]: {
                width: '12ch',
                '&:focus': {
                    width: '20ch',
                },
                },
            },
            }}
            startAdornment={
            <InputAdornment position="start" sx={{ 
                position: 'absolute', 
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                pl: 2
            }}>
                <SearchIcon />
            </InputAdornment>
            }
            inputProps={{ 'aria-label': 'search' }}
        />
        </Box>
    );
};

export default SearchInput;