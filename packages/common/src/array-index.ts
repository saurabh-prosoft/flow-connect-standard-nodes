import { Flow, Vector, Node } from "flow-connect/core";
import { NodeCreatorOptions } from "flow-connect/common";

export class ArrayIndex extends Node {
  constructor(flow: Flow, options: NodeCreatorOptions = {}) {
    super(flow, options.name || 'Array Index', options.position || new Vector(50, 50), options.width || 120,
      [{ name: 'data', dataType: 'array' }, { name: 'index', dataType: 'number' }],
      [{ name: 'value', dataType: 'any' }],
      {
        state: options.state ? { ...options.state } : {},
        style: options.style || { rowHeight: 10 },
        terminalStyle: options.terminalStyle || {}
      }
    );

    this.on('process', (_, inputs) => {
      if (!inputs || !inputs[0] || typeof inputs[1] !== 'number') return;
      this.setOutputs(0, inputs[0][inputs[1]]);
    });
  }
}
