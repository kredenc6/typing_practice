import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import svgr, { type VitePluginSvgrOptions } from "vite-plugin-svgr";

const svgrOptions: VitePluginSvgrOptions = {
  // svgr options: https://react-svgr.com/docs/options/
  svgrOptions: {
    typescript: false,
    svgo: false
  },

  // esbuild options, to transform jsx to js
  esbuildOptions: {
    // ...
  },

  // A minimatch pattern, or array of patterns, which specifies the files in the build the plugin should include.
  include: "**/*.svg?react"
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr(svgrOptions), react()],
})
