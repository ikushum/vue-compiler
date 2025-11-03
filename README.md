# Vue code compiler prototype

This is a simple web app that:
1. Lets users write Vue components in a CodeMirror editor
2. Compiles them using `@vue/compiler-sfc`
3. Extracts props automatically
4. Renders the component with a props UI
5. Provides the $mvt global runtime

## Getting Started

### Prerequisites
- Node.js 18+ installed

### Setup (2 minutes)

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

The app will open at `http://localhost:3000`

## Your Notes

Using WebComponents for a usecase as simple as this is an overkill so I've used `@vue/compiler-sfc` to compile the Vue component. `@vue/compiler-sfc` is included as a dependency of the main vue package so there is no need to install it separately.