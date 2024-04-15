import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


const WRONG_CODE = `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`;

function reactVirtualized() {
  return {
    name: 'my:react-virtualized',
    configResolved() {
      const file = require
        .resolve('react-virtualized')
        .replace(
          path.join('dist', 'commonjs', 'index.js'),
          path.join('dist', 'es', 'WindowScroller', 'utils', 'onScroll.js')
        );
      const code = fs.readFileSync(file, 'utf-8');
      const modified = code.replace(WRONG_CODE, '');
      fs.writeFileSync(file, modified);
    },
  };
}
// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],

  define: { 'process.env': process.env },//this is to load environment to make it active.
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  }

 

}));
