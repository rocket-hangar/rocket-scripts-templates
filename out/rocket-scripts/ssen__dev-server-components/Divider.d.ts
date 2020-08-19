/// <reference types="react" />
import { BackgroundColor, ForegroundColor } from 'chalk';
import { TextProps } from 'ink';
export interface DividerProps extends Omit<TextProps, 'children' | 'color' | 'backgroundColor'> {
    indent?: number;
    children: string;
    width?: number;
    color?: typeof ForegroundColor;
    backgroundColor?: typeof BackgroundColor;
    delimiter?: string;
}
export declare function Divider({ indent, children, width, delimiter, ...textProps }: DividerProps): JSX.Element;
