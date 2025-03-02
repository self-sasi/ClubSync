import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const MyPreset = definePreset(Aura, {
  semantic: {
      colorScheme: {
          light: {
              primary: {
                  50: '{pink.50}',
                  100: '{pink.100}',
                  200: '{pink.200}',
                  300: '{pink.300}',
                  400: '{pink.400}',
                  500: '{pink.500}',
                  600: '{pink.600}',
                  700: '{pink.700}',
                  800: '{pink.800}',
                  900: '{pink.900}',
                  950: '{pink.950}'
              },
              highlight: {
                background: '{pink.700}',
                focusBackground: '{pink.700}',
                color: '#ffffff'
              }
          },
          dark: {
            primary: {
              50: '{pink.50}',
              100: '{pink.100}',
              200: '{pink.200}',
              300: '{pink.300}',
              400: '{pink.400}',
              500: '{pink.500}',
              600: '{pink.600}',
              700: '{pink.700}',
              800: '{pink.800}',
              900: '{pink.900}',
              950: '{pink.950}'
          },
          highlight: {
            background: '{pink.700}',
            focusBackground: '{pink.700}',
            color: '#ffffff'
            }
          }
      }
  }
});
