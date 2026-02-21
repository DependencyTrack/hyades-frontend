<template>
  <div
    ref="editor"
    :style="{
      border: '1px solid #52525e',
      borderRadius: '0.25rem',
      maxWidth: maxWidth,
      resize: 'vertical',
      overflow: 'auto',
    }"
  ></div>
</template>

<script>
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { setDiagnostics } from '@codemirror/lint';
import { autocompletion } from '@codemirror/autocomplete';

export default {
  name: 'CodeMirrorEditor',
  props: {
    value: String,
    readOnly: Boolean,
    markers: {
      type: Array,
      default: () => [],
    },
    maxWidth: {
      type: String,
      default: '100%',
    },
  },
  data() {
    return {
      view: null,
      readOnlyCompartment: new Compartment(),
    };
  },
  mounted() {
    const self = this;
    const state = EditorState.create({
      doc: this.value || '',
      extensions: [
        basicSetup,
        javascript(),
        autocompletion({ override: [] }),
        oneDark,
        EditorView.lineWrapping,
        this.readOnlyCompartment.of(EditorState.readOnly.of(this.readOnly)),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const val = update.state.doc.toString();
            self.$emit('input', val);
            self.updateMinHeight(update.state.doc);
            if (self.$refs.editor) {
              self.$refs.editor.dispatchEvent(new Event('keyup'));
            }
          }
        }),
        EditorView.theme({
          '&': { height: '100%' },
          '.cm-scroller': { overflow: 'auto' },
        }),
      ],
    });

    this.view = new EditorView({
      state,
      parent: this.$refs.editor,
    });

    this.updateMinHeight(this.view.state.doc);
    this.view.dom.addEventListener('keyup', (e) => e.stopPropagation());
  },
  beforeDestroy() {
    if (this.view) {
      this.view.destroy();
      this.view = null;
    }
  },
  methods: {
    updateMinHeight(doc) {
      if (!this.view) {
        return;
      }
      const lines = Math.min(Math.max(3, doc.lines + 2), 8);
      this.view.dom.style.minHeight = lines * 1.4 + 'em';
    },
  },
  watch: {
    value(newVal) {
      if (this.view && newVal !== this.view.state.doc.toString()) {
        this.view.dispatch({
          changes: {
            from: 0,
            to: this.view.state.doc.length,
            insert: newVal || '',
          },
        });
      }
    },
    readOnly(newVal) {
      if (this.view) {
        this.view.dispatch({
          effects: this.readOnlyCompartment.reconfigure(
            EditorState.readOnly.of(newVal),
          ),
        });
      }
    },
    markers(newMarkers) {
      if (!this.view) {
        return;
      }
      if (!newMarkers || newMarkers.length === 0) {
        this.view.dispatch(setDiagnostics(this.view.state, []));
        return;
      }
      const doc = this.view.state.doc;
      const diagnostics = newMarkers
        .map((marker) => {
          try {
            const startLine = doc.line(marker.startLineNumber);
            const endLine = doc.line(marker.endLineNumber);
            return {
              from: startLine.from + marker.startColumn - 1,
              to: endLine.from + marker.endColumn - 1,
              severity: 'error',
              message: marker.message,
            };
          } catch (e) {
            return null;
          }
        })
        .filter(Boolean);
      this.view.dispatch(setDiagnostics(this.view.state, diagnostics));
    },
  },
};
</script>
