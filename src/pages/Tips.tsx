03:10:08.502 Running build in Washington, D.C., USA (East) – iad1
03:10:08.503 Build machine configuration: 2 cores, 8 GB
03:10:08.646 Cloning github.com/Emmanuel-Adegboye-art/banley-assessment (Branch: main, Commit: 3dd432a)
03:10:08.929 Cloning completed: 283.000ms
03:10:09.481 Restored build cache from previous deployment (3udyim7Umur8v7zz6tG4ue3hrVQK)
03:10:09.701 Running "vercel build"
03:10:09.726 Vercel CLI 56.4.0
03:10:10.569 Installing dependencies...
03:10:14.499 
03:10:14.500 changed 1 package in 4s
03:10:14.500 
03:10:14.501 148 packages are looking for funding
03:10:14.501   run `npm fund` for details
03:10:14.544 Running "npm run build"
03:10:15.986 
03:10:15.986 > restaurant-tip-manager@0.0.0 build
03:10:15.986 > tsc -b && vite build
03:10:15.987 
03:10:20.860 src/pages/Tips.tsx(11,3): error TS6133: 'Calendar' is declared but its value is never read.
03:10:20.862 src/pages/Tips.tsx(15,3): error TS6133: 'User' is declared but its value is never read.
03:10:20.862 src/pages/Tips.tsx(21,29): error TS6133: 'CardHeader' is declared but its value is never read.
03:10:20.863 src/pages/Tips.tsx(21,41): error TS6133: 'CardTitle' is declared but its value is never read.
03:10:20.863 src/pages/Tips.tsx(373,9): error TS6133: 'currency' is declared but its value is never read.
03:10:20.863 src/pages/Tips.tsx(549,16): error TS2552: Cannot find name 'Users'. Did you mean 'User'?
03:10:21.651 Error: Command "npm run build" exited with 2
