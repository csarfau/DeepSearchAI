import React, { useCallback, useState, useEffect } from 'react';
import { Box, InputBase, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import debounce from 'lodash/debounce';

interface SearchInputProps {
    onSearch: (query?: string) => void;
    placeholder?: string;
    defaultValue?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, placeholder = 'Search...', defaultValue }) => {
    const theme = useTheme();
    const [searchTerm, setSearchTerm] = useState(defaultValue || '');

    const debouncedSearch = useCallback(
        debounce((query: string) => {
            onSearch(query);
        }, 300),
        [onSearch]
    );

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setSearchTerm(newValue);
        
        if (newValue.trim() === '') {
            onSearch();
            debouncedSearch.cancel(); 
        } else {
            debouncedSearch(newValue);
        }
    };

    return (
        <Box
            sx={{
                borderRadius: '0.5rem',
                backgroundColor: theme.palette.mode === 'light' 
                    ? 'rgba(0, 0, 0, 0.04)' 
                    : 'rgba(255, 255, 255, 0.103)',
                '&:hover': {
                    backgroundColor: theme.palette.mode === 'light' 
                        ? 'rgba(0, 0, 0, 0.08)' 
                        : 'rgba(255, 255, 255, 0.13)',
                },
                p: '0.2rem 0.5rem', 
                width: '100%',
                maxWidth: '20rem', 
                boxSizing: 'border-box'
            }}
        >
            <InputBase
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={placeholder}
                sx={{
                    color: 'inherit',
                    width: '100%',
                }}
                startAdornment={<SearchIcon />}
                inputProps={{ 'aria-label': 'search' }}
            />
        </Box>
    );
};

export default SearchInput;