# Unit Converter - Application Description

**Last Updated:** October 18, 2025  
**Maintainer:** @rhoofr  
**Version:** 0.1.0

## Overview

Unit Converter is a responsive web application built with Next.js 15, React 19, and TypeScript that enables users to convert measurements across multiple unit categories. The application provides instant, multi-unit conversions with a clean, accessible interface optimized for mobile, tablet, and desktop devices.

## Core Functionality

### Conversion Flow

1. User selects a **category** (Length, Volume, Weight, Temperature, or Time)
2. User selects a **source unit** from the available units in that category
3. User enters a **numeric value** to convert
4. Application displays **all conversions** to other units in the same category
5. All decimal results are displayed to **2 decimal places** for precision

### Example Usage

**Length Conversion:**

- User selects: **Length** category
- User picks: **Meter** as source unit
- User enters: `5`
- User clicks: **Convert** button
- Results display:
  - Millimeter: `5000`
  - Centimeter: `500`
  - Kilometer: `0.0050`
  - Inch: `196.8504`
  - Foot: `16.4042`
  - Yard: `5.4681`
  - Mile: `0.0031`

## Supported Categories and Units

### 1. Length

Convert between metric and imperial distance measurements:

- **Millimeter** (mm)
- **Centimeter** (cm)
- **Meter** (m)
- **Kilometer** (km)
- **Inch** (in)
- **Foot** (ft)
- **Yard** (yd)
- **Mile** (mi)

### 2. Volume

Convert between metric and US liquid measurements:

- **Milliliter** (mL)
- **Liter** (L)
- **US Fluid Ounce** (fl oz)
- **US Cup** (cup)
- **US Pint** (pt)
- **US Quart** (qt)
- **US Gallon** (gal)

### 3. Weight

Convert between metric and imperial mass measurements:

- **Gram** (g)
- **Kilogram** (kg)
- **Metric Ton** (t)
- **Ounce** (oz)
- **Pound** (lb)
- **US Ton** (ton)
- **Stone** (st)

### 4. Temperature

Convert between common temperature scales:

- **Celsius** (°C)
- **Fahrenheit** (°F)
- **Kelvin** (K)

### 5. Time

Convert between Unix epoch timestamps and human-readable datetime formats:

- **Unix Epoch (Seconds)** - Seconds since January 1, 1970 00:00:00 UTC
- **Unix Epoch (Milliseconds)** - Milliseconds since January 1, 1970 00:00:00 UTC
- **Local Datetime** - User's local timezone
- **UTC Datetime** - Coordinated Universal Time

## Technical Specifications

### User Interface

- **Responsive Design**: Mobile-first approach using Tailwind CSS breakpoints
- **Accessibility**: ARIA-compliant forms and semantic HTML
- **Theme Support**: Light and dark mode via OKLCH color variables
- **Component Library**: shadcn/ui components (New York style)

### Form Validation

- **Client-side validation** using React Hook Form + Zod
- **Type-safe inputs** with TypeScript interfaces
- **Real-time feedback** for invalid inputs
- **Numeric precision**: 2 decimal places for all results unless the decimal is zero, in which case no decimal places should be shown

### Data Architecture

```typescript
// Example type structure
interface ConversionCategory {
  id: string;
  name: string;
  units: Unit[];
}

interface Unit {
  id: string;
  name: string;
  symbol: string;
  toBase: (value: number) => number; // Convert to base unit
  fromBase: (value: number) => number; // Convert from base unit
}

interface ConversionResult {
  unitId: string;
  unitName: string;
  value: string; // Formatted to 2 decimal places
}
```

### Conversion Logic

Each category has a **base unit** for internal calculations:

- **Length**: Meter (m)
- **Volume**: Liter (L)
- **Weight**: Kilogram (kg)
- **Temperature**: Uses direct formulas (no base unit)
- **Time**: Unix Epoch Seconds

**Conversion Process:**

1. Convert input value to base unit using `toBase()`
2. Convert base unit to all target units using `fromBase()`
3. Format results to 2 decimal places if decimal is not zero
4. Display in responsive grid layout

## User Experience Goals

1. **Instant Results**: No page reloads, instant calculation on input
2. **Copy-Friendly**: Allow users to easily copy converted values
3. **Clear Labeling**: Show both unit names and symbols
4. **Error Handling**: Graceful handling of invalid inputs with helpful messages
5. **Performance**: Fast, optimized calculations using React Server Components where possible

## Future Enhancements (Not in v0.1.0)

- Currency conversion
- Area and speed conversions
- Conversion history
- Favorite conversions
- Shareable conversion links
- Offline support via PWA
- Batch conversions

## Development Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5+ (strict mode)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Geist Mono

## Accessibility Compliance

- **WCAG 2.1 Level AA** standards
- Keyboard navigation support
- Screen reader optimization
- Sufficient color contrast ratios
- Focus indicators on all interactive elements
- Semantic HTML structure

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement approach
- No IE11 support required
