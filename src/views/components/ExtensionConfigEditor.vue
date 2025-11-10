<template>
  <div class="extension-config-editor">
    <div id="code-mirror" ref="code-mirror" />
  </div>
</template>

<script>
import * as yaml from 'js-yaml';
import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { linter } from '@codemirror/lint';
import { oneDark } from '@codemirror/theme-one-dark';
import { yaml as yamlLang } from '@codemirror/lang-yaml';

export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    schema: {
      type: Object,
      default: null,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    valid: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      ajv: null,
      codeMirror: null,
      isValid: true,
    };
  },
  watch: {
    schema() {
      if (this.codeMirror) {
        this.codeMirror.dispatch({
          effects: [],
        });
      }
    },
    value(newValue) {
      if (
        this.codeMirror &&
        newValue !== this.codeMirror.state.doc.toString()
      ) {
        this.codeMirror.dispatch({
          changes: {
            from: 0,
            to: this.codeMirror.state.doc.length,
            insert: newValue,
          },
        });
      }
    },
  },
  methods: {
    onAutoComplete: function (context) {
      let word = context.matchBefore(/\w*/);
      if (word.from === word.to && !context.explicit) {
        return null;
      }

      const options = Object.keys(this.schema.properties).map((key) => {
        const description = this.schema.properties[key].description;
        return {
          label: key,
          type: 'property',
          info: description,
        };
      });

      return {
        from: word.from,
        options: options,
      };
    },
    onValidationCompleted: function (valid) {
      this.isValid = valid;
      this.$emit('valid-change', valid);
      this.$emit('update:valid', valid);
    },
    formatError(error) {
      const path = error.instancePath || '/';
      let message = `${path}: ${error.message}`;

      if (error.params) {
        if (error.params.allowedValue) {
          message += ` (allowed: ${error.params.allowedValue})`;
        } else if (error.params.allowedValues) {
          message += ` (allowed: ${error.params.allowedValues.join(', ')})`;
        } else if (error.params.type) {
          message += ` (expected: ${error.params.type})`;
        } else if (error.params.missingProperty) {
          message += ` (missing: ${error.params.missingProperty})`;
        } else {
          console.debug(
            `No hint defined for validation error: ${JSON.stringify(error.params)}`,
          );
        }
      }

      return message;
    },
    findErrorPosition(doc, instancePath) {
      let from = 0;
      let to = doc.length;

      if (!instancePath || instancePath === '') {
        return { from, to };
      }

      const pathParts = instancePath.split('/').filter((p) => p);

      if (pathParts.length > 0) {
        const lastPart = pathParts[pathParts.length - 1];
        const searchStr = `${lastPart}:`;
        const index = doc.indexOf(searchStr);

        if (index !== -1) {
          from = index;
          to = index + searchStr.length;
        }
      }

      return { from, to };
    },
  },
  async mounted() {
    this.ajv = new Ajv2020({ allErrors: true });
    addFormats(this.ajv);

    const self = this;
    const jsonSchemaLinter = linter((view) => {
      const diagnostics = [];
      const doc = view.state.doc.toString();

      let parsed;
      try {
        parsed = yaml.load(doc);
      } catch (e) {
        const match = e.message.match(/position (\d+)/);
        const pos = match ? parseInt(match[1]) : 0;

        diagnostics.push({
          from: pos,
          to: Math.min(pos + 1, doc.length),
          severity: 'error',
          message: e.message,
        });

        self.onValidationCompleted(false);
        return diagnostics;
      }

      if (self.schema) {
        const validate = self.ajv.compile(self.schema);
        const valid = validate(parsed);

        if (!valid && validate.errors) {
          validate.errors.forEach((error) => {
            const message = self.formatError(error);
            const position = self.findErrorPosition(doc, error.instancePath);

            diagnostics.push({
              from: position.from,
              to: position.to,
              severity: 'error',
              message: message,
            });
          });

          self.onValidationCompleted(false);
        } else {
          self.onValidationCompleted(true);
        }
      } else {
        self.onValidationCompleted(true);
      }

      return diagnostics;
    });

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const newValue = update.state.doc.toString();
        this.$emit('input', newValue);
      }
    });

    const state = EditorState.create({
      doc: this.value,
      extensions: [
        basicSetup,
        yamlLang(),
        yamlLang().language.data.of({
          autocomplete: this.onAutoComplete,
        }),
        jsonSchemaLinter,
        updateListener,
        EditorView.lineWrapping,
        EditorView.editable.of(!this.readOnly),
        EditorState.readOnly.of(this.readOnly),
        EditorState.tabSize.of(2),
        oneDark,
      ],
    });

    this.codeMirror = new EditorView({
      state,
      parent: document.getElementById('code-mirror'),
    });
  },
  beforeDestroy() {
    if (this.codeMirror) {
      this.codeMirror.destroy();
    }
  },
};
</script>

<style scoped>
.extension-config-editor {
  border: 1px solid #0b1015;
  border-radius: 0.25rem;
}
</style>
