import { Flow, Vector, Node } from "flow-connect/core";
import { NodeCreatorOptions } from "flow-connect/common";
import { Select } from "flow-connect/ui";

export class Compare extends Node {
  select: Select

  static DefaultState = { value: '==' };

  constructor(flow: Flow, options: NodeCreatorOptions = {}) {
    super(flow, options.name || 'Compare', options.position || new Vector(50, 50), options.width || 150,
      [{ name: 'x', dataType: 'any' }, { name: 'y', dataType: 'any' }],
      [{ name: 'result', dataType: 'boolean' }],
      {
        state: options.state ? { ...Compare.DefaultState, ...options.state } : Compare.DefaultState,
        style: options.style || { rowHeight: 10 },
        terminalStyle: options.terminalStyle || {}
      }
    );

    this.setupUI();

    this.select.on('change', () => this.process(this.getInputs()));
    this.on('process', (_, inputs) => this.process(inputs));
  }

  process(inputs: any[]) {
    if (inputs[0] === null || typeof inputs[0] === 'undefined' || inputs[1] === null || typeof inputs[1] === 'undefined') return;
    let res;
    switch (this.state.value) {
      case '==': { res = inputs[0] == inputs[1]; break; }
      case '===': { res = inputs[0] === inputs[1]; break; }
      case '!=': { res = inputs[0] != inputs[1]; break; }
      case '!==': { res = inputs[0] !== inputs[1]; break; }
      case '<': { res = inputs[0] < inputs[1]; break; }
      case '<=': { res = inputs[0] <= inputs[1]; break; }
      case '>': { res = inputs[0] > inputs[1]; break; }
      case '>=': { res = inputs[0] >= inputs[1]; break; }
      case '&&': { res = inputs[0] && inputs[1]; break; }
      case '||': { res = inputs[0] || inputs[1]; break; }
      default: res = false;
    }
    this.setOutputs(0, res);
  }
  setupUI() {
    let select = this.createSelect(
      ['==', '===', '!=', '!==', '<', '<=', '>', '>=', '&&', '||'],
      { propName: 'value', input: true, output: true, height: 15, style: { fontSize: '14px' } }
    );
    this.ui.append(select);
  }
}
