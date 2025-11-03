import { parse } from '@vue/compiler-sfc';

export function usePropsParser() {
  function extractProps(source) {
    const { descriptor } = parse(source);
    const scriptContent = descriptor.script.content || '';

    const transformed = scriptContent.replace(/export\s+default\s+/, 'return ');

    const factory = new Function(transformed);
    const options = factory();

    return options && options.props ? options.props : null;
  }

  function getDefaults (props) {
    const values = {}
    Object.entries(props).forEach(([key, value]) => {
      values[key] = value.default
    });
    return values;
  }

  function getSchema (props) {
    const mvtTypeToJsonSchema = {
      text: 'string',
      number: 'number',
    }

    const schema = {
      id: 'props',
      title: 'Props Schema',
      description: 'Schema for the component props',
      type: 'object',
      required: [],
      properties: {},
    }
          
    Object.entries(props).forEach(([key, value]) => {
      schema.properties[key] = {
        type: mvtTypeToJsonSchema[value.mvt.type],
        default: value.default,
        description: value.mvt.description,
        minimum: value.mvt.min,
        maximum: value.mvt.max,
      }
    });
    return schema;
  }
  
  return {
    extractProps,
    getDefaults,
    getSchema,
  }
}