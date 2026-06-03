# Repository Instructions

- This is an Expo SDK 54 app (`expo ~54.0.34`, React Native `0.81.5`, React `19.1.0`); read the versioned docs at https://docs.expo.dev/versions/v54.0.0/ before changing Expo APIs.
- Use npm; `package-lock.json` is the committed lockfile.
- Commands: `npm install`, `npm run start`, `npm run android`, `npm run ios`, `npm run web`, `npm run lint`.
- There is no test script or test config. For focused verification, run `npm run lint` and `npx tsc --noEmit`.
- App entry is `expo-router/entry`; routes live under `app/`, with root stack in `app/_layout.tsx` and tabs in `app/(tabs)/_layout.tsx`.
- `app.json` enables `experiments.typedRoutes` and `experiments.reactCompiler`; avoid adding manual memoization just for React stability, and let Expo generate route types under ignored `.expo/` files.
- Imports use the `@/*` alias from `tsconfig.json` for repo-root paths.
- Treat this as a managed Expo app unless explicitly asked otherwise: generated `/ios`, `/android`, `.expo/`, `dist/`, `web-build/`, and `expo-env.d.ts` are ignored.
- Do not run `npm run reset-project` unless explicitly requested; it moves or deletes `app`, `components`, `hooks`, `constants`, and `scripts`.
- `components/ui/icon-symbol.tsx` is the Android/web fallback for `components/ui/icon-symbol.ios.tsx`; when adding SF Symbol names, update the Material Icons mapping too.
