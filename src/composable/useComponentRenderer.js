import { watch } from 'vue';
import { WebContainer } from "@webcontainer/api";

import styleCss from '@/style.css?raw';
import AppVue from '@/web-container/src/App.vue?raw';
import mainJs from '@/web-container/src/main.js?raw';
import indexHtml from '@/web-container/index.html?raw';
import viteConfig from '@/web-container/vite.config.js?raw';
import packageJson from '@/web-container/package.json?raw';


export function useComponentRenderer({propValues, componentMount}) {
  let webcontainerInstance = null
  
  async function renderComponent (source) {
    if (!webcontainerInstance) {
      printStatus('Booting WebContainer...');
      webcontainerInstance = await WebContainer.boot();
    }
  
    printStatus('Setting up environment...');
  
    const files = {
      'package.json': { file: { contents: packageJson }},
      'index.html': { file: { contents: indexHtml }},
      'vite.config.js': { file: { contents: viteConfig }},
      'src': {
        directory: {
          'style.css': { file: { contents: styleCss }},
          'App.vue': { file: { contents: AppVue }},
          'main.js': { file: { contents: mainJs }},
          'props.json': { file: { contents: JSON.stringify(propValues.value) }},
          'Component.vue': { file: { contents: source }},
        }
      },
    };
  
    await webcontainerInstance.mount(files);
    printStatus('Installing dependencies...');
  
    const installProcess = await webcontainerInstance.spawn('npm', ['install']);
    await installProcess.exit;
  
    printStatus('Starting dev server...');
  
    await webcontainerInstance.spawn('npm', ['run', 'dev']);
    
    webcontainerInstance.on('server-ready', (_port, url) => {
      const iframe = createIframe(url);
      mountIframe(iframe);
    });
  }
  
  function createIframe(url) {
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.width = '100%';
    iframe.style.height = '400px';
    iframe.style.border = '1px solid #e0e0e0';
    iframe.style.borderRadius = '4px';
    return iframe;
  }
  
  function mountIframe(iframe) {
    componentMount.value.innerHTML = '';
    componentMount.value.appendChild(iframe);
  }
  
  function printStatus(status) {
    componentMount.value.innerHTML = `<p>${status}</p>`;
  }

  function updateProps() {
    webcontainerInstance.fs.writeFile('src/props.json', JSON.stringify(propValues.value));
  }

  watch(propValues, () => {
    updateProps();
  }, { deep: true });

  return {
    renderComponent,
  }
}
