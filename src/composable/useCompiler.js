import { parse } from '@vue/compiler-sfc';
import { compile, defineComponent } from 'vue';

export function useCompiler() {
  function compileString(source) {
    const { descriptor } = parse(source);
    const scriptContent = descriptor.script.content || '';

    const transformed = scriptContent.replace(/export\s+default\s+/, 'return ');

    const factory = new Function(transformed);
    const options = factory();

    const templateCode = descriptor.template.content;
    const render = compile(templateCode, { mode: 'function' });

    const component = defineComponent({
      ...options,
      render
    });

    return component
  }
  
  return {
    compileString
  }
}