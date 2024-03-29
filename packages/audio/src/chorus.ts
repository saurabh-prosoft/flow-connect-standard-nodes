import { Node, NodeOptions, NodeStyle, TerminalType } from "flow-connect/core";
import { clamp } from "flow-connect/utils";
import { InputType, Input, Slider, Toggle, HorizontalLayout, HorizontalLayoutOptions } from "flow-connect/ui";

export class ChorusEffect extends Node {
  delaySlider: Slider;
  delayInput: Input;
  feedbackSlider: Slider;
  feedbackInput: Input;
  rateSlider: Slider;
  rateInput: Input;
  bypassToggle: Toggle;
  depthSlider: Slider;
  depthInput: Input;
  chorus: any;

  private static DefaultState = { feedback: 0.4, delay: 0.0045, depth: 0.7, rate: 0.01, bypass: false };

  constructor() {
    super();

    this.chorus = new (window as any).__tuna__.Chorus();
  }

  protected setupIO(_options: ChorusOptions): void {
    this.addTerminals([
      { type: TerminalType.IN, name: "in", dataType: "audio" },
      { type: TerminalType.OUT, name: "out", dataType: "audio" },
    ]);
  }

  protected created(options: ChorusOptions): void {
    const { width = 230, name = "Chorus Effect", state = {}, style = {} } = options;

    this.width = width;
    this.name = name;
    this.state = { ...ChorusEffect.DefaultState, ...state };
    this.style = { ...DefaultChorusStyle(), ...style };

    this.inputs[0].ref = this.outputs[0].ref = this.chorus;
    this.setupUI();
    Object.assign(this.chorus, {
      delay: this.state.delay,
      depth: this.state.depth,
      feedback: this.state.feedback,
      rate: this.state.rate,
    });

    this.setupListeners();
  }

  protected process(_inputs: any[]): void {}

  setupUI() {
    this.delaySlider = this.createUI("core/slider", {
      min: 0,
      max: 1,
      height: 10,
      propName: "delay",
      style: { grow: 0.5 },
    });
    this.delayInput = this.createUI("core/input", {
      propName: "delay",
      height: 20,
      style: { type: InputType.Number, grow: 0.2, precision: 4 },
    });
    this.depthSlider = this.createUI("core/slider", {
      min: 0,
      max: 1,
      height: 10,
      propName: "depth",
      style: { grow: 0.5 },
    });
    this.depthInput = this.createUI("core/input", {
      propName: "depth",
      height: 20,
      style: { type: InputType.Number, grow: 0.2, precision: 2 },
    });
    this.feedbackSlider = this.createUI("core/slider", {
      min: 0,
      max: 0.95,
      height: 10,
      propName: "feedback",
      style: { grow: 0.5 },
    });
    this.feedbackInput = this.createUI("core/input", {
      propName: "feedback",
      height: 20,
      style: { type: InputType.Number, grow: 0.2, precision: 2 },
    });
    this.rateSlider = this.createUI("core/slider", {
      min: 0,
      max: 0.1,
      height: 10,
      propName: "rate",
      style: { grow: 0.5 },
    });
    this.rateInput = this.createUI("core/input", {
      propName: "rate",
      height: 20,
      style: { type: InputType.Number, grow: 0.2, precision: 2 },
    });
    this.bypassToggle = this.createUI("core/toggle", { propName: "bypass", style: { grow: 0.1 } });
    this.ui.append([
      this.createUI<HorizontalLayout, HorizontalLayoutOptions>("core/x-layout", {
        childs: [
          this.createUI("core/label", { text: "Delay", style: { grow: 0.3 } }),
          this.delaySlider,
          this.delayInput,
        ],
        style: { spacing: 5 },
      }),
      this.createUI<HorizontalLayout, HorizontalLayoutOptions>("core/x-layout", {
        childs: [
          this.createUI("core/label", { text: "Depth", style: { grow: 0.3 } }),
          this.depthSlider,
          this.depthInput,
        ],
        style: { spacing: 5 },
      }),
      this.createUI<HorizontalLayout, HorizontalLayoutOptions>("core/x-layout", {
        childs: [
          this.createUI("core/label", { text: "Feedback", style: { grow: 0.3 } }),
          this.feedbackSlider,
          this.feedbackInput,
        ],
        style: { spacing: 5 },
      }),
      this.createUI<HorizontalLayout, HorizontalLayoutOptions>("core/x-layout", {
        childs: [this.createUI("core/label", { text: "Rate", style: { grow: 0.3 } }), this.rateSlider, this.rateInput],
        style: { spacing: 5 },
      }),
      this.createUI<HorizontalLayout, HorizontalLayoutOptions>("core/x-layout", {
        childs: [this.createUI("core/label", { text: "Bypass ?", style: { grow: 0.3 } }), this.bypassToggle],
        style: { spacing: 5 },
      }),
    ]);
  }
  setConfig(type: "delay" | "depth" | "feedback" | "rate" | "all", min?: number, max?: number) {
    if (type === "all") {
      this.chorus.delay = clamp(this.state.delay, 0, 1);
      this.chorus.depth = clamp(this.state.depth, 0, 1);
      this.chorus.feedback = clamp(this.state.feedback, 0, 0.95);
      this.chorus.rate = clamp(this.state.rate, 0, 0.1);
      return;
    }

    this.chorus[type] = clamp(this.state[type], min, max);
  }
  setupListeners() {
    this.watch("delay", () => this.setConfig("delay", 0, 1));
    this.watch("depth", () => this.setConfig("depth", 0, 1));
    this.watch("feedback", () => this.setConfig("feedback", 0, 0.95));
    this.watch("rate", () => this.setConfig("rate", 0, 0.1));
    this.watch("bypass", () => (this.chorus.bypass = this.state.bypass));

    this.outputs[0].on("connect", (_inst, connector) => this.outputs[0].ref.connect(connector.end.ref));
    this.outputs[0].on("disconnect", (_inst, _connector, _start, end) => this.outputs[0].ref.disconnect(end.ref));
  }
}

export interface ChorusOptions extends NodeOptions {}

export interface ChorusStyle extends NodeStyle {}

const DefaultChorusStyle = (): ChorusStyle => ({
  rowHeight: 10,
  spacing: 10,
});
