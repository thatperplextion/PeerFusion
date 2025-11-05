# Color Class Replacements

## Replace these hardcoded Tailwind classes with CSS variable-based classes:

### Text Colors
- `text-gray-900 dark:text-white` → `text-foreground`
- `text-gray-600 dark:text-gray-300` → `text-muted-foreground`
- `text-gray-500 dark:text-gray-400` → `text-muted-foreground`
- `text-gray-700 dark:text-gray-300` → `text-foreground`
- `text-gray-800 dark:text-gray-300` → `text-foreground`
- `text-gray-400 dark:text-gray-500` → `text-muted-foreground`
- `text-blue-600 dark:text-blue-400` → `text-primary`
- `text-green-600 dark:text-green-400` → `text-primary`

### Background Colors
- `bg-white dark:bg-gray-800` → `bg-card`
- `bg-white dark:bg-gray-700` → `bg-card`
- `bg-gray-100 dark:bg-gray-700` → `bg-muted`
- `bg-gray-50 dark:bg-gray-800` → `bg-muted`

### Border Colors
- `border-gray-300 dark:border-gray-600` → `border-border`
- `border-gray-200 dark:border-gray-600` → `border-border`

### Placeholder Colors
- `placeholder-gray-500 dark:placeholder-gray-400` → `placeholder:text-muted-foreground`

### Badge/Status Colors (keep these for semantic meaning)
- Green badges (success): `bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300`
- Blue badges (info): `bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300`
- Yellow badges (warning): `bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300`
- Red badges (error): `bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300`

These semantic colors should remain as they convey specific meaning.
