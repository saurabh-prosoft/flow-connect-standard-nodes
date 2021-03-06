import { Flow, Vector, Node } from "flow-connect/core";
import { NodeCreatorOptions } from "flow-connect/common";
import { normalize } from "flow-connect/utils";
import { InputType } from "flow-connect/ui";

export class Normalize extends Node {
  min = Number.MAX_SAFE_INTEGER;
  max = Number.MIN_SAFE_INTEGER;

  static DefaultState = { min: 0, max: 100, relative: false };

  constructor(flow: Flow, public type: 'number' | 'array', options: NodeCreatorOptions = {}) {
    super(flow, options.name || 'Normalize', options.position || new Vector(50, 50), options.width || 150,
      [{ name: 'data', dataType: type }],
      [{ name: 'normalized', dataType: type }],
      {
        state: options.state ? { ...Normalize.DefaultState, ...options.state } : Normalize.DefaultState,
        style: options.style || { rowHeight: 10 },
        terminalStyle: options.terminalStyle || {}
      }
    );

    if (type === 'array') {
      let relativeToggle = this.createToggle({ propName: 'relative', height: 10, style: { grow: .5 } });
      this.ui.append(this.createHozLayout([
        this.createLabel('Relative ?'),
        relativeToggle
      ], { style: { spacing: 20 } }));
      relativeToggle.on('change', () => this.process());
    }
    if (type === 'number' || !this.state.relative) {
      let minInput = this.createInput({ propName: 'min', height: 20, style: { type: InputType.Number, grow: .3 } });
      let maxInput = this.createInput({ propName: 'max', height: 20, style: { type: InputType.Number, grow: .3 } });
      this.ui.append(this.createHozLayout([
        this.createLabel('Min', { style: { grow: .2 } }),
        minInput,
        this.createLabel('Max', { style: { grow: .2 } }),
        maxInput
      ], { style: { spacing: 5 } }));

      minInput.on('change', () => this.process());
      maxInput.on('change', () => this.process());
    }
    if (this.state.constant) {
      let constantInput = this.createInput({ propName: 'constant', height: 20, style: { type: InputType.Number, grow: .5 } });
      this.ui.append(this.createHozLayout([
        this.createLabel('Constant'),
        constantInput
      ], { style: { spacing: 20 } }));

      constantInput.on('change', () => this.process());
    }

    this.on('process', () => this.process())
  }


  process() {
    let data = this.getInput(0);
    if (!data) return;

    let normalized;
    if (this.type === 'number') {
      normalized = Number(normalize(data, this.state.min, this.state.max).toFixed(2));
    } else {
      if (this.state.relative) {
        let currMin = Math.min(...data);
        let currMax = Math.max(...data);
        if (currMin < this.min) this.min = currMin - (this.state.constant || 0);
        if (currMax > this.max) this.max = currMax + (this.state.constant || 0);
        normalized = data.map((item: number) => Number(normalize(item, this.min, this.max).toFixed(2)));
      } else {
        normalized = data.map((item: number) => Number(normalize(item, this.state.min, this.state.max).toFixed(2)));
      }
    }
    this.setOutputs('normalized', normalized);
  }
}
