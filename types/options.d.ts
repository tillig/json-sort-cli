import { KnownProps } from "editorconfig";

export interface JsonStringifyOptions {
  space: string | number;
}

export interface CalculatedOptions {
  stringify_options: JsonStringifyOptions;
  line_end_string: string;
}

export type FormattingOptions = KnownProps & CalculatedOptions;
