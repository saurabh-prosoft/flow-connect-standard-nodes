import { Flow, Vector, Node } from "flow-connect/core";
import { NodeCreatorOptions } from "flow-connect/common";

export class Ceil extends Node {
  constructor(flow: Flow, options: NodeCreatorOptions = {}) {
    super(flow, options.name || 'Ceil', options.position || new Vector(50, 50), options.width || 120,
      [{ name: 'x', dataType: 'any' }],
      [{ name: '|x|', dataType: 'any' }],
      {
        state: options.state ? { ...options.state } : {},
        style: options.style || { rowHeight: 10 },
        terminalStyle: options.terminalStyle || {}
      }
    );

    this.on('process', (_, inputs) => {
      if (typeof inputs[0] === 'number') {
        this.setOutputs(0, Math.ceil(inputs[0]));
      } else if (Array.isArray(inputs[0])) {
        this.setOutputs(0, inputs[0].map(item => Math.ceil(item)));
      }
    });
  }
}
