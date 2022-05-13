import { Flow } from "../../core/flow";
import { Vector } from "../../core/vector";
import { NodeCreatorOptions } from "../../common/interfaces";
import { Node } from "../../core/node";
import { Toggle } from "../../ui/index";

export class BooleanSource extends Node {
  toggle: Toggle;

  static DefaultState = { value: false };

  constructor(flow: Flow, options: NodeCreatorOptions = {}) {
    super(flow, options.name || 'Boolean Source', options.position || new Vector(50, 50), options.width || 130, [],
      [{ name: 'value', dataType: 'boolean' }],
      {
        state: options.state ? { ...BooleanSource.DefaultState, ...options.state } : BooleanSource.DefaultState,
        style: options.style || { rowHeight: 10 },
        terminalStyle: options.terminalStyle || {}
      }
    );

    this.setupUI();

    this.toggle.on('change', () => this.process());
    this.on('process', () => this.process());
  }


  process() { this.setOutputs(0, this.state.value); }
  setupUI() {
    this.toggle = this.createToggle({ propName: 'value', input: true, output: true, height: 10, style: { grow: .4 } });
    this.ui.append(this.createHozLayout([
      this.createLabel('Value'),
      this.toggle
    ], { style: { spacing: 20 } }));
  }
}